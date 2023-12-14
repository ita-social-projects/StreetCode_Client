import './TermDictionary.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button, Space, Table } from 'antd';

import termsApi from '@/app/api/streetcode/text-content/terms.api';
import AddTermModal from '@/app/common/components/modals/Terms/AddTerm/AddTermModal.component';
import DeleteTermModal from '@/app/common/components/modals/Terms/DeleteTerm/DeleteTermModal.component';
import EditTermModal from '@/app/common/components/modals/Terms/EditTerm/EditTermModal.component';
import PageBar from '@/features/AdminPage/PageBar/PageBar.component';
import { Term } from '@/models/streetcode/text-contents.model';

const TermDictionary = () => {
    const { termsStore } = useMobx();
    const { modalStore } = useModalContext();
    const { fetchTerms } = termsStore;
    const { setModal } = modalStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [data, setData] = useState<Term[]>();

    const setTableState = async () => {
        await termsApi.getAll().then((response) => {
            setData(response);
        });
    };

    useEffect(() => {
        fetchTerms();
        setTableState();
    }, []);

    const handleAdd = () => {
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
    };

    const handleDelete = (id: number) => {
        termsStore.deleteTerm(id);
        setData((data?.filter((termId) => termId.id !== id)) || []);
    };

    const handleEdit = (upd: Partial<Term>) => {
        if (upd.id && upd) {
            termsStore.updateTerm(upd.id, upd);
            setData(data?.map(
                (t) => (t.id === upd?.id
                    ? { ...t,
                        title: upd?.title as string,
                        description: upd.description === undefined ? '' : upd.description as string } : t),
            ));
        }
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
                            columns={columns}
                            dataSource={data}
                            rowKey={({ id }) => id}
                            pagination={{ defaultPageSize: 5 }}
                        />
                    </div>
                </div>
                <AddTermModal term={term} setTerm={setTerm} handleAdd={handleAdd} />
                <DeleteTermModal term={term} handleDelete={handleDelete} />
                <EditTermModal term={term} handleEdit={handleEdit} />
            </div>
        </div>
    );
};

export default observer(TermDictionary);
