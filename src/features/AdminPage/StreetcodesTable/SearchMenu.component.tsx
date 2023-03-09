import FRONTEND_ROUTES from "@/app/common/constants/frontend-routes.constants";
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import { Button, Input, Select, SelectProps } from "antd";
import './StreetcodesTable.styles.scss';

interface IProps {
    setStatus: any
    setRequest: () => void
}

const SearchMenu = ({setStatus, setRequest}: IProps) => {

    const options: SelectProps['options'] = [
        { value: 'published', label: 'опублікований' },
        { value: 'draft', label: 'чернетка' },
        { value : 'deleted', label: 'видалений' }
      ];

    const handleChangeStatus = (value: string) => {
    console.log(`selected ${value}`);
    setStatus(value);
    };

    return(
    <>
    <div className='searchMenu'>
            <div className='searchMenuElement'>
                <Button className='Button' onClick={() => setRequest()}>Пошук стріткодів</Button>
            </div>
            <div className='searchMenuElement'>
                <Input
                    className='searchMenuElementInput'
                    prefix={<MagnifyingGlass />}
                    placeholder="Назва або індекс"
                />
            </div>
                <div className='searchMenuElement'>
                    <Select
                        mode="multiple"
                        allowClear
                        className='searchMenuStatusSelected'
                        placeholder="Статус стріткодів"
                        onChange={handleChangeStatus}
                        options={options}
                    />
                </div>
                <div className='searchMenuElement'>
                    <Button className='Button' onClick={() => window.open(`${FRONTEND_ROUTES.STREETCODE.BASE}/new-streetcode`,'_blank')}>Новий стріткод</Button>
                </div>
    </div>
    </>
    );
}

export default SearchMenu;