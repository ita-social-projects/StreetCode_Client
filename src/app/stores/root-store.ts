import { createContext, useContext } from 'react';
import ArtStore from '@stores/art-store';
import AudioStore from '@stores/audio-store';
import FactsStore from '@stores/facts-store';
import ImageStore from '@stores/image-store';
import ModalStore from '@stores/modal-store';
import PartnersStore from '@stores/partners-store';
import RelatedFiguresStore from '@stores/related-figures-store';
import SourcesStore from '@stores/sources-store';
import StreetcodeStore from '@stores/streetcode-store';
import SubtitlesStore from '@stores/subtitles-store';
import TagsStore from '@stores/tags-store';
import TermStore from '@stores/term-store';
import TextStore from '@stores/text-store';
import TimelineitemStore from '@stores/timelineitem-store';
import ToponymStore from '@stores/toponym-store';
import TransactionLinksStore from '@stores/transactions-store';
import VideoStore from '@stores/videos-store';
import CheckBoxStore from './checkbox-store';
import StreetcodeArtStore from './streetcode-art-store';

interface Store {
    modalStore: ModalStore,
    factsStore: FactsStore,
    subtitlesStore: SubtitlesStore,
    tagsStore: TagsStore,
    audiosStore: AudioStore,
    videosStore: VideoStore,
    artsStore: ArtStore
    imagesStore: ImageStore,
    partnersStore: PartnersStore,
    termsStore: TermStore,
    textStore: TextStore,
    timelineItemStore: TimelineitemStore,
    toponymStore: ToponymStore,
    transactionsStore: TransactionLinksStore,
    streetcodesStore: StreetcodeStore,
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
    videosStore: new VideoStore(),
    artsStore: new ArtStore(),
    streetcodeArtStore: new StreetcodeArtStore(),
    imagesStore: new ImageStore(),
    partnersStore: new PartnersStore(),
    termsStore: new TermStore(),
    textStore: new TextStore(),
    timelineItemStore: new TimelineitemStore(),
    toponymStore: new ToponymStore(),
    transactionsStore: new TransactionLinksStore(),
    streetcodesStore: new StreetcodeStore(),
    sourcesStore: new SourcesStore(),
    relatedFiguresStore: new RelatedFiguresStore(),
    checkboxStore: new CheckBoxStore(),
};

const StoreContext = createContext(store);

const useMobx = () => useContext(StoreContext);
export default useMobx;
