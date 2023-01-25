import './Streetcode.styles.scss';

import ScrollToTopBtn from '@components/ScrollToTopBtn/ScrollToTopBtn.component';
import ProgressBar from '@features/ProgressBar/ProgressBar.component';
import Footer from '@layout/footer/Footer.component';
import DonateBtn from '@streetcode/DonateBtn/DonateBtn.component';
import InterestingFactsComponent from '@streetcode/InterestingFactsBlock/InterestingFacts.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import PartnersComponent from '@streetcode/PartnersBlock/Partners.component';
import QRComponent from '@streetcode/QRBlock/QR.component';
import RelatedFiguresComponent from '@streetcode/RelatedFiguresBlock/RelatedFigures.component';
import SourcesComponent from '@streetcode/SourcesBlock/Sources.component';
import TextComponent from '@streetcode/TextBlock/TextBlock.component';
import TickerComponent from '@streetcode/TickerBlock/Ticker.component';
import ArtGalleryBlockComponent from '@streetcode/ArtGalleryBlock/ArtGalleryBlock.component';

const StreetcodeContent = () => (
    <div className="streetcodeContainer">
<<<<<<< feat/streetcode-art-gallery
        <HeaderBlock />
        <MainBlock />
        <TextComponent />
        <InterestingFactsComponent />
        <ArtGalleryBlockComponent />
        <RelatedFiguresComponent />
        <SourcesComponent />
=======
        <ProgressBar waitMsOnRender={100}>
            <MainBlock />
            <TextComponent />
            <InterestingFactsComponent />
            <RelatedFiguresComponent />
            <SourcesComponent />
        </ProgressBar>
>>>>>>> master
        <QRComponent />
        <PartnersComponent />
        <TickerComponent />
        <ScrollToTopBtn />
        <DonateBtn />
        <Footer />
    </div>
);

export default StreetcodeContent;
