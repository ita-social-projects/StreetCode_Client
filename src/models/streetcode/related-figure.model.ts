import Tag from '@models/additional-content/tag.model';
import Image from '@models/media/image.model';

import IModelState from '../interfaces/IModelState';
import IPersisted from '../interfaces/IPersisted';

export default interface RelatedFigure {
    id: number;
    title: string;
    url: string;
    alias?: string;
    imageId: number;
    image?: Image;
    tags: Tag[];
}
export interface RelatedFigureShort {
    id: number;
    title: string;
}

export interface RelatedFigureUpdate extends IModelState {
    observerId: number;
    targetId: number;
}

export interface RelatedFigureCreateUpdate extends RelatedFigureShort, IModelState, IPersisted {

}
