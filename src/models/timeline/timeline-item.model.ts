import Streetcode from "@models/streetcode/streetcode-types.model";
import HistoricalContext from "./historical-context.model";

export interface TimelineItem {
    Id: number;
    Date: Date;
    Title: string;
    Description?: string | undefined;
    Streetcodes: Streetcode[];
    HistoricalContexts: HistoricalContext[];
}

export interface Timeline {
    items: TimelineItem[];
}