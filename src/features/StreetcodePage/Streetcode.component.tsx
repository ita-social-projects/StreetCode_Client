import './Streetcode.styles.scss';

import React, {
    lazy, Suspense, useEffect, useRef, useState,
} from 'react';
import ScrollToTopBtn from '@components/ScrollToTopBtn/ScrollToTopBtn.component';
import ProgressBar from '@features/ProgressBar/ProgressBar.component';
import Footer from '@layout/footer/Footer.component';
import useMobx from '@stores/root-store';
import DonateBtn from '@streetcode/DonateBtn/DonateBtn.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import QRBlock from '@streetcode/QRBlock/QR.component';
import SourcesBlock from '@streetcode/SourcesBlock/Sources.component';
import TextBlockComponent from '@streetcode/TextBlock/TextBlock.component';
import TickerBlock from '@streetcode/TickerBlock/Ticker.component';

import TagsModalComponent from '@/app/common/components/modals/Tags/TagsModal.component';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';

import ArtGalleryBlockComponent from './ArtGalleryBlock/ArtGalleryBlock.component';
import InterestingFactsComponent from './InterestingFactsBlock/InterestingFacts.component';
import MapComponent from './MapBlock/Map/Map.component';
import MapBlock from './MapBlock/MapBlock.component';
import PartnersComponent from './PartnersBlock/Partners.component';
import RelatedFiguresComponent from './RelatedFiguresBlock/RelatedFigures.component';
import TimelineBlockComponent from './TimelineBlock/TimelineBlock.component';

const StreetcodeContent = () => {
    const streetcodeUrl = useRouteUrl();
    const [activeTagId, setActiveTagId] = useState(0);
    const [activeBlock, setActiveBlock] = useState(0);
    const { streetcodeStore } = useMobx();
    const { setCurrentStreetcodeId } = streetcodeStore;

    const [loading, setLoading] = useState(true);

    const [streetcodeCardState, setStreetcodeCardState] = useState(false);
    const [textBlockState, setTextBlockState] = useState(false);
    const [interestingFactsState, setInterestingFactsState] = useState(false);
    const [partnersState, setPartnersState] = useState(false);

    useEffect(() => {
        setCurrentStreetcodeId(streetcodeUrl).then();
    }, [setCurrentStreetcodeId, streetcodeUrl]);

    // useEffect(() => {
    //     document.body.style.overflow = 'hidden';
    //     if (streetcodeCardState && textBlockState && interestingFactsState && partnersState) {
    //         setLoading(false);
    //         document.body.style.overflow = 'auto';

    //         const anchorId = window.location.hash.substring(1);
    //         const blockElement = document.getElementById(anchorId);
    //         if (blockElement) {
    //             blockElement.scrollIntoView({ behavior: 'smooth' });
    //         }
    //     }
    // }, [streetcodeCardState, textBlockState, interestingFactsState, partnersState]);

    return (
        <div className="streetcodeContainer">
            {/*  {loading && (
                <div className="loader-container">
                    <img
                        className="spinner"
                        alt=""
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
                    />
                </div>
            )} */}
            <ProgressBar>
                <MainBlock
                    setActiveTagId={setActiveTagId}
                    setActiveBlock={setActiveBlock}
                    setStreetcodeCardState={setStreetcodeCardState}
                />
                <TextBlockComponent setTextBlockState={setTextBlockState} />
                <InterestingFactsComponent setInterestingFactsState={setInterestingFactsState} />
                <TimelineBlockComponent />
                <MapBlock />
                <ArtGalleryBlockComponent />
                <RelatedFiguresComponent
                    setActiveTagId={setActiveTagId}
                />
                <SourcesBlock />
            </ProgressBar>
            <QRBlock />
            <PartnersComponent setPartnersState={setPartnersState} />
            <div className="sticky">
                <div className="sticky-content">
                    <ScrollToTopBtn />
                    <DonateBtn />
                </div>
            </div>
            <TickerBlock />
            <Footer />
            <TagsModalComponent
                activeTagId={activeTagId}
                setActiveTagId={setActiveTagId}
                activeTagBlock={activeBlock}
            />
        </div>
    );
};

export default StreetcodeContent;
