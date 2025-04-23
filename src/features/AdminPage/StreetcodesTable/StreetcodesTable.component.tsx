import './SearchMenu.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    DeleteOutlined, DownOutlined, EditOutlined, RollbackOutlined,
} from '@ant-design/icons';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import {
    NumberComparator,
    StringComparator,
} from '@features/AdminPage/SortButton/ComparatorImplementations';
import SortButton, { SortButtonHandle } from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection, { SortDirection } from '@features/AdminPage/SortButton/useSortDirection';
import sortOptions from '@features/AdminPage/StreetcodesTable/constants/sortOptions';
import STREETCODE_STATES from '@features/AdminPage/StreetcodesTable/constants/streetcodeStates';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import {
    Button, Dropdown, Empty, MenuProps, Pagination, Space,
} from 'antd';
import Table from 'antd/es/table/Table';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
// eslint-disable-next-line import/extensions
import { useModalContext } from '@/app/stores/root-store';
import GetAllStreetcodesRequest from '@/models/streetcode/getAllStreetcodes.request';

import { formatDate } from './FormatDateAlgorithm';
import SearchMenu from './SearchMenu.component';

function convertUTCDateToLocalDate(date :Date) {
    const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}
const StreetcodesTable = () => {
    const [currentPages, setCurrentPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [titleRequest, setTitleRequest] = useState<string | null>(null);
    const [statusRequest, setStatusRequest] = useState<string[]>([]);
    const [pageRequest, setPageRequest] = useState<number>(1);
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedStreetCode[]>([]);
    const [currentStreetcodeOption, setCurrentStreetcodeOption] = useState(0);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [deleteStreetcode, deleteFormDB] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selected, setSelected] = useState(10);
    const [amountRequest, setAmountRequest] = useState(10);
    const requestDefault: GetAllStreetcodesRequest = {
        Page: pageRequest,
        Amount: amountRequest,
        Title: null,
        Sort: sortOptions.UpdatedAtDesc,
        Filter: null,
    };

    const { sortDirection, toggleSort, activeKey } = useSortDirection();

    const sortButtons = {
        sortByName: useRef<SortButtonHandle>(null),
        sortByIndex: useRef<SortButtonHandle>(null),
        sortByAuthor: useRef<SortButtonHandle>(null),
        sortByDate: useRef<SortButtonHandle>(null),
    };

    const [buttonKey, setButtonKey] = useState<string | null>(null);

    useEffect(() => {
        Object.entries(sortButtons).forEach(([key, value]) => {
            if (buttonKey === key) {
                (value.current as SortButtonHandle).changeImage(sortDirection);
            } else {
                (value.current as SortButtonHandle).resetImage();
            }
        });
    }, [sortDirection, buttonKey]);

    const sortingDelegates = {
        name: () => SortData<MapedStreetCode, string>(
            mapedStreetCodes,
            sortDirection,
            (itemToCompare: MapedStreetCode) => itemToCompare?.name,
            StringComparator,
        ),
        index: () => SortData<MapedStreetCode, number>(
            mapedStreetCodes,
            sortDirection,
            (itemToCompare: MapedStreetCode) => itemToCompare?.index,
            NumberComparator,
        ),
        author: () => SortData<MapedStreetCode, string>(
            mapedStreetCodes,
            sortDirection,
            (itemToCompare: MapedStreetCode) => itemToCompare?.author,
            StringComparator,
        ),
        date: () => SortData<MapedStreetCode, string>(
            mapedStreetCodes,
            sortDirection,
            (itemToCompare: MapedStreetCode) => itemToCompare?.date,
            StringComparator,
        ),
    };

    const sortedData = useMemo(
        () => {
            if (activeKey && activeKey in sortingDelegates) {
                return sortingDelegates[activeKey as keyof typeof sortingDelegates]();
            }
            return mapedStreetCodes;
        },
        [mapedStreetCodes, sortDirection, activeKey, sortingDelegates],
    );

    const [requestGetAll, setRequestGetAll] = useState<GetAllStreetcodesRequest>(requestDefault);

    const setRequest = () => {
        let page = pageRequest;
        const filter = statusRequest.length === 0 ? null : `Status:${statusRequest}`;
        if (requestGetAll.Title !== titleRequest || requestGetAll.Filter !== filter) {
            setPageRequest(1);
            setCurrentPages(1);
            page = 1;
        }
        setRequestGetAll({
            Page: page,
            Amount: amountRequest,
            Title: titleRequest === '' ? null : titleRequest,
            Sort: requestDefault.Sort,
            Filter: filter,
        });
    };

    const { modalStore } = useModalContext();

    const items: MenuProps['items'] = [
        {
            label: STREETCODE_STATES.DRAFT.label,
            key: STREETCODE_STATES.DRAFT.key,
        },
        {
            label: STREETCODE_STATES.PUBLISHED.label,
            key: STREETCODE_STATES.PUBLISHED.key,
        },
        {
            label: STREETCODE_STATES.DELETED.label,
            key: STREETCODE_STATES.DELETED.key,
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

    const handleChangeStatusConfirmation = async (status: string, e: number) => {
        await StreetcodesApi.updateState(currentStreetcodeOption, e);
        updateState(currentStreetcodeOption, status);
        modalStore.setConfirmationModal('confirmation', undefined, '', false, undefined);
    };

    const handleCancelConfirmation = () => {
        setIsConfirmationModalVisible(false);
    };

    const handleMenuClick: MenuProps['onClick'] = async (e) => {
        try {
            const selectedKey = +e.key;
            let currentStatus: string;

            switch (selectedKey) {
            case STREETCODE_STATES.DRAFT.key:
                currentStatus = STREETCODE_STATES.DRAFT.label;
                break;
            case STREETCODE_STATES.PUBLISHED.key:
                currentStatus = STREETCODE_STATES.PUBLISHED.label;
                break;
            case STREETCODE_STATES.DELETED.key:
                currentStatus = STREETCODE_STATES.DELETED.label;
                break;
            default:
                currentStatus = STREETCODE_STATES.DRAFT.label;
                break;
            }
            modalStore.setConfirmationModal(
                'confirmation',
                () => handleChangeStatusConfirmation(currentStatus, selectedKey),
                CONFIRMATION_MESSAGES.CHANGE_STREETCODE_STATUS,
                isConfirmationModalVisible,
                handleCancelConfirmation,
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleUndoArchive = async (id: number) => {
        await StreetcodesApi.updateState(id, STREETCODE_STATES.PUBLISHED.key);
        updateState(id, STREETCODE_STATES.PUBLISHED.label);
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const handleDeleteStreetcode = (streetcodeId: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                StreetcodesApi.delete(streetcodeId)
                    .then(() => {
                        setMapedStreetCodes(mapedStreetCodes
                            .filter((s) => s.key !== streetcodeId));
                    })
                    .catch((e) => {
                        console.error(e);
                    });
                modalStore.setConfirmationModal('confirmation');
            },
            CONFIRMATION_MESSAGES.DELETE_STREETCODE,
        );

        deleteFormDB(streetcodeId);
    };
    const PaginationProps = {
        items: [10, 25, 50].map((value) => ({
            key: value.toString(),
            label: value.toString(),
            onClick: () => {
                setSelected(value);
                setAmountRequest(value);
                setRequest();
            },
        })),
    };
    const columnsNames = [
        {
            title: (
                <div className="content-table-title">
                    <span>Назва</span>
                    <SortButton
                        ref={sortButtons.sortByName}
                        sortOnClick={() => {
                            toggleSort('name');
                            setButtonKey('sortByName');
                        }}
                    />
                </div>
            ),
            dataIndex: 'name',
            width: '18%',
            key: 'name',
            onCell: (record: MapedStreetCode) => ({
                onClick: () => window.open(`${FRONTEND_ROUTES.ADMIN.BASE}/${record.url}`, '_blank'),
            }),
        },
        {
            title: (
                <div className="content-table-title">
                    <span>Номер</span>
                    <SortButton
                        ref={sortButtons.sortByIndex}
                        sortOnClick={() => {
                            toggleSort('index');
                            setButtonKey('sortByIndex');
                        }}
                    />
                </div>
            ),
            dataIndex: 'index',
            width: '18%',
            key: 'index',
            onCell: (record: MapedStreetCode) => ({
                onClick: () => window.open(`${FRONTEND_ROUTES.ADMIN.BASE}/${record.url}`, '_blank'),
            }),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: '18%',
            onCell: (record: MapedStreetCode) => ({
                onClick: () => {
                    setCurrentStreetcodeOption(record.key);
                    setIsConfirmationModalVisible(true);
                },
            }),
            render: (text: string) => (
                <Dropdown menu={menuProps} trigger={['click']}>
                    <Button>
                        <Space>
                            {text}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            ),
        },
        {
            title: (
                <div className="content-table-title">
                    <span>Автор</span>
                    <SortButton
                        ref={sortButtons.sortByAuthor}
                        sortOnClick={() => {
                            toggleSort('author');
                            setButtonKey('sortByAuthor');
                        }}
                    />
                </div>
            ),
            dataIndex: 'author',
            key: 'author',
            width: '18%',
            onCell: (record: MapedStreetCode) => ({
                onClick: () => window.open(`${FRONTEND_ROUTES.ADMIN.BASE}/${record.url}`, '_blank'),
            }),
        },
        {
            title: (
                <div className="content-table-title">
                    <span>Історія</span>
                    <SortButton
                        ref={sortButtons.sortByDate}
                        sortOnClick={() => {
                            toggleSort('date');
                            setButtonKey('sortByDate');
                        }}
                    />
                </div>
            ),
            dataIndex: 'date',
            key: 'date',
            width: '18%',
            onCell: (record: MapedStreetCode) => ({
                onClick: () => window.open(`${FRONTEND_ROUTES.ADMIN.BASE}/${record.url}`, '_blank'),
            }),
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            width: '10%',
            key: 'action',
            render: (_: unknown, record: MapedStreetCode) => (
                <>
                    {record.status !== STREETCODE_STATES.DELETED.label ? (
                        <>
                            <Link to={`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/${record.key}`}>
                                <EditOutlined
                                    className="actionButton"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                />
                            </Link>
                            <DeleteOutlined
                                className="actionButton"
                                onClick={() => handleDeleteStreetcode(record.key)}
                            />
                        </>
                    ) : (
                        <RollbackOutlined
                            className="actionButton"
                            onClick={() => handleUndoArchive(record.key)}
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
        url: string,
        author: string,
    }

    const fetchPaginatedData = async () => {
        setIsLoading(true);
        requestGetAll.Page = pageRequest;
        requestGetAll.Amount = amountRequest;
        const getAllStreetcodesResponse = await StreetcodesApi.getAll(requestGetAll);
        const mapedStreetCodesBuffer: MapedStreetCode[] = [];
        const response = await Promise.all([getAllStreetcodesResponse]);
        response[0].streetcodes.forEach((streetcode) => {
            let currentStatus = '';

            switch (streetcode.status) {
            case STREETCODE_STATES.DRAFT.key: { currentStatus = STREETCODE_STATES.DRAFT.label; break; }
            case STREETCODE_STATES.PUBLISHED.key: { currentStatus = STREETCODE_STATES.PUBLISHED.label; break; }
            case STREETCODE_STATES.DELETED.key: { currentStatus = STREETCODE_STATES.DELETED.label; break; }
            default: { currentStatus = STREETCODE_STATES.DRAFT.label; break; }
            }
            const mapedStreetCode = {
                key: streetcode.id,
                index: streetcode.index,
                status: currentStatus,
                date: format(
                    convertUTCDateToLocalDate(new Date(streetcode.updatedAt)),
                    'dd.MM.yyyy HH:mm:SS ',
                    { locale: uk },
                ),
                name: streetcode.title,
                url: streetcode.transliterationUrl,
                author: streetcode.createdBy,
            };
            mapedStreetCodesBuffer.push(mapedStreetCode);
        });

        setMapedStreetCodes(mapedStreetCodesBuffer);
        setTotalItems(response[0].totalAmount);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPaginatedData();
    }, [requestGetAll, pageRequest, deleteStreetcode]);

    return (
        <div className="StreetcodeTableWrapper">
            <SearchMenu setStatus={setStatusRequest} setTitle={setTitleRequest} setRequest={setRequest} />
            <div className="ScrollableTableContainer">
                <Table
                    columns={columnsNames}
                    dataSource={isLoading ? [] : sortedData}
                    pagination={false}
                    locale={{
                        emptyText: isLoading ? (
                            <div className="loadingWrapper">
                                <div id="loadingGif" />
                            </div>
                        ) : (
                            <Empty description="Дані відсутні" />
                        ),
                    }}
                />
            </div>
            <div className="underTableZone">
                <br />
                <div className="underTableElement">
                    <div className="PaginationSelect">
                        <p>Рядків на сторінці</p>
                        <Dropdown menu={{ items: PaginationProps.items, className: 'classss' }} trigger={['click']}>
                            <Button>
                                <Space>
                                    {selected}
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
                    <Pagination
                        className="paginationElement"
                        showSizeChanger={false}
                        defaultCurrent={1}
                        current={currentPages}
                        total={totalItems}
                        pageSize={amountRequest}
                        onChange={(page: number) => {
                            setCurrentPages(page);
                            setPageRequest(page);
                            setRequest();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default observer(StreetcodesTable);
