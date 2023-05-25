import { makeAutoObservable } from 'mobx';

export default class StreetcodePageLoaderStore {
    public loadedBlocks = 0;

    public readonly allBlocks = 4;

    public constructor() {
        makeAutoObservable(this);
    }

    public addBlockFetched() {
        this.loadedBlocks += 1;
    }

    get isPageLoaded():boolean {
        return this.loadedBlocks >= this.allBlocks;
    }
}
