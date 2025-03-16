import './TermDictionary.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';

import {
    Button, Empty, Pagination, Space, Table,
} from 'antd';

import AddTermModal from '@/app/common/components/modals/Terms/AddTerm/AddTermModal.component';
import DeleteTermModal from '@/app/common/components/modals/Terms/DeleteTerm/DeleteTermModal.component';
import EditTermModal from '@/app/common/components/modals/Terms/EditTerm/EditTermModal.component';
import PageBar from '@/features/AdminPage/PageBar/PageBar.component';
import { Term } from '@/models/streetcode/text-contents.model';

const TermDictionary = () => {
    const { termsStore } = useMobx();
    const { modalStore } = useModalContext();
    const { setModal } = modalStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [data, setData] = useState<Term[]>();

    const { isLoading, refetch } = useQuery({
        queryKey: ['terms', termsStore.PaginationInfo.CurrentPage],
        queryFn: () => termsStore.getAll(),
    });

    const handleAdd = async () => {
        const newTerm : Term = {
            id: 0,
            title: term?.title as string,
            description: term?.description,
        };
        termsStore.createTerm(newTerm).then(
            (response) => {
                setData([...data || [], response ?? newTerm]);
                setTerm({ title: '', description: '' });
            },
        );
        await refetch();
    };

    const handleEdit = async (upd: Partial<Term>) => {
        if (upd && upd.id !== undefined) {
            const term: Term = upd as Term;
            await termsStore.updateTerm(upd.id, term);
            setData(data?.map(
                (t) => (t.id === upd?.id
                    ? { ...t,
                        title: upd?.title as string,
                        description: upd.description === undefined ? '' : upd.description as string } : t),
            ));
            await refetch();
        }
    };

    const handleDelete = async (id: number) => {
        await termsStore.deleteTerm(id);
        setData((data?.filter((termId) => termId.id !== id)) || []);
    };

    const columns = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Опис',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Дії',
            key: 'action',
            render: (t: Term) => (
                <Space size="middle">
                    {t.id === 0 ? (
                        <Button
                            className="actionButton"
                            disabled
                            onClick={() => {
                                setTerm(t);
                                setModal('editTerm');
                            }}
                        >
                            <EditFilled className="disableIcon" />
                        </Button>
                    ) : (
                        <Button
                            className="actionButton"
                            onClick={() => {
                                setTerm(t);
                                setModal('editTerm');
                            }}
                        >
                            <EditFilled className="actionIcon" />
                        </Button>
                    )}

                    <Button
                        className="actionButton"
                        onClick={() => {
                            setTerm(t);
                            setModal('deleteTerm');
                        }}
                    >
                        <DeleteFilled className="actionIcon" />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="termDictionaryCover">
            <div className="wrapper">
                <PageBar />
                <div className="termDictionaryContainer">
                    <div className="dictionaryHeader">
                        <h1>Словник термінів</h1>
                        <div>
                            <Button
                                className="streetcode-custom-button"
                                onClick={() => setModal('addTerm')}
                            >
                                Новий термін
                            </Button>
                        </div>
                    </div>
                    <div className="termTable">
                        <Table
                            pagination={false}
                            columns={columns}
                            dataSource={termsStore.getTermArray || []}
                            rowKey={({ id }) => id}
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
                                    current={termsStore.PaginationInfo.CurrentPage}
                                    total={termsStore.PaginationInfo.TotalItems}
                                    pageSize={termsStore.PaginationInfo.PageSize}
                                    onChange={(value: any) => {
                                        termsStore.setCurrentPage(value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <AddTermModal
                    term={term}
                    setTerm={setTerm}
                    handleAdd={handleAdd}
                />
                <EditTermModal
                    term={term}
                    handleEdit={handleEdit}
                />
                <DeleteTermModal
                    term={term}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default observer(TermDictionary);
