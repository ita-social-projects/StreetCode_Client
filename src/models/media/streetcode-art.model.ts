import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';

import Art, { ArtCreateUpdate } from './art.model';

export default interface StreetcodeArt {
    index: number;
    streetcodeId: number;
    art: Art;
}

export interface StreetcodeArtCreateUpdate extends IModelState, IPersisted {
    index: number;
    art: ArtCreateUpdate;
    streetcodeId?: number;
}
