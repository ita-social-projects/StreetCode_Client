import { createContext, useContext } from "react";
import SourcesStore from "@stores/sources-store";
import InterestingFactsStore from "@stores/interesting-facts-store";
import SubtitlesStore from "@stores/subtitles-store";

interface Store {
    sourcesStore: SourcesStore,
    interestingFactsStore: InterestingFactsStore,
    subtitlesStore: SubtitlesStore
}

export const store: Store = {
    sourcesStore: new SourcesStore(),
    interestingFactsStore: new InterestingFactsStore(),
    subtitlesStore: new SubtitlesStore()
}

export const StoreContext = createContext(store);

export const useMobx = () => useContext(StoreContext);