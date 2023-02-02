import { createContext, useContext } from 'react';
import AudioStore from '@stores/audio-store';
import FactsStore from '@stores/facts-store';
import ImageStore from '@stores/image-store';
import ModalStore from '@stores/modal-store';
import PartnersStore from '@stores/partners-store';
import RelatedFiguresStore from '@stores/related-figures-store';
import SourcesStore from '@stores/sources-store';
import SubtitlesStore from '@stores/subtitles-store';
import TagsStore from '@stores/tags-store';
import TermStore from '@stores/term-store';
import TimelineStore from '@stores/timeline-store';

import CheckBoxStore from './checkbox-store';
import StreetcodeArtStore from './streetcode-art-store';

interface Store {
    modalStore: ModalStore,
    factsStore: FactsStore,
    subtitlesStore: SubtitlesStore,
    tagsStore: TagsStore,
    audiosStore: AudioStore,
    imagesStore: ImageStore,
    partnersStore: PartnersStore,
    termsStore: TermStore,
    timelineItemStore: TimelineStore,
    sourcesStore: SourcesStore,
    streetcodeArtStore: StreetcodeArtStore,
    relatedFiguresStore: RelatedFiguresStore,
    checkboxStore: CheckBoxStore,
}

export const store: Store = {
    modalStore: new ModalStore(),
    factsStore: new FactsStore(),
    subtitlesStore: new SubtitlesStore(),
    tagsStore: new TagsStore(),
    audiosStore: new AudioStore(),
    streetcodeArtStore: new StreetcodeArtStore(),
    imagesStore: new ImageStore(),
    partnersStore: new PartnersStore(),
    termsStore: new TermStore(),
    timelineItemStore: new TimelineStore(),
    sourcesStore: new SourcesStore(),
    relatedFiguresStore: new RelatedFiguresStore(),
    checkboxStore: new CheckBoxStore(),
};

const StoreContext = createContext(store);

const useMobx = () => useContext(StoreContext);
export default useMobx;
