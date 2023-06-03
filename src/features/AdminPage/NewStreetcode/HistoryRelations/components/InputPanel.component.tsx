import './components.styles.scss';

import { useEffect, useState } from 'react';

import { AutoComplete, Button } from 'antd';

import { RelatedFigureCreateUpdate } from '@/models/streetcode/related-figure.model';

interface Props {
    figures: RelatedFigureCreateUpdate[];
    options: RelatedFigureCreateUpdate[];
    handleAdd: (relation: RelatedFigureCreateUpdate) => void;
}

const InputPanel = ({ figures, options, handleAdd }: Props) => {
    const [relation, setRelation] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<RelatedFigureCreateUpdate[]>(options);

    useEffect(() => {
        console.log('changed');
        if (figures.length > 0) {
            const filtered = options.filter((option) => !figures.some((figure) => figure.id === option.id));
            setFilteredOptions(filtered);
        } else {
            // const filtered = options.filter(option => relation => relation.id === option.id));
            setFilteredOptions(options);
        }
    }, [options, figures]);

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
            setFilteredOptions(options.filter((figure) => !figures.includes(figure) && figure.title !== found.title));
        }
    };

    return (
        <form className="input-container">
            <AutoComplete
                placeholder="Знайти стріткод..."
                style={{ width: '100%' }}
                options={filteredOptions.map((option) => ({ value: option.title, label: option.title }))}
                onSearch={handleSearch}
                value={relation}
            />
            <Button onClick={handleAddItem} className="streetcode-custom-button button-margin-left" type="primary">
        Додати
            </Button>
        </form>
    );
};

export default InputPanel;
