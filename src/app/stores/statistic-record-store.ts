import { makeAutoObservable } from 'mobx';

import StatisticRecord from '@/models/analytics/statisticrecord.model';

export default class StatisticRecordStore {
    public setStatisticRecordMap = new Map<number, StatisticRecord>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setStatisticRecordItem = (statisticRecord: StatisticRecord) => {
        this.setStatisticRecordMap.set(statisticRecord.id, statisticRecord);
    };

    private set setInternalStatisticRecordMap(statisticRecord: StatisticRecord[]) {
        statisticRecord.forEach(this.setStatisticRecordItem);
    }

    get getStatisticRecordArray() {
        return Array.from(this.setStatisticRecordMap.values());
    }

    public addStatisticRecord = (statisticRecord: StatisticRecord) => {
        this.setItem(statisticRecord);
    };

    private setItem = (statisticRecordItem: StatisticRecord) => {
        this.setStatisticRecordMap.set(statisticRecordItem.id, {
            ...statisticRecordItem,
        } as StatisticRecord);
    };

    public deleteStatisticRecordFromMap = (statisticRecordItemId: number) => {
        this.setStatisticRecordMap.delete(statisticRecordItemId);
    };
}
