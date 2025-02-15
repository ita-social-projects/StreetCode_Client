import { Button, Input, Select } from 'antd/es';
import './CalendarControlBar.styles.scss';
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import { EventType } from '@/models/calendar/calendarEvent.model';

interface Props {
  handleChange: (value: EventType) => void;
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
          defaultValue='Historical'
          onChange={handleChange}
          options={[
            { value: 'Historical', label: 'Історичні події' },
            { value: 'Custom', label: 'Власні події' },
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
