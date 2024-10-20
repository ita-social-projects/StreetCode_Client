import './CategoriesPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ImageStore from '@stores/image-store';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';

import { Button, Empty, Pagination } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import { SourceCategoryAdmin } from '@/models/sources/sources.model';

import CategoryAdminModal from './CategoriesPage/CategoryAdminModal.component';

const CategoriesMainPage: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { sourcesStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [categoryToEdit, setSourcesToEdit] = useState<SourceCategoryAdmin>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useQuery({
        queryKey: ['categories', sourcesStore.PaginationInfo.CurrentPage],
        queryFn: () => { sourcesStore.fetchSrcCategoriesAll() },
    });

    const updatedCategories = () => {
        setIsLoading(true);
        Promise.all([
            sourcesStore.fetchSrcCategoriesAll(),
        ]).then(() => {
            sourcesStore?.srcCategoriesMap.forEach((val, key) => {
                if (!!val.imageId && !val.image) {
                    ImageStore.getImageById(val.imageId!).then((image) => {
                        sourcesStore.srcCategoriesMap.set(
                            key,
                            { ...val, image },
                        );
                    });
                }
            });
        }).then(() => {
            sourcesStore.setInternalCategoriesMap(sourcesStore.getSrcCategoriesArray);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        updatedCategories();
    }, [modalAddOpened, modalEditOpened]);

    const columns: ColumnsType<SourceCategoryAdmin> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            render(value, record) {
                return (
                    <div>
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
                    className="categories-table-logo"
                    src={base64ToUrl(image?.base64, image?.mimeType ?? '')}
                    style={{ filter: 'grayscale(100%)' }}
                />
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (value, srcCategory, index) => (
                <div key={`${srcCategory.id}${index}1`} className="category-page-actions">
                    <DeleteOutlined
                        key={`${srcCategory.id}${index}`}
                        className="actionButton"
                        onClick={() => {
                            modalStore.setConfirmationModal(
                                'confirmation',
                                () => {
                                    if (srcCategory.id != undefined) {
                                        sourcesStore.deleteSourceCategory(srcCategory.id).then(() => {
                                            if (srcCategory.id != undefined) {
                                                sourcesStore.srcCategoriesMap.delete(srcCategory.id);
                                            }
                                        }).catch((e) => {
                                            console.error(e);
                                        });
                                        modalStore.setConfirmationModal('confirmation');
                                    }
                                },
                                'Ви впевнені, що хочете видалити цю категорію?',
                            );
                        }}
                    />
                    <EditOutlined
                        key={`${srcCategory.id}${index}2`}
                        className="actionButton"
                        onClick={() => {
                            setSourcesToEdit(srcCategory);
                            setModalEditOpened(true);
                        }}
                    />

                </div>
            ),
        },
    ];
    return (
        <div className="categories-page">
            <div className="categories-page-container">
                <div className="container-justify-end">
                    <Button
                        className="streetcode-custom-button categories-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        Додати нову категорію
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="categories-table"
                    columns={columns}
                    dataSource={isLoading ? [] : sourcesStore?.getSrcCategoriesArray}
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
                        <Pagination
                            className="paginationElement"
                            showSizeChanger={false}
                            defaultCurrent={1}
                            current={sourcesStore.PaginationInfo.CurrentPage}
                            total={sourcesStore.PaginationInfo.TotalItems}
                            pageSize={sourcesStore.PaginationInfo.PageSize}
                            onChange={(value: any) => {
                                sourcesStore.setCurrentPage(value);
                            }}
                        />
                    </div>
                </div>
            </div>
            <CategoryAdminModal isModalVisible={modalAddOpened} setIsModalOpen={setModalAddOpened} />
            <CategoryAdminModal isModalVisible={modalEditOpened} setIsModalOpen={setModalEditOpened} initialData={categoryToEdit} />
        </div>

    );
});
export default CategoriesMainPage;
