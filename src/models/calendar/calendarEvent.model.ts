import dayjs from "dayjs";

export default interface CalendarEvent {
    id: number,
    title: string,
    description?: string,
    date: dayjs.Dayjs, 
    type: EventType,
}

export type EventType = 'historical' | 'custom' ;