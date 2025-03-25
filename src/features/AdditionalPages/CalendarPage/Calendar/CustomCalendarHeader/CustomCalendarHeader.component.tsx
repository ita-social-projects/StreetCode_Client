import './CustomCalendarHeader.styles.scss';

import React from 'react';
import { useCalendarContext }
    from '@features/AdditionalPages/CalendarPage/Calendar/CalendarContext/CalendarContext.component';
import dayjs, { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';

import { Radio, Row, Select } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';

dayjs.extend(dayLocaleData);

interface Props {
  value: Dayjs;
  onChange: (date: Dayjs) => void;
}

const CustomCalendarHeader: React.FC<Props> = ({
    value,
    onChange,
}) => {
    const { viewMode, setViewMode } = useCalendarContext();
    const start = 0;
    const end = 12;
    const monthOptions = [];

    const viewOptions: CheckboxGroupProps['options'] = [
        { label: 'Календар', value: 'calendar' },
        { label: 'Список', value: 'listView' },
    ];

    let current = value.clone();
    const localeData = value.localeData();
    const months = [];
    for (let i = 0; i < 12; i += 1) {
        current = current.month(i);
        months.push(localeData.monthsShort(current));
    }

    for (let i = start; i < end; i += 1) {
        monthOptions.push(
            <Select.Option key={i} value={i} className="month-item">
                {months[i]}
            </Select.Option>,
        );
    }

    const year = value.year();
    const month = value.month();
    const options = [];
    for (let i = year - 10; i < year + 10; i += 1) {
        options.push(
            <Select.Option key={i} value={i} className="year-item">
                {i}
            </Select.Option>,
        );
    }

    return (
        <div style={{ padding: 8 }}>
            <Row className="calendar-custom-header">
                <Radio.Group
                    options={viewOptions}
                    optionType="button"
                    className="calendar-view-toggle"
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                />
                <Select
                    size="small"
                    popupMatchSelectWidth={false}
                    className="year-select"
                    value={year}
                    onChange={(newYear) => {
                        const now = value.clone().year(newYear);
                        onChange(now);
                    }}
                >
                    {options}
                </Select>
                <Select
                    size="small"
                    popupMatchSelectWidth={false}
                    className="month-select"
                    value={month}
                    onChange={(newMonth) => {
                        const now = value.clone().month(newMonth);
                        onChange(now);
                    }}
                >
                    {monthOptions}
                </Select>
            </Row>
        </div>
    );
};

export default CustomCalendarHeader;
