import './TermDictionary.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState, ChangeEvent } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { StringComparator } from '@features/AdminPage/SortButton/ComparatorImplementations';
import SortButton, { SortButtonHandle } from '@features/AdminPage/SortButton/SortButton';
import SortData from '@features/AdminPage/SortButton/SortLogic';
import useSortDirection from '@features/AdminPage/SortButton/useSortDirection';
import useMobx, { useModalContext } from '@stores/root-store';
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import { Button, Dropdown, Input, Space, Table, Pagination } from 'antd';

import AddTermModal from '@/app/common/components/modals/Terms/AddTerm/AddTermModal.component';
import DeleteTermModal from '@/app/common/components/modals/Terms/DeleteTerm/DeleteTermModal.component';
import EditTermModal from '@/app/common/components/modals/Terms/EditTerm/EditTermModal.component';
import PageBar from '@/features/AdminPage/PageBar/PageBar.component';
import { Term } from '@/models/streetcode/text-contents.model';

const PaginationSelect = ({ selected, onChange }) => {
    const paginationItems = useMemo(
        () => [10, 25, 50].map((value) => ({
            key: value.toString(),
            label: value.toString(),
            onClick: () => onChange(value),
        })),
        [onChange],
    );

    return (
        <div className="PaginationSelect">
            <p>Рядків на сторінці:</p>
            <Dropdown menu={{ items: paginationItems }} trigger={['click']}>
                <Button>
                    <Space>
                        {selected}
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </div>
    );
};

const TermDictionary = () => {
    const { termsStore } = useMobx();
    const { modalStore } = useModalContext();
    const { fetchTerms } = termsStore;
    const { setModal } = modalStore;

    const [term, setTerm] = useState<Partial<Term>>({});
    const [data, setData] = useState<Term[]>([]);
    const [selected, setSelected] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTitle, setSearchTitle] = useState('');

    const setTableState = async () => {
        const terms = await fetchTerms(searchTitle, selected, currentPage);
        setData(terms);
    };

    useEffect(() => {
        setTableState();
    }, [searchTitle, currentPage, selected]);

    useEffect(() => {
        setCurrentPage(1);
        fetchTerms(searchTitle, selected, 1);
    }, [searchTitle]);

    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTitle(event.target.value);
    };

    const handlePageSizeChange = (value: number) => {
        setSelected(value);
        setCurrentPage(1);
    };

    const handleAdd = () => {
        const newTerm: Term = {
            id: 0,
            title: term?.title || '',
            description: term?.description || '',
        };

        termsStore.createTerm(newTerm).then((response) => {
            setData([...data, response ?? newTerm]);
            setTerm({ title: '', description: '' });
        });
    };

    const handleDelete = (id: number) => {
        termsStore.deleteTerm(id);
        setData((data?.filter((termId) => termId.id !== id)) || []);
    };

    const handleEdit = (upd: Partial<Term>) => {
        if (upd && upd.id !== undefined) {
            const term: Term = upd as Term;
            termsStore.updateTerm(upd.id, term);
            setData(data?.map(
                (t) => (t.id === upd?.id
                    ? { ...t,
                        title: upd?.title as string,
                        description: upd.description === undefined ? '' : upd.description as string } : t),
            ));
        }
    };

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
        () => SortData<Term, string>(
            data,
            sortDirection,
            (itemToCompare: Term) => itemToCompare?.title,
            StringComparator,
        ),
        [data, sortDirection],
    );

    const columns = [
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
            width: '25%',
        },
        {
            title: 'Опис',
            dataIndex: 'description',
            key: 'description',
            width: '65%',
        },
        {
            title: 'Дії',
            key: 'action',
            width: '10%',
            render: (t: Term) => (
                <Space size="middle">
                    <Button
                        className="actionButton"
                        onClick={() => {
                            setTerm(t);
                            setModal('editTerm');
                        }}
                        icon={<EditOutlined className="actionIcon" />}
                        disabled={t.id === 0}
                    />
                    <Button
                        className="actionButton"
                        onClick={() => {
                            setTerm(t);
                            setModal('deleteTerm');
                        }}
                        icon={<DeleteOutlined className="actionIcon" />}
                    />
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
                    </div>
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
                            className="streetcode-custom-button"
                            onClick={() => setModal('addTerm')}
                        >
                            Новий термін
                        </Button>
                    </div>
                    <div className="termTable">
                        <Table
                            columns={columns}
                            dataSource={sortedData}
                            rowKey={({ id }) => id}
                            pagination={false}
                        />
                    </div>
                </div>
                <div className="underTableZone">
                    <br />
                    <div className="underTableElement">
                        <PaginationSelect selected={selected} onChange={handlePageSizeChange} />
                        <Pagination
                            className="paginationElement"
                            showSizeChanger={false}
                            current={currentPage}
                            total={termsStore.PaginationInfo.TotalItems}
                            pageSize={selected}
                            onChange={(page) => setCurrentPage(page)}
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