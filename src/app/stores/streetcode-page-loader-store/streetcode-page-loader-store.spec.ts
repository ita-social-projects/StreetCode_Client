import StreetcodeBlock from '@/models/streetcode/streetcode-blocks.model';

import StreetcodePageLoaderStore from './streetcode-page-loader-store';

let store: StreetcodePageLoaderStore;
beforeEach(() => {
    store = new StreetcodePageLoaderStore();
});

describe('streetcode-page-loader-store', () => {
    it('sets isPageLoaded to true when all blocks are loaded', () => {
        const blockTypes = Object.values(StreetcodeBlock)
            .filter((value) => typeof value === 'number');

        blockTypes.forEach((block) => store.addBlockFetched(block as StreetcodeBlock));

        expect(store.isPageLoaded).toBe(true);
    });

    it('sets isPageLoaded to false when not all blocks', () => {
        const blockTypes = Object.values(StreetcodeBlock)
            .filter((value) => typeof value === 'number').slice(2);

        blockTypes.forEach((block) => store.addBlockFetched(block as StreetcodeBlock));

        expect(store.isPageLoaded).toBe(false);
    });

    it('resets loader', () => {
        store.addBlockFetched(StreetcodeBlock.MainStreetcode);

        expect(store.getFetchedBlocks()[0]).toBe(StreetcodeBlock.MainStreetcode);

        store.resetLoader();

        expect(store.getFetchedBlocks().length).toBe(0);
    });
});
