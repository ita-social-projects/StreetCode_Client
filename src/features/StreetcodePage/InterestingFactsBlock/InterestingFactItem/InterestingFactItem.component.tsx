import './InterestingFactItem.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Image from '@models/media/image.model';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

import ImagesApi from '@/app/api/media/images.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

interface Props {
    fact: Fact;
    maxTextLength?: number;
    numberOfSlides: number;
    handleImageLoad: (() => void);
}

const InterestingFactItem = ({
    fact: { factContent, title, id, imageId },
    maxTextLength = 250,
    numberOfSlides,
    handleImageLoad,
}: Props) => {
    const { modalStore: { setModal } } = useMobx();
    const isReadMore = (factContent.length > maxTextLength) && (numberOfSlides !== 1);

    let mainContent = factContent;
    const [image, setImage] = useState<Image>();
    if (isReadMore) {
        mainContent = `${factContent.substring(0, maxTextLength - 3)}...`;
    }
    useEffect(() => {
        if (!image) {
            console.log("dfs")
            ImagesApi.getById(imageId).then((res) => setImage(res));
        }
    }, []);

    const url = base64ToUrl(image?.base64, image?.mimeType);

    return (
        <div className="interestingFactSlide">
            <div className="slideImage">
                <img
                    src={url}
                    alt=""
                    onLoad={handleImageLoad}
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
                    <p className="readMoreParagraph" onClick={() => setModal('facts', id, true)}>
                        Трохи ще...
                    </p>
                )}
            </div>
        </div>
    );
};

export default observer(InterestingFactItem);
