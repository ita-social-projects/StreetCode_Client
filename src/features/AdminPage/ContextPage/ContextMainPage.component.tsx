import './ContextMainPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, { ChangeEvent,useEffect, useMemo, useRef, useState} from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import ContextAdminModalComponent from '@features/AdminPage/ContextPage/ContextModal/ContextAdminModal.component';
import { StringComparator } from '@features/AdminPage/SortButton/ComparatorImplementations';
import SortButton, {SortButtonHandle} from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import {
    Button, Dropdown, Empty, Input, Pagination, Space,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Context from '@/models/additional-content/context.model';

const ContextMainPage: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { contextStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [contextToEdit, setContextToEdit] = useState<Context>();
    const [currentPages, setCurrentPages] = useState(1);
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);
    const [title, setTitle] = useState<string>('');

    const { isLoading } = useQuery({
        queryKey: ['contexts', contextStore.PaginationInfo.CurrentPage, title],
        queryFn: () => contextStore.fetchContexts(title),
    });

    const updatedContexts = () => {
        contextStore.fetchContexts();
    };

    const PaginationProps = {
        items: [10, 25, 50].map((value) => ({
            key: value.toString(),
            label: value.toString(),
            onClick: () => {
                setSelected(value);
                setAmountRequest(value);
                setCurrentPages(1);
                contextStore.PaginationInfo.PageSize = value;
                contextStore.fetchContexts();
            },
        })),
    };
    useEffect(() => {
        updatedContexts();
    }, [modalAddOpened, modalEditOpened]);

    useEffect(() => {
        setCurrentPages(1);
        contextStore.setCurrentPage(1);
        contextStore.fetchContexts();
    }, [title]);

    const handleDeleteContext = (contextId: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                if (contextId !== undefined) {
                    contextStore.deleteContext(contextId)
                        .catch((e) => {
                            console.error(e);
                        });
                    modalStore.setConfirmationModal('confirmation');
                }
            },
            CONFIRMATION_MESSAGES.DELETE_CONTEXT,
        );
    };

    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const dataSource = contextStore.getContextArray;

    const { sortDirection, toggleSort } = useSortDirection();

    const sortButtons = {
        sortByName: useRef<SortButtonHandle>(null),
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

    const sortedData = useMemo(
        () => SortData<Context, string>(
            dataSource,
            sortDirection,
            (itemToCompare: Context) => itemToCompare?.title,
            StringComparator,
        ),
        [dataSource, sortDirection],
    );

    const columns: ColumnsType<Context> = [
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
            dataIndex: 'title',
            key: 'title',
            render(value) {
                return (
                    <div>
                        {value}
                    </div>
                );
            },
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (value, context, index) => (
                <div key={`${context.id}${index}1`} className="partner-page-actions">
                    <DeleteOutlined
                        key={`${context.id}${index}`}
                        className="actionButton"
                        onClick={() => handleDeleteContext(context.id)}
                    />
                    <EditOutlined
                        key={`${context.id}${index}2`}
                        className="actionButton"
                        onClick={() => {
                            setContextToEdit(context);
                            setModalEditOpened(true);
                        }}
                    />

                </div>
            ),
        },
    ];
    return (
        <div className="context-page">
            <div className="contexts-page-container">
                <div className="container-justify-end">
                    <div className="searchMenuElement">
                        <Input
                            className="searchMenuElementInput"
                            prefix={<MagnifyingGlass />}
                            onChange={handleChangeTitle}
                            placeholder="Назва"
                        />
                    </div>
                    <Button
                        className="streetcode-custom-button partners-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        {BUTTON_LABELS.ADD_CONTEXT}
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="partners-table"
                    columns={columns}
                    dataSource={sortedData || []}
                    rowKey="id"
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
                <div className="underTableZone">
                    <br />
                    <div className="underTableElement">
                        <div className="PaginationSelect">
                            <p>Рядків на сторінці</p>
                            <Dropdown menu={{ items: PaginationProps.items }} trigger={['click']}>
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
                            total={contextStore.PaginationInfo.TotalItems}
                            pageSize={amountRequest}
                            onChange={(page: number) => {
                                setCurrentPages(page);
                                contextStore.setCurrentPage(page);
                                contextStore.fetchContexts();
                            }}
                        />
                    </div>
                </div>
            </div>
            <ContextAdminModalComponent
                isModalVisible={modalAddOpened}
                setIsModalOpen={setModalAddOpened}
            />
            <ContextAdminModalComponent
                isModalVisible={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                initialData={contextToEdit}
            />
        </div>
    );
});
export default ContextMainPage;
