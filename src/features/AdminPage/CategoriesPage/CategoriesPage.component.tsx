import './CategoriesPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import SortButton, {SortButtonHandle} from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import ImageStore from '@stores/image-store';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';

import {
    Button, Dropdown, Empty, Pagination, Space,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import { SourceCategory, SourceCategoryAdmin } from '@/models/sources/sources.model';

import CategoryAdminModal from './CategoriesPage/CategoryAdminModal.component';
import {StringComparator} from "@features/AdminPage/SortButton/ComparatorImplementations";

const CategoriesMainPage: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { sourcesStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [categoryToEdit, setSourcesToEdit] = useState<SourceCategoryAdmin>();
    const [currentPages, setCurrentPages] = useState(1);
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);
    const { isLoading } = useQuery({
        queryKey: ['categories', sourcesStore.PaginationInfo.CurrentPage],
        queryFn: () => sourcesStore.fetchSrcCategoriesAll(),
    });

    const updatedCategories = () => {
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
        });
    };

    const PaginationProps = {
        items: [10, 25, 50].map((value) => ({
            key: value.toString(),
            label: value.toString(),
            onClick: () => {
                setSelected(value);
                setAmountRequest(value);
                setCurrentPages(1);
                sourcesStore.PaginationInfo.PageSize = value;
                sourcesStore.fetchSrcCategoriesAll();
            },
        })),
    };

    useEffect(() => {
        updatedCategories();
    }, [modalAddOpened, modalEditOpened]);

    const handleDeleteCategory = (categoryId: number | undefined) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                if (categoryId !== undefined) {
                    sourcesStore.deleteSourceCategory(categoryId).then(() => {
                        if (categoryId !== undefined) {
                            sourcesStore.srcCategoriesMap.delete(categoryId);
                        }
                    }).catch((e) => {
                        console.error(e);
                    });
                    modalStore.setConfirmationModal('confirmation');
                }
            },
            CONFIRMATION_MESSAGES.DELETE_CATEGORY,
        );
    };

    const dataSource = sourcesStore.getSrcCategoriesArray;

    const { sortDirection, toggleSort } = useSortDirection();
    const [buttonKey, setButtonKey] = useState<string | null>(null);

    const sortButtons = {
        sortByName: useRef<SortButtonHandle>(null),
    };

    useEffect(() => {
        Object.entries(sortButtons).forEach(([key, value]) => {
            if (buttonKey === key) {
                (value.current as SortButtonHandle).changeImage(sortDirection);
            } else {
                (value.current as SortButtonHandle).resetImage();
            }
        });
    }, [sortDirection, buttonKey]);

    const sortedData = useMemo(
        () => SortData<SourceCategory, string>(
            dataSource,
            sortDirection,
            (itemToCompare: SourceCategory) => itemToCompare?.title,
            StringComparator,
        ),
        [dataSource, sortDirection],
    );

    const columns: ColumnsType<SourceCategoryAdmin> = [
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
            render(value) {
                return (
                    <div>
                        {value}
                    </div>
                );
            },
        },
        {
            title: 'Зображення',
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
                    alt="Category"
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
                        onClick={() => handleDeleteCategory(srcCategory.id)}
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
                        {BUTTON_LABELS.ADD_CATEGORY}
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="categories-table"
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
                            total={sourcesStore.PaginationInfo.TotalItems}
                            pageSize={amountRequest}
                            onChange={(page: number) => {
                                setCurrentPages(page);
                                sourcesStore.setCurrentPage(page);
                                sourcesStore.fetchSrcCategoriesAll();
                            }}
                        />
                    </div>
                </div>
            </div>
            <CategoryAdminModal
                isModalVisible={modalAddOpened}
                setIsModalOpen={setModalAddOpened}
            />
            <CategoryAdminModal
                isModalVisible={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                initialData={categoryToEdit}
            />
        </div>

    );
});

export default CategoriesMainPage;
