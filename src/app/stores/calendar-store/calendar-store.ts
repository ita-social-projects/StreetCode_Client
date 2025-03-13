import { makeAutoObservable } from 'mobx';
import eventsApi from '@api/events/events.api';
import dayjs from 'dayjs';

import {
    CalendarEvent,
    CreateCalendarEvent,
    EventType,
} from '@/models/calendar/calendarEvent.model';
import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class CalendarStore {
    events: CalendarEvent[] = [];

    private defaultPageSize = 10;

    public CurrentPage = 1;

    private paginationInfo: PaginationInfo = {
        PageSize: this.defaultPageSize,
        TotalPages: 1,
        TotalItems: 1,
        CurrentPage: 1,
    };

    constructor() {
        makeAutoObservable(this);
    }

    public setCurrentPage(currPage: number) {
        this.paginationInfo.CurrentPage = currPage;
    }

    public set PaginationInfo(paginationInfo: PaginationInfo) {
        this.paginationInfo = paginationInfo;
    }

    public get PaginationInfo(): PaginationInfo {
        return this.paginationInfo;
    }

    fetchAllEvents = async (eventType?: EventType, pageSize?: number) => {
        try {
            const response = await eventsApi.getAll(
                eventType,
                this.PaginationInfo.CurrentPage,
                pageSize ?? this.paginationInfo.PageSize,
            );

            this.paginationInfo.TotalItems = response.totalAmount;

            this.events = response.events;
        } catch (error: unknown) {
            console.error('Failed to fetch events:', error);
        }
    };

    fetchAllEventsShort = async () => {
        try {
            this.events = await eventsApi.getAllShort();
        } catch (error: unknown) {
            console.error('Failed to fetch events short:', error);
        }
    };

    getEventById = async (eventId: number) => {
        try {
            const response = await eventsApi.getById(eventId.toString());
            return response;
        } catch (error: unknown) {
            console.error('Failed to fetch event:', error);
        }
    };

    addEvent = async (event: CreateCalendarEvent) => {
        try {
            await eventsApi.create(event);
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    };

    updateEvent = async (event: CalendarEvent) => {
        try {
            await eventsApi.update(event);
        } catch (error) {
            console.error('Failed to update event:', error);
        }
    };

    removeEvent = async (eventId: number) => {
        try {
            await eventsApi.delete(eventId.toString());
            this.events = this.events.filter((event) => event.id !== eventId);
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    getEventsByDate(date: string): CalendarEvent[] {
        return this.events
            .filter((event) => {
                const eventDate = dayjs(event.date).format('MM-DD');
                return eventDate === date;
            })
            .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
    }
}
