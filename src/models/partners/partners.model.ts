import Url from '@models/additional-content/url.model';
import Image from '@models/media/image.model';
import Streetcode from '@models/streetcode/streetcode-types.model';

export default interface Partner {
    id: number;
    image: Image;
    url: Url;
    logoUrl: string | undefined;
    description?: string | undefined;
    partnerSourceLinks: PartnerSourceLink[];
    streetcodePartner: StreetcodePartner[];
}

export interface StreetcodePartner {
    isSponsor: boolean;
    streetcodeId: number;
    partnerId: number;
    partner: Partner;
    streetcode?: Streetcode | undefined;
}

export interface PartnerSourceLink {
    id: number;
    url: Url;
    logoUrl: string;
    partner: Partner;
    partnerId: number;
}
