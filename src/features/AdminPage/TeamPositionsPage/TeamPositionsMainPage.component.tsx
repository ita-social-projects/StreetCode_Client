import './TeamPositionsMainPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';

import { Button, Dropdown, Empty, Pagination, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Position from '@/models/additional-content/teampositions.model';

import TeamPositionsAdminModal from './TeamPositionsModal/TeamPositionsAdminModal.component';

const TeamPositionsMainPage: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { teamPositionsStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [positionToEdit, setPositionToEdit] = useState<Position>();
    const [currentPages, setCurrentPages] = useState(1);
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);
    const { isLoading } = useQuery({
        queryKey: ['positions', teamPositionsStore.PaginationInfo.CurrentPage],
        queryFn: () => teamPositionsStore.fetchPositions(),
    });

    const updatedPositions = () => {
        teamPositionsStore.fetchPositions();
    };

    useEffect(() => {
        updatedPositions();
    }, [modalAddOpened, modalEditOpened]);

    const PaginationProps = {
        items: [10, 25, 50].map((value) => ({
            key: value.toString(),
            label: value.toString(),
            onClick: () => {
                setSelected(value);
                setAmountRequest(value);
                setCurrentPages(1);
                teamPositionsStore.PaginationInfo.PageSize = value;
                teamPositionsStore.fetchPositions();
            },
        })),
    };
    const handleDeletePosition = (positionId: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                if (positionId !== undefined) {
                    teamPositionsStore.deletePosition(positionId)
                        .catch((e) => {
                            console.error(e);
                        });
                    modalStore.setConfirmationModal('confirmation');
                }
            },
            CONFIRMATION_MESSAGES.DELETE_POSITION,
        );
    };

    const columns: ColumnsType<Position> = [
        {
            title: 'Назва',
            dataIndex: 'position',
            key: 'position',
            render(value, record) {
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
            render: (value, positions, index) => (
                <div key={`${positions.id}${index}1`} className="position-page-actions">
                    <DeleteOutlined
                        key={`${positions.id}${index}`}
                        className="actionButton"
                        onClick={() => handleDeletePosition(positions.id)}
                    />
                    <EditOutlined
                        key={`${positions.id}${index}2`}
                        className="actionButton"
                        onClick={() => {
                            setPositionToEdit(positions);
                            setModalEditOpened(true);
                        }}
                    />

                </div>
            ),
        },
    ];
    return (
        <div className="positions-page">
            <div className="positions-page-container">
                <div className="container-justify-end">
                    <Button
                        className="streetcode-custom-button positions-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        {BUTTON_LABELS.ADD_POSITION}
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="positions-table"
                    columns={columns}
                    dataSource={teamPositionsStore.getPositionsArray || []}
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
                            total={teamPositionsStore.PaginationInfo.TotalItems}
                            pageSize={amountRequest}
                            onChange={(page: number) => {
                                setCurrentPages(page);
                                teamPositionsStore.setCurrentPage(page);
                                teamPositionsStore.fetchPositions();
                            }}
                        />
                    </div>
                </div>
            </div>
            <TeamPositionsAdminModal
                isModalVisible={modalAddOpened}
                setIsModalOpen={setModalAddOpened}
            />
            <TeamPositionsAdminModal
                isModalVisible={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                initialData={positionToEdit}
            />
        </div>

    );
});
export default TeamPositionsMainPage;
