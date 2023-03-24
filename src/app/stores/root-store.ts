import { createContext, useContext } from 'react';
import AudioStore from '@stores/audio-store';
import CheckBoxStore from '@stores/checkbox-store';
import FactsStore from '@stores/facts-store';
import ImageStore from '@stores/image-store';
import ModalStore from '@stores/modal-store';
import PartnersStore from '@stores/partners-store';
import RelatedFiguresStore from '@stores/related-figures-store';
import RelatedTermsStore from '@stores/related-terms-store';
import SourcesStore from '@stores/sources-store';
import StreetcodeArtStore from '@stores/streetcode-art-store';
import StreetcodeStore from '@stores/streetcode-current-store';
import SubtitlesStore from '@stores/subtitles-store';
import TagsStore from '@stores/tags-store';
import TermStore from '@stores/term-store';
import TimelineStore from '@stores/timeline-store';

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
    streetcodeStore: StreetcodeStore,
    relatedFiguresStore: RelatedFiguresStore,
    checkboxStore: CheckBoxStore,
    relatedTermStore: RelatedTermsStore,
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
    relatedTermStore: new RelatedTermsStore(),
    streetcodeStore: new StreetcodeStore(),
};

const StoreContext = createContext(store);

const useMobx = () => useContext(StoreContext);
export default useMobx;
