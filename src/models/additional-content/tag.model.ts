import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';

export default interface Tag {
    id: number;
    title: string;
}
export interface TagCreate {
    title: string;
}

export interface StreetcodeTag {
    id: number;
    title: string;
    isVisible: boolean;
    index?: number;
}

export interface StreetcodeTagUpdate extends StreetcodeTag, IModelState, IPersisted {
    streetcodeId?: number,
}
