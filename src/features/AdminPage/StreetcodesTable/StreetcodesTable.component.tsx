import './SearchMenu.styles.scss';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChartOutlined, DeleteOutlined, FormOutlined, RollbackOutlined } from '@ant-design/icons';

import { InputNumber, Pagination } from 'antd';
import Table from 'antd/es/table/Table';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useMobx from '@/app/stores/root-store';
import GetAllStreetcodesRequest from '@/models/streetcode/getAllStreetcodes.request';

import { formatDate } from './FormatDateAlgorithm';
import SearchMenu from './SearchMenu.component';

const StreetcodesTable = () => {
    const [currentPages, setCurrentPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [titleRequest, setTitleRequest] = useState<string | null>(null);
    const [statusRequest, setStatusRequest] = useState<string | null>(null);
    const [pageRequest, setPageRequest] = useState<number | null>(1);
    const [amountRequest, setAmountRequest] = useState<number | null>(4);
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedStreetCode[]>([]);

    const requestDefault: GetAllStreetcodesRequest = {
        Page: pageRequest,
        Amount: amountRequest,
        Title: null,
        Sort: null,
        Filter: null,
    };

    const [requestGetAll, setRequestGetAll] = useState<GetAllStreetcodesRequest>(requestDefault);

    const setRequest = () => {
        setRequestGetAll({
            Page: pageRequest,
            Amount: amountRequest,
            Title: titleRequest == '' ? null : titleRequest,
            Sort: null,
            Filter: statusRequest == null ? null : `Status:${statusRequest}`,
        });
        console.log('GET ALL REQUEST', requestGetAll);
    };

    const { modalStore } = useMobx();
    const columnsNames = [
        {
            title: 'Назва стріткоду',
            dataIndex: 'name',
            width: 500,
            key: 'name',
            render: (text: string, record: MapedStreetCode) => ({
                children: (
                    <div onClick={() => window.open(`${record.url}`, '_blank')}>
                        {text}
                    </div>
                ),
            }),
        },
        {
            title: 'Номер стріткоду',
            dataIndex: 'index',
            width: 150,
            key: 'index',
            render: (text: string, record: MapedStreetCode) => ({
                children: (
                    <div onClick={() => window.open(`${record.url}`, '_blank')}>
                        {text}
                    </div>
                ),
            }),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (text: string, record: MapedStreetCode) => ({
                children: (
                    <div onClick={() => window.open(`${record.url}`, '_blank')}>
                        {text}
                    </div>
                ),
            }),
        },
        {
            title: 'Останні зміни',
            dataIndex: 'date',
            key: 'date',
            render: (text: string, record: MapedStreetCode) => ({
                children: (
                    <div onClick={() => window.open(`${record.url}`, '_blank')}>
                        {text}
                    </div>
                ),
            }),
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            width: 100,
            key: 'action',
            render: (value: any, record: MapedStreetCode, index: any) => (
                <>
                    {record.status !== 'Видалений' ? (
                        <>
                            <Link to={`/admin-panel/edit-streetcode/${record.key}`}>
                                <FormOutlined
                                    className="actionButton"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                />
                            </Link>
                            <DeleteOutlined
                                className="actionButton"
                                onClick={(event) => {
                                    modalStore.setConfirmationModal(
                                        'confirmation',
                                        () => {
                                            StreetcodesApi.delete(record.key).then(() => {
                                                deleteFile(record);
                                            }).catch((e) => {
                                                console.log(e);
                                            });
                                            modalStore.setConfirmationModal('confirmation');
                                        },
                                        'Ви впевнені, що хочете видалити цей стріткод?',
                                    );
                                }}
                            />
                            <Link to={`${FRONTEND_ROUTES.ADMIN.ANALYTICS}/${record.key}`}>
                                <BarChartOutlined />
                            </Link>
                        </>
                    )
                        : <RollbackOutlined className="actionButton" />}
                </>
            ),
        },
    ];
    const deleteFile = (record: any) => {
        const updatedMapedStreetCodes = mapedStreetCodes.map((item) => {
            if (item.index === record.index) {
                return {
                    ...item,
                    status: 'Видалений',
                    date: formatDate(new Date()),
                };
            }
            return item;
        });
        setMapedStreetCodes(updatedMapedStreetCodes);
    };
    interface MapedStreetCode {
        key: number,
        index: number,
        status: string,
        date: string,
        name: string,
        url: string
    }

    useEffect(() => {
        requestGetAll.Page = pageRequest;
        requestGetAll.Amount = amountRequest;
        const getAllStreetcodesResponse = StreetcodesApi.getAll(
            requestGetAll,
        );
        const mapederStreetCodes: MapedStreetCode[] = [];

        Promise.all([getAllStreetcodesResponse]).then((response) => {
            response[0].streetcodes?.map((streetcode) => {
                let currentStatus = '';

                switch (streetcode.status) {
                case 0: { currentStatus = 'Чернетка'; break; }
                case 1: { currentStatus = 'Опублікований'; break; }
                case 2: { currentStatus = 'Видалений'; break; }
                }

                const mapedStreetCode = {
                    key: streetcode.id,
                    index: streetcode.index,
                    status: currentStatus,
                    date: formatDate(new Date(streetcode.updatedAt)),
                    name: streetcode.title,
                    url: streetcode.transliterationUrl,
                };

                mapederStreetCodes.push(mapedStreetCode);
            });

            setMapedStreetCodes(mapederStreetCodes);
            setTotalItems(amountRequest !== null
                ? response[0].pages * amountRequest : 0);
        });
    }, [requestGetAll, amountRequest]);

    return (

        <div className="StreetcodeTableWrapper">
            <SearchMenu setStatus={setStatusRequest} setTitle={setTitleRequest} setRequest={setRequest} />
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
                    <br />
                    <div className="underTableElement">
                        <InputNumber
                            className="pageAmountElement"
                            min={1}
                            max={20}
                            defaultValue={amountRequest !== null ? amountRequest : 4}
                            onChange={(value: number | null) => {
                                setAmountRequest(value);
                                setRequest();
                            }}
                        />
                    </div>
                    <div className="underTableElement">
                        <Pagination
                            className="pagenationElement"
                            simple
                            defaultCurrent={1}
                            current={currentPages}
                            total={totalItems}
                            pageSize={amountRequest !== null ? amountRequest : 0}
                            onChange={(value: any) => {
                                setCurrentPages(value);
                                setPageRequest(value);
                                setRequest();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreetcodesTable;
