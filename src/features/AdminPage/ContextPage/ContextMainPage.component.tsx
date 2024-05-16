import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import ContextAdminModalComponent from '@features/AdminPage/ContextPage/ContextModal/ContextAdminModal.component';
import Context from '@/models/additional-content/context.model';

import './ContextMainPage.style.scss';

const ContextMainPage: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { contextStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [contextToEdit, setContextToEdit] = useState<Context>();

    const updatedContexts = () => {
        contextStore.fetchContexts();
    };

    useEffect(() => {
        updatedContexts();
    }, [modalAddOpened, modalEditOpened]);

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
                        onClick={() => {
                            modalStore.setConfirmationModal(
                                'confirmation',
                                () => {
                                    if (context.id !== undefined) {
                                        contextStore.deleteContext(context.id)
                                            .catch((e) => {
                                                console.log(e);
                                            });
                                        modalStore.setConfirmationModal('confirmation');
                                    }
                                },
                                'Ви впевнені, що хочете видалити цей тег?',
                            );
                        }}
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
                        Додати новий контекст
                    </Button>
                </div>
                <Table
                    pagination={{ pageSize: 10 }}
                    className="partners-table"
                    columns={columns}
                    dataSource={contextStore.getContextArray}
                    rowKey="id"
                />
            </div>
            <ContextAdminModalComponent isModalVisible={modalAddOpened} setIsModalOpen={setModalAddOpened} />
            <ContextAdminModalComponent isModalVisible={modalEditOpened} setIsModalOpen={setModalEditOpened} initialData={contextToEdit} />
        </div>
    );
});
export default ContextMainPage;