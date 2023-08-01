/* eslint-disable no-restricted-imports */
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import NewsModal from '@features/AdminPage/NewsPage/NewsModal/NewsModal.component';
import PageBar from '@features/AdminPage/PageBar/PageBar.component';
import ImageStore from '@stores/image-store';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

const Newss: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { newsStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [newsToEdit, setNewsToEdit] = useState<News>();
    const updatedNews = () => {
        Promise.all([
            newsStore.fetchNewsAll(),
        ]).then(() => {
            newsStore?.NewsMap.forEach((val, key) => {
                if (val.imageId !== null && val.imageId !== undefined) {
                    ImageStore.getImageById(val.imageId!).then((image) => {
                        newsStore.NewsMap.set(
                            key,
                            { ...val, image },
                        );
                    });
                }
            });
        }).then(() => newsStore.setInternalMap(newsStore.getNewsArray));
    };
    useEffect(() => {
        updatedNews();
    }, [modalAddOpened]);
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
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (image: Image, record) => (
                <img
                    key={`${record.id}${record.image?.id}}`}
                    className="partners-table-logo"
                    src={base64ToUrl(image?.base64, image?.mimeType ?? '')}
                    alt={image?.alt}
                />
            ),

        },
        {
            title: 'Дата створення',
            dataIndex: 'creationDate',
            key: 'creationDate',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (value: string, record) => (
                <div key={value} className="partner-table-item-name">
                    <p>{value ? value.substring(0, 10) : ''}</p>
                </div>
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (value, news, index) => (
                <div key={`${news.id}${index}1`} className="partner-page-actions">
                    <DeleteOutlined
                        key={`${news.id}${index}`}
                        className="actionButton"
                        onClick={() => {
                            modalStore.setConfirmationModal(
                                'confirmation',
                                () => {
                                    newsStore.deleteNews(news.id).then(() => {
                                        newsStore.NewsMap.delete(news.id);
                                    }).catch((e) => {
                                        console.log(e);
                                    });
                                    modalStore.setConfirmationModal('confirmation');
                                },
                                'Ви впевнені, що хочете видалити чю новину?',
                            );
                        }}
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
                        Створити новину
                    </Button>
                </div>
                <Table
                    pagination={{ pageSize: 10 }}
                    className="partners-table"
                    columns={columns}
                    dataSource={newsStore?.getNewsArray}
                    rowKey="id"
                />
            </div>
            <NewsModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} />
            <NewsModal
                open={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                newsItem={newsToEdit}
            />
        </div>

    );
});
export default Newss;
