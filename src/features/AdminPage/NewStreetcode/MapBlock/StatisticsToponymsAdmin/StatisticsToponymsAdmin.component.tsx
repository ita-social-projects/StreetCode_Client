import './StatisticsToponymsAdmin.styles.scss';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useMobx from '@app/stores/root-store';
import { ModelState } from '@models/enums/model-state';
import GetAllToponymsResponse from '@models/toponyms/getAllToponyms.response';
import Toponym, { ToponymCreateUpdate } from '@models/toponyms/toponym.model';

import { Button, Checkbox, InputNumber, Pagination } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Table from 'antd/es/table/Table';

import ToponymsApi from '@/app/api/map/toponyms.api';
import GetAllToponyms from '@/models/toponyms/getAllToponyms.request';
import GetAllToponymsRequest from '@/models/toponyms/getAllToponyms.request';

import SearchMenu from './SearchMenu.component';

interface MapedToponyms {
    key: number | undefined,
    streetName: string | undefined,
    checked: boolean | false
}

const StatisticsToponymsComponentAdmin = () => {
    const { newStreetcodeInfoStore } = useMobx();
    const [titleRequest, setTitleRequest] = useState<string | ''>('');
    const [pageRequest, setPageRequest] = useState<number | null>(null);
    const [amountRequest, setAmountRequest] = useState<number | null>(null);
    const [mustChecked, setMustChecked] = useState<(string | undefined)[]>();
    const { id } = useParams<any>();
    const parseId = id ? +id : null;
    const [toponyms, setToponyms] = useState<Toponym[]>();

    const requestDefault: GetAllToponymsRequest = {
        Title: parseId ? "" : 'q',
        Page: null,
        Amount: null,
    };
    const [requestGetAll, setRequestGetAll] = useState<GetAllToponyms>(requestDefault);
    const setRequest = () => {
        setRequestGetAll({
            Page: pageRequest,
            Amount: amountRequest,
            Title: titleRequest === ' ' ? null : titleRequest,
        })
    };
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedToponyms[]>([]);

    useEffect(() => {
        if (parseId) {
            ToponymsApi.getByStreetcodeId(parseId).then((result) => {
                setMustChecked(result.map((x) => x.streetName));
                const persistedItems: ToponymCreateUpdate[] = result.map((toponym) => ({
                    toponymId: toponym.id,
                    streetName: toponym.streetName,
                    isPersisted: true,
                    modelState: ModelState.Updated,
                    streetcodeId: parseId,
                }));
                newStreetcodeInfoStore.SelectedToponyms = persistedItems;
            });
        }
    }, []);

    const columnsNames = [
        {
            title: ' ',
            dataIndex: 'streetName',
            key: 'checkbox',
            width: 6,

            render: (text, record, index) => (
                <Checkbox
                    defaultChecked={mustChecked?.includes(text)}
                    onChange={(e: CheckboxChangeEvent) => {
                        const toponym = newStreetcodeInfoStore.selectedToponyms.find((x) => x.toponymId === record.key);
                        if (e.target.checked) {
                            if (toponym) {
                                toponym.modelState = ModelState.Updated;
                            } else {
                                const newToponym: ToponymCreateUpdate = {
                                    toponymId: record.key,
                                    streetName: text,
                                    streetcodeId: parseId ?? 0,
                                    modelState: ModelState.Created,
                                };
                                newStreetcodeInfoStore.selectedToponyms.push(newToponym);
                            }
                        } else if (toponym?.isPersisted) {
                            toponym.modelState = ModelState.Deleted;
                        } else {
                            newStreetcodeInfoStore.selectedToponyms = newStreetcodeInfoStore
                                .selectedToponyms.filter((t) => t !== text);
                        }
                    }}
                />
            ),
        },
        {
            title: 'Топонім',
            dataIndex: 'streetName',
            width: 120,
            key: 'streetName',
        },

    ];

    useEffect(() => {
        if (requestGetAll.Title === '' && parseId) {
            ToponymsApi.getByStreetcodeId(parseId).then((x) => setToponyms(x));
        } else {
            ToponymsApi.getAll(requestGetAll).then((response) => setToponyms(response.toponyms));
        }
    }, [requestGetAll, parseId]);
    

    useEffect(() => {
        const mappedStreetCodes: MapedToponyms[] = [];
        toponyms?.forEach((toponym) => {
            const mapedStreetCode = {
                key: toponym.id,
                streetName: toponym.streetName,
                checked: toponym.streetName === mustChecked,
            };
            mappedStreetCodes.push(mapedStreetCode);
        });
        setMapedStreetCodes(mappedStreetCodes);
    }, [toponyms, mustChecked]);

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
        </div>
    );
};
export default StatisticsToponymsComponentAdmin;
