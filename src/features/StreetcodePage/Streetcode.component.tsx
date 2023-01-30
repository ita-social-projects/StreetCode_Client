import './Streetcode.styles.scss';

import ScrollToTopBtn from '@components/ScrollToTopBtn/ScrollToTopBtn.component';
import ProgressBar from '@features/ProgressBar/ProgressBar.component';
import Footer from '@layout/footer/Footer.component';
import ArtGalleryBlock from '@streetcode/ArtGalleryBlock/ArtGalleryBlock.component';
import DonateBtn from '@streetcode/DonateBtn/DonateBtn.component';
import InterestingFactsBlock from '@streetcode/InterestingFactsBlock/InterestingFacts.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import PartnersComponent from '@streetcode/PartnersBlock/Partners.component';
import QRComponent from '@streetcode/QRBlock/QR.component';
import RelatedFiguresBlock from '@streetcode/RelatedFiguresBlock/RelatedFigures.component';
import SourcesBlock from '@streetcode/SourcesBlock/Sources.component';
import TextBlock from '@streetcode/TextBlock/TextBlock.component';
import TickerComponent from '@streetcode/TickerBlock/Ticker.component';
import MapBlock from '@streetcode/MapBlock/MapBlock.component';

const StreetcodeContent = () => (
    <div className="streetcodeContainer">
        <ProgressBar>
            <MainBlock />
            <TextBlock />
            <InterestingFactsBlock />
            <MapBlock />
            <ArtGalleryBlock />
            <RelatedFiguresBlock />
            <SourcesBlock />
        </ProgressBar>
        <QRComponent />
        <PartnersComponent />
        <TickerComponent />
        <ScrollToTopBtn />
        <DonateBtn />
        <Footer />
    </div>
);

export default StreetcodeContent;
