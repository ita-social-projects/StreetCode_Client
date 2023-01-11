import RelatedFigure from '@/models/streetcode/related-figure.model';
import './RelatedFigureItem.styles.scss';

interface Props {
    relatedFigure: RelatedFigure;
}

const redirectOnStreetcode = (id: number) => {
    console.log('redirected to streetcode with id: ' + id);
}

const RelatedFigureSliderItem = ({ relatedFigure }: Props) => (
    <div
        className={'relatedFigureSlide'}
        style={{ backgroundImage: 'url(' + relatedFigure.image?.url.href + ')' }}
        onClick={() => {redirectOnStreetcode(relatedFigure.id)}}
    >
        <div className={'slideText'}>
            <h3 className={'heading'}>
                {relatedFigure.title}
            </h3>
            <div className={'relatedTagList'}>
                {relatedFigure.tags.map((tag, idx) => (
                    <div key={idx} className="tag">
                        <p>{tag.title}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

export default RelatedFigureSliderItem;