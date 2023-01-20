import './InterestingFactItem.styles.scss';

import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';

interface Props {
    mainText: string;
    textHeading: string;
    imgSrc: string;
    maxTextLength?: number;
    factId:number;
    numberOfSlides:number;
}

const InterestingFactItem = ({
    imgSrc, mainText, textHeading, maxTextLength = 300, factId, numberOfSlides
}: Props) => {
    const { modalStore: { setModal } } = useMobx();
    const isReadMore = (mainText.length > maxTextLength) && (numberOfSlides!=1);

    if (isReadMore) {
        mainText = `${mainText.substring(0, maxTextLength)}...`;
    }

    return (
        <div className="interestingFactSlide">
            <div className="slideImage">
                <img src={imgSrc} alt="" />
            </div>
            <div className="slideText">
                <p className="heading">{textHeading}</p>
                <p className="mainText">{mainText}</p>
                {isReadMore && (
                    <p className="readMoreParagraph" onClick={() => setModal('facts', factId, true)}>
                        Трохи ще...
                    </p>
                )}
            </div>
        </div>
    );
};

export default observer(InterestingFactItem);
