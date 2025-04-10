import './ContextMainPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, {useEffect, useMemo, useState} from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import ContextAdminModalComponent from '@features/AdminPage/ContextPage/ContextModal/ContextAdminModal.component';
import SortButton from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';

import { Button, Dropdown, Empty, Pagination, Space } from 'antd';
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
    const { isLoading } = useQuery({
        queryKey: ['contexts', contextStore.PaginationInfo.CurrentPage],
        queryFn: () => contextStore.fetchContexts(),
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

    const dataSource = contextStore.getContextArray;

    const { sortDirection, toggleSort } = useSortDirection();
    const sortedData = useMemo(
        () => SortData<Context>(dataSource, sortDirection, (itemToCompare: Context) => itemToCompare?.title),
        [dataSource, sortDirection],
    );

    const columns: ColumnsType<Context> = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Назва</span>
                    <SortButton sortOnClick={toggleSort} />
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
