import './Streetcode.styles.scss';

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

const StreetcodeContent = () => (
    <div className="streetcodeContainer">
        <ProgressBar>
            <MainBlock />
            <TextBlock />
            <InterestingFactsBlock />
            <TimelineBlock />
            <MapBlock />
            <ArtGalleryBlock />
            <RelatedFiguresBlock />
            <SourcesBlock />
        </ProgressBar>
        <QRBlock />
        <PartnersBlock />
        <TickerBlock />
        <ScrollToTopBtn />
        <DonateBtn />
        <Footer />
    </div>
);

export default StreetcodeContent;
