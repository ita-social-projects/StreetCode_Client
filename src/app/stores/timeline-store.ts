import { makeAutoObservable, runInAction } from 'mobx';
import timelineApi from '@api/timeline/timeline.api';
import { ModelState } from '@models/enums/model-state';
import TimelineItem, { HistoricalContextUpdate, TimelineItemUpdate } from '@models/timeline/chronology.model';

export default class TimelineStore {
    public timelineItemMap = new Map<number, TimelineItem>();

    public activeYear: number | null = null;

    public constructor() {
        makeAutoObservable(this);
    }

    public addTimeline = (timelineItem: TimelineItem) => {
        const timelineitemToUpdate: TimelineItemUpdate = {
            ...timelineItem,
            modelState: ModelState.Created,
            historicalContexts: timelineItem.historicalContexts as HistoricalContextUpdate[],
        };

        this.setItem(timelineitemToUpdate);
    };

    public deleteTimelineFromMap = (timelineItemId: number) => {
        const timelineItem = this.timelineItemMap.get(timelineItemId) as TimelineItemUpdate;
        if (timelineItem && timelineItem.isPersisted) {
            const timelineitemToUpdate: TimelineItemUpdate = {
                ...timelineItem,
                modelState: ModelState.Deleted,
            };
            this.setItem(timelineitemToUpdate);
        } else {
            this.timelineItemMap.delete(timelineItemId);
        }
    };

    private setInternalMap = (timelineItems: TimelineItem[]) => {
        this.timelineItemMap.clear();
        timelineItems.forEach((item) => {
            const updatedContexts = item.historicalContexts.map((context) => {
                const updatedContext = {
                    ...context,
                    isPersisted: true,
                };
                return updatedContext as HistoricalContextUpdate;
            });

            const updatedItem = {
                ...item,
                isPersisted: true,
                historicalContexts: updatedContexts,
            };

            this.setItem(updatedItem);
        });
    };

    private setItem = (timelineItem: TimelineItem) => {
        this.timelineItemMap.set(timelineItem.id, {
            ...timelineItem,
            date: new Date(timelineItem.date),
        });
    };

    public setActiveYear = (year: number | null) => {
        this.activeYear = year;
    };

    get getTimelineItemArray() {
        return (Array.from(this.timelineItemMap.values()) as TimelineItemUpdate[])
            .filter((item: TimelineItemUpdate) => item.modelState !== ModelState.Deleted)
            .sort((prev, cur) => Number(prev.date) - Number(cur.date));
    }

    get getTimelineItemArrayToCreate() {
        return Array.from(this.timelineItemMap.values()).map((item) => ({
            ...item,
            id: 0,
            historicalContexts: item.historicalContexts
                .map((h) => ({ ...h, id: h.id < 0 ? 0 : h.id })),
        }));
    }

    get getTimelineItemArrayToUpdate() {
        return (Array.from(this.timelineItemMap.values()) as TimelineItemUpdate[]).map((item) => {
            const updatedItem = { ...item };

            if (item.modelState === ModelState.Created) {
                updatedItem.id = 0;
            }
            updatedItem.historicalContexts = item.historicalContexts
                .map((h) => ({ ...h, id: h.id < 0 ? 0 : h.id, timelineId: updatedItem.id }));
            return updatedItem;
        });
    }

    get getYearsArray() {
        return [...new Set(
            Array.from(this.timelineItemMap.values())
                .map((timelineItem) => timelineItem.date.getFullYear()),
        )].sort();
    }

    public fetchTimelineItemsByStreetcodeId = async (streetcodeId: number) => {
        try {
            const timelineItems = await timelineApi.getByStreetcodeId(streetcodeId);
            this.setInternalMap(timelineItems);
        } catch (error: unknown) { /* empty */ }
    };

    public createTimelineItem = async (timelineItem: TimelineItem) => {
        try {
            await timelineApi.create(timelineItem);
            this.setItem(timelineItem);
        } catch (error: unknown) { /* empty */ }
    };

    public updateTimelineItem = async (timelineItem: TimelineItem) => {
        try {
            await timelineApi.update(timelineItem);
            runInAction(() => {
                const updatedTimelineItem = {
                    ...this.timelineItemMap.get(timelineItem.id),
                    ...timelineItem,
                };
                this.setItem(updatedTimelineItem as TimelineItem);
            });
        } catch (error: unknown) { /* empty */ }
    };

    public deleteTimelineItem = async (timelineItemId: number) => {
        try {
            await timelineApi.delete(timelineItemId);
            runInAction(() => {
                this.timelineItemMap.delete(timelineItemId);
            });
        } catch (error: unknown) { /* empty */ }
    };
}
