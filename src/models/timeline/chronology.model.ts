import dayjs, { Dayjs } from 'dayjs';

export interface HistoricalContext {
    id: number;
    title: string;
    isDeleted?: boolean,
}
export enum DateViewPattern {
    DateMonthYear,
    MonthYear,
    SeasonYear,
    Year,
}

export default interface TimelineItem {
    id: number;
    date: Date;
    dateViewPattern:DateViewPattern,
    title: string;
    description?: string | undefined;
    historicalContexts: HistoricalContext[];
}

export interface TimelineItemUpdate extends TimelineItem {
    isDeleted?: boolean,
    isPersisted?: boolean,
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
export const selectDateOptions = [{
    value: 'date',
    label: 'Рік-місяць-день',
}, {
    value: 'month',
    label: 'Рік-місяць',
}, {
    value: 'year',
    label: 'Рік',
}, {
    value: 'season-year',
    label: 'Рік-пора',
}];
export const dateTimePickerTypes = ['date', 'month', 'season-year', 'year'];

export const dateToString = (typeDate:'date' | 'month' | 'year' | 'season-year', date: Dayjs | null):string => {
    dayjs.locale('uk');
    if (!date) {
        return '';
    }
    if (typeDate === 'date') {
        return date.format('D MMMM YYYY');
    }
    if (typeDate === 'month') {
        return date.format('MMMM YYYY');
    }
    const year = date.format('YYYY');
    if (typeDate === 'year') {
        return year;
    }
    return `${getSeason(date)} ${year}`;
};