import './InterestingFactItem.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import CardText from '@components/CardText/CardText.component';
import { Fact } from '@models/streetcode/text-contents.model';
import { useModalContext } from '@stores/root-store';

// eslint-disable-next-line import/extensions
import useIsVisible from '@/app/common/hooks/stateful/useIsVisible';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

interface Props {
    fact: Fact;
    index?: number;
    middleFactIndex?: number;
}

const InterestingFactItem = ({
    fact: { factContent, title, id, image },
    index,
    middleFactIndex,
}: Props) => {
    const millisecondsToHideAfterOpening = 4000;
    const { modalStore } = useModalContext();
    const timeout = useRef<NodeJS.Timeout>();
    const [descriptionVisible, setDescriptionVisible] = useState<boolean>(false);

    const elementRef = useRef<HTMLDivElement>(null);
    const isOnScreen = useIsVisible(elementRef);

    useEffect(() => {
        if (index === middleFactIndex && image?.imageDetails?.alt && isOnScreen) {
            setDescriptionVisible(true);
            timeout.current = setTimeout(() => {
                setDescriptionVisible(false);
            }, millisecondsToHideAfterOpening);
        }
    }, [index, middleFactIndex, image, isOnScreen]);

    return (
        <div
            className="interestingFactSlide"
            ref={elementRef}
        >
            <div
                className="slideImage"
            >
                <img
                    src={base64ToUrl(image?.base64, image?.mimeType)}
                    alt=""
                />
                {index === middleFactIndex && image?.imageDetails?.alt ? (
                    <div className={`description-popup ${descriptionVisible ? 'description-popup-visible' : ''}`}>
                        <p>{image?.imageDetails?.alt}</p>
                    </div>
                ) : null}

            </div>
            <div className="slideText">
                <CardText
                    title={title}
                    text={factContent}
                    onBtnClick={() => modalStore.setModal('facts', id, true)}
                />
            </div>
        </div>
    );
};

export default observer(InterestingFactItem);
