export interface HistoricalContext {
    id: number;
    title: string;
}
export enum DateViewType {
    Year,
    MonthYear,
    SeasonYear,
    DayMonthYear,
}

export default interface TimelineItem {
    id: number;
    date: Date;
    dateString:string;
    dateViewType:DateViewType,
    title: string;
    description?: string | undefined;
    historicalContexts: HistoricalContext[];
}
