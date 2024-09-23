import { action, makeAutoObservable, observable } from 'mobx';
import { HistoricalContext } from '@models/timeline/chronology.model';
import ContextsApi from '../api/additional-content/contexts.api';

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
            const response = await ContextsApi.getAll().then((resp) => resp.historicalContexts);
            this.setInternalMap(response);
        } catch (error) { /* empty */ }
    };
}
