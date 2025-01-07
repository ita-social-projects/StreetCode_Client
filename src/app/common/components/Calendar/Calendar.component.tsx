import React from 'react';
import { Calendar } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import './Calendar.styles.scss';

const CalendarComponent: React.FC = () => {
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
                <Calendar onPanelChange={onPanelChange} />
            </div>
        </div>
        </>
    );
};

export default CalendarComponent;