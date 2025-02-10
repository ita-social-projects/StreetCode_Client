import { Button, Input, Select } from 'antd/es';
import './CalendarControlBar.styles.scss';
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

interface Props {
  handleChange: (value: string) => void;
}
const CalendarControlBar: React.FC<Props> = ({ handleChange }) => {
  return (
    <div className='calendarControlBar'>
      <div className='calendarControlBarElement'>
        <Button className='Button' onClick={() => {}}>
          Пошук події
        </Button>
      </div>
      <div className='calendarControlBarElement Input'>
        <Input
          prefix={<MagnifyingGlass />}
          // onChange={handleChangeTitle} haven`t been implemented
          placeholder='Назва або індекс події'
        />
      </div>
      <div className='calendarControlBarElement'>
        <Select
          className='calendarControlBarStatusSelected'
          defaultValue='historical'
          onChange={handleChange}
          options={[
            { value: 'historical', label: 'Історичні події' },
            { value: 'custom', label: 'Кастомні події' },
          ]}
        />
      </div>
      <div className='calendarControlBarElement'>
        <Button
          className='Button'
          onClick={() =>
            window.open(`${FRONTEND_ROUTES.ADMIN.NEW_EVENT}`, '_blank')
          }
        >
          Додати подію
        </Button>
      </div>
    </div>
  );
};

export default CalendarControlBar;
