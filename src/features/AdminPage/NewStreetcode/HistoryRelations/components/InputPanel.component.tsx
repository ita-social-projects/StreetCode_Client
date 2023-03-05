import './components.styles.scss';
import { Button } from 'antd';
import { AutoComplete } from 'antd';
import RelatedFigure from '@/models/streetcode/related-figure.model';
import { useEffect, useState } from 'react';

interface Props {
  options: RelatedFigure[];
  handleAdd: (relation: RelatedFigure) => void;
}
const InputPanel = ({ options, handleAdd }: Props) => {
  const [relation, setRelation] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<RelatedFigure[]>(options);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);  

  const handleSearch = (value: string) => {
    const filtered = options.filter(option => option.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredOptions(filtered);
  };

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    //console.log('handleAddItem is called...');
    event.preventDefault();
    const found = filteredOptions.find(rel => rel.title === relation);
    if(found !== undefined) {
      handleAdd(found);
      setRelation('');
      setFilteredOptions(options);
      //console.log(found);
    }
  };  

  return (
    <form className="input-container" onSubmit={handleAddItem}>
      <AutoComplete
        placeholder='Знайти стріткод...'
        style={{ width: 300 }}
        options={filteredOptions.map(option => ({ value: option.title, label: option.title }))}
        onSearch={handleSearch}
        onChange={(value) => setRelation(value)}
        value={relation}
      />
      <Button htmlType="submit" className='create-relation-button' type="primary">
        <span>Додати</span>
      </Button>
    </form>
  );
}

export default InputPanel;
