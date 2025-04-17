import './CalendarPage.styles.scss';

import React from 'react';
import { Helmet } from 'react-helmet';

import CalendarComponent from './Calendar/Calendar.component';
import { CalendarProvider } from './Calendar/CalendarContext/CalendarContext.component';

const CalendarPage: React.FC = () => (
    <CalendarProvider>
        <div className="calendarPageWrapper">
            <Helmet>
                <title>Календар | Historycode</title>
            </Helmet>
            <div className="calendarPage">
                <CalendarComponent />
            </div>
        </div>
    </CalendarProvider>
);

export default CalendarPage;
