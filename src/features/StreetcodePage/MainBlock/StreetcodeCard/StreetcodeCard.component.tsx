import './StreetcodeCard.styles.scss';

import { SetStateAction, useState } from 'react';
import { PlayCircleFilled } from '@ant-design/icons';
import TagList from '@components/TagList/TagList.component';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Tag from '@models/additional-content/tag.model';
import Streetcode from '@models/streetcode/streetcode-types.model';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import Image from '@/models/media/image.model';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
  
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

    const { value } = useAsync(() => ImagesApi.getByStreetcodeId(id ?? 1), [id]);
    const images = value as Image[];
    useAsync(() => fetchAudioByStreetcodeId(id ?? 1), [id]);

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
                            tags={streetcode?.tags.map((tag: Tag) => tag)}
                            setActiveTagId={setActiveTagId}
                            setActiveTagBlock={setActiveBlock}
                        />
                        <div className="teaserBlockContainer">
                            <p className="teaserBlock">
                                 {streetcode?.teaser}
                            </p>
                          
                        </div>

                        <div className="cardFooter">
                            {audio?.base64
                                ? (
                                    <Button
                                        type="primary"
                                        className="audioBtn audioBtnActive"
                                        onClick={() => setModal('audio')}
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
                            <Button className="animateFigureBtn"><a href="#QRBlock">Оживити картинку</a></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreetcodeCard;
