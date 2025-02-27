import React, { useEffect, useState } from 'react';
import { ModelState } from '@models/enums/model-state';
import { RelatedFigureCreateUpdate, RelatedFigureShort } from '@models/streetcode/related-figure.model';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import { StreetcodeShort } from '@/models/streetcode/streetcode-types.model';

import SelectWithCustomSuffix from '@/app/common/components/SelectWithCustomSuffix';
import { Select } from 'antd';

interface Props {
    currentStreetcodeId: number | null;
    figures: RelatedFigureCreateUpdate[];
    setFigures: React.Dispatch<React.SetStateAction<RelatedFigureCreateUpdate[]>>;
    onChange: (field: string, value: any) => void;
}

const RelatedFiguresBlock = React.memo(({ currentStreetcodeId, figures, setFigures, onChange }: Props) => {
    const [options, setOptions] = useState<StreetcodeShort[]>([]);

    const getOptions = async () => {
        Promise.all([
            StreetcodesApi.getAllPublished().then((ops) => {
                setOptions(ops.filter((x) => x.id !== currentStreetcodeId));
            }),
        ]);
    };

    useEffect(() => {
        getOptions();
    }, []);

    const handleAdd = (figureId: number) => {
        const figurePersisted = figures.find((rel) => rel.id === figureId);
        if (figurePersisted) { // for case when delete persisted item and add it again
            figurePersisted.modelState = ModelState.Updated;
            setFigures([...figures]);
        } else {
            const figure = options.find((rel) => rel.id === figureId) as RelatedFigureCreateUpdate;
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

    return (
        <div className="adminContainer-block">
            <h2>Зв&apos;язки історії(History-коди)</h2>

            <SelectWithCustomSuffix
                mode="multiple"
                placeholder="Знайти history-код..."
                onSelect={handleAdd}
                value={figures.filter((x) => (x as RelatedFigureCreateUpdate).modelState !== ModelState.Deleted)
                    .map((x) => x.id)}
                filterOption={(input, option) => option?.children?.toLowerCase().indexOf(input.toLowerCase()) !== -1}
                onDeselect={handleDelete}
            >
                {options.map((s) => (
                    <Select.Option
                        key={`${s.id}`}
                        value={s.id}
                    >
                        {s.title}
                    </Select.Option>
                ))}
            </SelectWithCustomSuffix>
        </div>
    );
});

export default RelatedFiguresBlock;
