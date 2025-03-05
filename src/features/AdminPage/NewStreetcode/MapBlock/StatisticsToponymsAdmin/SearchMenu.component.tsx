import './SearchMenu.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';

import BUTTON_LABELS from '@constants/buttonLabels';

import { Button, Input } from 'antd';

interface IProps {
    setTitle: any
    setRequest: () => void
}

const SearchMenu = ({ setTitle, setRequest }: IProps) => {
    const handleChangeTitle = (event: any) => {
        setTitle(event.target.value);
    };

    return (
        <div className="searchMenuToponyms">

            <div className="searchMenuElement">
                <Input
                    className="searchMenuElementInput"
                    prefix={<MagnifyingGlass />}
                    onChange={handleChangeTitle}
                    placeholder="Назва топоніму"
                />
            </div>
            <div className="searchMenuElement">
                <Button
                    className="streetcode-custom-button"
                    onClick={() => setRequest()}
                >
                    {BUTTON_LABELS.SEARCH_TOPONYM}
                </Button>
            </div>
        </div>
    );
};

export default SearchMenu;
