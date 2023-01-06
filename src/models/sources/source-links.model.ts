import Url from 'models/additional-content/url.model';
import Image from 'models/media/image.model';

export interface SourceLinkCategory {
    id: number;
    title: string;
    image?: Image | undefined;
    imageId: number;
    sourceLinks: SourceLink[];
}

export interface SourceLink {
    id: number;
    url?: Url | undefined;
    streetcodeId: number;
}
