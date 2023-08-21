import Url from '@models/additional-content/url.model';
import Image from '@models/media/image.model';

export default interface TeamMember {
    id: number;
    isMain: boolean;
    firstName: string;
    lastName: string;
    description?: string | undefined;
    imageId: number;
    image?: Image;
    teamMemberLinks: TeamMemberLinkCreateUpdate[];
    positions: Positions[];
}
export interface TeamCreateUpdate {
    id: number;
    isMain: boolean;
    firstName: string;
    lastName: string;
    description?: string | undefined;
    imageId: number;
    teamMemberLinks: TeamMemberLinkCreateUpdate[];
    positions: Positions[];
}
export interface TeamMemberLinkCreateUpdate {
    id: number;
    targetUrl: string;
    logoType: number;
}
export interface TeamMemberLink {
    id: number;
    targetUrl: Url;
    logoType: number;
}
export interface Positions {
    id: number;
    position: string;
}
export enum LogoType {
    twitter = 0,
    instagram = 1,
    facebook = 2,
    youtube = 3,
}
