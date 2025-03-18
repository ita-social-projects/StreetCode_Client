import './DayViewCard.styles.scss';

import useMobx from '@stores/root-store';
import dayjs, { Dayjs } from 'dayjs';

import { Card } from 'antd';

interface Props {
  selectedDate: Dayjs;
}
const DayViewCard: React.FC<Props> = ({ selectedDate }) => {
    const { calendarStore } = useMobx();
    const eventsForDay = calendarStore.getEventsByDate(
        selectedDate.format('MM-DD'),
    );

    return (
        <div>
            <Card className="dayViewCard" title={selectedDate.format('D MMMM')}>
                {eventsForDay.length === 0 ? (
                    <p>Немає подій на цей день.</p>
                ) : (
                    <ul className="events-container events-scroll-container">
                        {eventsForDay.map((event) => {
                            const eventDate = dayjs(event.date);

                            return (
                                <li key={event.id} className="event-item">
                                    <p className="event-year">{eventDate.format('YYYY')}</p>
                                    <p>{event.title}</p>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Card>
        </div>
    );
};

export default DayViewCard;
