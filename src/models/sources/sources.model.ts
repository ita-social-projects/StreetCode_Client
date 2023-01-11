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
    subCategories: SourceSubCategory[];
}

export interface SourceSubCategory {
    id: number;
    title: string;
    sourceLinkCategoryId: number;
    sourceLinkCategory?: SourceCategory | undefined;
    sourceLinks: SourceLink[];
}
