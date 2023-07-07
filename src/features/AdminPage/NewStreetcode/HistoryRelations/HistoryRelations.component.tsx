import React, { useEffect, useState } from 'react';
import { ModelState } from '@models/enums/model-state';
import { RelatedFigureCreateUpdate, RelatedFigureShort } from '@models/streetcode/related-figure.model';
import axios from 'axios';

import InputPanel from './components/InputPanel.component';
import RelationsList from './components/RelatedFigureList.component';

interface Props {
    figures: RelatedFigureCreateUpdate[];
    setFigures: React.Dispatch<React.SetStateAction<RelatedFigureCreateUpdate[]>>;
    onChange: (field: string, value: any) => void;
}

const RelatedFiguresBlock = React.memo(({ figures, setFigures, onChange }: Props) => {
    const [options, setOptions] = useState<RelatedFigureShort[]>([]);

    const handleAdd = (relationToAdd: RelatedFigureCreateUpdate) => {
        const figurePersisted = figures.find((rel) => rel.id === relationToAdd.id);
        if (figurePersisted) { // for case when delete persisted item and add it again
            figurePersisted.modelState = ModelState.Updated;
            setFigures([...figures]);
        } else {
            const figure = options.find((rel) => rel.id === relationToAdd.id) as RelatedFigureCreateUpdate;
            figure.modelState = ModelState.Created;
            setFigures((prevState) => [...prevState, figure]);
        }
    };

    const handleDelete = async (id: number) => {
        const figureToDelete = figures.find((x) => x.id === id);
        if (figureToDelete?.isPersisted) {
            figureToDelete.modelState = ModelState.Deleted;
            setFigures([...figures]);
        } else {
            const newRelatedSCs = figures.filter((rel) => rel.id !== id);
            setFigures(newRelatedSCs);
        }
        onChange('figures', figures);
    };

    const getOptions = async () => {
        try {
            const response = await axios.get<RelatedFigureShort[]>(
                'https://localhost:5001/api/RelatedFigure/GetAllPublished',
            );

            setOptions(response.data as RelatedFigureShort[]);
            console.log(response.data);
        } catch (error) { /* empty */ }
    };

    useEffect(() => {
        getOptions();
    }, []);

    return (
        <div className="adminContainer-block">
            <h2>Зв&apos;язки історії(Стріткоди)</h2>
            <InputPanel figures={figures} options={options} handleAdd={handleAdd} onChange={onChange} />
            <RelationsList figures={figures} handleDelete={handleDelete} />
        </div>
    );
});

export default RelatedFiguresBlock;
