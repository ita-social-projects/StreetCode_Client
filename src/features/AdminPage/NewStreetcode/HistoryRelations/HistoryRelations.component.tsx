import React, { useEffect, useState } from 'react';
import { ModelState } from '@models/enums/model-state';
import { RelatedFigureCreateUpdate, RelatedFigureShort } from '@models/streetcode/related-figure.model';

import InputPanel from './components/InputPanel.component';
import RelationsList from './components/RelatedFigureList.component';
import useMobx from '@/app/stores/root-store';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import Streetcode from '@/models/streetcode/streetcode-types.model';

interface Props {
    figures: RelatedFigureCreateUpdate[];
    setFigures: React.Dispatch<React.SetStateAction<RelatedFigureCreateUpdate[]>>;
    onChange: (field: string, value: any) => void;
}

const RelatedFiguresBlock = React.memo(({ figures, setFigures, onChange }: Props) => {
    const [options, setOptions] = useState<Streetcode[]>([]);
    const { streetcodeShortStore } = useMobx();

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
        Promise.all([
            StreetcodesApi.getAllShort().then((ops) => setOptions(ops))
        ])
        .catch();
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