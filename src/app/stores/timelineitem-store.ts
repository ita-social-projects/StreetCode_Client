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

    public getTimelineItemArray = () => Array.from(this.TimelineItemMap.values());

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
            const TimelineItems = await timelineApi.getAll();
            this.setInternalMap(TimelineItems);
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
