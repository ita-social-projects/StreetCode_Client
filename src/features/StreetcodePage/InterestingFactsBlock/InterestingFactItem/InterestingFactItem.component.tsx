import './InterestingFactItem.styles.scss';

import WowFactImg from '@images/interesting-facts/WowFacts1.png';
import Image from '@models/media/image.model';
import { observer } from 'mobx-react-lite';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import ImagesApi from '@/app/api/media/images.api';

interface Props {
    fact: Fact;
    maxTextLength?: number;
    numberOfSlides: number;
}

const InterestingFactItem = ({
    fact: { factContent, title, id, imageId },
    maxTextLength = 250,
    numberOfSlides,
}: Props) => {
    const { modalStore: { setModal } } = useMobx();
    const isReadMore = (factContent.length > maxTextLength) && (numberOfSlides !== 1);

    let mainContent = factContent;
    if (isReadMore) {
        mainContent = `${factContent.substring(0, maxTextLength - 3)}...`;
    }

    return (
        <div className="interestingFactSlide">
            <div className="slideImage">
                <img src={"https://i.ibb.co/f85t1Vs/Antonovich.png"} alt="" />
            </div>
            <div className="slideText">
                <p className="heading">
                    {title}
                </p>
                <p className="mainText">
                    {mainContent}
                </p>
                {isReadMore && (
                    <p className="readMoreParagraph" onClick={() => setModal('facts', id, true)}>
                        Трохи ще...
                    </p>
                )}
            </div>
        </div>
    );
};

export default observer(InterestingFactItem);
function fetchAudioByStreetcodeId(imageId: number | undefined) {
    throw new Error('Function not implemented.');
}

