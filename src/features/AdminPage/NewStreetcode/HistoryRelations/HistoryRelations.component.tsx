import { useState, useEffect } from 'react';
import './HistoryRelations.styles.scss';
import RelationsList from './components/RelatedFigureList.component';
import RelatedFigure from '@models/streetcode/related-figure.model';
import InputPanel from './components/InputPanel.component'
import axios from 'axios';

const RelatedFiguresBlock = () => {
    const [relations, setRelations] = useState<RelatedFigure[]>([]);
    const [options, setOptions] = useState<RelatedFigure[]>([]);

    const handleAdd = (relationToAdd: RelatedFigure) => {
        const existing = relations.find((rel)=>rel.id===relationToAdd.id);
        if(existing === undefined) {
            setRelations([...relations, relationToAdd]);
        }
    }

    const getOptions = async() => {
        try {
            const response = await axios.get<RelatedFigure[]>(
                `https://localhost:5001/api/Streetcode/GetAll`);
            setOptions(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getOptions();
    }, []);
    
    return (
        <div className='adminContainer-block'>
            <h2>Зв'язки історії(Стріткоди)</h2>
                <InputPanel relations={relations} options={options} handleAdd={handleAdd} />
                <RelationsList relations={relations} setRelations={setRelations}/>
        </div>
    );
}

export default RelatedFiguresBlock;
