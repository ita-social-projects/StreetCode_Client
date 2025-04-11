import './Partners.styles.scss';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined, StarOutlined } from '@ant-design/icons';
import facebook from '@assets/images/partners/facebook.svg';
import instagram from '@assets/images/partners/instagram.svg';
import twitter from '@assets/images/partners/twitterNew.svg';
import youtube from '@assets/images/partners/youtube.svg';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import SortButton from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import ImageStore from '@stores/image-store';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';

import {
    Button, Dropdown, Empty, Pagination, Space,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import PartnersApi from '@/app/api/partners/partners.api';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import Partner, { PartnerSourceLink } from '@/models/partners/partners.model';

// eslint-disable-next-line no-restricted-imports
import PageBar from '../PageBar/PageBar.component';

import PartnerModal from './PartnerModal/PartnerModal.component';
import {StringComparator} from "@features/AdminPage/SortButton/ComparatorImplementations";

const LogoType = [twitter, instagram, facebook, youtube];

const Partners: React.FC = observer(() => {
    const { partnersStore } = useMobx();
    const { modalStore } = useModalContext();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [partnerToEdit, setPartnerToedit] = useState<Partner>();
    const [currentPages, setCurrentPages] = useState(1);
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);

    const { isLoading } = useQuery({
        queryKey: ['partners', partnersStore.PaginationInfo.CurrentPage],
        queryFn: () => partnersStore.getAll(),
    });

    const updatedPartners = () => {
        Promise.all([
            partnersStore?.getAll(),
        ]).then(() => {
            partnersStore?.PartnerMap.forEach((val, key) => {
                ImageStore.getImageById(val.logoId).then((logo) => {
                    runInAction(() => {
                        partnersStore.PartnerMap.set(
                            val.id,
                            { ...val, logo },
                        );
                    });
                });
            });
        }).then(() => {
            partnersStore.setInternalMap(partnersStore.getPartnerArray);
        });
    };

    useEffect(() => {
        updatedPartners();
    }, [modalAddOpened, modalEditOpened]);

    const { PageSize, TotalItems } = partnersStore.PaginationInfo;

    const PaginationProps = {
        items: [10, 25, 50].map((value) => ({
            key: value.toString(),
            label: value.toString(),
            onClick: () => {
                setSelected(value);
                setAmountRequest(value);
                setCurrentPages(1);
                partnersStore.PaginationInfo.PageSize = value;
                partnersStore.getAll();
            },
        })),
    };

    const handleDeletePartner = (partnerId: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                PartnersApi.delete(partnerId)
                    .then(() => {
                        partnersStore.PartnerMap.delete(partnerId);
                    })
                    .catch(() => { });
                modalStore.setConfirmationModal('confirmation');
            },
            CONFIRMATION_MESSAGES.DELETE_PARTNER,
        );
    };

    const dataSource = partnersStore.getPartnerArray || [];

    const { sortDirection, toggleSort } = useSortDirection();
    const sortedData = useMemo(
        () => SortData<Partner, string>(
            dataSource,
            sortDirection,
            (itemToCompare: Partner) => itemToCompare?.title,
            StringComparator,
        ),
        [dataSource, sortDirection],
    );

    const columns: ColumnsType<Partner> = [
        {
            title: (
                <div className="content-table-title">
                    <span>Назва</span>
                    <SortButton sortOnClick={toggleSort} />
                </div>
            ),
            dataIndex: 'title',
            key: 'title',
            width: '30%',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="partner-table-item-name">
                        <p>{value}</p>
                        {record.isKeyPartner ? <StarOutlined /> : ''}
                    </div>
                );
            },
        },
        {
            title: 'Посилання на сайт',
            dataIndex: 'targetUrl',
            key: 'url',
            width: '28%',
            render: (targeteurl) => (
                <a
                    className="site-link"
                    key={`${targeteurl.href}`}
                    href={targeteurl.href}
                >
                    {targeteurl.title ?? targeteurl.href}
                </a>
            ),
        },
        {
            title: 'Лого',
            dataIndex: 'logo',
            key: 'logo',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (logo: Image, record) => (
                <img
                    key={`${record.id}${record.logo?.id}}`}
                    className="partners-table-logo"
                    src={base64ToUrl(logo?.base64, logo?.mimeType ?? '')}
                    alt={logo?.imageDetails?.alt ?? 'default'}
                />
            ),

        },
        {
            title: 'Соц. мережі',
            dataIndex: 'partnerSourceLinks',
            key: 'partnerSourceLinks',
            width: '12%',
            render: (links: PartnerSourceLink[], partner) => (
                <div key={`${links.length}${partner.id}${partner.logoId}`} className="partner-links">
                    {links.map((link) => {
                        const LogoComponent = LogoType[link.logoType];
                        return (
                            <a
                                key={`${link.id}${link.targetUrl}`}
                                rel="noreferrer"
                                target="_blank"
                                className="sourceLink"
                                href={link.targetUrl.href}
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
            width: '10%',
            render: (value, partner, index) => (
                <div key={`${partner.id}${index}`} className="partner-page-actions">
                    <DeleteOutlined
                        key={`${partner.id}${index}111`}
                        className="actionButton"
                        onClick={() => handleDeletePartner(partner.id)}
                    />
                    <EditOutlined
                        key={`${partner.id}${index}222`}
                        className="actionButton"
                        onClick={() => {
                            setPartnerToedit(partner);
                            setModalEditOpened(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="partners-page">
            <PageBar />
            <div className="partners-page-container">
                <div className="container-justify-end">
                    <Button
                        className="streetcode-custom-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        {BUTTON_LABELS.ADD_PARTNER}
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="partners-table"
                    columns={columns}
                    dataSource={sortedData}
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
                            total={TotalItems}
                            pageSize={amountRequest}
                            onChange={(page: number) => {
                                setCurrentPages(page);
                                partnersStore.setCurrentPage(page);
                                partnersStore.getAll();
                            }}
                        />
                    </div>
                </div>
                <PartnerModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} isStreetcodeVisible />
                <PartnerModal
                    open={modalEditOpened}
                    setIsModalOpen={setModalEditOpened}
                    partnerItem={partnerToEdit}
                    isStreetcodeVisible
                />
            </div>
        </div>
    );
});

export default Partners;
