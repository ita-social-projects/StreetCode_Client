import Tag from '@models/additional-content/tag.model';
import Image from '@models/media/image.model';

export default interface RelatedFigure {
    id: number;
    title: string;
    url: string;
    alias?: string;
    imageId: number;
    tags: Tag[];
}
