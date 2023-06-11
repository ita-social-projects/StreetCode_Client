import { makeAutoObservable } from 'mobx';

import { ToponymCreateUpdate } from '@/models/toponyms/toponym.model';

export default class NewStreetcodeInfoStore {
    public animationId: number | null = null;

    public blackAndWhiteId: number | null = null;

    public relatedFigureId: number | null = null;

    public audioId: number | null = null;

    public arUrl: string | null = null;

    public selectedToponyms: ToponymCreateUpdate[] = [];

    public constructor() {
        makeAutoObservable(this);
    }

    set AnimationId(id:number) {
        this.animationId = id;
    }

    set BlackAndWhiteId(id:number) {
        this.blackAndWhiteId = id;
    }

    set SelectedToponyms(toponyms: ToponymCreateUpdate[]) {
        this.selectedToponyms = toponyms;
    }
}
