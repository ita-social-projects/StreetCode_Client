import Image from './Image';

export default interface News {
  id: number;
  title: string;
  text: string;
  url: string;
  imageId?: number;
  image?: Image;
  creationDate: string;
}
