import { makeAutoObservable } from 'mobx';

import Toponym from '@/models/toponyms/toponym.model';

import ToponymsApi from '../api/map/toponyms.api';

export default class ToponymStore {
    public toponyms: Toponym[] = [];

    public loaded = false;

    public constructor() {
        makeAutoObservable(this);
    }

    public fetchToponymByStreetcodeId = (streetcodeId: number)
    : Promise<Toponym[]> => {
        this.loaded = true;
        return ToponymsApi.getByStreetcodeId(streetcodeId).then((res) => {
            this.toponyms = (res);
            return res;
        });
    };
}
