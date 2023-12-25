import Image from './Image';
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
