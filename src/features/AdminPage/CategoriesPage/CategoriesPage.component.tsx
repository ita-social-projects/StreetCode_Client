import './CategoriesPage.style.scss'

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ImageStore from '@stores/image-store';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button } from 'antd';
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

    const updatedCategories = () => {
        Promise.all([
            sourcesStore.fetchSrcCategoriesAll(),
        ]).then(() => {
            sourcesStore?.srcCategoriesMap.forEach((val, key) => {
                if (val.imageId !== null && val.imageId !== undefined) {
                    ImageStore.getImageById(val.imageId!).then((image) => {
                        sourcesStore.srcCategoriesMap.set(
                            key,
                            { ...val, image },
                        );
                    });
                }
            });
        }).then(() => sourcesStore.setInternalCategoriesMap(sourcesStore.getSrcCategoriesArray));
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
                                            console.log(e);
                                        });
                                        modalStore.setConfirmationModal('confirmation');
                                    }
                                },
                                'Ви впевнені, що хочете видалити чю новину?',
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
                    pagination={{ pageSize: 10 }}
                    className="categories-table"
                    columns={columns}
                    dataSource={sourcesStore?.getSrcCategoriesArray}
                    rowKey="id"
                />
            </div>
            <CategoryAdminModal isModalVisible={modalAddOpened} setIsModalOpen={setModalAddOpened} />
            <CategoryAdminModal isModalVisible={modalEditOpened} setIsModalOpen={setModalEditOpened} initialData={categoryToEdit} />
        </div>

    );
});
export default CategoriesMainPage;
