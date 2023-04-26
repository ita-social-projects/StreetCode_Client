import './components.styles.scss';

import { useEffect, useState } from 'react';

import { AutoComplete, Button } from 'antd';

import RelatedFigure from '@/models/streetcode/related-figure.model';

interface Props {
  relations: RelatedFigure[];
  options: RelatedFigure[];
  handleAdd: (relation: RelatedFigure) => void;
}

const InputPanel = ({ relations, options, handleAdd }: Props) => {
    const [relation, setRelation] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<RelatedFigure[]>(options);

    useEffect(() => {
        if (relations.length > 0) {
            const filtered = options.filter(option => !relations.some(relation => relation.id === option.id));
            setFilteredOptions(filtered);
        }
    }, [options, relations]);


    const handleSearch = (value: string) => {
        if (relations.length > 0) {
            const filtered = options.filter(option => !relations.some(relation => relation.id === option.id));
            setFilteredOptions(filtered);
        }
        
    };

    const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const found = filteredOptions.find((rel) => rel.title === relation);
        if (found !== undefined) {
            handleAdd(found);
            setRelation('');
            setFilteredOptions(options.filter((rel) => !relations.includes(rel) && rel.title != found.title));
        }
    };

    return (
        <form className="input-container" onSubmit={handleAddItem}>
            <AutoComplete
                placeholder="Знайти стріткод..."
                style={{ width: 400 }}
                options={filteredOptions.map((option) => ({ value: option.title, label: option.title }))}
                onSearch={handleSearch}
                onChange={(value) => setRelation(value)}
                value={relation}
            />
            <Button htmlType="submit" className="create-relation-button" type="primary">
        Додати
            </Button>
        </form>
    );
};

export default InputPanel;
