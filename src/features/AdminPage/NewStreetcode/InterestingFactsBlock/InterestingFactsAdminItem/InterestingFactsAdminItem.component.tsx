import './InterestingFactsAdminItem.style.scss';

import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx, { useModalContext } from '@stores/root-store';

// eslint-disable-next-line no-restricted-imports
import InterestingFactsAdminModal from '../FactsAdminModal/InterestingFactsAdminModal.component';

interface Props {
    fact: Fact,
    onChange: (field: string, value: any) => void,
}
const InterestingFactAdminItem = ({ fact, onChange }: Props) => {
    const { factsStore } = useMobx();
    const { modalStore } = useModalContext();
    const [openModal, setModalOpen] = useState<boolean>(false);

    const handleRemove = useCallback(() => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                factsStore.deleteFactFromMap(fact.id);
                onChange('fact', fact);
                modalStore.setConfirmationModal('confirmation');
            },
            CONFIRMATION_MESSAGES.DELETE_WOW_FACT,
        );
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
            </div>
        </div>
    );
};

export default observer(InterestingFactAdminItem);
