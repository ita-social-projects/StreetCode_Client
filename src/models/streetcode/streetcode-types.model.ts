import Subtitle from '@models/additional-content/subtitles.model';
import Tag, { TagVisible } from '@models/additional-content/tag.model';
import Art, { IndexedArt } from '@models/media/art.model';
import Audio from '@models/media/audio.model';
import Image, { ImageCreate } from '@models/media/image.model';
import Video, { VideoCreate } from '@models/media/video.model';
import StreetcodePartner, { PartnerShort } from '@models/partners/partners.model';
import { SourceLink } from '@models/sources/sources.model';
import RelatedFigure from '@models/streetcode/related-figure.model';
import TimelineItem from '@models/timeline/chronology.model';
import Toponym from '@models/toponyms/toponym.model';
import TransactionLink from '@models/transactions/transaction-link.model';

import { Fact, FactCreate, TextCreate } from './text-contents.model';

export default interface Streetcode extends EventStreetcode, PersonStreetcode {
    id: number;
    index: number;
    teaser: string;
    alias?: string;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
    eventStartOrPersonBirthDate: Date;
    eventEndOrPersonDeathDate: Date;
    type: StreetcodeType;
    status: Status;
    text: string;
    audio?: Audio | undefined;
    transliterationUrl: string;
    // coordinate?: StreetcodeCoordinate | undefined;
    transactionLink?: TransactionLink | undefined;
    toponyms: Toponym[];
    arts: Art[];
    images: Image[];
    tags: Tag[];
    subtitles: Subtitle[];
    facts: Fact[];
    videos: Video[];
    sourceLinks: SourceLink[];
    timelineItems: TimelineItem[];
    observers: RelatedFigure[];
    targets: RelatedFigure[];
    streetcodePartners: StreetcodePartner[];
}

export interface EventStreetcode {
    title: string;
    streetcode: Streetcode;
}

export interface PersonStreetcode {
    title: string;
    firstName: string;
    lastName: string;
    rank: string;
    streetcode: Streetcode;
}

export enum Status {
    Draft,
    Published,
    Deleted,
}

export enum StreetcodeType {
    Event,
    Person,
}
export interface StreetcodeShort {
    id: number;
    index: number;
    title: string;
}

export interface StreetcodeCatalogRecord {
    id: number,
    title: string,
    url: string,
    imgUrl: string | undefined,
    alias: string | undefined,
}

export interface StreetcodeCreate {
    index: number,
    firstName: string | null,
    lastName: string | null,
    title: string,
    teaser: string,
    alias?: string,
    transliterationUrl: string,
    viewCount: number,
    createdAt: string,
    eventStartOrPersonBirthDate: Date,
    eventEndOrPersonDeathDate: Date,
    dateString: string,
    // audio?: Audio | undefined,
    tags: TagVisible[],
    streetcodeType: StreetcodeType,
    // images: ImageCreate[],
    text: TextCreate | null,
    videos: VideoCreate[],
    // facts: FactCreate[],
    timelineItems: TimelineItem[],
    partners: PartnerShort[],
    // indexedArts: IndexedArt[],
    subTitle: string | null,
    relatedFigures: RelatedFigure[]
}
