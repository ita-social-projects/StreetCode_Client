import { makeAutoObservable, runInAction } from 'mobx';
import timelineApi from '@api/timeline/timeline.api';
import TimelineItem, { TimelineItemUpdate } from '@models/timeline/chronology.model';

export default class TimelineStore {
    public timelineItemMap = new Map<number, TimelineItem>();

    public timelineItemMapToUpdate = new Map<number, TimelineItemUpdate>();

    public activeYear: number | null = null;

    public constructor() {
        makeAutoObservable(this);
    }

    public addTimeline = (timelineItem: TimelineItem) => {
        this.setItem(timelineItem);

        const timelineitemToUpdate: TimelineItemUpdate = {
            ...timelineItem,
            id: 0,
            isDeleted: false,
        };

        this.timelineItemMapToUpdate.set(timelineItem.id, timelineitemToUpdate);
    };

    public deleteTimelineFromMap = (timelineItemId: number) => {
        this.timelineItemMap.delete(timelineItemId);
        const timelineItem = this.timelineItemMapToUpdate.get(timelineItemId);
        if (timelineItem && timelineItem.isPersisted) {
            this.timelineItemMapToUpdate.set(timelineItemId, {
                ...timelineItem,
                isDeleted: true,
            });
        } else {
            this.timelineItemMapToUpdate.delete(timelineItemId);
        }
    };

    private setInternalMap = (timelineItems: TimelineItem[]) => {
        timelineItems.forEach(this.setItem);

        this.timelineItemMap.forEach((item) => {
            this.timelineItemMapToUpdate.set(item.id, {
                ...item,
                isPersisted: true,
            });
        });
    };

    private setItem = (timelineItem: TimelineItem) => {
        this.timelineItemMap.set(timelineItem.id, {
            ...timelineItem,
            date: new Date(timelineItem.date),
        } as TimelineItem);
    };

    public setActiveYear = (year: number | null) => {
        this.activeYear = year;
    };

    get getTimelineItemArray() {
        return Array.from(this.timelineItemMap.values())
            .sort((prev, cur) => Number(prev.date) - Number(cur.date));
    }

    get getTimelineItemArrayToUpdate() {
        return Array.from(this.timelineItemMapToUpdate.values())
            .sort((prev, cur) => Number(prev.date) - Number(cur.date));
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
        } catch (error: unknown) {}
    };

    public createTimelineItem = async (timelineItem: TimelineItem) => {
        try {
            await timelineApi.create(timelineItem);
            this.setItem(timelineItem);
        } catch (error: unknown) {}
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
        } catch (error: unknown) {}
    };

    public deleteTimelineItem = async (timelineItemId: number) => {
        try {
            await timelineApi.delete(timelineItemId);
            runInAction(() => {
                this.timelineItemMap.delete(timelineItemId);
            });
        } catch (error: unknown) {}
    };
}
