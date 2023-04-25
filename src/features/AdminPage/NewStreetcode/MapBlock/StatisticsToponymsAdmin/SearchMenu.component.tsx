import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import { Button, Input, Select, SelectProps, InputNumber} from "antd";
import './SearchMenu.styles.scss'


interface IProps {
    setTitle: any
    setRequest: () => void
}

const SearchMenu = ({setTitle, setRequest}: IProps) => {

    const handleChangeTitle = (event: any) => {
        setTitle(event.target.value);
    };

    return(
    <>
    <div className='searchMenuToponyms'>
            <div className='searchMenuElement'>
                <Button className='streetcode-custom-button admin-button' onClick={() => setRequest()}>Пошук Топонімів</Button>
            </div>
            <div className='searchMenuElement'>
                <Input
                    prefix={<MagnifyingGlass />}
                    onChange={handleChangeTitle}
                    placeholder="Назва топоніму"
                />
            </div>

    </div>
    </>
    );
}

export default SearchMenu;