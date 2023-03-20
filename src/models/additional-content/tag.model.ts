export default interface Tag {
    id: number;
    title: string;
}
export interface TagCreate {
    title: string;
}

export interface TagVisible {
    id: number;
    title: string;
    visible:boolean;
}
