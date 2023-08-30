import './StreetcodeCard.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { PlayCircleFilled } from '@ant-design/icons';
import TagList from '@components/TagList/TagList.component';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { StreetcodeTag } from '@models/additional-content/tag.model';
import Streetcode from '@models/streetcode/streetcode-types.model';
import useMobx, { useAudioContext, useModalContext, useStreecodePageLoaderContext } from '@stores/root-store';

import { Button } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import TransactionLinksApi from '@/app/api/transactions/transactLinks.api';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { audioClickEvent, personLiveEvent } from '@/app/common/utils/googleAnalytics.unility';
import Image from '@/models/media/image.model';

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
    const { modalStore: { setModal } } = useModalContext();
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
    const { fetchAudioByStreetcodeId, audio } = useAudioContext();
    const [arlink, setArlink] = useState('');
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);

    useAsync(() => {
        if (id && id > 0) {
            fetchAudioByStreetcodeId(id).then(() => {
                setAudioIsLoaded(true)
            });
        }
    }, [id]);

    const [images, setImages] = useState<Image[]>([]);

    useEffect(() => {
        if (id && id > 0) {
            ImagesApi.getByStreetcodeId(id ?? 1)
                .then((imgs) => {
                    setImages(imgs); 
                    streecodePageLoaderContext.addBlockFetched();
                })
                .catch((e) => { });
            TransactionLinksApi.getByStreetcodeId(id).then((x) => setArlink(x.url));
        }
    }, [streetcode]);

    return (
        streecodePageLoaderContext.isPageLoaded ? (
            <div className="card">
                <div className="leftSider">
                    <div className="leftSiderContent">
                        <BlockSlider
                            arrows={false}
                            slidesToShow={1}
                            swipeOnClick
                            infinite
                        >
                            {images.slice(0, 2).map((im) => (
                                <img
                                    key={im.id}
                                    src={base64ToUrl(im.base64, im.mimeType)}
                                    className="streetcodeImg"
                                    alt={im.imageDetails?.alt}
                                />
                            ))}
                        </BlockSlider>
                    </div>
                </div>
                <div className="rightSider">
                    <div className="headerContainer">
                        <div className="upper-info">
                            <div className="streetcodeIndex">
                            Стріткод #
                                {streetcode?.index ?? 0 <= 9999 ? `000${streetcode?.index}`.slice(-4)
                                    : streetcode?.index}
                            </div>
                            <h2 className="streetcodeTitle">
                                {streetcode?.title}
                            </h2>
                            <div className="streetcodeDate">
                                {streetcode?.dateString}
                            </div>
                            <TagList
                                tags={streetcode?.tags.filter((tag: StreetcodeTag) => tag.isVisible)}
                                setActiveTagId={setActiveTagId}
                                setActiveTagBlock={setActiveBlock}
                            />
                            <p className="teaserBlock">
                                {streetcode?.teaser}
                            </p>
                        </div>

                        <div className="cardFooter">
                            {audio?.base64 && audioIsLoaded
                                ? (
                                    <Button
                                        type="primary"
                                        className= {"audioBtn audioBtnActive"}
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

                            {arlink
                                ? (
                                    <Button
                                        className="animateFigureBtn"
                                        onClick={() => personLiveEvent(streetcode?.id ?? 0)}
                                    >
                                        <a href="#QRBlock">Оживити картинку</a>
                                    </Button>
                                )
                                : <></>}
                        </div>
                    </div>
                </div>
            </div>
        ) : ''
    );
};

export default observer(StreetcodeCard);
