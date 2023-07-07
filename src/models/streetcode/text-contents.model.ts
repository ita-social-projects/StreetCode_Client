import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';
import Image, { ImageCreate } from '@models/media/image.model';

import Streetcode from './streetcode-types.model';

export interface Fact {
  id: number;
  title: string;
  factContent: string;
  image?: Image;
  imageId: number;
}
export interface FactCreate extends Fact {
  imageDescription?: string
}
export interface FactUpdate extends FactCreate, IModelState, IPersisted {
    streetcodeId?: number;
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
  additionalText?: string;
  streetcodeId: number;
  streetcode?: Streetcode | undefined;
  link: string | undefined;
}

export interface TextCreateUpdate extends IModelState {
  id: number;
  title: string | undefined;
  textContent: string | undefined;
  additionalText?: string;
  streetcodeId?: number | null;
}
