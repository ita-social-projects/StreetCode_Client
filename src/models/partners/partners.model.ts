import Url from '@models/additional-content/url.model';
import Image from '@models/media/image.model';

// eslint-disable-next-line no-restricted-imports
import { StreetcodeShort } from '../streetcode/streetcode-types.model';

export default interface Partner {
    id: number;
    isKeyPartner: boolean;
    isVisibleEverywhere: boolean;
    title: string;
    description?: string | undefined;
    logoId: number;
    logo?:Image;
    targetUrl?: Url;
    partnerSourceLinks: PartnerSourceLink[];
    streetcodes:StreetcodeShort[];
}
export interface PartnerShort {
    id: number;
    title: string;
}
export interface PartnerCreateUpdate {
    id: number;
    isKeyPartner: boolean;
    isVisibleEverywhere: boolean;
    title: string;
    description?: string | undefined;
    logoId: number;
    targetUrl: string;
    urlTitle:string;
    partnerSourceLinks:PartnerSourceLinkCreateUpdate[];
    streetcodes:StreetcodeShort[];
}
export interface PartnerSourceLinkCreateUpdate {
    id: number;
    targetUrl: string;
    logoType: number;
}
export interface PartnerSourceLink {
    id: number;
    targetUrl: Url;
    logoType: number;
}
export enum LogoType {
    twitter = 0,
    instagram = 1,
    facebook = 2,
    youtube = 3,
}
