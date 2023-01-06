import Streetcode from '@models/streetcode/streetcode-types.model';

export interface HistoricalContext {
    id: number;
    title: string;
    timelineItems: TimelineItem[];
}

export interface TimelineItem {
    id: number;
    date: Date;
    title: string;
    description?: string | undefined;
    streetcodes: Streetcode[];
    historicalContexts: HistoricalContext[];
}

export interface Timeline {
    items: TimelineItem[];
}
