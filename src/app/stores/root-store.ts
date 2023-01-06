import { createContext, useContext } from "react";
import SourcesStore from "@stores/sources-store";
import InterestingFactsStore from "@stores/interesting-facts-store";

interface Store {
    sourcesStore: SourcesStore,
    interestingFactsStore: InterestingFactsStore
}

export const store: Store = {
    sourcesStore: new SourcesStore(),
    interestingFactsStore: new InterestingFactsStore()
}

export const StoreContext = createContext(store);

export const useMobx = () => useContext(StoreContext);