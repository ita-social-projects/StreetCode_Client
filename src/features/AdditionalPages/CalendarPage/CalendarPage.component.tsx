import React from "react";
import CalendarComponent from "../../../app/common/components/Calendar/Calendar.component";
import './CalendarPage.styles.scss';

const CalendarPage: React.FC = () => {
  return (
    <div className='calendarPage'>
      <CalendarComponent />
    </div>
  );
};

export default CalendarPage;
