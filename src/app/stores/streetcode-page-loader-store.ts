import { makeAutoObservable } from 'mobx';

import StreetcodeBlock from '@/models/streetcode/streetcode-blocks.model';

export default class StreetcodePageLoaderStore {
    private isBlockFetchedMap = new Map<StreetcodeBlock, boolean>([
        [StreetcodeBlock.MainStreetcode, false],
        [StreetcodeBlock.StreetcodeImage, false],
        [StreetcodeBlock.Text, false],
        [StreetcodeBlock.Facts, false],
        [StreetcodeBlock.TimelineItems, false],
        [StreetcodeBlock.Map, false],
        [StreetcodeBlock.Sources, false],
        [StreetcodeBlock.Partnters, false],
        [StreetcodeBlock.RelatedFigures, false],
    ]);

    private isTransitionEnded = false;

    public constructor() {
        makeAutoObservable(this);
    }

    public addBlockFetched(blockType: StreetcodeBlock) {
        this.isBlockFetchedMap.set(blockType, true);
    }

    public endTransition() {
        this.isTransitionEnded = true;
    }

    public resetLoader() {
        Array.from(this.isBlockFetchedMap.keys()).forEach((key: StreetcodeBlock) => {
            this.isBlockFetchedMap.set(key, false);
        });
        this.isTransitionEnded = false;
    }

    get isPageLoaded():boolean {
        const isAllblocksFetched = Array.from(this.isBlockFetchedMap.values()).every((x) => x);
        return this.isTransitionEnded && isAllblocksFetched;
    }
}
