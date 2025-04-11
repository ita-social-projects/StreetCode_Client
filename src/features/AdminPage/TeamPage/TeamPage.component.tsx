/* eslint-disable no-restricted-imports */
import './TeamPage.styles.scss';

import { observer } from 'mobx-react-lite';
import React, {useEffect, useMemo, useState} from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined, StarOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import SortButton from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import { useQuery } from '@tanstack/react-query';

import { Button, Dropdown, Empty, Pagination, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import Image from '@/models/media/image.model';

import base64ToUrl from '../../../app/common/utils/base64ToUrl.utility';
import ImageStore from '../../../app/stores/image-store';
import useMobx, { useModalContext } from '../../../app/stores/root-store';
import TeamMember, { TeamMemberLink } from '../../../models/team/team.model';
import PageBar from '../PageBar/PageBar.component';

import LOGO_ICONS from './TeamModal/constants/logoIcons';
import TeamModal from './TeamModal/TeamModal.component';
import {StringComparator} from "@features/AdminPage/SortButton/ComparatorImplementations";

const TeamPage = () => {
    const { teamStore } = useMobx();
    const { modalStore } = useModalContext();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [teamToEdit, setTeamToedit] = useState<TeamMember>();
    const [currentPages, setCurrentPages] = useState(1);
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);
    const { isLoading } = useQuery({
        queryKey: ['team', teamStore.PaginationInfo.CurrentPage],
        queryFn: () => teamStore.getAll(),
    });

    const updatedTeam = () => {
        Promise.all([teamStore?.getAll()]).then(() => {
            teamStore?.TeamMap.forEach((val, key) => {
                ImageStore.getImageById(val.imageId).then((image) => {
                    teamStore.TeamMap.set(val.id, { ...val, image });
                });
            });
        }).then(() => teamStore.setInternalMap(teamStore.getTeamArray));
    };

    const PaginationProps = {
        items: [10, 25, 50].map((value) => ({
            key: value.toString(),
            label: value.toString(),
            onClick: () => {
                setSelected(value);
                setAmountRequest(value);
                setCurrentPages(1);
                teamStore.PaginationInfo.PageSize = value;
                teamStore.getAll();
            },
        })),
    };

    useEffect(() => {
        updatedTeam();
    }, []);

    const handleDeleteTeamMember = (teamId: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                teamStore.deleteTeam(teamId).then(() => {
                    teamStore.TeamMap.delete(teamId);
                }).catch((e) => {
                    console.error(e);
                });
                modalStore.setConfirmationModal('confirmation');
            },
            CONFIRMATION_MESSAGES.DELETE_TEAM_MEMBER,
        );
    };

    const renderImageColumn = (image: Image, record: { id: any; }) => (
        <img
            key={`${record.id}${image?.id}`}
            className="team-table-logo"
            src={base64ToUrl(image?.base64, image?.mimeType ?? '')}
            alt={image?.alt}
        />
    );

    const dataSource = teamStore?.getTeamArray;

    const { sortDirection, toggleSort } = useSortDirection();
    const sortedData = useMemo(
        () => SortData<TeamMember, string>(
            dataSource,
            sortDirection,
            (itemToCompare: TeamMember) => itemToCompare?.name,
            StringComparator,
        ),
        [dataSource, sortDirection],
    );

    const columns: ColumnsType<TeamMember> = [
        {
            title: (
                <div className="content-table-title">
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <span>Прізвище та ім'я</span>
                    <SortButton sortOnClick={toggleSort} />
                </div>
            ),
            dataIndex: 'name',
            key: 'name',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="team-table-item-name">
                        <p>
                            {record.name}
                        </p>
                        {record.isMain ? <StarOutlined /> : ''}
                    </div>
                );
            },
        },
        {
            title: 'Позиція',
            dataIndex: 'positions',
            key: 'positions',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="team-table-item-name">
                        <p>
                            {record.positions.map((x) => `${x.position} `)}
                            {' '}
                        </p>
                    </div>
                );
            },
        },
        {
            title: 'Опис',
            dataIndex: 'description',
            key: 'description',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="team-table-item-name">
                        <p>{value}</p>
                    </div>
                );
            },
        },
        {
            title: 'Фото',
            dataIndex: 'image',
            key: 'image',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: renderImageColumn,
        },
        {
            title: 'Соц. мережі',
            dataIndex: 'teamMemberLinks',
            key: 'teamMemberLinks',
            width: '8%',
            render: (links: TeamMemberLink[], team) => (
                <div key={`${links.length}${team.id}${team.imageId}`} className="team-links">
                    {links.map((link) => {
                        const LogoComponent = LOGO_ICONS.find((logo) => logo.type === link.logoType)!.icon;
                        return (
                            <a
                                key={`${link.id}${link.targetUrl}`}
                                rel="noreferrer"
                                target="_blanc"
                                className="teamLink"
                                href={link.targetUrl.toString()}
                            >
                                <LogoComponent />
                            </a>
                        );
                    })}
                </div>
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '5%',
            render: (value, team, index) => (
                <div key={`${team.id}${index}`} className="team-page-actions">
                    <DeleteOutlined
                        key={`${team.id}${index}111`}
                        className="actionButton"
                        onClick={() => handleDeleteTeamMember(team.id)}
                    />
                    <EditOutlined
                        key={`${team.id}${index}222`}
                        className="actionButton"
                        onClick={() => {
                            setTeamToedit(team);
                            setModalEditOpened(true);
                        }}
                    />

                </div>
            ),
        },
    ];
    return (
        <div className="team-page">
            <PageBar />
            <div className="team-page-container">
                <div className="container-justify-end">
                    <Button
                        className="streetcode-custom-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        {BUTTON_LABELS.ADD_TEAM_MEMBER}
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="team-table"
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
                            total={teamStore.PaginationInfo.TotalItems}
                            pageSize={amountRequest}
                            onChange={(page: number) => {
                                setCurrentPages(page);
                                teamStore.setCurrentPage(page);
                                teamStore.getAll();
                            }}
                        />
                    </div>
                </div>
            </div>
            <TeamModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} />
            <TeamModal
                open={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                teamMember={teamToEdit}

            />
        </div>
    );
};
export default observer(TeamPage);
