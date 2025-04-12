import './TagsMainPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import BUTTON_LABELS from '@constants/buttonLabels';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import SortButton, {SortButtonHandle} from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';

import {
    Button, Dropdown, Empty, Pagination, Space,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Tag from '@/models/additional-content/tag.model';

import TagAdminModal from './TagsPage/TagAdminModal';
import {StringComparator} from "@features/AdminPage/SortButton/ComparatorImplementations";

const TagsMainPage: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { tagsStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [tagToEdit, setTagToEdit] = useState<Tag>();
    const [currentPages, setCurrentPages] = useState(1);
    const [amountRequest, setAmountRequest] = useState(10);
    const [selected, setSelected] = useState(10);
    const { isLoading } = useQuery({
        queryKey: ['tags', tagsStore.PaginationInfo.CurrentPage],
        queryFn: () => tagsStore.fetchAllTags(),
    });

    const updatedTags = () => {
        tagsStore.fetchAllTags();
    };
    const PaginationProps = {
        items: [10, 25, 50].map((value) => ({
            key: value.toString(),
            label: value.toString(),
            onClick: () => {
                setSelected(value);
                setAmountRequest(value);
                setCurrentPages(1);
                tagsStore.PaginationInfo.PageSize = value;
                tagsStore.fetchAllTags();
            },
        })),
    };

    useEffect(() => {
        updatedTags();
    }, [modalAddOpened, modalEditOpened]);

    const handleDeleteTag = (tagId: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                if (tagId !== undefined) {
                    tagsStore.deleteTag(tagId)
                        .catch((e) => {
                            console.error(e);
                        });
                    modalStore.setConfirmationModal('confirmation');
                }
            },
            CONFIRMATION_MESSAGES.DELETE_TAGS,
        );
    };

    const dataSource = tagsStore.getAllTagsArray;

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

    const sortedData = useMemo(
        () => SortData<Tag, string>(
            dataSource,
            sortDirection,
            (itemToCompare: Tag) => itemToCompare?.title,
            StringComparator,
        ),
        [dataSource, sortDirection],
    );

    const columns: ColumnsType<Tag> = [
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
            render(value, record) {
                return (
                    <div>
                        {value}
                    </div>
                );
            },
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (value, tag, index) => (
                <div key={`${tag.id}${index}1`} className="tag-page-actions">
                    <DeleteOutlined
                        key={`${tag.id}${index}`}
                        className="actionButton"
                        onClick={() => handleDeleteTag(tag.id)}
                    />
                    <EditOutlined
                        key={`${tag.id}${index}2`}
                        className="actionButton"
                        onClick={() => {
                            setTagToEdit(tag);
                            setModalEditOpened(true);
                        }}
                    />

                </div>
            ),
        },
    ];
    return (
        <div className="tags-page">
            <div className="tags-page-container">
                <div className="container-justify-end">
                    <Button
                        className="streetcode-custom-button tags-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        {BUTTON_LABELS.ADD_TAG}
                    </Button>
                </div>
                <div className="ScrollableTableContainer">
                    <Table
                        pagination={false}
                        className="tags-table"
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
                </div>
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
                            total={tagsStore.PaginationInfo.TotalItems}
                            pageSize={amountRequest}
                            onChange={(page: number) => {
                                setCurrentPages(page);
                                tagsStore.setCurrentPage(page);
                                tagsStore.fetchAllTags();
                            }}
                        />
                    </div>
                </div>
            </div>
            <TagAdminModal
                isModalVisible={modalAddOpened}
                setIsModalOpen={setModalAddOpened}
            />
            <TagAdminModal
                isModalVisible={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                initialData={tagToEdit}
            />
        </div>

    );
});
export default TagsMainPage;
