import CalendarEvent from "@/models/calendar/calendarEvent.model";
import eventsApi from "@api/events/events.api";
import dayjs from "dayjs";
import { makeAutoObservable, runInAction } from "mobx";

class CalendarStore {
  events: CalendarEvent[] = [];

  constructor() {
    makeAutoObservable(this);
    //this.initializeStubEvents();
  }

  fetchAllEvents = async () => {
    try {
      const response = await eventsApi.getAll();
      runInAction(() => {
        this.events = response.events;
      });
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

  // initializeStubEvents() {
  //     this.events = [
  //         {
  //             id: 1,
  //             title: 'День народження Коненка',
  //             date: '2025-01-10T00:00:00',
  //             type: 'historical',
  //         },
  //         {
  //             id: 2,
  //             title: 'Повстання армії',
  //             date: '2025-01-10T00:00:00',
  //             type: 'historical',
  //         },
  //         {
  //             id: 3,
  //             title: 'Лекція з історії',
  //             date: '2025-01-10T00:00:00',
  //             type: 'custom',
  //         },
  //         {
  //             id: 4,
  //             title: 'Важлива історична подія',
  //             date: '2025-01-2T00:00:00',
  //             type: 'historical',
  //         },
  //         {
  //             id: 5,
  //             title: 'Дата смерті відомого письменника',
  //             date: '2025-01-25T00:00:00',
  //             type: 'historical',
  //         },
  //     ];
  // }
}

export const calendarStore = new CalendarStore();
