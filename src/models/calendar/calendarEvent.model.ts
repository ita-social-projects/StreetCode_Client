import dayjs from 'dayjs';
import { StreetcodeShort } from '../streetcode/streetcode-types.model';

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  date: dayjs.Dayjs;
  eventType: EventType;
  location?: string;
  organizer?: string;
  timelineItemId?: number;
  streetcodes?: StreetcodeShort[];
}

export interface CreateCalendarEvent {
  title: string;
  description?: string;
  date: dayjs.Dayjs;
  eventType: EventType;
  location?: string;
  organizer?: string;
  timelineItemId?: number;
  streetcodeIds?: number[];
}

export interface UpdateCalendarEvent {
  id: number;
  title: string;
  description?: string;
  date: dayjs.Dayjs;
  eventType: EventType;
  location?: string;
  organizer?: string;
  timelineItemId?: number;
  streetcodeIds?: number[];
}

export type EventType = 'Historical' | 'Custom';
