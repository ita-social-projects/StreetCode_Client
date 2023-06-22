import { makeAutoObservable } from 'mobx';
import StatisticRecordApi from '@api/analytics/statistic-record.api';
import { ModelState } from '@models/enums/model-state';

import StatisticRecord, { StatisticRecordUpdate } from '@/models/analytics/statisticrecord.model';

export default class StatisticRecordStore {
    public StatisticRecordMap = new Map<number, StatisticRecord>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (statisticRecords: StatisticRecord[]) => {
        statisticRecords.forEach((item) => {
            this.setItem({ ...item, isPersisted: true, modelState: ModelState.Updated } as StatisticRecordUpdate);
        });
    };

    get getStatisticRecordArray() {
        return Array.from(this.StatisticRecordMap.values());
    }

    get getStatisticRecordArrayToUpdate() {
        return (Array.from(this.StatisticRecordMap.values()) as StatisticRecordUpdate[])
            .map((item: StatisticRecordUpdate) => {
                if (item.modelState === ModelState.Created) {
                    return { ...item,
                             id: 0,
                             streetcodeCoordinate: { ...item.streetcodeCoordinate, id: 0 } };
                }
                return item;
            });
    }

    public addStatisticRecord = (statisticRecord: StatisticRecord) => {
        const statisticRecordToUpdate: StatisticRecordUpdate = {
            ...statisticRecord,
            modelState: ModelState.Created,
        };
        this.setItem(statisticRecordToUpdate);
    };

    public deleteStatisticRecordFromMap = (statisticRecordItemId: number) => {
        const statisticRecord = this.StatisticRecordMap.get(statisticRecordItemId) as StatisticRecordUpdate;
        if (statisticRecord?.isPersisted) {
            const timelineitemToUpdate: StatisticRecordUpdate = {
                ...statisticRecord,
                modelState: ModelState.Deleted,
            };
            this.setItem(timelineitemToUpdate);
        } else {
            this.StatisticRecordMap.delete(statisticRecordItemId);
        }
    };

    public setItem = (statisticRecordItem: StatisticRecord) => {
        this.StatisticRecordMap.set(statisticRecordItem.id, {
            ...statisticRecordItem,
        } as StatisticRecord);
    };

    public fetchStatisticRecordsByStreetcodeId = async (streetcodeId: number) => {
        try {
            const statisticRecords = await StatisticRecordApi.getAllByStreetcodeId(streetcodeId);
            this.setInternalMap(statisticRecords);
        } catch (error: unknown) { /* empty */ }
    };
}
