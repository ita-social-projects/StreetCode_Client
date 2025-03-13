import { Dayjs } from 'dayjs';

import { Calendar, ConfigProvider } from 'antd/es';
import uk_UA from 'antd/locale/uk_UA';

import DayViewCard from '../DayViewCard/DayViewCard.component';

interface DayViewProps {
  selectedDate: Dayjs;
  handleBackToCalendar: () => void;
  onDateClick: (date: Dayjs) => void;
}

const DayView: React.FC<DayViewProps> = ({
    selectedDate,
    handleBackToCalendar,
    onDateClick,
}) => (
    <div className="day-view-container-wrapper">
        <div className="day-view-container">
            <DayViewCard selectedDate={selectedDate} />
            <div className="small-calendar-wrapper">
                <button className="back-button" type="button" onClick={handleBackToCalendar}>
              Назад до календаря
                </button>
                <ConfigProvider locale={uk_UA}>
                    <Calendar
                        fullscreen={false}
                        value={selectedDate}
                        onSelect={onDateClick}
                    />
                </ConfigProvider>
            </div>
        </div>
    </div>
);

export default DayView;
