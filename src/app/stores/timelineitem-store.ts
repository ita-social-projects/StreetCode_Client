import { makeAutoObservable, runInAction } from 'mobx';
import timelineApi from '@api/timeline/timeline.api';
import TimelineItem from '@models/timeline/chronology.model';

export default class TimelineitemStore {
    public TimelineItemMap = new Map<number, TimelineItem>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (timelineItems: TimelineItem[]) => {
        timelineItems.forEach(this.setItem);
    };

    private setItem = (timelineItem: TimelineItem) => {
        this.TimelineItemMap.set(timelineItem.id, timelineItem);
    };

    public get getTimelineItemArray() {
        return Array.from(this.TimelineItemMap.values());
        // .map((timelineItem) => new Date(timelineItem.date)
        //     .toLocaleDateString('uk-Uk', { year: 'numeric', month: 'long', day: '2-digit' }));
    }

    public get getYearsArray() {
        return [...new Set(
            Array.from(this.TimelineItemMap.values())
                .map((timelineItem) => new Date(timelineItem.date).getFullYear()),
        )].sort();
    }

    public fetchTimelineItem = async (id: number) => {
        try {
            const timelineItem = await timelineApi.getById(id);
            this.setItem(timelineItem);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchTimelineItems = async () => {
        try {
            const timelineItems = await timelineApi.getAll();
            this.setInternalMap(timelineItems);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchTimelineItemsByStreetcodeId = async (streetcodeId: number) => {
        try {
            const timelineItems = await timelineApi.getByStreetcodeId(streetcodeId);
            this.setInternalMap(timelineItems);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createTimelineItem = async (timelineItem: TimelineItem) => {
        try {
            await timelineApi.create(timelineItem);
            this.setItem(timelineItem);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateTimelineItem = async (timelineItem: TimelineItem) => {
        try {
            await timelineApi.update(timelineItem);
            runInAction(() => {
                const updatedTimelineItem = {
                    ...this.TimelineItemMap.get(timelineItem.id),
                    ...timelineItem,
                };
                this.setItem(updatedTimelineItem as TimelineItem);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteTimelineItem = async (timelineItemId: number) => {
        try {
            await timelineApi.delete(timelineItemId);
            runInAction(() => {
                this.TimelineItemMap.delete(timelineItemId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
