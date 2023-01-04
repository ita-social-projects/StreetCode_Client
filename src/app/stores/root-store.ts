import { createContext, useContext } from "react";

import SubtitlesStore from "@stores/subtitles-store";
import ModalStore from "@stores/modal-store";
import FactsStore from "@stores/facts-store";

interface Store {
    modalStore: ModalStore,
    factsStore: FactsStore,
    subtitlesStore: SubtitlesStore,
}

export const store: Store = {
    modalStore: new ModalStore(),
    factsStore: new FactsStore(),
    subtitlesStore: new SubtitlesStore(),
}

const StoreContext = createContext(store);

const useMobx = () => useContext(StoreContext);
export default useMobx;