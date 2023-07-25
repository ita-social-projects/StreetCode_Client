import Image from '@models/media/image.model';
import dayjs from 'dayjs';

export default interface News {
    id: number;
    title: string;
    text: string;
    url: string;
    imageId?: number;
    image?: Image;
    creationDate: dayjs.Dayjs;
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
