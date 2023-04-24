import Url from '@models/additional-content/url.model';
import Image from '@models/media/image.model';
import Streetcode from '@models/streetcode/streetcode-types.model';

export interface SourceLink {
    id: number;
    url?: Url | undefined;
}

export interface SourceCategory {
    id: number;
    title: string;
    imageId: number;
    image?: Image | undefined;
    streetcodeId: number;
    streetcode?: Streetcode | undefined;
    streetcodeCategoryContents: StreetcodeCategoryContent[];
}
export interface SourceCategoryName {
    id: number;
    title: string;
}

export interface StreetcodeCategoryContent {
    sourceLinkCategoryId: number;
    streetcodeId:number;
    text?:string;
}
