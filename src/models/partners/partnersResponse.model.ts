import Partner from './partners.model';

export default interface PartnerResponse {
    keyPartners: Partner[];
    otherPartners: Partner[];
}
