import { action, makeAutoObservable, observable } from 'mobx';
import HistoricalContextApi from '@api/timeline/historicalcontext.api';
import { HistoricalContext } from '@models/timeline/chronology.model';

export default class HistoricalContextStore {
    public historicalContextArray = new Array<HistoricalContext>();

    public constructor() {
        makeAutoObservable(this, {
            historicalContextArray: observable,
            fetchHistoricalContextAll: action,
            addItemToArray: action,

        });
    }

    private setInternalMap = (historicalcontext: HistoricalContext[]) => {
        this.historicalContextArray = [];
        historicalcontext.forEach((item) => {
            this.addItemToArray(item);
        });
    };

    public addItemToArray = (item: HistoricalContext) => {
        this.historicalContextArray.push(item);
    };

    public fetchHistoricalContextAll = async () => {
        try {
            const response = await HistoricalContextApi.getAll();
            this.setInternalMap(response);
        } catch (error) { /* empty */ }
    };
}
