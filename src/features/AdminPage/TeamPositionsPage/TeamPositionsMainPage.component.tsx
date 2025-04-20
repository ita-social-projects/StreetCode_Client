import './TeamPositionsMainPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import { StringComparator } from '@features/AdminPage/SortButton/ComparatorImplementations';
import SortButton, { SortButtonHandle } from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import {
    Button, Dropdown, Empty, Input, Pagination, Space,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Position from '@/models/additional-content/teampositions.model';

import TeamPositionsAdminModal from './TeamPositionsModal/TeamPositionsAdminModal.component';

const TeamPositionsMainPage: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { teamPositionsStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState(false);
    const [modalEditOpened, setModalEditOpened] = useState(false);
    const [positionToEdit, setPositionToEdit] = useState<Position>();
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);
    const [title, setTitle] = useState('');
    const [debouncedTitle, setDebouncedTitle] = useState('');
    const currentPage = teamPositionsStore.PaginationInfo.CurrentPage;

    const { isLoading, data, refetch } = useQuery({
        queryKey: ['positions', debouncedTitle, currentPage, amountRequest],
        queryFn: () => teamPositionsStore.fetchPositions(debouncedTitle, amountRequest),
        enabled: false,
        keepPreviousData: true,
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            teamPositionsStore.setCurrentPage(1); // <-- Спочатку оновлення сторінки
            setDebouncedTitle(title);
        }, 400);

        return () => clearTimeout(timeout);
    }, [title]);

    useEffect(() => {
        refetch();
    }, [debouncedTitle, currentPage, amountRequest]);

    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
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
    const dataSource = teamPositionsStore.getPositionsArray;

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
        () => SortData<Position, string>(
            dataSource,
            sortDirection,
            (itemToCompare: Position) => itemToCompare?.position,
            StringComparator,
        ),
        [dataSource, sortDirection],
    );

    const columns: ColumnsType<Position> = [
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
                    <div className="searchMenuElement">
                        <Input
                            className="searchMenuElementInput"
                            prefix={<MagnifyingGlass />}
                            onChange={handleChangeTitle}
                            placeholder="Назва"
                        />
                    </div>
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
                            <Dropdown menu={{
                                    items: [10, 25, 50].map((value) => ({
                                        key: value.toString(),
                                        label: value.toString(),
                                        onClick: () => {
                                            setSelected(value);
                                            setAmountRequest(value);
                                            teamPositionsStore.setCurrentPage(1);
                                        },
                                    })),
                                }}
                                trigger={['click']}
                            >
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
                            current={currentPage}
                            total={teamPositionsStore.PaginationInfo.TotalItems}
                            pageSize={amountRequest}
                            onChange={(page) => {
                                teamPositionsStore.setCurrentPage(page);
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
