import './components.styles.scss';
import { Button } from 'antd';

interface Props {
    relation: string,
    setRelation: React.Dispatch<React.SetStateAction<string>>,
    handleAdd: (event:React.FormEvent) => void
};

const Input = ({ relation, setRelation, handleAdd }: Props) => {
    return (
        <form className="input-container" onSubmit={handleAdd}>
            <input className="relation-title-input"
                type="input"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="Назва стріткоду">
            </input>
            <button type="submit" className='create-relation-button'>
                <span>Додати</span>
            </button>
        </form>
    );
}
//<button className="create-relation-button" type="submit">Додати</button>
export default Input;