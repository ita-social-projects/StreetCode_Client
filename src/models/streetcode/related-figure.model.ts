import Tag from '@models/additional-content/tag.model';
import Image from '@models/media/image.model';

export default interface RelatedFigure {
    Id: number;
    Title: string;
    Image: Image;
    Tags: Tag[];
}
