import './InterestingFactSliderItem.styles.scss';

import { useMobx } from '@stores/root-store';
import { observer } from 'mobx-react-lite';

interface Props {
    MainText:string,
    TextHeading:string,
    ImageSrc:string
}

const InterestingFactSliderItem = (props: Props) => {
    const { interestingFactsStore: { openModal } } = useMobx();
    const toDisplayReadMore = props.MainText.length > 300;
    const textPart = props.MainText.length > 300 ? props.MainText.substr(0, 300) : props.MainText;
    return (
      <div className="interestingFactSlide">
        <div className="slideImage">
          <img src={props.ImageSrc} />
        </div>
        <div className="slideText">
          <p className="heading">{props.TextHeading}</p>
          {toDisplayReadMore ? <p className="mainText">{textPart}</p> : <p className="mainText">{props.MainText}</p>}
          {toDisplayReadMore ? <p className="readMoreParagraph" onClick={openModal}>Трохи ще...</p> : null}
        </div>
      </div>
    );
};

export default observer(InterestingFactSliderItem);
