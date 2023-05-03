import { makeAutoObservable, runInAction } from 'mobx';
import StatisticRecord from '@/models/analytics/analytics/statisticrecord.model';
import StatisticRecordApi from '../api/analytics/statistic-record.api';

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

    // public createStreetcodeCoordinate = async (statisticRecord: StatisticRecord, streetcodeId: number) => {
    //     try {
    //         const newStreetcodeCoordinate = await StatisticRecordApi.create(streetcodeCoordinate);
    //         this.setStatisticRecordItem(newStreetcodeCoordinate);
    //     } catch (error: unknown) {
    //         console.log(error);
    //     }
    // };

    // public updateStreetcodeCoordinate = async (statisticRecord: StatisticRecord) => {
    //     try {
    //         await StatisticRecordApi.update(statisticRecord);
    //         runInAction(() => {
    //             this.setStatisticRecordItem(statisticRecord);
    //         });
    //     } catch (error: unknown) {
    //         console.log(error);
    //     }
    // };

    // public deleteStreetcodeCoordinate = async (StatisticRecordId: number) => {
    //     try {
    //         await StatisticRecordApi.delete(StatisticRecordId);
    //         runInAction(() => {
    //             this.setStatisticRecordMap.delete(StatisticRecordId);
    //         });
    //     } catch (error: unknown) {
    //         console.log(error);
    //     }
    // };
}