import StreetcodeBlock from '@/models/streetcode/streetcode-blocks.model';

import StreetcodePageLoaderStore from './streetcode-page-loader-store';

let store: StreetcodePageLoaderStore;
beforeEach(() => {
    store = new StreetcodePageLoaderStore();
});

describe('streetcode-page-loader-store', () => {
    it('sets isPageLoaded to true when all blocks are loaded and transition is ended', () => {
        store.endTransition();

        const blockTypes = Object.values(StreetcodeBlock)
            .filter((value) => typeof value === 'number');

        blockTypes.forEach((block) => store.addBlockFetched(block as StreetcodeBlock));

        expect(store.isPageLoaded).toBe(true);
    });

    it('sets isPageLoaded to false when not all blocks are loaded and transition is ended', () => {
        store.endTransition();

        const blockTypes = Object.values(StreetcodeBlock)
            .filter((value) => typeof value === 'number').slice(2);

        blockTypes.forEach((block) => store.addBlockFetched(block as StreetcodeBlock));

        expect(store.isPageLoaded).toBe(false);
    });

    it('sets isPageLoaded to false when all blocks but transition has not ended', () => {
        const blockTypes = Object.values(StreetcodeBlock)
            .filter((value) => typeof value === 'number');

        blockTypes.forEach((block) => store.addBlockFetched(block as StreetcodeBlock));

        expect(store.isPageLoaded).toBe(false);
    });

    it('resets loader', () => {
        store.endTransition();
        store.addBlockFetched(StreetcodeBlock.MainStreetcode);

        expect(store.getFetchedBlocks()[0]).toBe(StreetcodeBlock.MainStreetcode);
        expect(store.isTransitionFinished).toBe(true);

        store.resetLoader();

        expect(store.getFetchedBlocks().length).toBe(0);
        expect(store.isTransitionFinished).toBe(false);
    });
});
