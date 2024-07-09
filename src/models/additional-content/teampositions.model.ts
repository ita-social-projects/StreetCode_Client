import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';

export default interface Position {
    id: number;
    position: string;
}
export interface PositionCreate {
    position: string;
}

export interface StreetcodePosition {
    id: number;
    title: string;
    isVisible: boolean;
    index?: number;
}

export interface StreetcodeTagUpdate extends StreetcodePosition, IModelState, IPersisted {
    streetcodeId?: number,
}
