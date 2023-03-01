import RelatedFigure from '../../../../../models/streetcode/related-figure.model';
import { useState, useRef, useEffect } from 'react';

import { DeleteOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
    relation: RelatedFigure;
    relations: Array<RelatedFigure>;
    setRelations: React.Dispatch<React.SetStateAction<Array<RelatedFigure>>>;
};

const RelatedItem = ({relation, relations, setRelations} : Props) => {
    
    const deleteRelation = async (id: number) => {
        const newRelatedSCs = relations.filter((rel) => rel.id !== id);
        setRelations(newRelatedSCs);
    }

    return(
        <div className="relationItem">
            <span className='text'>{relation.title}</span>
            <div className='actions'>
                <span onClick={() => deleteRelation(relation.id)}>
                    <DeleteOutlined/>
                </span>
            </div>
        </div>
    )
}

export default RelatedItem;