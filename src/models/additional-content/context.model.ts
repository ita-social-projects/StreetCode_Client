import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';

export default interface Context {
    id: number;
    title: string;
}
export interface ContextCreate {
    title: string;
}

export interface StreetcodeContext {
    id: number;
    title: string;
    isVisible: boolean;
    index?: number;
}

export interface StreetcodeContextUpdate extends StreetcodeContext, IModelState, IPersisted {
    streetcodeId?: number,
}
