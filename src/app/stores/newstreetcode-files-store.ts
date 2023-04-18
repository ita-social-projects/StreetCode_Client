import { makeAutoObservable } from 'mobx';

export default class NewStreetcodeFilesStore {
    public animationId = 0;

    public blackAndWhiteId = 0;

    public constructor() {
        makeAutoObservable(this);
    }

    set AnimationId(id:number) {
        this.animationId = id;
    }

    set BlackAndWhiteId(id:number) {
        this.blackAndWhiteId = id;
    }
}
