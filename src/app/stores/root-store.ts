import { createContext, useContext } from 'react';
import ArtGalleryTemplateStore from '@stores/art-gallery-template-store';
import ArtStore from '@stores/art-store';
import AudioStore from '@stores/audio-store';
import CheckBoxStore from '@stores/checkbox-store';
import FactsStore from '@stores/facts-store';
import HistoricalContextStore from '@stores/historicalcontext-store';
import ImageStore from '@stores/image-store';
import ModalStore from '@stores/modal-store';
import PartnersStore from '@stores/partners-store';
import RelatedFiguresStore from '@stores/related-figures-store';
import RelatedTermsStore from '@stores/related-terms-store';
import SourcesAdminStore from '@stores/sourceadmin-store';
import SourcesStore from '@stores/sources-store';
import StreetcodeArtSlideStore from '@stores/streetcode-art-slide-store';
import StreetcodeStore from '@stores/streetcode-current-store';
import StreetcodesCatalogStore from '@stores/streetcodes-catalog-store';
import StreetcodeShortStore from '@stores/streetcodeshort-store';
import SubtitlesStore from '@stores/subtitles-store';
import TagsStore from '@stores/tags-store';
import TermStore from '@stores/term-store';
import TimelineStore from '@stores/timeline-store';
import ContextStore from '@stores/context-store';

import NewsStore from './news-store/news-store';
import CreateUpdateMediaStore from './create-update-media-store';
import NewStreetcodeInfoStore from './newstreetcode-info-store';
import PositionsStore from './position-store';
import SourceCreateUpdateStreetcode from './source-category-store-create';
import StatisticRecordStore from './statistic-record-store';
import StreetcodeCoordinatesStore from './streetcode-coordinates-store';
import StreetcodesMainPageStore from './streetcode-mainpage-store';
import StreetcodePageLoaderStore from './streetcode-page-loader-store';
import StreetcodesByTagStore from './streetcodes-bytag-store';
import TeamStore from './team-store';
import ToponymStore from './toponym-store';

interface Store {
    factsStore: FactsStore,
    subtitlesStore: SubtitlesStore,
    tagsStore: TagsStore,
    audiosStore: AudioStore,
    imagesStore: ImageStore,
    partnersStore: PartnersStore,
    teamStore: TeamStore,
    termsStore: TermStore,
    timelineItemStore: TimelineStore,
    sourcesStore: SourcesStore,
    sourcesAdminStore: SourcesAdminStore
    artStore: ArtStore,
    streetcodeArtSlideStore: StreetcodeArtSlideStore,
    relatedFiguresStore: RelatedFiguresStore,
    checkboxStore: CheckBoxStore,
    relatedTermStore: RelatedTermsStore,
    historicalContextStore: HistoricalContextStore,
    streetcodeCatalogStore: StreetcodesCatalogStore,
    streetcodeShortStore: StreetcodeShortStore,
    newStreetcodeInfoStore: NewStreetcodeInfoStore,
    streetcodeCoordinatesStore: StreetcodeCoordinatesStore,
    sourceCreateUpdateStreetcode: SourceCreateUpdateStreetcode,
    positionsStore: PositionsStore,
    statisticRecordStore: StatisticRecordStore,
    newsStore: NewsStore,
    streetcodeMainPageStore: StreetcodesMainPageStore,
    relatedByTag: StreetcodesByTagStore,
    createUpdateMediaStore: CreateUpdateMediaStore,
    contextStore: ContextStore,
    artGalleryTemplateStore: ArtGalleryTemplateStore,
}

export interface StreetcodeDataStore {
    streetcodeStore: StreetcodeStore,
}
export interface ModalDataStore {
    modalStore: ModalStore,
}

export const store: Store = {
    factsStore: new FactsStore(),
    subtitlesStore: new SubtitlesStore(),
    tagsStore: new TagsStore(),
    audiosStore: new AudioStore(),
    imagesStore: new ImageStore(),
    partnersStore: new PartnersStore(),
    termsStore: new TermStore(),
    teamStore: new TeamStore(),
    timelineItemStore: new TimelineStore(),
    sourcesStore: new SourcesStore(),
    relatedFiguresStore: new RelatedFiguresStore(),
    checkboxStore: new CheckBoxStore(),
    relatedTermStore: new RelatedTermsStore(),
    historicalContextStore: new HistoricalContextStore(),
    streetcodeCatalogStore: new StreetcodesCatalogStore(),
    streetcodeShortStore: new StreetcodeShortStore(),
    newStreetcodeInfoStore: new NewStreetcodeInfoStore(),
    streetcodeCoordinatesStore: new StreetcodeCoordinatesStore(),
    sourceCreateUpdateStreetcode: new SourceCreateUpdateStreetcode(),
    positionsStore: new PositionsStore(),
    sourcesAdminStore: new SourcesAdminStore(),
    statisticRecordStore: new StatisticRecordStore(),
    newsStore: new NewsStore(),
    streetcodeMainPageStore: new StreetcodesMainPageStore(),
    relatedByTag: new StreetcodesByTagStore(),
    createUpdateMediaStore: new CreateUpdateMediaStore(),
    contextStore: new ContextStore(),
    artGalleryTemplateStore: new ArtGalleryTemplateStore(),
    streetcodeArtSlideStore: new StreetcodeArtSlideStore(),
    artStore: new ArtStore(),
};
export const streetcodeDataStore:StreetcodeDataStore = {
    streetcodeStore: new StreetcodeStore(),
};

export const modalDataStore:ModalDataStore = {
    modalStore: new ModalStore(),
};

export const toponymDataStore:ToponymStore = new ToponymStore();
export const streecodePageLoaderStore:StreetcodePageLoaderStore = new StreetcodePageLoaderStore();
export const audioDataStore: AudioStore = new AudioStore();

const streecodePageLoaderContext = createContext(streecodePageLoaderStore);
const streetcodeContext = createContext(streetcodeDataStore);
const modalContext = createContext(modalDataStore);
const toponymContext = createContext(toponymDataStore);
const audioContext = createContext(audioDataStore);

export const useStreetcodeDataContext = () => useContext(streetcodeContext);
export const useModalContext = () => useContext(modalContext);
export const useToponymContext = () => useContext(toponymContext);
export const useStreecodePageLoaderContext = () => useContext(streecodePageLoaderContext);
export const useAudioContext = () => useContext(audioContext);

const StoreContext = createContext(store);

const useMobx = () => useContext(StoreContext);
export default useMobx;
