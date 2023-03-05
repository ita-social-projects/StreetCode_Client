import { useState, useRef, useEffect } from 'react';
import EventStreetcode from '../../../../../models/streetcode/related-figure.model';
import { DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Props {
    relation: EventStreetcode;
    relations: Array<EventStreetcode>;
    setRelations: React.Dispatch<React.SetStateAction<Array<EventStreetcode>>>;
};

const RelatedItem = ({relation, relations, setRelations} : Props) => {
    
    const deleteRelationHandle = async (id: number) => {
        const newRelatedSCs = relations.filter((rel) => rel.id !== id);
        setRelations(newRelatedSCs);
        try {
            //const response = await axios.delete(`https://localhost:5001/api/Streetcode/Delete`);
        } catch (err) {
            console.error(err);
        } 
    }

    const addPictureHandle = async (id: number) => {

    }

    return(
        <div className="relationItem">
            <span className='text'>{relation.title}</span>
            <div className='actions'>
                <span onClick={() => deleteRelationHandle(relation.id)}>
                    <DeleteOutlined/>
                </span>
            </div>
        </div>
    )
}

export default RelatedItem;