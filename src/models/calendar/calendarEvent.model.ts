import dayjs from 'dayjs';
import { StreetcodeShort } from '../streetcode/streetcode-types.model';

export default interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  date: dayjs.Dayjs;
  eventType: EventType | number;
  location?: string;
  organizer?: string;
  timelineItemId?: number;
  streetcodes?: StreetcodeShort[];
}

export default interface CreateCalendarEvent {
  title: string;
  description?: string;
  date: dayjs.Dayjs;
  eventType: EventType | number;
  location?: string;
  organizer?: string;
  timelineItemId?: number;
  streetcodeIds?: number[];
}

export type EventType = 'historical' | 'custom';

export function mapEventTypeToStr(type: number): EventType {
  switch (type) {
    case 0:
      return 'historical';
    case 1:
      return 'custom';
    default:
      return 'custom';
  }
}

export function mapEventTypeToNum(type: EventType | string): number {
  switch (type) {
    case 'historical':
      return 0;
    case 'custom':
      return 1;
    default:
      return 0;
  }
}
