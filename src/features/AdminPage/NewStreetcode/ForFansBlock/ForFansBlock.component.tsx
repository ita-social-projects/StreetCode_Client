import './ForFansBlock.style.scss';
import useMobx from '@stores/root-store';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';
import ForFansAdminItem from './ForFansAdminItem/ForFansAdminItem.component';
import ForFansAdminModal from './ForFansAdminModal/ForFansAdminModal.component';
import { useState } from 'react';

const ForFansBlock = () => {
        const streetcodeId = 2;// useRouteId();
        const { sourcesStore: { fetchSrcCategoriesByStreetcodeId, getSrcCategoriesArray } } = useMobx();
        const [isModalOpen, setIsModalOpen] = useState(false);
    
        useAsync(
            () => fetchSrcCategoriesByStreetcodeId(streetcodeId),
            [streetcodeId],
        );
        return (
            <div className="forFansBlock">
                <div className="forFansHeader">
                    <h2>
                       Для фанатів
                    </h2>
                </div>
                <div className="forFansContainer">
                    <button className="addNewCategory" onClick={() => setIsModalOpen(true)}>+</button>
                    {getSrcCategoriesArray.map((SourceCategory) => (
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