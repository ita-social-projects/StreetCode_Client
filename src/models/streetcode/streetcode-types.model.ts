import Subtitle from '@models/additional-content/subtitles.model';
import Tag from '@models/additional-content/tag.model';
import Art from '@models/media/art.model';
import Audio from '@models/media/audio.model';
import Image from '@models/media/image.model';
import Video from '@models/media/video.model';
import StreetcodePartner, { PartnerShort } from '@models/partners/partners.model';
import { SourceLink } from '@models/sources/sources.model';
import RelatedFigure from '@models/streetcode/related-figure.model';
import TimelineItem from '@models/timeline/chronology.model';
import Toponym from '@models/toponyms/toponym.model';
import TransactionLink from '@models/transactions/transaction-link.model';

import { VideoCreate } from '../map/media/video.model';

import { Fact, FactCreate } from './text-contents.model';

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
    index: number;
    firstName: string | undefined,
    lastName: string | undefined,
    title: string,
    teaser: string;
    alias?: string;
    transliterationUrl: string;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
    eventStartOrPersonBirthDate: Date;
    eventEndOrPersonDeathDate: Date;
    audio?: Audio | undefined;
    tags: Tag[];
    type: StreetcodeType;
    images: Image[];
    textTitle: string | undefined;
    text: string | undefined;
    video: VideoCreate
    facts: FactCreate[];
    timelineItems: TimelineItem[];
    partners: PartnerShort[];
}
