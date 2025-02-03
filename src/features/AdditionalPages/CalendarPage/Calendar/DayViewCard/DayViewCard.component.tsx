import dayjs, { Dayjs } from "dayjs";
import "./DayViewCard.styles.scss";
import { Card } from "antd";
import useMobx from "@/app/stores/root-store";

interface Props {
  selectedDate: Dayjs;
}
const DayViewCard: React.FC<Props> = ({ selectedDate }) => {
  const { calendarStore } = useMobx();
  const eventsForDay = calendarStore.getEventsByDate(
    selectedDate.format("MM-DD")
  );
  console.log(eventsForDay);
  return (
    <div>
      <Card className='dayViewCard' title={selectedDate.format("D MMMM")}>
        {eventsForDay.length === 0 ? (
          <p>Немає подій на цей день.</p>
        ) : (
          <ul className='events-container'>
            {eventsForDay.map((event) => {
              const eventDate = dayjs(event.date);

              return (
                <li key={event.id} className='event-item'>
                  <p className='event-year'>{eventDate.format("YYYY")}</p>
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
