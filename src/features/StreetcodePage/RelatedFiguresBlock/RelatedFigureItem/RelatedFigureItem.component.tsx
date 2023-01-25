import './RelatedFigureItem.styles.scss';

import { useAsync } from '@hooks/stateful/useAsync.hook';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx from '@stores/root-store';

interface Props {
    relatedFigure: RelatedFigure;
    filterTags?: boolean;
}

const redirectOnStreetcode = (id: number) => {
    console.log(`redirected to streetcode with id: ${id}`);
};

const RelatedFigureItem = ({ relatedFigure, filterTags = false }: Props) => {
    const { id, imageId, title, tags } = relatedFigure;

    const { imagesStore, tagsStore: { getTagArray } } = useMobx();
    const { fetchImage, getImage } = imagesStore;

    useAsync(
        () => fetchImage(imageId),
        [imageId],
    );

    return (
        <div
            className="relatedFigureSlide"
            style={{ backgroundImage: `url(${getImage(imageId)?.url.href})` }}
            onClick={() => {
                redirectOnStreetcode(id);
            }}
        >
            <div className="slideText">
                <h3 className="heading">
                    {title}
                </h3>
                <div className="relatedTagList">
                    {tags.filter((tag) => getTagArray.find((ti) => ti.id === tag.id || !filterTags))
                        .map((tag, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                            <div key={idx} className="tag">
                                <p>{tag.title}</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedFigureItem;
