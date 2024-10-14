import Image from '@models/media/image.model';
import dayjs from 'dayjs';

export interface NewsCreate {
    title: string;
    text: string;
    url: string;
    imageId: number;
    creationDate: dayjs.Dayjs;
}

export interface NewsUpdate extends NewsCreate {
    id: number;
}

export default interface News extends NewsUpdate {
    image?: Image;
}

export interface RandomNews {
    title: string;
    randomNewsUrl: string;
}

export interface NewsWithUrl {
    news: News;
    prevNewsUrl: string;
    nextNewsUrl: string;
    randomNews: RandomNews;
}
