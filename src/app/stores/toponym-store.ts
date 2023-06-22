import { makeAutoObservable } from 'mobx';
import ToponymsApi from '@api/map/toponyms.api';

import Toponym from '@/models/toponyms/toponym.model';

export default class ToponymStore {
    public toponyms: Toponym[] = [];

    public loaded = false;

    public constructor() {
        makeAutoObservable(this);
    }

    private setToponyms = (newToponyms: Toponym[]) => {
        this.toponyms.splice(0, this.toponyms.length);
        newToponyms.forEach((t) => this.toponyms.push(t));
    };

    public fetchToponymByStreetcodeId = async (streetcodeId: number)
    : Promise<Toponym[]> => {
        this.loaded = true;
        return ToponymsApi.getByStreetcodeId(streetcodeId).then((res) => {
            this.setToponyms(res);
            return res;
        });
    };
}
