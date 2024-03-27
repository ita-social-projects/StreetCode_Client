import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';
import StreetcodeArt, { StreetcodeArtCreateUpdate } from '@models/media/streetcode-art.model';

export default interface StreetcodeArtSlide {
    index: number;
    streetcodeId: number;
    template: number;
    streetcodeArts: StreetcodeArt[];
}

export interface StreetcodeArtSlideAdmin extends IModelState, IPersisted {
    index: number;
    streetcodeArts: StreetcodeArtCreateUpdate[];
    template: number;
    streetcodeId?: number;
}

export interface StreetcodeArtSlideCreateUpdate extends IModelState, IPersisted {
    index: number;
    streetcodeArts: Array<{ artId: number, index: number }>;
    template: number;
    streetcodeId?: number;
}
