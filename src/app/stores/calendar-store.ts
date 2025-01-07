import CalendarEvent from '@/models/calendar/calendarEvent.model';
import { makeAutoObservable } from 'mobx';

class CalendarStore {
    events: CalendarEvent[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    addEvent(event: CalendarEvent) {
        this.events.push(event);
    }

    removeEvent(eventId: number) {
        this.events = this.events.filter((event) => event.id !== eventId);
    }
}

export const calendarStore = new CalendarStore();