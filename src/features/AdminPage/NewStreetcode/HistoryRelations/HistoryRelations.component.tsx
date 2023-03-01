import { useState, useEffect, useRef } from 'react';
import './HistoryRelations.styles.scss';
import RelationsList from './components/RelatedFigureList.component';
import Input from './components/InputPanel.component';
import HistoryRelation from '../../../../models/streetcode/related-figure.model';

interface Props {
    relations: Array<HistoryRelation>,
    setRelations: React.Dispatch<React.SetStateAction<Array<HistoryRelation>>>
}

const RelatedFiguresBlock = () => {
    const [relation, setRelation] = useState<string>("");
    const [relations, setRelations] = useState<HistoryRelation[]>([]);

    const addRelation = (event: React.FormEvent) => {
        event.preventDefault();

        if(relations) {
            setRelations([...relations,{id: 1, title: relation, imageId: -1, tags: []}]);
            setRelation("");
        }
    }

    return (
        <div className='relations-block'>
            <div className='subheading'>
                <h3>Зв'язки історії</h3>
                <h4>Стріткоди</h4>
            </div>
            <Input relation={relation} setRelation={setRelation} handleAdd={addRelation}/>
            <RelationsList relations={relations} setRelations={setRelations}/>
        </div>
    );
}

export default RelatedFiguresBlock;