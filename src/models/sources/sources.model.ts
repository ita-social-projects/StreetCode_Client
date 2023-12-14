import Url from '@models/additional-content/url.model';
import Image from '@models/media/image.model';
import Streetcode from '@models/streetcode/streetcode-types.model';

import IModelState from '../interfaces/IModelState';
import IPersisted from '../interfaces/IPersisted';

export interface SourceLink {
    id: number;
    url?: Url | undefined;
}

export interface SourceCategoryAdmin {
    id?: number;
    title: string;
    imageId: number;
    image?: Image | undefined;
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
    id?:number;
    sourceLinkCategoryId: number;
    streetcodeId:number;
    text?:string;
}

export interface StreetcodeCategoryContentUpdate extends StreetcodeCategoryContent, IModelState, IPersisted {

}
