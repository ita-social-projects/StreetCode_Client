import CalendarEvent, {
  mapEventType,
} from "@/models/calendar/calendarEvent.model";
import { PaginationInfo } from "@/models/pagination/pagination.model";
import eventsApi from "@api/events/events.api";
import dayjs from "dayjs";
import { makeAutoObservable, runInAction } from "mobx";

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

  public get PaginationInfo(): PaginationInfo {
    return this.paginationInfo;
  }

  fetchAllEvents = async (pageSize?: number) => {
    try {
      const response = await eventsApi.getAll(
        this.PaginationInfo.CurrentPage,
        pageSize ?? this.paginationInfo.PageSize
      );

      this.paginationInfo.TotalItems = response.totalAmount;
      this.events = response.events.map((event) => ({
        ...event,
        eventType: mapEventType(Number(event.eventType)),
      }));
    } catch (error: unknown) {
      console.error("Failed to fetch events:", error);
    }
  };

  addEvent(event: CalendarEvent) {
    this.events.push(event);
  }

  removeEvent(eventId: number) {
    this.events = this.events.filter((event) => event.id !== eventId);
  }

  getEventsByDate(date: string): CalendarEvent[] {
    return this.events.filter((event) => {
      const eventDate = dayjs(event.date).format("MM-DD");
      return eventDate === date;
    });
  }
}
