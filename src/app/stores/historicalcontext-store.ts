import { makeAutoObservable } from 'mobx';
import HistoricalContextApi from '@api/timeline/historicalcontext.api';
import { HistoricalContext } from '@models/timeline/chronology.model';

export class HistoricalContextStore {
    public historicalContextArray = new Array<HistoricalContext>();

    public constructor() {
        makeAutoObservable(this);
    }

    public fetchHistoricalContextAll = async () => {
        HistoricalContextApi.getAll()
            .then((value) => {
                this.historicalContextArray = value as HistoricalContext[];
            }).catch((error) => {
                console.log(error);
            });
    };

    public addItemToArray = (item: HistoricalContext) => {
        this.historicalContextArray.push(item);
    };
}
export default new HistoricalContextStore();
