import './InterestingFactsAdminItem.style.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

import InterestingFactsAdminModal from '../FactsAdminModal/InterestingFactsAdminModal.component';

interface Props {
    fact: Fact,
}
const InterestingFactAdminItem = ({ fact }: Props) => {
    const { factsStore } = useMobx();
    const [openModal, setModalOpen] = useState<boolean>(false);

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
                    <DeleteOutlined onClick={() => factsStore.deleteFactFromMap(fact.id)} />
                </div>
                <div>
                    <InterestingFactsAdminModal fact={fact} setModalOpen={setModalOpen} open={openModal} />
                </div>

            </div>
        </div>
    );
};

export default observer(InterestingFactAdminItem);
