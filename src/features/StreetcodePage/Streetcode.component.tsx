import './Streetcode.styles.scss';

import { useState } from 'react';
import ScrollToTopBtn from '@components/ScrollToTopBtn/ScrollToTopBtn.component';
import ProgressBar from '@features/ProgressBar/ProgressBar.component';
import Footer from '@layout/footer/Footer.component';
import ArtGalleryBlock from '@streetcode/ArtGalleryBlock/ArtGalleryBlock.component';
import DonateBtn from '@streetcode/DonateBtn/DonateBtn.component';
import InterestingFactsBlock from '@streetcode/InterestingFactsBlock/InterestingFacts.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import MapBlock from '@streetcode/MapBlock/MapBlock.component';
import PartnersBlock from '@streetcode/PartnersBlock/Partners.component';
import QRBlock from '@streetcode/QRBlock/QR.component';
import RelatedFiguresBlock from '@streetcode/RelatedFiguresBlock/RelatedFigures.component';
import SourcesBlock from '@streetcode/SourcesBlock/Sources.component';
import TextBlock from '@streetcode/TextBlock/TextBlock.component';
import TickerBlock from '@streetcode/TickerBlock/Ticker.component';
import TimelineBlock from '@streetcode/TimelineBlock/TimelineBlock.component';

import TagsModalComponent from '@/app/common/components/modals/Tags/TagsModal.component';
import useSticky from '@/app/common/hooks/scrolling/useSticky.hook';

const StreetcodeContent = () => {
    const [activeTagId, setActiveTagId] = useState(0);
    const [activeBlock, setActiveBlock] = useState(0);
    useSticky();

    return (
        <div className="streetcodeContainer">
            <ProgressBar>
                <MainBlock
                    setActiveTagId={setActiveTagId}
                    setActiveBlock={setActiveBlock}
                />
                <TextBlock />
                <InterestingFactsBlock />
                <TimelineBlock />
                <MapBlock />
                <ArtGalleryBlock />
                <RelatedFiguresBlock
                    setActiveTagId={setActiveTagId}
                />
                <SourcesBlock />
            </ProgressBar>
            <QRBlock />
            <PartnersBlock />
            <TickerBlock />
            <div className="stickies">
                <ScrollToTopBtn />
                <DonateBtn />
            </div>
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
