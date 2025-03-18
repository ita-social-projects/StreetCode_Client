import useMobx from '@stores/root-store';
import { Dayjs } from 'dayjs';

import { Calendar, CalendarProps, ConfigProvider, Tooltip } from 'antd/es';
import uk_UA from 'antd/locale/uk_UA';

import { CalendarEvent } from '@/models/calendar/calendarEvent.model';

interface CalendarViewProps {
  currentMonth: Dayjs;
  setCurrentMonth: (month: Dayjs) => void;
  onDateClick: (date: Dayjs) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
    currentMonth,
    setCurrentMonth,
    onDateClick,
}) => {
    const { calendarStore } = useMobx();

    const dateCellRender = (value: Dayjs) => {
        const events: CalendarEvent[] = calendarStore.getEventsByDate(
            value.format('MM-DD'),
        );

        return (
            <ul className="events">
                {events.map((event) => (
                    <li key={event.id}>
                        <div className="badge">
                            <div className="small-circle" />
                            <Tooltip title={event.title} color="#FAFAFA">
                                <div className="badge-text">{event.title}</div>
                            </Tooltip>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return '';
        return info.originNode;
    };

    const onPanelChange = (value: any, mode: CalendarProps<Dayjs>['mode']) => {
        setCurrentMonth(value);
    };

    return (
        <div className="calendar-container-wrapper">
            <ConfigProvider locale={uk_UA}>
                <Calendar
                    className="calendar-full"
                    onSelect={(date) => {
                        if (date.isSame(currentMonth, 'month')) {
                            onDateClick(date);
                        }
                    }}
                    cellRender={cellRender}
                    onPanelChange={onPanelChange}
                />
            </ConfigProvider>
        </div>
    );
};

export default CalendarView;
