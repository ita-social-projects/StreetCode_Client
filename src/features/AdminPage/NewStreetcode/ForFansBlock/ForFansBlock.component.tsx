import './ForFansBlock.style.scss';

import React, { useEffect, useState } from 'react';
import useMobx from '@stores/root-store';

import SourcesApi from '@/app/api/sources/sources.api';
import { SourceCategory, SourceCategoryName, StreetcodeCategoryContent } from '@/models/sources/sources.model';

import ForFansAdminItem from './ForFansAdminItem/ForFansAdminItem.component';
import ForFansAdminModal from './ForFansAdminModal/ForFansAdminModal.component';

const ForFansBlock:React.FC<{ categories:StreetcodeCategoryContent[],
    setCategories: React.Dispatch<React.SetStateAction<StreetcodeCategoryContent[]>>
 }> = ({ categories, setCategories }) => {
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
                 <button className="addNewCategory" onClick={() => setIsModalOpen(true)}>+</button>
                 {categories.map((SourceCategory) => (
                     <ForFansAdminItem
                         SourceCategory={SourceCategory}
                     />
                 ))}
             </div>
             <ForFansAdminModal
                 allCategories={categoriesSelect}
                 streetcodeCategoryContents={categories}
                 setStreetcodeCategoryContents={setCategories}
                 open={isModalOpen}
                 setOpen={setIsModalOpen}
             />

         </div>
     );
 };

export default ForFansBlock;
