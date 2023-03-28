import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import './ForFansAdminItem.style.scss';
import { SourceCategory } from '@/models/sources/sources.model';
import useMobx from '@stores/root-store';
import { useState } from 'react';
import ForFansAdminModal from '../ForFansAdminModal/ForFansAdminModal.component';

interface Props {
    SourceCategory: SourceCategory;
}

const ForFansAdminItem = ({ SourceCategory: { title, id } } : Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="forFansItem">
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
            {/* NOTE: Add for fans here */}
            <ForFansAdminModal SourceCategory={} open={isModalOpen} setOpen={setIsModalOpen} />
        </div>
    );
};

export default ForFansAdminItem;
