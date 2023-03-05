import './StreetcodeCard.styles.scss';

import Grushevskiy from '@images/streetcode-card/Grushevskiy.gif';
import Hrushevskiy from '@images/streetcode-card/Hrushevskyi.png';

import { useState } from 'react';
import { PlayCircleFilled } from '@ant-design/icons';
import TagList from '@components/TagList/TagList.component';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Tag from '@models/additional-content/tag.model';
import Streetcode from '@models/streetcode/streetcode-types.model';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import TagsModal from '@/app/common/components/modals/Tags/TagsModal.component';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';
import Image from '@/models/media/image.model';

const fullMonthNumericYearDateFmtr = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

interface Props {
    streetcode?: Streetcode;
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

/* delete this when started using db images */
const cSlides = [
    <img
        src={Grushevskiy}
        className="streetcodeImg"
        alt="Hrushevskiy"
    />,
    <img
        src={Hrushevskiy}
        className="streetcodeImg"
        alt="Hrushevskiy"
    />,
];

const StreetcodeCard = ({ streetcode }: Props) => {
    const id = useRouteId();
    const { modalStore: { setModal } } = useMobx();
    const { audiosStore: { fetchAudioByStreetcodeId, audio } } = useMobx();
    const [activeTagId, setActiveTagId] = useState(0);

    const { value } = useAsync(() => ImagesApi.getByStreetcodeId(id), [id]);
    const images = value as Image[];


    useAsync(() => fetchAudioByStreetcodeId(id), [id]);

    return (
        <div className="card">
            <div className="leftSider">
                <div className="leftSiderContentContainer">
                    <div className="leftSiderContent">
                        <BlockSlider
                            arrows={false}
                            slidesToShow={1}
                            swipeOnClick
                            infinite
                            draggable={false}
                        >
                            {/* uncomment this to get images brom db, but make sure there are correct urls */}
                            {/* {images?.map(({ url: { href }, alt }) => (
                                <img
                                    src={href}
                                    className="streetcodeImg"
                                    alt={alt}
                                />
                            ))} */}
                            {cSlides}
                        </BlockSlider>
                    </div>
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
                        <TagList tags={streetcode?.tags.map((tag: Tag) => tag)} setActiveTagId={setActiveTagId} />
                        <p className="teaserBlock">
                            {streetcode?.teaser}
                        </p>
                        <div className="cardFooter">
                            {audio?.url?.href
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
            <TagsModal setActiveTagId={setActiveTagId} activeTagId={activeTagId} />
        </div>
    );
};

export default StreetcodeCard;
