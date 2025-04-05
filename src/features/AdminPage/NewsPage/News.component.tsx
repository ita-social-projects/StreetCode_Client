/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-imports */
import './News.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import NewsModal from '@features/AdminPage/NewsPage/NewsModal/NewsModal.component';
import PageBar from '@features/AdminPage/PageBar/PageBar.component';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { Button, Dropdown, Empty, Pagination, Popover, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';
import BUTTON_LABELS from "@constants/buttonLabels";
import CONFIRMATION_MESSAGES from "@constants/confirmationMessages";

const Newss: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { newsStore, imagesStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [newsToEdit, setNewsToEdit] = useState<News>();
    const [currentPages, setCurrentPages] = useState(1);
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);
    const { isLoading } = useQuery({
        queryKey: ['news', newsStore.CurrentPage],
        queryFn: () => newsStore.getAll(),
    });

    const handleDeleteNews = (news: News) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                newsStore.deleteNews(news.id).then(() => {
                    imagesStore.deleteImage(news.imageId);
                }).catch((e) => {
                    console.error(e);
                });
                modalStore.setConfirmationModal('confirmation');
            },
            CONFIRMATION_MESSAGES.DELETE_NEWS,
        );
    };

    const PaginationProps = {
        items: [10, 25, 50].map((value) => ({
            key: value.toString(),
            label: value.toString(),
            onClick: () => {
                setSelected(value);
                setAmountRequest(value);
                setCurrentPages(1);
                newsStore.PaginationInfo.PageSize = value;
                newsStore.getAll();
            },
        })),
    };

    const columns: ColumnsType<News> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            render(value, record) {
                return (
                    <div onClick={() => window.open(`${FRONTEND_ROUTES.OTHER_PAGES.NEWS}/${record.url}`, '_blank')}>
                        {value}
                    </div>
                );
            },
        },
        {
            title: 'Картинка',
            dataIndex: 'image',
            key: 'image',
            width: '25%',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (image: Image, record) => (
                <img
                    key={`${record.id}${record.image?.id}}`}
                    className="partners-table-logo"
                    src={base64ToUrl(image?.base64, image?.mimeType ?? '')}
                    alt={image?.imageDetails?.alt}
                />
            ),

        },
        {
            title: 'Дата публікації',
            dataIndex: 'creationDate',
            key: 'creationDate',
            width: '20%',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (value: string) => (
                <div key={value} className="partner-table-item-name">
                    <p>{value ? dayjs(value).format('YYYY-MM-DD') : ''}</p>
                    {value && dayjs(value).isAfter(dayjs()) && 
                     <Popover content={"Заплановано"} trigger="hover">
                        <InfoCircleOutlined className='info-circle-for-planed-content'/>
                    </Popover>
                    }
                </div>
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '20%',
            render: (value, news, index) => (
                <div key={`${news.id}${index}1`} className="partner-page-actions">
                    <DeleteOutlined
                        key={`${news.id}${index}`}
                        className="actionButton"
                        onClick={() => handleDeleteNews(news)}
                    />
                    <EditOutlined
                        key={`${news.id}${index}2`}
                        className="actionButton"
                        onClick={() => {
                            setNewsToEdit(news);
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
                        className="streetcode-custom-button partners-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        {BUTTON_LABELS.ADD_NEWS}
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="partners-table"
                    columns={columns}
                    dataSource={newsStore.NewsArray || []}
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
                            total={newsStore.PaginationInfo.TotalItems}
                            pageSize={amountRequest}
                            onChange={(page: number) => {
                                setCurrentPages(page);
                                newsStore.setCurrentPage(page);
                                newsStore.getAll();
                            }}
                        />
                    </div>
                </div>
                <NewsModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} />
                <NewsModal
                    open={modalEditOpened}
                    setIsModalOpen={setModalEditOpened}
                    newsItem={newsToEdit}
                />
            </div>
        </div>
    );
});

export default Newss;
