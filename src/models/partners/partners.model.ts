import Url from '@models/additional-content/url.model';

export default interface Partner {
    id: number;
    isKeyPartner: boolean;
    title: string;
    description?: string | undefined;
    logoId: number;
    targetUrl: Url;
    partnerSourceLinks: PartnerSourceLink[];
}

export enum LogoType {
    Facebook = '@assets/images/partners/facebook.png',
    Instagram = '@assets/images/partners/instagram.png',
    Twitter = '@assets/images/partners/twitter.png',
    YouTube = '@assets/images/partners/youtube.png',
}

export interface PartnerSourceLink {
    id: number;
    targetUrl: Url;
    logoType: number;
}
