export default interface Tag {
    id: number;
    title: string;
}
export interface TagCreate {
    title: string;
}

export interface StreetcodeTag {
    id: number;
    title: string;
    isVisible: boolean;
    index?: number;
}
