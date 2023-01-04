import { createContext, useContext } from "react";

import SubtitlesStore from "@stores/subtitles-store";
import ModalStore from "@stores/modal-store";

interface Store {
    modalStore: ModalStore,
    subtitlesStore: SubtitlesStore
}

export const store: Store = {
    modalStore: new ModalStore(),
    subtitlesStore: new SubtitlesStore(),
}

const StoreContext = createContext(store);

const useMobx = () => useContext(StoreContext);
export default useMobx;