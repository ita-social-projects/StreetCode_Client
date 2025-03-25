import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import CustomCalendarHeader
    from '@features/AdditionalPages/CalendarPage/Calendar/CustomCalendarHeader/CustomCalendarHeader.component';
import { Dayjs } from 'dayjs';

import { Calendar, ConfigProvider } from 'antd/es';
import uk_UA from 'antd/locale/uk_UA';

import ListViewCards from './ListViewCards.component';

interface Props {
    initialSelectedDate?: Dayjs | null;
}

const ListCalendarView: React.FC<Props> = observer(({ initialSelectedDate }) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        if (initialSelectedDate) {
            setSelectedDate(initialSelectedDate);
        }
    }, [initialSelectedDate]);

    const onDateSelect = (date: Dayjs) => {
        setSelectedDate(date);
    };

    const renderCustomHeader = (props: any) => <CustomCalendarHeader {...props} />;

    return (
        <div className="day-view-container-wrapper">
            <div className="day-view-container">
                <ListViewCards selectedDate={selectedDate} />
                <ConfigProvider locale={uk_UA}>
                    <Calendar
                        fullscreen={false}
                        headerRender={renderCustomHeader}
                        onSelect={onDateSelect}
                        value={selectedDate || undefined}
                    />
                </ConfigProvider>
            </div>
        </div>
    );
});

export default ListCalendarView;
