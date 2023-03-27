// import './InterestingFactsAdminItem.style.scss';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';
import { useState } from 'react';
import InterestingFactsAdminModal from '../FactsAdminModal/InterestingFactsAdminModal.component';

interface Props {
    fact: Fact;
}

const InterestingFactAdminItem = ({ fact: { title } } : Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="interestingFactItem">
            <div className="item">
                <div className="faIcon">
                    <FaPencilAlt onClick={() => setIsModalOpen(true)} />
                </div>
                <p>
                    {title}
                </p>
                <div className="faIcon">
                    <FaRegTrashAlt />
                </div>
            </div>
            <InterestingFactsAdminModal open={isModalOpen} setOpen={setIsModalOpen} />
        </div>
    );
};

export default InterestingFactAdminItem;
