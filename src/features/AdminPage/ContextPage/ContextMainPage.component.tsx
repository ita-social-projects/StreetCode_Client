import './ContextMainPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import ContextAdminModalComponent from '@features/AdminPage/ContextPage/ContextModal/ContextAdminModal.component';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';

import { Button, Empty, Pagination } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Context from '@/models/additional-content/context.model';

const ContextMainPage: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { contextStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [contextToEdit, setContextToEdit] = useState<Context>();

    const { isLoading, refetch } = useQuery({
        queryKey: ['contexts', contextStore.PaginationInfo.CurrentPage],
        queryFn: () => contextStore.fetchContexts(),
    });

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

    const columns: ColumnsType<Context> = [
        {
            title: 'Назва',
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
                    dataSource={contextStore.getContextArray || []}
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
                        <Pagination
                            className="paginationElement"
                            showSizeChanger={false}
                            defaultCurrent={1}
                            current={contextStore.PaginationInfo.CurrentPage}
                            total={contextStore.PaginationInfo.TotalItems}
                            pageSize={contextStore.PaginationInfo.PageSize}
                            onChange={(value: any) => {
                                contextStore.setCurrentPage(value);
                            }}
                        />
                    </div>
                </div>
            </div>
            <ContextAdminModalComponent
                isModalVisible={modalAddOpened}
                setIsModalOpen={setModalAddOpened}
                afterSubmit={refetch}
            />
            <ContextAdminModalComponent
                isModalVisible={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                initialData={contextToEdit}
                afterSubmit={refetch}
            />
        </div>
    );
});

export default ContextMainPage;
