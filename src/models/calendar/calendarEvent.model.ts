import dayjs from "dayjs";

export default interface CalendarEvent {
    id: number,
    title: string,
    description?: string,
    date: dayjs.Dayjs, 
    eventType: EventType | number,
}

export type EventType = 'historical' | 'custom' ;

export function mapEventType(type: number): EventType {
    switch(type) {
        case 0: return 'historical';
        case 1: return 'custom';
        default: return 'custom';
    }
};