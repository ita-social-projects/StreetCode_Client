import './StreetcodesTable.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';

import { ChangeEvent, Dispatch } from 'react';
import STREETCODE_STATES from '@features/AdminPage/StreetcodesTable/constants/streetcodeStates';

import { Button, Input, Select, SelectProps } from 'antd';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

interface IProps {
    setStatus: Dispatch<React.SetStateAction<string[]>>
    setTitle: Dispatch<React.SetStateAction<string | null>>
    setRequest: () => void
}

const SearchMenu = ({ setStatus, setTitle, setRequest }: IProps) => {
    const options: SelectProps['options'] = [
        { value: 'Published', label: STREETCODE_STATES.PUBLISHED.label.toLowerCase() },
        { value: 'Draft', label: STREETCODE_STATES.DRAFT.label.toLowerCase() },
        { value: 'Deleted', label: STREETCODE_STATES.DELETED.label.toLowerCase() },
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
                <Button className="Button" onClick={() => setRequest()}>Пошук history-кодів</Button>
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
                    placeholder="Статус history-кодів"
                    onChange={handleChangeStatus}
                    options={options}
                />
            </div>
            <div className="searchMenuElement">
                <Button
                    className="Button"
                    onClick={() => window.open(`${FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}`, '_blank')}
                >
                    Новий history-код
                </Button>
            </div>
        </div>
    );
};

export default SearchMenu;
