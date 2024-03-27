import './TeamPage.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, StarOutlined } from '@ant-design/icons';
import behance from '@assets/images/partners/behance.svg';
import facebook from '@assets/images/partners/facebook.svg';
import http from '@assets/images/partners/http.svg';
import instagram from '@assets/images/partners/instagram.svg';
import linkedin from '@assets/images/partners/linkedin.svg';
import tiktok from '@assets/images/partners/tiktok.svg';
import twitter from '@assets/images/partners/twitterNew.svg';
import youtube from '@assets/images/partners/youtube.svg';

import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import Image from '@/models/media/image.model';

import base64ToUrl from '../../../app/common/utils/base64ToUrl.utility';
import ImageStore from '../../../app/stores/image-store';
import useMobx, { useModalContext } from '../../../app/stores/root-store';
import TeamMember, { TeamMemberLink } from '../../../models/team/team.model';
import PageBar from '../PageBar/PageBar.component';

import TeamModal from './TeamModal/TeamModal.component';

const TeamPage = () => {
    const { teamStore } = useMobx();
    const { modalStore } = useModalContext();
    const LogoType = [twitter, instagram, facebook, youtube, linkedin, tiktok, behance, http];
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [teamToEdit, setTeamToedit] = useState<TeamMember>();

    const updatedTeam = () => {
        Promise.all([teamStore?.fetchTeamAll()]).then(() => {
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
                        const LogoComponent = LogoType[link.logoType];
                        return (
                            <a
                                key={`${link.id}${link.targetUrl}`}
                                rel="noreferrer"
                                target="_blanc"
                                className="teamLink"
                                href={link.targetUrl}
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
                                        console.log(e);
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
                    pagination={{ pageSize: 10 }}
                    className="team-table"
                    columns={columns}
                    dataSource={teamStore?.getTeamArray}
                    rowKey="id"
                />
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
