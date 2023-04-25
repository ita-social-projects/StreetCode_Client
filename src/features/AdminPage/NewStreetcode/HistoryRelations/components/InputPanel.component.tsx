import './components.styles.scss';
import { Button } from 'antd';
import { AutoComplete } from 'antd';
import RelatedFigure from '@/models/streetcode/related-figure.model';
import { useEffect, useState } from 'react';

interface Props {
  relations: RelatedFigure[];
  options: RelatedFigure[];
  handleAdd: (relation: RelatedFigure) => void;
}

const InputPanel = ({relations, options, handleAdd }: Props) => {
  const [relation, setRelation] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<RelatedFigure[]>(options);

  useEffect(() => {
    setFilteredOptions(options);
    console.log(options);
  }, [options]);  

  const handleSearch = (value: string) => {
    const filtered = options.filter(option => option.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredOptions(filtered);
  };

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = filteredOptions.find(rel => rel.title === relation);
    if(found !== undefined) {
      handleAdd(found);
      setRelation('');
      setFilteredOptions(options.filter((rel) => !relations.includes(rel) && rel.title != found.title));
    }
  };  

  return (
    <form onSubmit={handleAddItem}>
    <div className='display-flex-row'>
      <AutoComplete
        placeholder='Знайти стріткод...'
        style={{ width: '100%' }}
        options={filteredOptions.map(option => ({ value: option.title, label: option.title }))}
        onSearch={handleSearch}
        onChange={(value) => setRelation(value)}
        value={relation}
      />
      <Button htmlType="submit" className='streetcode-custom-button button-margin-left' type="primary">
        Додати
      </Button>
      </div>
    </form>
  );
}

export default InputPanel;
