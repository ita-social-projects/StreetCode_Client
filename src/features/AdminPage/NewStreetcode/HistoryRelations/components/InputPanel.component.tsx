import './components.styles.scss';

import { useEffect, useState } from 'react';

import { AutoComplete, Button } from 'antd';

import { ModelState } from '@/models/enums/model-state';
import { RelatedFigureCreateUpdate, RelatedFigureShort } from '@/models/streetcode/related-figure.model';

interface Props {
    figures: RelatedFigureCreateUpdate[];
    options: RelatedFigureShort[];
    handleAdd: (relation: RelatedFigureCreateUpdate) => void;
    onChange: (field: string, value: any) => void;
}

const InputPanel = ({ figures, options, handleAdd, onChange }: Props) => {
    const [relation, setRelation] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<RelatedFigureCreateUpdate[]>(options);

    useEffect(() => {
        if (figures.length > 0) {
            const filtered = options.filter((option) => figures.some((figure) => figure.id === option.id
                && figure.modelState === ModelState.Deleted)
                || !figures.some((figure) => figure.id === option.id));

            setFilteredOptions(filtered);
        } else {
            // const filtered = options.filter(option => relation => relation.id === option.id));
            setFilteredOptions(options);
        }
    }, [options, figures]);

    // TODO: fix search
    const handleSearch = (value: string) => {
        if (figures.length > 0) {
            const filtered = options.filter((option) => !figures.some((figure) => figure.id === option.id));
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    };

    const handleAddItem = (event: React.MouseEvent) => {
        event.preventDefault();
        const found = filteredOptions.find((rel) => rel.title === relation);
        if (found !== undefined) {
            handleAdd(found);
            setRelation('');
            setFilteredOptions(options.filter((figure) => !figures.includes(figure) && figure.title !== found.title));
            onChange('figures', figures);
        }
    };

    return (
        <div className="input-container">
            <AutoComplete
                placeholder="Знайти стріткод..."
                style={{ width: '100%' }}
                options={filteredOptions.map((option) => ({ value: option.title, label: option.title }))}
                onSearch={handleSearch}
                onChange={(value) => setRelation(value)}
                value={relation}
            />
            <Button onClick={handleAddItem} className="streetcode-custom-button button-margin-left" type="primary">
        Додати
            </Button>
        </div>
    );
};

export default InputPanel;
