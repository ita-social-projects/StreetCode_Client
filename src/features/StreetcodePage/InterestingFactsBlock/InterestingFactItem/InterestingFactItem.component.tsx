import './InterestingFactItem.styles.scss';

import { observer } from 'mobx-react-lite';
import { Fact } from '@models/streetcode/text-contents.model';
import { useModalContext } from '@stores/root-store';

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
    const { modalStore } = useModalContext();
    const isReadMore = (factContent.length > maxTextLength) && (numberOfSlides !== 1);

    let mainContent = factContent;
    if (isReadMore) {
        mainContent = `${factContent.substring(0, maxTextLength - 3)}...`;
    }

    return (
        <div className="interestingFactSlide">
            <div className="slideImage">
                <img
                    src={base64ToUrl(image?.base64, image?.mimeType)}
                    alt=""
                />
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
