import './RelatedFigureItem.styles.scss';

import Tag from '@/models/additional-content/tag.model';

interface Props {
    Id: number,
    TextHeading: string,
    ImageSrc: string,
    Tags: Tag[]
}

const redirectOnStreetcode = (id: number) => {
    console.log(`redirected to streetcode with id: ${id}`);
};

function RelatedFigureSliderItem(props: Props) {
  return (
    <div
      className="relatedFigureSlide"
      style={{ backgroundImage: `url(${props.ImageSrc})` }}
      onClick={() => { redirectOnStreetcode(props.Id); }}
    >
      <div className="slideText">
        <h3 className="heading">{props.TextHeading}</h3>
        <div className="relatedTagList">
          {props.Tags.map((tag) => (
            <div className="tag">
              <p>{tag.title}</p>
            </div>
))}
        </div>
      </div>
    </div>
);
}

export default RelatedFigureSliderItem;
