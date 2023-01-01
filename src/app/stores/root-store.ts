import { createContext, useContext } from "react";
import SourcesStore from "@stores/sources-store";

interface Store {
    sourcesStore: SourcesStore,
}

export const store: Store = {
    sourcesStore: new SourcesStore(),
}

export const StoreContext = createContext(store);

export const useMobx = () => useContext(StoreContext);