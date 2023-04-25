import './InterestingFactItem.styles.scss';

import { observer } from 'mobx-react-lite';
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

    const imgId = imageId as number;

    const { value } = useAsync(() => ImagesApi.getById(imgId), [imgId]);
    const image = value as Image;

    const url = base64ToUrl(image?.base64, image?.mimeType);

    return (
        <div className="interestingFactSlide">
            <div className="slideImage">
                <img src={url} alt="" />
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
