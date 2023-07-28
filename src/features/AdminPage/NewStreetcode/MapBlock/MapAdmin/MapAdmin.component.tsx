import './MapAdmin.styles.scss';
import '../StatisticsStreetcodeAdmin/StatisticsAdmin.styles.scss';

import StreetcodeMarker from '@images/footer/streetcode-marker.png';

import { Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import StatisticRecordApi from '@app/api/analytics/statistic-record.api';
import getNewMinNegativeId from '@app/common/utils/newIdForStore';
import useMobx from '@app/stores/root-store';
import { ModelState } from '@models/enums/model-state';

import {
    Button, Input, message, Modal, Table,
} from 'antd';

import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import StatisticRecord, { StatisticRecordUpdate } from '@/models/analytics/statisticrecord.model';

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
    const mapRef = useRef<GoogleMap | null>(null);
    const { streetcodeCoordinatesStore, statisticRecordStore } = useMobx();
    const statisticRecordIdToDelete = useRef<number>(0);
    const [address, setAddress] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const newNumberAsNumber = parseInt(newNumber, 10);
    const [isExist, setIsExist] = useState(false);
    const [isInvalidInput, setIsInvalidInput] = useState(false);
    const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set());
    const [deletedNumbers, setDeletedNumbers] = useState<Set<number>>(new Set());
    const [showButton, setShowButton] = useState(false);

    const handleSaveButtonClick = () => {
        if (!newNumber || newNumber === '' || isExist) {
            message.error({
                content: 'Будь ласка введіть значення номеру фізичного стіткоду для збереження',
                style: { marginTop: '400vh' },
            });
        } else if (streetcodeCoordinates.length > 0) {
            const newCoordinate: StreetcodeCoordinate = {
                id: getNewMinNegativeId(streetcodeCoordinatesStore.getStreetcodeCoordinateArray.map((f) => f.id)),
                latitude: streetcodeCoordinates[0].latitude,
                longtitude: streetcodeCoordinates[0].longtitude,
                streetcodeId: 0,
            };
            const newStatisticRecord: StatisticRecord = {
                id: getNewMinNegativeId(statisticRecordStore.getStatisticRecordArray.map((f) => f.id)),
                streetcodeCoordinate: newCoordinate,
                qrId: newNumberAsNumber,
                count: 0,
                address,
            };
            setUsedNumbers((prevUsedNumbers) => new Set(prevUsedNumbers).add(newNumberAsNumber));
            setShowButton(false);
            setNewNumber('');
            statisticRecordStore.addStatisticRecord(newStatisticRecord);
            streetcodeCoordinatesStore.addStreetcodeCoordinate(newCoordinate);
        }
    };

    const handleDelete = (record: { id: any; qrId: any }) => {
        const { id, qrId } = record;
        streetcodeCoordinatesStore.deleteStreetcodeCoordinateFromMap(id);
        statisticRecordStore.deleteStatisticRecordFromMap(id);
        removeFromUsedNumbers(qrId);
        setDeletedNumbers((prevDeletedNumbers) => new Set(prevDeletedNumbers).add(qrId));
    };

    const removeFromUsedNumbers = (qrId: number) => {
        const newUsedNumbers = new Set(usedNumbers);
        newUsedNumbers.delete(qrId);
        setUsedNumbers(newUsedNumbers);
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
                        streetcodeId: 0,
                        id: 0,
                    },
                ]);
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode(
                    { location: { lat, lng } },
                    (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                        if (results && status === 'OK') {
                            setAddress(results[0].formatted_address);
                        } else {
                            console.error(`Geocode was not successful for the following reason: ${status}`);
                        }
                    },
                );
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
                            streetcodeId: 0,
                            id: 0,
                        },
                    ]);
                    setCenter({ lat: latitude, lng: longitude });
                },
            );
        }
    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        setShowButton(true);
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        if (lat && lng) {
            setStreetcodeCoordinates([
                {
                    latitude: lat,
                    longtitude: lng,
                    streetcodeId: 0,
                    id: 0,
                },
            ]);
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                { location: { lat, lng } },
                (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                    if (results && status === 'OK') {
                        setAddress(results[0].formatted_address);
                    } else {
                        console.error(`Geocode was not successful for the following reason: ${status}`);
                    }
                },
            );
        }
    };

    const columns = [
        {
            title: 'Номер таблички',
            dataIndex: 'qrId',
            key: 'qrId',
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
            title: 'Адреса',
            dataIndex: 'address',
            key: 'address',
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

    const data = statisticRecordStore.getStatisticRecordArray
        .filter((x) => (x as StatisticRecordUpdate).modelState !== ModelState.Deleted)
        .map((item) => ({
            key: item.id,
            id: item.id,
            qrId: item.qrId,
            latitude: item.streetcodeCoordinate.latitude,
            longtitude: item.streetcodeCoordinate.longtitude,
            address: item.address,
            actions: item,
        }));

    const onCheckIndexClick = (value: any) => {
        if (value) {
            StatisticRecordApi.existByQrId(value)
                .then((exist) => {
                    setIsExist(exist);
                    if (usedNumbers.has(parseInt(value, 10))) {
                        setIsExist(true);
                    } else if (deletedNumbers.has(parseInt(value, 10))) {
                        setIsExist(false);
                    } else {
                        setIsExist(exist);
                    }
                })
                .catch(() => {
                    message.error('Сервер не відповідає');
                });
        } else {
            setIsExist(false);
        }
    };

    const handleNewNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputNumber = event.target.value;
        if (!Number.isNaN(inputNumber) && Number(inputNumber) >= 0) {
            setNewNumber(inputNumber);
            setIsInvalidInput(false);
        } else {
            setIsInvalidInput(true);
        }
    };

    return (
        <>
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

                    <Input
                        type="number"
                        className={`input-stnumber ${isExist ? 'red' : 'green'}`}
                        placeholder="введіть номер таблички стріткоду"
                        onChange={(e) => {
                            handleNewNumberChange(e);
                            onCheckIndexClick(e.target.value);
                        }}

                        value={newNumber}
                    />
                    {isExist && (
                        <span className="notification red">
                            Даний номер таблички вже використовується
                        </span>
                    )}
                    { isInvalidInput && (
                        <span className="notification red">
                            Введіть додатнє число
                        </span>
                    )}

                    {/* <Button
                        className="onMapbtn"
                        onClick={handleMarkerCurrentPosition}
                    >
                        <a>Обрати місце на мапі</a>
                    </Button>  */}

                    {(streetcodeCoordinates.length > 0) && (!isExist) && (!isInvalidInput) && (showButton) && (
                        <Button className="onMapbtn" onClick={handleSaveButtonClick}>
                            <a>Зберегти стріткод</a>
                        </Button>
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
                {data.map((item, index) => (
                    <Marker
                        key={index}
                        icon={{
                            url: StreetcodeMarker,
                            scaledSize: new window.google.maps.Size(57, 45),
                            origin: new window.google.maps.Point(0, 0),
                        }}
                        position={{ lat: item.latitude, lng: item.longtitude }}
                        title={item.address}
                    />
                ))}
            </GoogleMap>
            <Table columns={columns} dataSource={data} />
        </>

    );
};

export default observer(MapOSMAdmin);
