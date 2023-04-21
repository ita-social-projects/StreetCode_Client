import './ForFansBlock.style.scss';

import React, { useState } from 'react';
import useMobx from '@stores/root-store';

import { SourceCategory } from '@/models/sources/sources.model';

import ForFansAdminModal from './ForFansAdminModal/ForFansAdminModal.component';

const ForFansBlock:React.FC<{ categories:SourceCategory[] }> = ({ categories }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="forFansBlock">
            <div className="forFansHeader">
                <h2>
                       Для фанатів
                </h2>
            </div>
            <div className="forFansContainer">
                <button className="addNewCategory" onClick={() => setIsModalOpen(true)}>+</button>
                {categories.map((SourceCategory) => (
                    <ForFansAdminItem
                        SourceCategory={SourceCategory}
                    />
                ))}
            </div>
            <ForFansAdminModal open={isModalOpen} setOpen={setIsModalOpen} />
        </div>
    );
};

export default ForFansBlock;
