import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import useMobx from '@stores/root-store';

import InterestingFactsAdminModal from './FactsAdminModal/InterestingFactsAdminModal.component';
import InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component';

interface Props {
    onChange: (field: string, value: any) => void;
}

const InterestingFactsBlock = ({ onChange }: Props) => {
    const [openModal, setModalOpen] = useState<boolean>(false);
    const { factsStore } = useMobx();

    return (
        <div className="adminContainer-block">
            <h2>Wow-факти</h2>
            <div className="textBlockButton-container">
                <button
                    type="button"
                    className="buttonWithPlus"
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    +
                </button>
                {factsStore.getFactArray.map((f) => (
                    <InterestingFactAdminItem
                        key={f.id}
                        fact={f}
                        onChange={onChange}
                    />
                ))}
            </div>
            <div>
                <InterestingFactsAdminModal setModalOpen={setModalOpen} open={openModal} onChange={onChange} />
            </div>
        </div>
    );
};

export default observer(InterestingFactsBlock);
