export default interface Partner {
    id: number;
    title: string;
    logoUrl: string;
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