import { StreetcodeShort } from '@models/streetcode/streetcode-types.model';
import dayjs from 'dayjs';

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
  dateString?: string;
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
  dateString?: string;
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
