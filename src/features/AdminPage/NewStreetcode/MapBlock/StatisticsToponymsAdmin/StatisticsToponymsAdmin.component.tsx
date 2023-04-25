import './StatisticsToponymsAdmin.styles.scss';

import { useEffect, useState } from 'react';

import { Button, Checkbox, InputNumber, Pagination } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Table from 'antd/es/table/Table';

import ToponymsApi from '@/app/api/map/toponyms.api';
import useMobx from '@/app/stores/root-store';
import GetAllToponyms from '@/models/toponyms/getAllToponyms.request';
import GetAllToponymsRequest from '@/models/toponyms/getAllToponyms.request';

import SearchMenu from './SearchMenu.component';

const StatisticsToponymsComponentAdmin = () => {
    const { newStreetcodeInfoStore } = useMobx();
    const [titleRequest, setTitleRequest] = useState<string | null>(null);
    const [pageRequest, setPageRequest] = useState<number | null>(null);
    const [amountRequest, setAmountRequest] = useState<number | null>(null);

    const requestDefault: GetAllToponymsRequest = {
        Title: 'Шевченк',
        Page: null,
        Amount: null,
    };
    const [requestGetAll, setRequestGetAll] = useState<GetAllToponyms>(requestDefault);
    const setRequest = () => {
        setRequestGetAll({
            Page: pageRequest,
            Amount: amountRequest,
            Title: titleRequest === '' ? null : titleRequest,
        });
    };
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedToponyms[]>([]);

    const columnsNames = [
        {
            title: ' ',
            dataIndex: 'streetName',
            key: 'checkbox',
            width: 6,
            render: (text, record, index) => (
                <Checkbox onChange={(e:CheckboxChangeEvent) => {
                    const indexValue = newStreetcodeInfoStore.selectedToponyms.indexOf(text);
                    if (e.target.checked) {
                        if (indexValue < 0) {
                            newStreetcodeInfoStore.selectedToponyms.push(text);
                        }
                    } else if (indexValue >= 0) {
                        newStreetcodeInfoStore.SelectedToponyms = newStreetcodeInfoStore
                            .selectedToponyms.filter((t) => t !== text);
                    }
                }}
                />
            ),
        },
        {
            title: 'Топонім',
            dataIndex: 'streetName',
            width: 150,
            key: 'streetName',
        },

    ];
    interface MapedToponyms {
        key: number | undefined,
        streetName: string | undefined,
    }

    useEffect(() => {
        const getAllToponymsResponse = ToponymsApi.getAll(requestGetAll);

        const mapedStreetCodes: MapedToponyms[] = [];

        Promise.all([getAllToponymsResponse]).then((response) => {
            response[0].toponyms?.map((toponym) => {
                const mapedStreetCode = {
                    key: toponym.id,
                    streetName: toponym.streetName,

                };

                mapedStreetCodes.push(mapedStreetCode);
            });

            setMapedStreetCodes(mapedStreetCodes);
        });
    }, [requestGetAll]);

    return (
        <div className="ToponymsTableWrapper">
            <SearchMenu setTitle={setTitleRequest} setRequest={setRequest} />
            <div>
                <Table
                    columns={columnsNames}
                    dataSource={mapedStreetCodes}
                    scroll={{ y: 440 }}
                    pagination={false}
                />
            </div>
            <div>
                <div className="underTableZone">
                    <Button className="streetcode-custom-button">Додати обрані</Button>
                </div>
            </div>
        </div>
    );
};
export default StatisticsToponymsComponentAdmin;
