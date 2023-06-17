import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';
import dayjs, { Dayjs } from 'dayjs';

export interface HistoricalContext {
    id: number;
    title: string;
}

export interface HistoricalContextUpdate extends HistoricalContext, IModelState, IPersisted {
    timelineId?: number;
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

export interface TimelineItemUpdate extends TimelineItem, IModelState, IPersisted {
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
export const selectDateOptions = [{
    value: 'date',
    label: 'День місяць рік',
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

export const selectDateOptionsforTimeline = [{
    value: 'date',
    label: 'Рік, день місяць',
}, {
    value: 'month',
    label: 'Рік, місяць',
}, {
    value: 'year',
    label: 'Рік',
}, {
    value: 'season-year',
    label: 'Рік, пора(місяць)',
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
