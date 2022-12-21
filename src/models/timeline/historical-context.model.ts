import { TimelineItem } from "./timeline-item.model";

export default interface HistoricalContext {
    id: number;
    title: string;
    timelineItems: TimelineItem[];
}