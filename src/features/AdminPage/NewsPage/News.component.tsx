import './Partners.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, StarOutlined } from '@ant-design/icons';
import facebook from '@assets/images/partners/facebook.png';
import instagram from '@assets/images/partners/instagram.png';
import twitter from '@assets/images/partners/twitter.png';
import youtube from '@assets/images/partners/youtube.png';
import ImageStore from '@stores/image-store';
import useMobx from '@stores/root-store';
import axios from 'axios';

import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import Partner, { PartnerSourceLink } from '@/models/partners/partners.model';

import PageBar from '../PageBar/PageBar.component';

import PartnerModal from './PartnerModal/PartnerModal.component';
import News from '@/models/news/news.model';

const LogoType = [twitter, instagram, facebook, youtube];

const Newss:React.FC = observer(() => {
    const { newsStore, partnersStore, modalStore } = useMobx();
    

    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [partnerToEdit, setPartnerToedit] = useState<Partner>();

    // const updatedPartners = () => {
    //     Promise.all([
    //         partnersStore?.fetchPartnersAll(),
    //     ]).then(() => {
    //         partnersStore?.PartnerMap.forEach((val, key) => {
    //             ImageStore.getImageById(val.logoId).then((logo) => {
    //                 partnersStore.PartnerMap.set(
    //                     key,
    //                     { ...val, logo },
    //                 );
    //             });
    //         });
    //     }).then(()=> partnersStore.setInternalMap(partnersStore.getPartnerArray));
    // };
    // useEffect(() => {
    //     updatedPartners();
    // }, []);
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
        // {
        //     title: 'Посилання на сайт',
        //     dataIndex: 'targetUrl',
        //     key: 'url',
        //     width: '28%',
        //     render: (targeteurl) => (
        //         <a
        //             className="site-link"
        //             key={`${targeteurl.href}`}
        //             href={targeteurl.href}
        //         >
        //             {targeteurl.title ?? targeteurl.href}
        //         </a>
        //     ),
        // },
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
                    src={base64ToUrl(image?.base64, image?.mimeType??'')}
                    alt={image?.alt}
                />
            ),

        },
        // {
        //     title: 'Соц. мережі',
        //     dataIndex: 'partnerSourceLinks',
        //     key: 'partnerSourceLinks',
        //     width: '12%',
        //     render: (links:PartnerSourceLink[], partner) => (
        //         <div key={`${links.length}${partner.id}${partner.logoId}`} className="partner-links">
        //             {links.map((link) => (
        //                 <a
        //                     key={`${link.id}${link.targetUrl}`}
        //                     rel="noreferrer"
        //                     target="_blank"
        //                     className="sourceLink"
        //                     href={link.targetUrl.href}
        //                 >
        //                     <img
        //                         key={link.id * link.logoType}
        //                         src={LogoType[link.logoType]}
        //                         alt={link.targetUrl.title}
        //                     />
        //                 </a>
        //             ))}
        //         </div>
        //     ),
        // },
        { title: 'Дії',
          dataIndex: 'action',
          key: 'action',
          width: '10%',
          render: (value, news, index) => (
              <div key={`${news.id}${index}`} className="partner-page-actions">
                  <DeleteOutlined
                      key={`${news.id}${index}111`}
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
                  {/* <EditOutlined
                      key={`${news.id}${index}222`}
                      className="actionButton"
                      onClick={() => {
                          setPartnerToedit(news);
                          setModalEditOpened(true);
                      }}
                  /> */}

              </div>
          ) },
    ];
    return (
        <div className='partners-page'>
            <PageBar />
            <div className="partners-page-container">
                <div className='container-justify-end'>
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
            <PartnerModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} isStreetcodeVisible />
            <PartnerModal
                open={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                partnerItem={partnerToEdit}
                isStreetcodeVisible
            />
        </div>

    );
});
export default Newss;
