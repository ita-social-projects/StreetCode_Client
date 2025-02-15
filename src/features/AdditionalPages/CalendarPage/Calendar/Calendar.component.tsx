import React, { useRef, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import 'dayjs/locale/uk';
import type { Dayjs } from 'dayjs';
import './Calendar.styles.scss';
import { observer } from 'mobx-react-lite/dist';
import CalendarHeader from './CalendarHeader/CalendarHeader.component';
import dayjs from 'dayjs';
import CalendarView from './CalendarView/CalendarView.component';
import DayView from './DayView/DayView.component';
import useMobx from '@/app/stores/root-store';
import { useQuery } from '@tanstack/react-query';

dayjs.locale('uk');

const CalendarComponent: React.FC = observer(() => {
  const { token } = theme.useToken();
  const { calendarStore } = useMobx();
  const topRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'dayView'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const { isLoading } = useQuery({
    queryKey: ['events', calendarStore.events.length],
    queryFn: () => {
      calendarStore.fetchAllEvents();
    },
  });

  const onDateClick = (date: Dayjs) => {
    if (!selectedDate || !date.isSame(selectedDate, 'date')) {
      setSelectedDate(date);
      setViewMode('dayView');
    }

    executeScroll();
  };

  const handleBackToCalendar = () => {
    const currentLocalDate = dayjs();
    setCurrentMonth(currentLocalDate);

    setSelectedDate(null);
    setViewMode('calendar');

    executeScroll();
  };

  const executeScroll = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderView = () => {
    if (viewMode === 'calendar') {
      return (
        <CalendarView
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          onDateClick={onDateClick}
        />
      );
    }

    if (viewMode === 'dayView' && selectedDate) {
      return (
        <DayView
          selectedDate={selectedDate}
          handleBackToCalendar={handleBackToCalendar}
          onDateClick={onDateClick}
        />
      );
    }

    return null;
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#E04031',
            colorPrimaryHover: '#ff4d4f',
          },
        }}
      >
        <div className='site-calendar-demo-card'>
          <div ref={topRef} className='calendar-header'>
            <CalendarHeader />
          </div>
          <div className='calendar-container'>{renderView()}</div>
        </div>
      </ConfigProvider>
    </>
  );
});

export default CalendarComponent;
