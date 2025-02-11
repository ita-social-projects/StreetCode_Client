import { mapEventTypeToStr } from '@/models/calendar/calendarEvent.model';
import {
  CalendarEvent,
  CreateCalendarEvent,
} from '@/models/calendar/calendarEvent.model';
import { PaginationInfo } from '@/models/pagination/pagination.model';
import eventsApi from '@api/events/events.api';
import dayjs from 'dayjs';
import { makeAutoObservable, observable, runInAction } from 'mobx';

export default class CalendarStore {
  events: CalendarEvent[] = [];

  private defaultPageSize = 10;

  public CurrentPage = 1;

  public paginationInfo: PaginationInfo = {
    PageSize: this.defaultPageSize,
    TotalPages: 2,
    TotalItems: 1,
    CurrentPage: 1,
  };

  constructor() {
    makeAutoObservable(this);
  }

  public setCurrentPage(currPage: number) {
    this.paginationInfo.CurrentPage = currPage;
  }

  public get PaginationInfo(): PaginationInfo {
    return this.paginationInfo;
  }

  fetchAllEvents = async (eventType?: number, pageSize?: number) => {
    try {
      const response = await eventsApi.getAll(
        eventType,
        this.PaginationInfo.CurrentPage,
        pageSize ?? this.paginationInfo.PageSize
      );

      this.paginationInfo.TotalItems = response.totalAmount;

      this.events = response.events.map((event) => ({
        ...event,
        eventType: mapEventTypeToStr(Number(event.eventType)),
      }));
    } catch (error: unknown) {
      console.error('Failed to fetch events:', error);
    }
  };

  fetchEventById = async (eventId: number) => {
    try {
      const response = await eventsApi.getById(eventId.toString());
      response.eventType = mapEventTypeToStr(Number(response.eventType));
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
