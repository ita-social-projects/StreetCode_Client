import './MapAdmin.styles.scss';
import '../StatisticsStreetcodeAdmin/StatisticsAdmin.styles.scss';

import StreetcodeMarker from '@images/footer/streetcode-marker.png';

import {
    Autocomplete, GoogleMap, LoadScript, Marker,
} from '@react-google-maps/api';
import {  observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';

import {
    Button, Input, Table,
} from 'antd';

import useMobx from '@/app/stores/root-store';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const initialCenter: google.maps.LatLngLiteral = {
    lat: 50.44759739385438,
    lng: 30.522674496948543,
};

const MapOSMAdmin = () => {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | undefined>(undefined);
    const [center, setCenter] = useState(initialCenter);
    const [streetcodeCoordinates, setStreetcodeCoordinates] = useState<StreetcodeCoordinate[]>([]);
    const mapRef = useRef<google.maps.Map | null>(null);
    const { streetcodeCoordinatesStore } = useMobx();

    const handleSaveButtonClick = () => {
        if (streetcodeCoordinates.length > 0) {
            const newCoordinate: StreetcodeCoordinate = {
                latitude: streetcodeCoordinates[0].latitude,
                longtitude: streetcodeCoordinates[0].longtitude,
                streetcodeId: 0, // set a default streetcodeId for now
                id: streetcodeCoordinatesStore.setStreetcodeCoordinateMap.size, // set a default id for now
            };
            streetcodeCoordinatesStore.addStreetcodeCoordinate(newCoordinate);
            setStreetcodeCoordinates([]);
        }
    };

    const handleDelete = (record: { id: any; }) => {
        const { id } = record;
        streetcodeCoordinatesStore.deleteStreetcodeCoordinateFromMap(id);
    };

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== undefined) {
            const place = autocomplete.getPlace();
            const location = place.geometry?.location;
            if (location) {
                const lat = location.lat();
                const lng = location.lng();
                setCenter({ lat, lng });
                setStreetcodeCoordinates([
                    {
                        latitude: lat,
                        longtitude: lng,
                        streetcodeId: 0, // set a default streetcodeId for now
                        id: 0, // set a default id for now
                    },
                ]);
            }
        }
    };

    const handleMarkerCurrentPosition = () => {
        if (mapRef.current) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setStreetcodeCoordinates([
                        {
                            latitude,
                            longtitude: longitude,
                            streetcodeId: 0, // set a default streetcodeId for now
                            id: 0, // set a default id for now
                        },
                    ]);
                    setCenter({ lat: latitude, lng: longitude });
                },
            );
        }
    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        if (lat && lng) {
            setStreetcodeCoordinates([
                {
                    latitude: lat,
                    longtitude: lng,
                    streetcodeId: 0, // set a default streetcodeId for now
                    id: 0, // set a default id for now
                },
            ]);
        }
    };
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Широта',
            dataIndex: 'latitude',
            key: 'latitude',
        },
        {
            title: 'Довгота',
            dataIndex: 'longtitude',
            key: 'longtitude',
        },
        {
            title: 'Дії',
            key: 'actions',
            render: (text: any, record: any) => (
                <span>
                    <DeleteOutlined onClick={() => handleDelete(record)} />
                </span>
            ),
        },
    ];
    const data = streetcodeCoordinatesStore.getStreetcodeCoordinateArray.map((item) => ({
        id: item.id,
        latitude: item.latitude,
        longtitude: item.longtitude,
        actions: item,
    }));

    return (

        <LoadScript googleMapsApiKey="AIzaSyCr5712Z86_z29W9biaPj8DcaggjbUAy7M" language="uk" libraries={['places']}>
            <GoogleMap
                ref={mapRef}
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                onClick={handleMapClick}

            >
                <div className="statisticsContainerAdmin">
                    <h1>Додати стріткод на мапу:</h1>
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <Input
                            className="input-streets"
                            placeholder="введіть вулицю"
                            prefix={<EnvironmentOutlined className="site-form-item-icon" />}
                        />
                    </Autocomplete>
                    <Button className="onMapbtn" onClick={handleMarkerCurrentPosition}><a>Обрати місце на мапі</a></Button>
                    {streetcodeCoordinates.length > 0 && (
                        <Button className="onMapbtn" onClick={handleSaveButtonClick}><a>Зберегти стріткод</a></Button>
                    )}

                </div>
                {streetcodeCoordinates.map((marker, index) => (
                    <Marker
                        key={index}
                        icon={{
                            url: StreetcodeMarker,
                            scaledSize: new window.google.maps.Size(57, 45),
                            origin: new window.google.maps.Point(0, 0),
                        }}
                        position={{ lat: marker.latitude, lng: marker.longtitude }}
                        title={`Marker ${marker.latitude}, ${marker.longtitude}`}
                    />
                ))}

            </GoogleMap>

            <Table columns={columns} dataSource={data} />
        </LoadScript>

    );
};

export default observer(MapOSMAdmin);
