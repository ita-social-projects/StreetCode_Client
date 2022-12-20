export interface Fact {
    id: number;
    title: string;
    factContent: string;
    text: string;
    //image: Image;
    //streetcode: Streetcode[];
    imageId?: number | undefined;
}