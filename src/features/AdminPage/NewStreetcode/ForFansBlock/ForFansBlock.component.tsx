import './ForFansBlock.style.scss';

import React, { useEffect, useState } from 'react';
import useMobx from '@stores/root-store';

import SourcesApi from '@/app/api/sources/sources.api';
import { SourceCategory, SourceCategoryName, StreetcodeCategoryContent } from '@/models/sources/sources.model';

import ForFansAdminItem from './ForFansAdminItem/ForFansAdminItem.component';
import ForFansAdminModal from './ForFansAdminModal/ForFansAdminModal.component';
import { observer } from 'mobx-react-lite';

const ForFansBlock = () => {
    const { sourceCreateUpdateStreetcode } = useMobx();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriesSelect, setCategoriesSelect] = useState<SourceCategoryName[]>([]);
    useEffect(() => {
        SourcesApi.getAllNames().then((categ) => setCategoriesSelect(categ)).catch((e) => console.log(e));
    }, []);
    return (
        <div className="forFansBlock">
            <div className="forFansHeader">
                <h2>
                       Для фанатів
                </h2>
            </div>
            <div className="forFansContainer">
                <button className="addNewCategory"
                 onClick={() => setIsModalOpen(true)}>+</button>
                {sourceCreateUpdateStreetcode.streetcodeCategoryContents.map((category) => (
                    <ForFansAdminItem
                        categoryName={categoriesSelect.find((c) => c.id === category.categoryId)!.title}
                        id={category.id}
                        onEditClick={()=>{
                            sourceCreateUpdateStreetcode.indexUpdate = category.id;
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
