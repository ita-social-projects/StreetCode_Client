import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { ModelState } from '@models/enums/model-state';
import useMobx from '@stores/root-store';

import SourcesApi from '@/app/api/sources/sources.api';
import { SourceCategoryName, StreetcodeCategoryContentUpdate } from '@/models/sources/sources.model';

import ForFansAdminItem from './ForFansAdminItem/ForFansAdminItem.component';
import ForFansAdminModal from './ForFansAdminModal/ForFansAdminModal.component';

interface Props {
    onChange: (field: string, value: any) => void;
}

const ForFansBlock: React.FC<Props> = ({ onChange }) => {
    const { sourceCreateUpdateStreetcode } = useMobx();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriesSelect, setCategoriesSelect] = useState<SourceCategoryName[]>([]);

    useEffect(() => {
        if (!isModalOpen) {
            SourcesApi.getAllNames().then((categ) => setCategoriesSelect(categ)).catch((e) => {});
        }
    }, [isModalOpen]);

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
                {sourceCreateUpdateStreetcode.streetcodeCategoryContents
                    .filter((categoryContent) => (categoryContent as StreetcodeCategoryContentUpdate)
                        .modelState !== ModelState.Deleted)
                    .map((category) => (
                        <ForFansAdminItem
                            key={category.id}
                            categoryName={categoriesSelect
                                .find((c) => c.id === category.sourceLinkCategoryId)?.title ?? ''}
                            index={sourceCreateUpdateStreetcode.streetcodeCategoryContents.indexOf(category)}
                            onEditClick={() => {
                                sourceCreateUpdateStreetcode.indexUpdate = sourceCreateUpdateStreetcode.streetcodeCategoryContents.indexOf(category);
                                setIsModalOpen(true);
                            }}
                        />
                    ))}
            </div>
            <ForFansAdminModal
                character_limit={1000}
                allCategories={categoriesSelect}
                open={isModalOpen}
                setOpen={setIsModalOpen}
                onChange={onChange}
            />
        </div>
    );
};

export default observer(ForFansBlock);