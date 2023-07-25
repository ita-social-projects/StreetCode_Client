import IModelState from '@models/interfaces/IModelState';
import Streetcode from '@models/streetcode/streetcode-types.model';

export default interface Audio {
    id: number;
    description?: string | undefined;
    blobName: string;
    base64?: string;
    mimeType: string;
    streetcode?: Streetcode | undefined;
}

export interface AudioCreate {
    title?: string ;
    baseFormat: string;
    mimeType: string;
    extension: string;
}

export interface AudioUpdate extends IModelState {
    id: number;
    streetcode?: number | null;
}
