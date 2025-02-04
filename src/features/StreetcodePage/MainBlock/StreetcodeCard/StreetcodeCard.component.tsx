import './StreetcodeCard.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { PlayCircleFilled } from '@ant-design/icons';
import TagList from '@components/TagList/TagList.component';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { StreetcodeTag } from '@models/additional-content/tag.model';
import Streetcode from '@models/streetcode/streetcode-types.model';
import { useAudioContext, useModalContext, useStreecodePageLoaderContext, useStreetcodeDataContext }
    from '@stores/root-store';

import { Button } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import TransactionLinksApi from '@/app/api/transactions/transactLinks.api';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { audioClickEvent } from '@/app/common/utils/googleAnalytics.unility';
import Image, { ImageAssigment } from '@/models/media/image.model';
import StreetcodeBlock from '@/models/streetcode/streetcode-blocks.model';

interface Props {
    streetcode?: Streetcode;
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>,
    setShowAllTags: React.Dispatch<React.SetStateAction<boolean>>,
}

const StreetcodeCard = ({ streetcode, setActiveTagId, setShowAllTags }: Props) => {
    const id = streetcode?.id;
    const { modalStore: { setModal, modalsState } } = useModalContext();
    const audioState = modalsState.audio;
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
    const { fetchAudioByStreetcodeId, audio } = useAudioContext();
    const [arlink, setArlink] = useState('');
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [images, setImages] = useState<Image[]>([]);
    const [imagesForSlider, setImagesForSlider] = useState<Image[]>([]);
    const navigate = useNavigate();
    const { streetcodeStore } = useStreetcodeDataContext();
    const { isFavourite, deleteFromFavourites, addToFavourites } = streetcodeStore;

    useAsync(() => {
        if (id && id > 0) {
            fetchAudioByStreetcodeId(id).then(() => {
                setAudioIsLoaded(true);
            });
        }
    }, [id]);

    useEffect(() => {
        if (id && id > 0) {
            ImagesApi.getByStreetcodeId(id ?? 1)
                .then((imgs) => {
                    setImages(imgs);
                    setImagesForSlider(imgs.filter(
                        (image) => image.imageDetails?.alt === ImageAssigment.blackandwhite.toString()
                        || image.imageDetails?.alt === ImageAssigment.animation.toString(),
                    ));
                    streecodePageLoaderContext.addBlockFetched(StreetcodeBlock.StreetcodeImage);
                })
                .catch((e) => { });
            TransactionLinksApi.getByStreetcodeId(id).then((x) => setArlink(x.url));
        }
    }, [streetcode]);

    const handlePreviewClick = () => {
        if (streetcode) {
            navigate(`/${streetcode.transliterationUrl}/pdf-preview`, {
                state: {
                    streetcode,
                    image: imagesForSlider[0] ?? imagesForSlider[1],
                },
            });
        }
    };

    return (
        <div className="card">
            <div className="leftSider">
                <div className="leftSiderContent">
                    <BlockSlider
                        arrows={false}
                        slidesToShow={1}
                        swipeOnClick
                        infinite
                    >
                        {imagesForSlider.map((image, index) => {
                            if (imagesForSlider.length > 1 && index === 0) {
                                return (
                                    <div>
                                        <img
                                            key={imagesForSlider[0].id}
                                            src={
                                                base64ToUrl(
                                                    imagesForSlider[0].base64,
                                                    imagesForSlider[0].mimeType,
                                                )
                                            }
                                            className="streetcodeImgColored"
                                            style={{ objectFit: 'contain' }}
                                            alt={imagesForSlider[0].imageDetails?.alt}
                                        />
                                        <img
                                            key={imagesForSlider[1].id}
                                            src={base64ToUrl(
                                                imagesForSlider[1].base64,
                                                imagesForSlider[1].mimeType,
                                            )}
                                            className="streetcodeImgGrey"
                                            style={{ objectFit: 'contain' }}
                                            alt={imagesForSlider[1].imageDetails?.alt}
                                        />
                                    </div>
                                );
                            }

                            return (
                                <img
                                    key={imagesForSlider[index].id}
                                    src={base64ToUrl(
                                        imagesForSlider[index].base64,
                                        imagesForSlider[index].mimeType,
                                    )}
                                    className="streetcodeImg"
                                    style={{ objectFit: 'contain' }}
                                    alt={imagesForSlider[index].imageDetails?.alt}
                                />
                            );
                        })}
                    </BlockSlider>
                </div>
            </div>
            <div className="rightSider">
                {
                    isFavourite !== undefined ? (
                        isFavourite
                            ? (<FaBookmark className="bookmark" onClick={deleteFromFavourites} />)
                            : (<FaRegBookmark className="bookmark" onClick={addToFavourites} />)
                    ) : null
                }
                <div className="streetcodeIndex">
                            History-код #
                    {streetcode?.index ?? 0 <= 9999 ? `000${streetcode?.index}`.slice(-4)
                        : streetcode?.index}
                </div>
                <h2 className="streetcodeTitle">
                    {streetcode?.title}
                </h2>
                <div className="streetcodeDate">
                    {streetcode?.dateString}
                </div>
                <div className="tagListWrapper">
                    <TagList
                        tags={streetcode?.tags.filter((tag: StreetcodeTag) => tag.isVisible)}
                        setActiveTagId={setActiveTagId}
                        setShowAllTags={setShowAllTags}

                    />
                </div>
                <div className="blurTop" />

                <p className="teaserBlock">
                    {streetcode?.teaser}
                </p>

                <div className="blurBottom" />
                <div className="cardFooter">
                    {audio?.base64 && audioIsLoaded
                        ? (
                            <Button
                                type="primary"
                                className="cardFooterButton audioBtnActive"
                                onClick={() => {
                                    if (audioState.isOpen) {
                                        setModal('audio', undefined, true);
                                    } else {
                                        setModal('audio');
                                    }

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
                                className="cardFooterButton audioBtn"
                            >
                                <span>Аудіо на підході</span>
                            </Button>
                        )}
                    <Button
                        className="cardFooterButton pdfButton"
                        onClick={handlePreviewClick}
                    >
                        <span>Переглянути PDF</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default observer(StreetcodeCard);
