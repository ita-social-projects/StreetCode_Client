import './TeamPage.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, StarOutlined } from '@ant-design/icons';


import { Button, Pagination, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import Image from '@/models/media/image.model';

import base64ToUrl from '../../../app/common/utils/base64ToUrl.utility';
import ImageStore from '../../../app/stores/image-store';
import useMobx, { useModalContext } from '../../../app/stores/root-store';
import TeamMember, { TeamMemberLink } from '../../../models/team/team.model';
import PageBar from '../PageBar/PageBar.component';

import TeamModal from './TeamModal/TeamModal.component';
import { useQuery } from '@tanstack/react-query';
import LOGO_ICONS from './TeamModal/constants/logoIcons';

const TeamPage = () => {
    const { teamStore } = useMobx();
    const { modalStore } = useModalContext();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [teamToEdit, setTeamToedit] = useState<TeamMember>();

    useQuery({
        queryKey: ['team', teamStore.PaginationInfo.CurrentPage],
        queryFn: () => { teamStore.getAll() },
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

    useEffect(() => {
        updatedTeam();
    }, []);

    const renderImageColumn = (image: Image, record: { id: any; }) => (
        <img
            key={`${record.id}${image?.id}`}
            className="team-table-logo"
            src={base64ToUrl(image?.base64, image?.mimeType ?? '')}
            alt={image?.alt}
        />
    );
    const columns: ColumnsType<TeamMember> = [
        {
            title: "Прізвище та ім'я",
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
                        const LogoComponent = LOGO_ICONS.find( logo => logo.type === link.logoType)!.icon;
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
                        onClick={() => {
                            modalStore.setConfirmationModal(
                                'confirmation',
                                () => {
                                    teamStore.deleteTeam(team.id).then(() => {
                                        teamStore.TeamMap.delete(team.id);
                                    }).catch((e) => {
                                        console.error(e);
                                    });
                                    modalStore.setConfirmationModal('confirmation');
                                },
                                'Ви впевнені, що хочете видалити цього члена команди?',
                            );
                        }}
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
                        Створити нового члена команди
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="team-table"
                    columns={columns}
                    dataSource={teamStore?.getTeamArray}
                    rowKey="id"
                />
                <div className="underTableZone">
                    <br />
                    <div className="underTableElement">
                        <Pagination
                            className="paginationElement"
                            showSizeChanger={false}
                            defaultCurrent={1}
                            current={teamStore.PaginationInfo.CurrentPage}
                            total={teamStore.PaginationInfo.TotalItems}
                            pageSize={teamStore.PaginationInfo.PageSize}
                            onChange={(value: any) => {
                                teamStore.setCurrentPage(value);
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
