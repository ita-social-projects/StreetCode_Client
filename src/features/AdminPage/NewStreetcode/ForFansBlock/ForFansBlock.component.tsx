import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import useMobx from '@stores/root-store';

import SourcesApi from '@/app/api/sources/sources.api';
import { SourceCategory, SourceCategoryName, StreetcodeCategoryContent } from '@/models/sources/sources.model';

import ForFansAdminItem from './ForFansAdminItem/ForFansAdminItem.component';
import ForFansAdminModal from './ForFansAdminModal/ForFansAdminModal.component';

const ForFansBlock = () => {
    const { sourceCreateUpdateStreetcode } = useMobx();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriesSelect, setCategoriesSelect] = useState<SourceCategoryName[]>([]);

    useEffect(() => {
        SourcesApi.getAllNames().then((categ) => setCategoriesSelect(categ)).catch((e) => console.log(e));
    }, []);
    
    return (
        <div className="adminContainer-block">
            <h2>Для фанатів</h2>
            
            <div className="textBlockButton-container">
                <button
                    type="button"
                    className="buttonWithPlus"
                    onClick={() => setIsModalOpen(true)}
                >
                    +
                </button>
                {sourceCreateUpdateStreetcode.streetcodeCategoryContents.map((category, index) => (
                    <ForFansAdminItem
                        categoryName={categoriesSelect.find((c) => c.id === category.sourceLinkCategoryId)?.title ?? ''}
                        id={index}
                        onEditClick={() => {
                            sourceCreateUpdateStreetcode.indexUpdate = index;
                            setIsModalOpen(true);
                        }}
                    />
                ))}
            </div>
            <ForFansAdminModal
                allCategories={categoriesSelect}
                open={isModalOpen}
                setOpen={setIsModalOpen}
            />
        </div>
    );
};

export default observer(ForFansBlock);
