import './Streetcode.styles.scss';

import { observer } from 'mobx-react-lite';
import React, {
    lazy, Suspense, useEffect, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router';
import { useNavigate, useSearchParams, useSearchParams } from 'react-router-dom';
import ScrollToTopBtn from '@components/ScrollToTopBtn/ScrollToTopBtn.component';
import ProgressBar from '@features/ProgressBar/ProgressBar.component';
import Footer from '@layout/footer/Footer.component';
import useMobx, { useAdditionalContext, useStreetcodeDataContext } from '@stores/root-store';
import DonateBtn from '@streetcode/DonateBtn/DonateBtn.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import QRBlock from '@streetcode/QRBlock/QR.component';
import SourcesBlock from '@streetcode/SourcesBlock/Sources.component';
import TextBlockComponent from '@streetcode/TextBlock/TextBlock.component';
import TickerBlock from '@streetcode/TickerBlock/Ticker.component';

import StatisticRecordApi from '@/app/api/analytics/statistic-record.api';
import TagsModalComponent from '@/app/common/components/modals/Tags/TagsModal.component';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';

import ArtGalleryBlockComponent from './ArtGalleryBlock/ArtGalleryBlock.component';
import InterestingFactsComponent from './InterestingFactsBlock/InterestingFacts.component';
import MapBlock from './MapBlock/MapBlock.component';
import PartnersComponent from './PartnersBlock/Partners.component';
import RelatedFiguresComponent from './RelatedFiguresBlock/RelatedFigures.component';
import TimelineBlockComponent from './TimelineBlock/TimelineBlock.component';

const StreetcodeContent = () => {
    const { streetcodeStore } = useStreetcodeDataContext();
    const { setCurrentStreetcodeId } = streetcodeStore;
    const { imageLoaderStore } = useAdditionalContext();
    // const [slideCloneCountAdded, setSlideCloneCountAdded] = useState(0);

    const slideCloneCountAdded = useRef<number>(0);
    const streetcodeUrl = useRouteUrl();

    const [activeTagId, setActiveTagId] = useState(0);
    const [activeBlock, setActiveBlock] = useState(0);
    const [loading, setLoading] = useState(true);

    const [textBlockState, setTextBlockState] = useState(false);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const checkExist = async (qrId: number) => {
        const exist = await StatisticRecordApi.existByQrId(qrId);
        return exist;
    };

    const addCount = async (qrId: number) => {
        await StatisticRecordApi.update(qrId);
    };

    useAsync(() => {
        const idParam = searchParams.get('qrid');
        if (idParam !== null) {
            const tempId = +idParam;
            Promise.all([checkExist(tempId), addCount(tempId)]).then(
                (resp) => {
                    if (resp.at(0) && resp.at(1) !== null) {
                        searchParams.delete('qrid');
                        setSearchParams(searchParams);
                    }
                },
            ).catch(
                () => {
                    navigate('/404', { replace: true });
                },
            );
        }
    });

    useEffect(() => {
        setCurrentStreetcodeId(streetcodeUrl).then();
    }, [setCurrentStreetcodeId, streetcodeUrl]);

    console.log('streetcde');
    useEffect(() => {
        // for cloned images in sliders
        if (slideCloneCountAdded.current === 0) {
            const slideClonedImgs = document.querySelectorAll('.slick-cloned img');
            const slideCloneCount = slideClonedImgs.length;
            imageLoaderStore.totalImagesToLoad += slideCloneCount;
            slideCloneCountAdded.current = slideCloneCount;
        }

        if (imageLoaderStore.imagesLoadedPercentage >= 50 && textBlockState) {
            setLoading(false);
            const anchorId = window.location.hash.substring(1);
            const blockElement = document.getElementById(anchorId);
            if (blockElement) {
                blockElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [textBlockState, imageLoaderStore.loadedImagesCount]);

    return (
        <div className="streetcodeContainer">
            {loading && (
                <div className="loader-container">
                    <img
                        className="spinner"
                        alt=""
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
                    />
                </div>
            )}
            <ProgressBar>
                <MainBlock
                    setActiveTagId={setActiveTagId}
                    setActiveBlock={setActiveBlock}
                />
                <TextBlockComponent setTextBlockState={setTextBlockState} />
                <InterestingFactsComponent />
                <TimelineBlockComponent />
                <MapBlock />
                <ArtGalleryBlockComponent />
                <RelatedFiguresComponent setActiveTagId={setActiveTagId} />
                <SourcesBlock />
            </ProgressBar>
            <QRBlock />
            <PartnersComponent />
            <div className="sticky">
                <div className="sticky-content">
                    <ScrollToTopBtn />
                    <DonateBtn />
                </div>
            </div>
            <TickerBlock />
            <TagsModalComponent
                activeTagId={activeTagId}
                setActiveTagId={setActiveTagId}
                activeTagBlock={activeBlock}
            />
        </div>
    );
};

export default observer(StreetcodeContent);
