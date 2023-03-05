import { useState, useEffect } from 'react';
import './HistoryRelations.styles.scss';
import RelationsList from './components/RelatedFigureList.component';
import RelatedFigure from '@models/streetcode/related-figure.model';
import InputPanel from './components/InputPanel.component'
import axios from 'axios';
import { Button } from 'antd';

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
                `https://localhost:5001/api/Streetcode/GetAll`); //fix this
            setOptions(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const saveChanges = async() => {
        /*try {
            const response = await axios.get<RelatedFigure[]>(
                `https://localhost:5001/api/Streetcode/Create/params`); //fix this
            setOptions(response.data);
        } catch (error) {
            console.error(error);
        }*/
    }


    useEffect(() => {
        getOptions();
    }, []);
    
    return (
        <div className='relations-block'>
            <div className='subheading'>
                <h3>Зв'язки історії</h3>
                <h4>Стріткоди</h4>
            </div>
            <InputPanel options={options} handleAdd={handleAdd} />
            <RelationsList relations={relations} setRelations={setRelations}/>
            <Button 
                type="text" danger onSubmit={saveChanges}
                className={`submitButton ${relations.length === 0 ? 'invisible':''}`}
            >
                Зберегти зміни
            </Button>
        </div>
    );
}

export default RelatedFiguresBlock;
