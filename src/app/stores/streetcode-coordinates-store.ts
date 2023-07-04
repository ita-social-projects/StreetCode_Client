import { makeAutoObservable, runInAction } from 'mobx';

import StreetcodeCoordinatesApi from '@/app/api/additional-content/streetcode-cooridnates.api';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';

export default class StreetcodeCoordinatesStore {
    public setStreetcodeCoordinateMap = new Map<number, StreetcodeCoordinate>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setStreetcodeCoordinateItem = (streetcodeCoordinate: StreetcodeCoordinate) => {
        this.setStreetcodeCoordinateMap.set(streetcodeCoordinate.id, streetcodeCoordinate);
    };

    private set setInternalStreetcodeCoordinateMap(streetcodeCoordinate: StreetcodeCoordinate[]) {
        this.setStreetcodeCoordinateMap.clear();
        streetcodeCoordinate.forEach(this.setStreetcodeCoordinateItem);
    }

    get getStreetcodeCoordinateArray() {
        return Array.from(this.setStreetcodeCoordinateMap.values());
    }

    public addStreetcodeCoordinate = (streetcodeCoordinate: StreetcodeCoordinate) => {
        this.setItem(streetcodeCoordinate);
    };

    private setItem = (streetcodeCoordinateItem: StreetcodeCoordinate) => {
        this.setStreetcodeCoordinateMap.set(streetcodeCoordinateItem.id, {
            ...streetcodeCoordinateItem,
        } as StreetcodeCoordinate);
    };

    public deleteStreetcodeCoordinateFromMap = (streetcodeCoordinateItemId: number) => {
        this.setStreetcodeCoordinateMap.delete(streetcodeCoordinateItemId);
    };

    public fetchStreetcodeCoordinatesByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalStreetcodeCoordinateMap = await StreetcodeCoordinatesApi.getByStreetcodeId(streetcodeId);
        } catch (error: unknown) { /* empty */ }
    };

    public createStreetcodeCoordinate = async (streetcodeCoordinate: StreetcodeCoordinate, streetcodeId: number) => {
        try {
            const newStreetcodeCoordinate = await StreetcodeCoordinatesApi.create(streetcodeCoordinate);
            this.setStreetcodeCoordinateItem(newStreetcodeCoordinate);
        } catch (error: unknown) { /* empty */ }
    };

    public updateStreetcodeCoordinate = async (streetcodeStreetcodeCoordinate: StreetcodeCoordinate) => {
        try {
            await StreetcodeCoordinatesApi.update(streetcodeStreetcodeCoordinate);
            runInAction(() => {
                this.setStreetcodeCoordinateItem(streetcodeStreetcodeCoordinate);
            });
        } catch (error: unknown) { /* empty */ }
    };

    public deleteStreetcodeCoordinate = async (StreetcodeCoordinateId: number) => {
        try {
            await StreetcodeCoordinatesApi.delete(StreetcodeCoordinateId);
            runInAction(() => {
                this.setStreetcodeCoordinateMap.delete(StreetcodeCoordinateId);
            });
        } catch (error: unknown) { /* empty */ }
    };
}
