/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-imports */
import './News.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import NewsModal from '@features/AdminPage/NewsPage/NewsModal/NewsModal.component';
import PageBar from '@features/AdminPage/PageBar/PageBar.component';
import { StringComparator } from '@features/AdminPage/SortButton/ComparatorImplementations';
import SortButton, {SortButtonHandle} from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import {
    Button, Dropdown, Empty, Input, Pagination, Popover, Space,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

const Newss: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { newsStore, imagesStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [newsToEdit, setNewsToEdit] = useState<News>();
    const [currentPages, setCurrentPages] = useState(1);
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);
    const [title, setTitle] = useState<string>('');
    const { isLoading } = useQuery({
        queryKey: ['news', newsStore.CurrentPage, title],
        queryFn: () => newsStore.getAll(title),
    });

    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

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

    const dataSource = newsStore.NewsArray;

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

    useEffect(() => {
        setCurrentPages(1);
        newsStore.setCurrentPage(1);
        newsStore.getAll(title);
    }, [title]);

    const sortedData = useMemo(
        () => SortData<News, string>(
            dataSource,
            sortDirection,
            (itemToCompare: News) => itemToCompare?.title,
            StringComparator,
        ),
        [dataSource, sortDirection],
    );

    const columns: ColumnsType<News> = [
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
            dataIndex: 'title',
            key: 'title',
            width: '50%',
            render(value, record) {
                return (
                    <div onClick={() => window.open(`${FRONTEND_ROUTES.OTHER_PAGES.NEWS}/${record.url}`, '_blank')}>
                        {value}
                    </div>
                );
            },
        },
        {
            title: 'Зображення',
            dataIndex: 'image',
            key: 'image',
            width: '20%',
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
            title: 'Дата',
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
            width: '10%',
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
                    <div className="searchMenuElement">
                        <Input
                            className="searchMenuElementInput"
                            prefix={<MagnifyingGlass />}
                            onChange={handleChangeTitle}
                            placeholder="Назва"
                        />
                    </div>
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
