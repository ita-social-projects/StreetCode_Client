import './InterestingFactsBlock.style.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useMobx from '@stores/root-store';


import InterestingFactsAdminModal from './FactsAdminModal/InterestingFactsAdminModal.component';
import InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component';


const InterestingFactsBlock = ({ id }) => {
    const [openModal, setModalOpen] = useState<boolean>(false);
    const { factsStore } = useMobx();
    useEffect(() => {
        if (id >= 0) {
            factsStore.fetchFactsByStreetcodeId(id);
        }
    }), [];
    return (
        <div className="adminContainer-block">
            <h2>Wow-факти</h2>
            <div>
                <button className="buttonWithPlus" onClick={() => setModalOpen(true)}>+</button>
                {factsStore.getFactArray.map((f) => <InterestingFactAdminItem fact={f} />)}
            </div>
            <div>
                <InterestingFactsAdminModal setModalOpen={setModalOpen} open={openModal} />
            </div>
        </div>
    );
};

export default observer(InterestingFactsBlock);