import React from "react";
import CalendarComponent from "../../../app/common/components/Calendar/Calendar.component";
import './CalendarPage.styles.scss';
import { Helmet } from "react-helmet";

const CalendarPage: React.FC = () => {
  return (
    <div className='calendarPageWrapper'>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
      <div className='calendarPage'>
        <CalendarComponent />
      </div>
    </div>
  );
};

export default CalendarPage;
