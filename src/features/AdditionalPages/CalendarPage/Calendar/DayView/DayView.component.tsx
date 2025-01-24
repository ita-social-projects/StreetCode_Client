import { Calendar, ConfigProvider } from "antd/es";
import DayViewCard from "../DayViewCard/DayViewCard.component";
import { Dayjs } from "dayjs";
import uk_UA from "antd/locale/uk_UA";

interface DayViewProps {
  selectedDate: Dayjs;
  handleBackToCalendar: () => void;
  onDateClick: (date: Dayjs) => void;
}

const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  handleBackToCalendar,
  onDateClick,
}) => {
  return (
    <>
      <div className='day-view-container-wrapper'>
        <div className='day-view-container'>
          <DayViewCard selectedDate={selectedDate} />
          <div className='small-calendar-wrapper'>
            <button className='back-button' onClick={handleBackToCalendar}>
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
    </>
  );
};

export default DayView;
