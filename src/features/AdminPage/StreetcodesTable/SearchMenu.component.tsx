import FRONTEND_ROUTES from "@/app/common/constants/frontend-routes.constants";
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import { Button, Input, Select, SelectProps } from "antd";
import './StreetcodesTable.styles.scss';

const SearchMenu = () => {

    const options: SelectProps['options'] = [
        { value: 'published', label: 'опублікований' },
        { value: 'draft', label: 'чернетка' },
        { value : 'deleted', label: 'видалений' }
      ];

    const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    };

    return(
    <>
    <div className='searchMenu'>
            <div className='searchMenuElement'>
                <Button className='Button'>Пошук стріткодів</Button>
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
                        onChange={handleChange}
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