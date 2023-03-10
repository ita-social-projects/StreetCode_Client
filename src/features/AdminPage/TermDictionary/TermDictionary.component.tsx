import './TermDictionary.component.scss';

import { useEffect, useState } from 'react';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import useMobx from '@stores/root-store';

import { Button, Space, Table } from 'antd';

import termsApi from '@/app/api/streetcode/text-content/terms.api';
import AddTermModal from '@/app/common/components/modals/Terms/AddTerm/AddTermModal.component';
import DeleteTermModal from '@/app/common/components/modals/Terms/DeleteTerm/DeleteTermModal.component';
import EditTermModal from '@/app/common/components/modals/Terms/EditTerm/EditTermModal.component';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { Term } from '@/models/streetcode/text-contents.model';

// eslint-disable-next-line no-restricted-imports
import PageBar from '../PageBar/PageBar.component';

const TermDictionary = () => {
    const { termsStore, modalStore } = useMobx();
    const { fetchTerms, getTermArray } = termsStore;
    const { setTermModal } = modalStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [data, setData] = useState<Term[]>();

    const setTableState = async () => {
        await termsApi.getAll().then((responce) => {
            setData(responce);
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
        termsStore.createTerm(newTerm);
        console.log(newTerm);
        setData([...data || [], newTerm]);
        setTerm({ id: 0, title: '', description: '' });
    };

    const handleDelete = (id: number) => {
        termsStore.deleteTerm(id);
        setData((data?.filter((termId) => termId.id !== id)) || []);
        setTerm({ id: 0, title: '', description: '' });
    };

    const handleEdit = (id: number, title: string, description: string | undefined) => {
        const updatedTerm : Term = {
            id,
            title,
            description,
        };
        termsStore.updateTerm(id, updatedTerm);
        setData(data?.map(
            (t) => (t.id === term?.id
                ? { ...t,
                    title: term?.title as string,
                    description: term.description === undefined ? '' : term.description as string } : t),
        ));
        setTerm({ id: 0, title: '', description: '' });
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
                    <Button
                        className="action-button"
                        onClick={() => {
                            setTerm(t);
                            setTermModal('editTerm');
                        }}
                    >
                        <EditFilled className="action-icon" />
                    </Button>
                    <Button
                        className="action-button"
                        onClick={() => {
                            setTerm(t);
                            setTermModal('deleteTerm');
                        }}
                    >
                        <DeleteFilled className="action-icon" />
                    </Button>
                </Space>
            ),
        },
    ];
    if (getTermArray === undefined) {
        return null;
    }

    return (
        <div className="wrapper">
            <PageBar />
            <div className="termDictionaryContainer">
                <div className="dictionary-header">
                    <h1>Словник термінів</h1>
                    <div className="controls">
                        <Button onClick={() => setTermModal('addTerm')}>Новий термін</Button>
                    </div>
                </div>
                <div className="term-table">
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
            <EditTermModal term={term} setTerm={setTerm} handleEdit={handleEdit} />
        </div>
    );
};

export default TermDictionary;
