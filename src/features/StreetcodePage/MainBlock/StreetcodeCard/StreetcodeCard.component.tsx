import './StreetcodeCard.styles.scss';

import { PlayCircleFilled } from '@ant-design/icons';
import TagList from '@components/TagList/TagList.component';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { StreetcodeTag } from '@models/additional-content/tag.model';
import Streetcode from '@models/streetcode/streetcode-types.model';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { audioClickEvent, personLiveEvent } from '@/app/common/utils/googleAnalytics.unility';
import Image from '@/models/media/image.model';
import { useEffect, useState } from 'react';

const fullMonthNumericYearDateFmtr = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

interface Props {
    streetcode?: Streetcode;
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>,
    setActiveBlock: React.Dispatch<React.SetStateAction<number>>
}

const formatDate = (date?: Date): string => fullMonthNumericYearDateFmtr.format(date).replace('р.', 'року');

const concatDates = (firstDate?: Date, secondDate?: Date): string => {
    let dates = '';

    if (firstDate) {
        dates += formatDate(new Date(firstDate));
    }

    if (secondDate) {
        dates += ` — ${formatDate(new Date(secondDate))}`;
    }

    return dates;
};

const StreetcodeCard = ({ streetcode, setActiveTagId, setActiveBlock }: Props) => {
    const id = streetcode?.id;
    const { modalStore: { setModal } } = useMobx();
    const { audiosStore: { fetchAudioByStreetcodeId, audio } } = useMobx();
    useAsync(() => fetchAudioByStreetcodeId(id ?? 1), [id]);

    const [images, setImages] = useState<Image[]>([]);
    useEffect(() => {
        ImagesApi.getByStreetcodeId(id ?? 1)
            .then((imgs) => setImages(imgs))
            .catch((e) => console.log(e));
    }, []);
    return (
        <div className="card">
            <div className="leftSider">
                <div className="leftSiderContent">
                    <BlockSlider
                        arrows={false}
                        slidesToShow={1}
                        swipeOnClick
                        infinite
                        draggable={false}
                    >
                        {images?.map(({ base64, mimeType, alt }) => (
                            <img
                                src={base64ToUrl(base64, mimeType)}
                                className="streetcodeImg"
                                alt={alt}
                            />
                        ))}
                    </BlockSlider>
                </div>

            </div>
            <div className="rightSider">
                <div className="headerContainer">
                    <div>
                        <div className="streetcodeIndex">
                            Стріткод #000
                            {streetcode?.index}
                        </div>
                        <h2 className="streetcodeTitle">
                            {streetcode?.title}
                        </h2>
                        <div className="streetcodeDate">
                            {concatDates(
                                streetcode?.eventStartOrPersonBirthDate,
                                streetcode?.eventEndOrPersonDeathDate,
                            )}
                        </div>
                        <TagList
                            tags={streetcode?.tags.filter((tag: StreetcodeTag) => tag.isVisible)}
                            setActiveTagId={setActiveTagId}
                            setActiveTagBlock={setActiveBlock}
                        />
                        <div className="teaserBlockContainer">
                            <p className="teaserBlock">
                                {streetcode?.teaser}
                            </p>
                        </div>
                    </div>

                    <div className="cardFooter">
                        {audio?.base64
                            ? (
                                <Button
                                    type="primary"
                                    className="audioBtn audioBtnActive"
                                    onClick={() => {
                                            setModal('audio');
                                            audioClickEvent(streetcode?.id ?? 0);
                                        }}
                                >
                                    <PlayCircleFilled className="playCircle" />
                                    <span>Прослухати текст</span>
                                </Button>
                            )
                            : (
                                <Button
                                    disabled
                                    type="primary"
                                    className="audioBtn"
                                >
                                    <span>Аудіо на підході</span>
                                </Button>
                            )}
                        <Button className="animateFigureBtn" onClick={() => personLiveEvent(streetcode?.id ?? 0)}><a href="#QRBlock">Оживити картинку</a></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreetcodeCard;
