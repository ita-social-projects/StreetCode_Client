import './RelatedFigureItem.styles.scss';

import { useAsync } from '@hooks/stateful/useAsync.hook';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx from '@stores/root-store';

interface Props {
    relatedFigure: RelatedFigure;
}

const redirectOnStreetcode = (id: number) => {
    console.log(`redirected to streetcode with id: ${id}`);
};

const RelatedFigureItem = ({ relatedFigure }: Props) => {
    const { id, imageId, title, tags } = relatedFigure;

    const { imagesStore } = useMobx();
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
                    {tags.map((tag, idx) => (
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
