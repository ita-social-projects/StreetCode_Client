import { makeAutoObservable } from 'mobx';

export default class NewStreetcodeInfoStore {
    public animationId = 0;

    public blackAndWhiteId = 0;

    public selectedToponyms:string[] = [];

    public constructor() {
        makeAutoObservable(this);
    }

    set AnimationId(id:number) {
        this.animationId = id;
    }

    set BlackAndWhiteId(id:number) {
        this.blackAndWhiteId = id;
    }

    set SelectedToponyms(toponyms:string[]) {
        this.selectedToponyms = toponyms;
    }
}
