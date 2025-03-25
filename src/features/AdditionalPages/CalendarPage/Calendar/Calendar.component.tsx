import './Calendar.styles.scss';

import { observer } from 'mobx-react-lite/dist';
import React, { useState } from 'react';
import useMobx from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { ConfigProvider } from 'antd';

import 'dayjs/locale/uk';

import { useCalendarContext } from './CalendarContext/CalendarContext.component';
import CalendarView from './CalendarViews/CalendarView/CalendarView.component';
import DayView from './CalendarViews/DayView/DayView.component';
import ListCalendarView from './CalendarViews/ListCalendarView/ListCalendarView.component';

dayjs.locale('uk');

const CalendarComponent: React.FC = observer(() => {
    const { calendarStore } = useMobx();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const { viewMode, setViewMode } = useCalendarContext();
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    const { isLoading } = useQuery({
        queryKey: ['events', calendarStore.events.length],
        queryFn: () => {
            calendarStore.fetchAllEventsShort();
        },
    });

    const onDateClick = (date: Dayjs) => {
        if (!selectedDate || !date.isSame(selectedDate, 'date')) {
            setSelectedDate(date);
            setViewMode('dayView');
        }
    };

    const handleBackToCalendar = () => {
        const currentLocalDate = dayjs();
        setCurrentMonth(currentLocalDate);

        setSelectedDate(null);
        setViewMode('calendar');
    };

    const renderView = () => {
        switch (viewMode) {
        case 'calendar':
            return (
                <CalendarView
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    onDateClick={onDateClick}
                />
            );
        case 'dayView':
            return selectedDate ? (
                <DayView
                    selectedDate={selectedDate}
                    handleBackToCalendar={handleBackToCalendar}
                    onDateClick={onDateClick}
                />
            ) : null;
        case 'listView':
            return (
                <ListCalendarView
                    initialSelectedDate={selectedDate}
                />
            );
        default:
            return null;
        }
    };

    return (

        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#E04031',
                    colorPrimaryHover: '#ff4d4f',
                },
            }}
        >
            <div className="site-calendar-demo-card">
                <div className="calendar-header">
                    <p>HistoryCode </p>
                    <div className="small-square" />
                    <p>КАЛЕНДАР</p>
                </div>
                <div className="calendar-container">{renderView()}</div>
            </div>
        </ConfigProvider>
    );
});

export default CalendarComponent;
