import Image, { ImageCreate } from '@models/media/image.model';

import Streetcode from './streetcode-types.model';

export interface Fact {
    id: number;
    title: string;
    factContent: string;
    image?: Image;
    imageId: number;
}
export interface FactCreate {
    title: string;
    factContent: string;
    image: ImageCreate;
}

export interface Term {
    id: number;
    title: string;
    description?: string | undefined;
}

export interface RelatedTerm {
    id: number;
    word: string;
    termId: number;
}

export interface Text {
    id: number;
    title: string;
    textContent: string;
    аdditionalText?: string;
    streetcodeId: number;
    streetcode?: Streetcode | undefined;
}

export interface TextCreate {
    title: string | undefined;
    textContent: string | undefined;
}
