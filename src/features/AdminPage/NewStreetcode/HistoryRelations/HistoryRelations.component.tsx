import './HistoryRelations.styles.scss';

import { useEffect, useState } from 'react';
import { PartnerShort } from '@models/partners/partners.model';
import RelatedFigure from '@models/streetcode/related-figure.model';
import axios from 'axios';

import InputPanel from './components/InputPanel.component';
import RelationsList from './components/RelatedFigureList.component';

interface Props {
    setFigures: React.Dispatch<React.SetStateAction<RelatedFigure[]>>;
}
const RelatedFiguresBlock = ({ setFigures }: Props) => {
    const [relations, setRelations] = useState<RelatedFigure[]>([]);
    const [options, setOptions] = useState<RelatedFigure[]>([]);

    const handleAdd = (relationToAdd: RelatedFigure) => {
        const existing = relations.find((rel) => rel.id === relationToAdd.id);
        if (existing === undefined) {
            setRelations((prevState) => [...prevState, relationToAdd]);
        }

        setFigures((prevState) => [...prevState, relationToAdd]);
    };

    const getOptions = async () => {
        try {
            const response = await axios.get<RelatedFigure[]>(
                'https://localhost:5001/api/Streetcode/GetAll',
            );
            setOptions(response.data.streetcodes);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getOptions();
    }, []);

    return (
        <div className='adminContainer-block'>
            <h2>Зв'язки історії(Стріткоди)</h2>
            <InputPanel relations={relations} options={options} handleAdd={handleAdd} />
            <RelationsList relations={relations} setRelations={setRelations} setFigures={setFigures} />
        </div>
    );
};

export default RelatedFiguresBlock;
