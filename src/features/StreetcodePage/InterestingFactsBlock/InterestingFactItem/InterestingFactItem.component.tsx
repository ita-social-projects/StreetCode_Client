import './InterestingFactItem.styles.scss';

import WowFactImg from '@images/interesting-facts/WowFacts1.png';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

interface Props {
    fact: Fact;
    // maxTextLength?: number;
    numberOfSlides: number;
}

const InterestingFactItem = ({
    fact: { factContent, title, id },
    // maxTextLength = 250,
    numberOfSlides,
}: Props) => {
    const { modalStore: { setModal } } = useMobx();

    const maxTextLength = 220;
    // const [maxTextLength, setMaxCharacterCount] = useState(220);

    // useEffect(() => {
    //     const handleResize = () => {
    //         const screenWidth = window.innerWidth;
    //         if (screenWidth <= 1024) {
    //             setMaxCharacterCount(220);
    //         }
    //         setMaxCharacterCount(250);
    //     };
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    // const maxTextLength = () : number => {
    //     const screenWidth = window.innerWidth;
    //     if (screenWidth <= 768) {
    //        return 220;
    //     }
    //     return 250;
    //   };
    const isReadMore = (factContent.length > maxTextLength) && (numberOfSlides !== 1);

    let mainContent = factContent;
    if (isReadMore) {
        mainContent = `${factContent.substring(0, maxTextLength - 3)}...`;
    }

    return (
        <div className="interestingFactSlide">
            <div className="slideImage">
                <img src={WowFactImg} alt="" />
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
