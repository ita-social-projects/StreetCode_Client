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

export interface PartnerSourceLink {
    id: number;
    targetUrl: Url;
    logoType: number;
}
