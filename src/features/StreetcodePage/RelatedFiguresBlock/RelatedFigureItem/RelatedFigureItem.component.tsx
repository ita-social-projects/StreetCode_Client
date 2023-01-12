import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import useMobx from '@/app/stores/root-store';
import RelatedFigure from '@/models/streetcode/related-figure.model';
import './RelatedFigureItem.styles.scss';

interface Props {
    relatedFigure: RelatedFigure;
}

const redirectOnStreetcode = (id: number) => {
    console.log('redirected to streetcode with id: ' + id);
}

const RelatedFigureSliderItem = ({ relatedFigure }: Props) => {
    const { id, image, title, tags} = relatedFigure;
    const { imagesStore } = useMobx();
    const { fetchImage, getImage } = imagesStore;

    // useAsync(
    //     () => fetchImage(relatedFigure.imageId),
    //     [relatedFigure.imageId]
    // );

    return (
        <div
            className={'relatedFigureSlide'}
            style={{ backgroundImage: `url(${relatedFigure.image?.url.href})` }}
            onClick={() => {redirectOnStreetcode(id)}}
        >
            <div className={'slideText'}>
                <h3 className={'heading'}>
                    {title}
                </h3>
                <div className={'relatedTagList'}>
                    {tags.map((tag, idx) => (
                        <div key={idx} className="tag">
                            <p>{tag.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RelatedFigureSliderItem;