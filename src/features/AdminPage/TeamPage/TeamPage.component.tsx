import './TeamPage.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined, StarOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import { StringComparator } from '@features/AdminPage/SortButton/ComparatorImplementations';
import SortButton, { SortButtonHandle } from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import { useQuery } from '@tanstack/react-query';
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import {
    Button, Dropdown, Empty, Input, Pagination, Space, Table, Checkbox,
} from 'antd';
import { ColumnsType } from 'antd/es/table';

import Image from '@/models/media/image.model';

import base64ToUrl from '../../../app/common/utils/base64ToUrl.utility';
import ImageStore from '../../../app/stores/image-store';
import useMobx, { useModalContext } from '../../../app/stores/root-store';
import TeamMember, { TeamMemberLink } from '../../../models/team/team.model';
import PageBar from '../PageBar/PageBar.component';

import LOGO_ICONS from './TeamModal/constants/logoIcons';
import TeamModal from './TeamModal/TeamModal.component';

const TeamPage = () => {
    const { teamStore } = useMobx();
    const { modalStore } = useModalContext();

    const [modalAddOpened, setModalAddOpened] = useState(false);
    const [modalEditOpened, setModalEditOpened] = useState(false);
    const [teamToEdit, setTeamToedit] = useState<TeamMember>();
    const [currentPages, setCurrentPages] = useState(1);
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);
    const [title, setTitle] = useState('');
    const [isMainFilter, setIsMainFilter] = useState<boolean>(false);

    const { isLoading } = useQuery({
        queryKey: ['team', teamStore.PaginationInfo.CurrentPage, title, isMainFilter],
        queryFn: () => teamStore.getAll(title, isMainFilter),
    });

    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        setCurrentPages(1);
    };

    const updatedTeam = () => {
        Promise.all([teamStore?.getAll(title, isMainFilter)]).then(() => {
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
                teamStore.getAll(title, isMainFilter);
            },
        })),
    };

    useEffect(() => {
        updatedTeam();
    }, [title, isMainFilter]);
    useEffect(() => {
        setCurrentPages(1);
        teamStore.setCurrentPage(1);
        teamStore.getAll();
    }, [title]);

    const handleDeleteTeamMember = (teamId: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                teamStore.deleteTeam(teamId).then(() => {
                    teamStore.TeamMap.delete(teamId);
                }).catch(console.error);
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
            key: 'name',
            width: '20%',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="team-table-item-name">
                        <p>{record.name}</p>
                        {record.isMain ? <StarOutlined /> : ''}
                    </div>
                );
            },
        },
        {
            title: 'Позиція',
            dataIndex: 'positions',
            key: 'positions',
            width: '20%',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="team-table-item-name">
                        <p>{record.positions.map((x) => `${x.position} `)}</p>
                    </div>
                );
            },
        },
        {
            title: 'Опис',
            dataIndex: 'description',
            key: 'description',
            width: '28%',
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
            width: '7%',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: renderImageColumn,
        },
        {
            title: 'Соц. мережі',
            dataIndex: 'teamMemberLinks',
            key: 'teamMemberLinks',
            width: '15%',
            align: 'center',
            render: (links: TeamMemberLink[], team) => (
                <div key={`${links.length}${team.id}${team.imageId}`} className="team-links">
                    {links.map((link) => {
                        const LogoComponent = LOGO_ICONS.find((logo) => logo.type === link.logoType)?.icon;
                        return (
                            <a
                                key={`${link.id}${link.targetUrl}`}
                                rel="noreferrer"
                                target="_blank"
                                className="teamLink"
                                href={link.targetUrl.toString()}
                            >
                                {LogoComponent && <LogoComponent />}
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
            width: '10%',
            align: 'center',
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
                    <div className="left-side">
                        <div className="searchMenuElement">
                            <Input
                                className="searchMenuElementInput"
                                prefix={<MagnifyingGlass />}
                                onChange={handleChangeTitle}
                                placeholder="Назва"
                            />
                        </div>
                    </div>

                    <div className="right-side">
                        <Checkbox
                            checked={isMainFilter}
                            onChange={(e) => {
                                setIsMainFilter(e.target.checked);
                                setCurrentPages(1);  // Reset to first page when filter changes
                            }}
                        >
                        Ключовий учасник
                        </Checkbox>
                        <Button
                            className="streetcode-custom-button"
                            onClick={() => setModalAddOpened(true)}
                        >
                            {BUTTON_LABELS.ADD_TEAM_MEMBER}
                        </Button>
                    </div>
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
                                teamStore.getAll(title, isMainFilter);
                            }}
                        />
                    </div>
                </div>
            </div>
            <TeamModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} />
            <TeamModal open={modalEditOpened} setIsModalOpen={setModalEditOpened} teamMember={teamToEdit} />
        </div>
    );
};
export default observer(TeamPage);
