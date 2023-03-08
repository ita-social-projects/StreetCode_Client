import './TermDictionary.component.scss';

import { useEffect, useState } from 'react';
import useMobx from '@stores/root-store';

import { Button, Space, Table } from 'antd';

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
    const { setTermModal, modalsState: { addTerm, editTerm, deleteTerm } } = modalStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [data, setData] = useState<Term[]>();

    useAsync(fetchTerms, [getTermArray.length]);

    useEffect(() => {
        setData(getTermArray);
    }, [getTermArray.length]);

    const handleAdd = () => {
        const newTerm : Term = {
            id: 0,
            title: term?.title as string,
            description: term?.description,
        };
        termsStore.createTerm(newTerm);
        const uiTerm : Term = { ...newTerm, id: data?.at(getTermArray.length - 1)?.id as number };
        setTerm({ id: 0, title: '', description: '' });
        //setData([...(data || []), ...([uiTerm] || [])]);
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
        console.log(id);
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
                    <Button onClick={() => {
                        setTerm(t);
                        setTermModal('editTerm');
                    }}
                    >
                        Edit
                    </Button>
                    <Button onClick={() => {
                        setTerm(t);
                        setTermModal('deleteTerm');
                    }}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <PageBar />
            <div className="termDictionaryContainer">
                <div className="controls">
                    <Button onClick={() => setTermModal('addTerm')}>+</Button>
                </div>
                <div className="dictionary-header">
                    <h1>Словник термінів</h1>
                </div>
                <div className="term-table">
                    <Table columns={columns} dataSource={data} rowKey={({ id }) => id} />
                </div>
            </div>
            <AddTermModal term={term} setTerm={setTerm} handleAdd={handleAdd} />
            <DeleteTermModal term={term} handleDelete={handleDelete} />
            <EditTermModal term={term} setTerm={setTerm} handleEdit={handleEdit} />
        </div>
    );
};

export default TermDictionary;
