export default interface CalendarEvent {
    id: number,
    title: string,
    date: string, //dayjs.Dayjs
    type: EventType,
}

export type EventType = 'default' | 'birthday' | 'timelineItem' | 'custom' ;