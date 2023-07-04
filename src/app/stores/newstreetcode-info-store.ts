import { makeAutoObservable } from 'mobx';

import { ToponymCreateUpdate } from '@/models/toponyms/toponym.model';

export default class NewStreetcodeInfoStore {
    public arUrl: string | null = null;

    public selectedToponyms: ToponymCreateUpdate[] = [];

    public constructor() {
        makeAutoObservable(this);
    }

    set SelectedToponyms(toponyms: ToponymCreateUpdate[]) {
        this.selectedToponyms = toponyms;
    }
}
