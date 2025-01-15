import React from 'react';
import { Badge, Calendar } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { calendarStore } from '@stores/calendar-store';
import './Calendar.styles.scss';

const CalendarComponent: React.FC = () => {

    const dateCellRender = (value: Dayjs) => {
        const events = calendarStore.getEventsByDate(value.format('YYYY-MM-DD'));;

        return (
          <ul className="events">
            {events.map((event) => (
              <li key={event.id}>
                <div className={`badge ${event.type}`}>{event.title}</div>
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
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    return (
        <>        
        <div className='site-calendar-demo-card'>
            <div className='calendar-header'>
                <p>HistoryCode </p>
                <div className='small-square'></div>
                <p>КАЛЕНДАР</p>
            </div>
            <div className='calendar-container'>
                <Calendar cellRender={cellRender} onPanelChange={onPanelChange} />
            </div>
        </div>
        </>
    );
};

export default CalendarComponent;