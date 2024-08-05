import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';
import dayjs, { Dayjs } from 'dayjs';

export interface HistoricalContext {
  id: number;
  title: string;
}

export interface HistoricalContextUpdate
  extends HistoricalContext,
    IModelState,
    IPersisted {
  timelineId?: number;
}

export enum DateViewPattern {
  DateMonthYear,
  MonthYear,
  SeasonYear,
  Year,
}

export const DateViewPatternToDatePickerType = (
    dateViewPattern: DateViewPattern,
) => {
    switch (dateViewPattern) {
    case DateViewPattern.DateMonthYear:
        return 'date';
    case DateViewPattern.MonthYear:
        return 'month';
    case DateViewPattern.SeasonYear:
        return 'season-year';
    case DateViewPattern.Year:
        return 'year';
    default:
        throw new Error(
            'Function: DateViewPatternToDatePickerType. Error: dateViewPattern.',
        );
    }
};

export default interface TimelineItem {
  id: number;
  date: string;
  dateViewPattern: DateViewPattern;
  title: string;
  description?: string | undefined;
  historicalContexts: HistoricalContext[];
}

export interface TimelineItemUpdate
  extends TimelineItem,
    IModelState,
    IPersisted {
  historicalContexts: HistoricalContextUpdate[];
}

export const getSeason = (date: Dayjs | null): string => {
    if (!date) {
        return '';
    }
    const month = date.month();
    if (month < 2 || month === 11) {
        return 'зима';
    }
    if (month >= 2 && month < 5) {
        return 'весна';
    }
    if (month >= 5 && month < 8) {
        return 'літо';
    }
    return 'осінь';
};
export const selectDateOptions = [
    {
        value: 'date',
        label: 'день-місяць-рік',
    },
    {
        value: 'month',
        label: 'місяць-рік',
    },
    {
        value: 'year',
        label: 'рік',
    },
    {
        value: 'season-year',
        label: 'пора-рік',
    },
];

export const selectDateOptionsforTimeline = [
    {
        value: 'date',
        label: 'Рік, день місяць',
    },
    {
        value: 'month',
        label: 'Рік, місяць',
    },
    {
        value: 'year',
        label: 'Рік',
    },
    {
        value: 'season-year',
        label: 'Рік, пора(місяць)',
    },
];
export const dateTimePickerTypes = ['date', 'month', 'season-year', 'year'];

export enum DatePickerType {
  Date = 'date',
  Month = 'month',
  SeasonYear = 'season-year',
  Year = 'year',
}

export const dateToString = (
    typeDate: DatePickerType,
    date: Dayjs | null,
): string => {
    dayjs.locale('uk');
    if (!date) {
        return '';
    }

    const year = date.format('YYYY').replace(/^0+/, '');

    if (typeDate === DatePickerType.Date) {
        return date.format('D MMMM ').concat(year);
    }
    if (typeDate === DatePickerType.Month) {
        return date.format('MMMM ').concat(year);
    }
    if (typeDate === DatePickerType.Year) {
        return year;
    }
    return `${getSeason(date)} ${year}`;
};
