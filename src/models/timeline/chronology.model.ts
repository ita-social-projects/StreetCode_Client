export interface HistoricalContext {
    id: number;
    title: string;
}

export default interface TimelineItem {
    id: number;
    date: Date;
    title: string;
    description?: string | undefined;
    historicalContexts: HistoricalContext[];
}
