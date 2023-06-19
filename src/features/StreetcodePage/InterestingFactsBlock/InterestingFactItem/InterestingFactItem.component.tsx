import './InterestingFactItem.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { Fact } from '@models/streetcode/text-contents.model';
import { useModalContext } from '@stores/root-store';

import useIsVisible from '@/app/common/hooks/stateful/useIsVisible';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

interface Props {
    fact: Fact;
    maxTextLength?: number;
    numberOfSlides: number;
}

const InterestingFactItem = ({
    fact: { factContent, title, id, image },
    maxTextLength = 250,
    numberOfSlides,
}: Props) => {
    const millisecondsToHideAfterOpening = 4000;
    const { modalStore } = useModalContext();
    const isReadMore = (factContent.length > maxTextLength) && (numberOfSlides !== 1);
    const timeout = useRef<NodeJS.Timeout>();
    const [descriptionVisible, setDescriptionVisible] = useState<boolean>(false);

    const elementRef = useRef<HTMLDivElement>(null);
    const isOnScreen = useIsVisible(elementRef);

    let mainContent = factContent;
    if (isReadMore) {
        mainContent = `${factContent.substring(0, maxTextLength - 3)}...`;
    }
    useEffect(() => {
        if (image?.imageDetails?.alt && isOnScreen) {
            setDescriptionVisible(true);
            timeout.current = setTimeout(() => {
                setDescriptionVisible(false);
                timeout.current = undefined;
            }, millisecondsToHideAfterOpening);
        }
    }, [image, isOnScreen]);

    return (
        <div className="interestingFactSlide" ref={elementRef}>
            <div
                className="slideImage"
            >
                <img
                    src={base64ToUrl(image?.base64, image?.mimeType)}
                    alt=""
                />
                {image?.imageDetails?.alt ? (
                    <div className={`description-popup ${descriptionVisible ? 'description-popup-visible' : ''}`}>
                        <p>{image?.imageDetails?.alt}</p>
                    </div>
                ) : null}

            </div>
            <div className="slideText">
                <p className="heading">
                    {title}
                </p>
                <p className={`mainText ${(numberOfSlides !== 1) ? 'lineSpecifier' : ''}`}>
                    {mainContent}
                </p>
                {isReadMore && (
                    <p className="readMoreParagraph" onClick={() => modalStore.setModal('facts', id, true)}>
                        Трохи ще...
                    </p>
                )}
            </div>
        </div>
    );
};

export default observer(InterestingFactItem);
