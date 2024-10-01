import './StreetcodesTable.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';

import { ChangeEvent, Dispatch } from 'react';

import { Button, Input, Select, SelectProps } from 'antd';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

interface IProps {
    setStatus: Dispatch<React.SetStateAction<string[]>>
    setTitle: Dispatch<React.SetStateAction<string | null>>
    setRequest: () => void
}

const SearchMenu = ({ setStatus, setTitle, setRequest }: IProps) => {
    const options: SelectProps['options'] = [
        { value: 'Published', label: 'опублікований' },
        { value: 'Draft', label: 'чернетка' },
        { value: 'Deleted', label: 'видалений' },
    ];

    const handleChangeStatus = (value: string[]) => {
        setStatus(value);
    };

    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    return (
        <div className="searchMenu">
            <div className="searchMenuElement">
                <Button className="Button" onClick={() => setRequest()}>Пошук стріткодів</Button>
            </div>
            <div className="searchMenuElement">
                <Input
                    className="searchMenuElementInput"
                    prefix={<MagnifyingGlass />}
                    onChange={handleChangeTitle}
                    placeholder="Назва або індекс"
                />
            </div>
            <div className="searchMenuElement">
                <Select
                    mode="multiple"
                    allowClear
                    className="searchMenuStatusSelected"
                    placeholder="Статус стріткодів"
                    onChange={handleChangeStatus}
                    options={options}
                />
            </div>
            <div className="searchMenuElement">
                <Button
                    className="Button"
                    onClick={() => window.open(`${FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}`, '_blank')}
                >
                    Новий стріткод
                </Button>
            </div>
        </div>
    );
};

export default SearchMenu;
