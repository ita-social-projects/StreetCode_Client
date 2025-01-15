import CalendarEvent from '@/models/calendar/calendarEvent.model';
import { makeAutoObservable } from 'mobx';

class CalendarStore {
    events: CalendarEvent[] = [];

    constructor() {
        makeAutoObservable(this);
        this.initializeStubEvents();
    }

    addEvent(event: CalendarEvent) {
        this.events.push(event);
    }

    removeEvent(eventId: number) {
        this.events = this.events.filter((event) => event.id !== eventId);
    }

    getEventsByDate(date: string): CalendarEvent[] {
        return this.events.filter(event => event.date === date);
    }

    initializeStubEvents() {
        this.events = [
            {
                id: 1,
                title: 'День народження Коненка',
                date: '2025-01-10',
                type: 'birthday',
            },
            {
                id: 2,
                title: 'Повстання армії',
                date: '2025-01-10',
                type: 'timelineItem',
            },
            {
                id: 3,
                title: 'Лекція з історії',
                date: '2025-01-10',
                type: 'custom',
            },
            {
                id: 4,
                title: 'Важлива історична подія',
                date: '2025-01-25',
                type: 'timelineItem',
            },
            {
                id: 5,
                title: 'Дата смерті відомого письменника',
                date: '2025-02-01',
                type: 'timelineItem',
            },
            {
                id: 6,
                title: 'Лекція з історії',
                date: '2025-01-10',
                type: 'custom',
            },
        ];
    }
}

export const calendarStore = new CalendarStore();