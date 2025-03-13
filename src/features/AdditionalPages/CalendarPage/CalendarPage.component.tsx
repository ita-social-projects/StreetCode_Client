import './CalendarPage.styles.scss';

import React from 'react';
import { Helmet } from 'react-helmet';

import CalendarComponent from './Calendar/Calendar.component';

const CalendarPage: React.FC = () => (
    <div className="calendarPageWrapper">
        <Helmet>
            <title>Calendar</title>
        </Helmet>
        <div className="calendarPage">
            <CalendarComponent />
        </div>
    </div>
);

export default CalendarPage;
