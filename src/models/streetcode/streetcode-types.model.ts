import Audio from "@models/media/audio.model";
//import { StreetcodeCoordinate } from "@models/additional-content/coordinates.model";
import Art from "@models/media/art.model";
import Image from "@models/media/image.model";
import Tag from "@models/additional-content/tag.model";
import Subtitle from "@models/additional-content/subtitles.model";
import { Fact } from "./text-contents.model";
import Video from "@models/media/video.model";
import { SourceLink } from "@models/sources/sources.model";
import { TimelineItem } from "@models/timeline/timeline-item.model";
import RelatedFigure from "./related-figure.model";
import { StreetcodePartner } from "@models/partners/partners.model";
import Toponym from "@models/toponyms/toponym.model";
import TransactionLink from "@models/transactions/transaction-link.model";

export default interface Streetcode extends EventStreetcode, PersonStreetcode {
    id: number;
    index: number;
    teaser: string;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
    eventStartOrPersonBirthDate: Date;
    eventEndOrPersonDeathDate: Date;
    text: string;
    audio?: Audio | undefined;
    //coordinate?: StreetcodeCoordinate | undefined;
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
    firstName: string;
    lastName: string;
    rank: string;
    streetcode: Streetcode;
}