import './MapAdmin.styles.scss';
import { observer } from 'mobx-react-lite';
import { Autocomplete, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useRef, useState,useCallback } from 'react';
import { Button, Form, Input, InputNumber, Table, message } from 'antd';
import { DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import '../StatisticsStreetcodeAdmin/StatisticsAdmin.styles.scss';
import StreetcodeMarker from '@images/footer/streetcode-marker.png';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import StatisticRecordApi from '@/app/api/analytics/statistic-record.api';
import StatisticRecord from '@/models/analytics/statisticrecord.model';
import useMobx from '@/app/stores/root-store';
import { Modal } from 'antd';
import getNewMinNegativeId from '@/app/common/utils/newIdForStore';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const initialCenter: google.maps.LatLngLiteral = {
    lat: 50.44759739385438,
    lng: 30.522674496948543
};
interface Props {
    coordinates: StreetcodeCoordinate[];
}
const MapOSMAdmin: React.FC<Props> = ({
    coordinates,
}) => {

    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | undefined>(undefined);
    const [center, setCenter] = useState(initialCenter);
    const [streetcodeCoordinates, setStreetcodeCoordinates] = useState<StreetcodeCoordinate[]>([]);
    const mapRef = useRef<GoogleMap | null>(null);
    const { streetcodeCoordinatesStore, statisticRecordStore } = useMobx();
    const [statisticRecord, setStatisticRecord] = useState<StatisticRecord>();
    const [address, setAddress] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const newNumberAsNumber = parseInt(newNumber, 10);
    const [isExist, setIsExist] = useState(false);
    const [isInvalidInput, setIsInvalidInput] = useState(false);
    const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (coordinates.length > 0) {

            coordinates.forEach(x => {
                const newCoordinate: StreetcodeCoordinate = {
                    latitude: x.latitude,
                    longtitude: x.longtitude,
                    streetcodeId: x.streetcodeId,
                    id: x.id,
                };
                streetcodeCoordinatesStore.addStreetcodeCoordinate(newCoordinate);
                setStreetcodeCoordinates([]);
            });
        }
    }, [coordinates]);

    const handleSaveButtonClick = () => {
        if (!newNumber || newNumber === "" || isExist) {
            message.error({
                content: 'Будь ласка введіть значення номеру фізичного стіткоду для збереження',
                style: { marginTop: '400vh' },
            });
        } else {
            if (streetcodeCoordinates.length > 0) {
                const newCoordinate: StreetcodeCoordinate = {
                    latitude: streetcodeCoordinates[0].latitude,
                    longtitude: streetcodeCoordinates[0].longtitude,
                    streetcodeId: 0,
                    id: getNewMinNegativeId(streetcodeCoordinatesStore.getStreetcodeCoordinateArray.map((f) => f.id)),

                };
                const newStatisticRecord: StatisticRecord = {
                    id: getNewMinNegativeId(statisticRecordStore.getStatisticRecordArray.map((f) => f.id)),
                    streetcodeCoordinate: newCoordinate,
                    coordinateId: newCoordinate.id,
                    qrId: newNumberAsNumber,
                    count: 0,
                    address: address,
                };

                setUsedNumbers((prevUsedNumbers) => new Set(prevUsedNumbers).add(newNumberAsNumber));
                statisticRecordStore.addStatisticRecord(newStatisticRecord);
                setStatisticRecord(newStatisticRecord);
                streetcodeCoordinatesStore.addStreetcodeCoordinate(newCoordinate);
                coordinates?.map(x => {
                    const newCoor: StreetcodeCoordinate = {
                        latitude: x.latitude,
                        longtitude: x.longtitude,
                        streetcodeId: x.streetcodeId,
                        id: x.id,
                    };
                    streetcodeCoordinatesStore.addStreetcodeCoordinate(newCoor);

                });
                setStreetcodeCoordinates([]);
            }
        }
    };

    const handleDelete = (record: { id: any; qrId: any }) => {
        const { id, qrId } = record;
        streetcodeCoordinatesStore.deleteStreetcodeCoordinateFromMap(id);
        statisticRecordStore.deleteStatisticRecordFromMap(id);
        removeFromUsedNumbers(qrId);
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
                            console.error('Geocode was not successful for the following reason: ' + status);
                        }
                    }
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
                            latitude: latitude,
                            longtitude: longitude,
                            streetcodeId: 0,
                            id: 0,
                        },
                    ]);
                    setCenter({ lat: latitude, lng: longitude });
                }
            );
        }
    }

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
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
                        console.error('Geocode was not successful for the following reason: ' + status);
                    }
                }
            );
        }
    };
    const [visibleModal, setVisibleModal] = useState(false);
    const handleRemove = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);
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

    const data = statisticRecordStore.getStatisticRecordArray.map(
        (item) => ({
            id: item.id,
            qrId: item.qrId,
            latitude: item.streetcodeCoordinate.latitude,
            longtitude: item.streetcodeCoordinate.longtitude,
            address: item.address,
            actions: item,
        }),
    );

    const onCheckIndexClick = (value: any) => {
        if (value) {
            StatisticRecordApi.existByQrId(value)
                .then((exist) => {
                    setIsExist(exist);
                    if (usedNumbers.has(parseInt(value, 10))) {
                        setIsExist(true);
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
        <LoadScript
            googleMapsApiKey="AIzaSyCr5712Z86_z29W9biaPj8DcaggjbUAy7M"
            language="uk"
            libraries={['places']}
        >
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
                    </Button> */}
                    {(streetcodeCoordinates.length > 0) && (!isExist)  && (!isInvalidInput) && (
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
                {data.map((item) => (
                    <Marker
                        key={item.id}
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
        </LoadScript>

    );
};

export default observer(MapOSMAdmin);