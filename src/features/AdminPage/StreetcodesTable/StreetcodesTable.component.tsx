import './SearchMenu.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChartOutlined, DeleteOutlined, DownOutlined, FormOutlined, RollbackOutlined,
} from '@ant-design/icons';
import { NumberLiteralTypeAnnotation } from '@babel/types';

import {
    Button, Dropdown, InputNumber, MenuProps, Pagination, Space,
} from 'antd';
import Table from 'antd/es/table/Table';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useMobx, { useModalContext } from '@/app/stores/root-store';
import GetAllStreetcodesRequest from '@/models/streetcode/getAllStreetcodes.request';

import { formatDate } from './FormatDateAlgorithm';
import SearchMenu from './SearchMenu.component';

const StreetcodesTable = () => {
    const [currentPages, setCurrentPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [titleRequest, setTitleRequest] = useState<string | null>(null);
    const [statusRequest, setStatusRequest] = useState<string | null>(null);
    const [pageRequest, setPageRequest] = useState<number | null>(1);
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedStreetCode[]>([]);
    const [currentStreetcodeOption, setCurrentStreetcodeOption] = useState(0);
    const amountRequest = 10;

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
            Title: titleRequest === '' ? null : titleRequest,
            Sort: null,
            Filter: statusRequest == null ? null : `Status:${statusRequest}`,
        });
    };

    const { modalStore } = useModalContext();

    const items: MenuProps['items'] = [
        {
            label: 'Чернетка',
            key: '0',
        },
        {
            label: 'Опублікований',
            key: '1',
        },
        {
            label: 'Видалений',
            key: '2',
        },
    ];

    const updateState = (id: number, state: string) => {
        const updatedMapedStreetCodes = mapedStreetCodes.map((item) => {
            if (item.key === id) {
                return {
                    ...item,
                    status: state,
                    date: formatDate(new Date()),
                };
            }
            return item;
        });
        setMapedStreetCodes(updatedMapedStreetCodes);
    };

    const handleMenuClick: MenuProps['onClick'] = async (e) => {
        await StreetcodesApi.updateState(currentStreetcodeOption, +e.key);

        let currentStatus;
        switch (e.key) {
        case '0': { currentStatus = 'Чернетка'; break; }
        case '1': { currentStatus = 'Опублікований'; break; }
        case '2': { currentStatus = 'Видалений'; break; }
        default: { currentStatus = 'Чернетка'; break; }
        }

        updateState(currentStreetcodeOption, currentStatus);
    };

    const handleUndoDelete = async (id: number) => {
        await StreetcodesApi.updateState(id, 0);
        updateState(id, 'Видалений');
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const columnsNames = [
        {
            title: 'Назва стріткоду',
            dataIndex: 'name',
            width: 500,
            key: 'name',
            render: (text: string, record: MapedStreetCode) => ({
                children: (
                    <div onClick={() => window.open(`${FRONTEND_ROUTES.ADMIN.BASE}/${record.url}`, '_blank')}>
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
                    <div onClick={() => window.open(`${FRONTEND_ROUTES.ADMIN.BASE}/${record.url}`, '_blank')}>
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
                    <Dropdown menu={
                        menuProps
                    }
                    >
                        <Button onClick={() => setCurrentStreetcodeOption(record.key)}>
                            <Space>
                                {text}
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                ),
            }),
        },
        {
            title: 'Останні зміни',
            dataIndex: 'date',
            key: 'date',
            render: (text: string, record: MapedStreetCode) => ({
                children: (
                    <div onClick={() => window.open(`${FRONTEND_ROUTES.ADMIN.BASE}/${record.url}`, '_blank')}>
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
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                    {record.status !== 'Видалений' ? (
                        <>
                            <Link to={`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/${record.key}`}>
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
                                                updateState(record, 'Видалений');
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
                        : (
                            <RollbackOutlined
                                className="actionButton"
                                onClick={() => handleUndoDelete(record.key)}
                            />
                        )}
                </>
            ),
        },
    ];
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
        const getAllStreetcodesResponse = StreetcodesApi.getAll(requestGetAll);
        const mapedStreetCodesBuffer: MapedStreetCode[] = [];
        Promise.all([getAllStreetcodesResponse]).then((response) => {
            response[0].streetcodes?.map((streetcode) => {
                let currentStatus = '';

                switch (streetcode.status) {
                case 0: { currentStatus = 'Чернетка'; break; }
                case 1: { currentStatus = 'Опублікований'; break; }
                case 2: { currentStatus = 'Видалений'; break; }
                default: { currentStatus = 'Чернетка'; break; }
                }

                const mapedStreetCode = {
                    key: streetcode.id,
                    index: streetcode.index,
                    status: currentStatus,
                    date: formatDate(new Date(streetcode.updatedAt)),
                    name: streetcode.title,
                    url: streetcode.transliterationUrl,
                };
                mapedStreetCodesBuffer.push(mapedStreetCode);
            });

            setMapedStreetCodes(mapedStreetCodesBuffer);
            setTotalItems(response[0].pages * amountRequest);
        });
    }, [requestGetAll, pageRequest]);

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
                        <Pagination
                            className="pagenationElement"
                            simple
                            defaultCurrent={1}
                            current={currentPages}
                            total={totalItems}
                            pageSize={amountRequest}
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

export default observer(StreetcodesTable);
