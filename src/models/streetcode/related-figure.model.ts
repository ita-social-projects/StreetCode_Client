import Tag from '../additional-content/tag.model';
import Image from '../media/image.model';

export default interface RelatedFigure {
    Id: number;
    Title: string;
    Image: Image;
    Tags: Tag[];
}
