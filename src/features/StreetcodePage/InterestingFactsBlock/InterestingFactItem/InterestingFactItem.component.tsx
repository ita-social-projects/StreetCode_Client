import './InterestingFactItem.styles.scss';

import WowFactImg from '@images/interesting-facts/WowFacts1.png';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

interface Props {
    fact: Fact;
    maxTextLength?: number;
    numberOfSlides: number;
}

const InterestingFactItem = ({
    fact: { factContent, title, id },
    maxTextLength = 250,
    numberOfSlides,
}: Props) => {
    const { modalStore: { setModal } } = useMobx();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    function onResizeWindow() {
        setWindowWidth(window.innerWidth);
    }

    useEffect(() => {
        onResizeWindow();
        window.addEventListener('resize', onResizeWindow);
        setWindowWidth(windowWidth);
        return () => {
            setWindowWidth(windowWidth);
            window.removeEventListener('resize', onResizeWindow);
        };
    }, []);

    if (windowWidth <= 1024) {
        maxTextLength = 190;
    }

    const isReadMore = (factContent.length > maxTextLength) && (numberOfSlides !== 1);

    const mainContent = factContent;

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
