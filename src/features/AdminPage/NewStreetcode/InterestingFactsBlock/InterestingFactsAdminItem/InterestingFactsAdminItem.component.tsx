import './InterestingFactsAdminItem.style.scss';

import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

import InterestingFactsAdminModal from '../FactsAdminModal/InterestingFactsAdminModal.component';

interface Props {
    fact: Fact,
    onChange: (field: string, value: any) => void,
}
const InterestingFactAdminItem = ({ fact, onChange }: Props) => {
    const { factsStore } = useMobx();
    const [openModal, setModalOpen] = useState<boolean>(false);
    const [visibleModal, setVisibleModal] = useState(false);

    const handleRemove = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);

    return (
        <div className="textBlockButton">
            <div className="item">
                <div className="blockItem">
                    <EditOutlined onClick={() => setModalOpen(true)} />
                </div>
                <p>
                    {fact.title}
                </p>
                <div className="blockItem">
                    <DeleteOutlined onClick={() => handleRemove()} />
                </div>
                <div>
                    <InterestingFactsAdminModal
                        fact={fact}
                        setModalOpen={setModalOpen}
                        open={openModal}
                        onChange={onChange}
                    />
                </div>
                <Modal
                    title="Ви впевнені, що хочете видалити даний Wow-факт?"
                    open={visibleModal}
                    onOk={(e) => {
                        factsStore.deleteFactFromMap(fact.id); setVisibleModal(false);
                        onChange('fact', fact);
                    }}
                    onCancel={handleCancelModalRemove}
                />
            </div>
        </div>
    );
};

export default observer(InterestingFactAdminItem);
