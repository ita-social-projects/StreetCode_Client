import React, { useMemo } from 'react';
import useMobx from '@stores/root-store';
import dayjs, { Dayjs } from 'dayjs';

import { Card } from 'antd';

interface Props {
    selectedDate?: Dayjs | null;
}

const ListViewCards: React.FC<Props> = ({ selectedDate }) => {
    const { calendarStore } = useMobx();
    const eventsList = [...calendarStore.events];

    const { groupedEvents, groupOrder } = useMemo(() => {
        const grouped: Record<string, typeof eventsList> = {};
        let order: string[] = [];

        eventsList.sort((a, b) => {
            const dateA = dayjs(a.date);
            const dateB = dayjs(b.date);

            const monthDayComparison = dateA.format('MMDD').localeCompare(dateB.format('MMDD'));

            if (monthDayComparison === 0) {
                return dateB.year() - dateA.year();
            }

            return monthDayComparison;
        });

        eventsList.forEach((event) => {
            const eventDate = dayjs(event.date);
            const monthDayKey = eventDate.format('DD MMMM');
            if (!grouped[monthDayKey]) {
                grouped[monthDayKey] = [];
                order.push(monthDayKey);
            }

            grouped[monthDayKey].push(event);
        });

        if (selectedDate) {
            const selectedMonthDayKey = selectedDate.format('DD MMMM');

            const keyIndex = order.indexOf(selectedMonthDayKey);
            if (keyIndex > -1) {
                order = [
                    selectedMonthDayKey,
                    ...order.slice(0, keyIndex),
                    ...order.slice(keyIndex + 1),
                ];
            }
        }

        return { groupedEvents: grouped, groupOrder: order };
    }, [eventsList, selectedDate]);

    eventsList.forEach((event) => {
        const eventDate = dayjs(event.date);
        const monthDayKey = eventDate.format('DD MMMM');

        if (!groupedEvents[monthDayKey]) {
            groupedEvents[monthDayKey] = [];
        }

        groupedEvents[monthDayKey].push(event);
    });

    return (
        <div>
            <Card className="dayViewCard" title="Список подій">
                {Object.keys(groupedEvents).length === 0 ? (
                    <p>Немає подій на цей день.</p>
                ) : (
                    <ul className="events-container events-scroll-container">
                        {Object.entries(groupedEvents).map(([monthDay, events]) => (
                            <li key={monthDay} className="event-group">
                                <div className="event-group-header">
                                    <p>{monthDay}</p>
                                    <hr />
                                </div>
                                <ul className="event-group-items">
                                    {events.map((event) => {
                                        const eventDate = dayjs(event.date);
                                        return (
                                            <li key={event.id} className="event-item">
                                                <p className="event-year">{eventDate.year()}</p>
                                                <p>{event.title}</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
};

export default ListViewCards;
