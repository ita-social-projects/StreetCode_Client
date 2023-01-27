export default interface Partner {
    id: number;
    title: string;
    logoId: number;
    targetUrl: string;
    description?: string | undefined;
    partnerSourceLinks: PartnerSourceLink[];
}

export interface PartnerSourceLink {
    id: number;
    title: string;
    targetUrl: string;
    logoUrl: string;
    partnerId: number;
}
