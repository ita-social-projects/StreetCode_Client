import './Partners.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import NewsModal from '@features/AdminPage/NewsPage/PartnerModal/NewsModal.component';
import ImageStore from '@stores/image-store';
import useMobx from '@stores/root-store';

import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

import PageBar from '../PageBar/PageBar.component';

const Newss:React.FC = observer(() => {
    const { newsStore, modalStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [newsToEdit, setNewsToEdit] = useState<News>();
    const updatedNews = () => {
        Promise.all([
            newsStore.fetchNewsAll(),
        ]).then(() => {
            newsStore?.NewsMap.forEach((val, key) => {
                console.log(val.imageId);
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
                    <div key={`${value}${record.id}`} className="partner-table-item-name">
                        <p>{value}</p>
                    </div>
                );
            },
        },
        {
            title: 'Посилання на новину',
            dataIndex: 'url',
            key: 'url',
            width: '28%',
            render: (targeteurl) => (
                <a
                    className="site-link"
                    key={`${targeteurl}`}
                    href={targeteurl}
                >
                    {targeteurl}
                </a>
            ),
        },
        {
            title: 'Картинка',
            dataIndex: 'image',
            key: 'image',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (image:Image, record) => (
                <img
                    key={`${record.id}${record.image?.id}}`}
                    className="partners-table-logo"
                    src={base64ToUrl(image?.base64, image?.mimeType ?? '')}
                    alt={image?.alt}
                />
            ),

        },
        { title: 'Дії',
          dataIndex: 'action',
          key: 'action',
          width: '10%',
          render: (value, news, index) => (
              <div key={`${news.id}${index}`} className="partner-page-actions">
                  <DeleteOutlined
                      key={`${news.id}${index}222`}
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
                      key={`${news.id}${index}111`}
                      className="actionButton"
                      onClick={() => {
                          setNewsToEdit(news);
                          setModalEditOpened(true);
                      }}
                  />

              </div>
          ) },
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
