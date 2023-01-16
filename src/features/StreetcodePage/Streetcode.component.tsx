import './Streetcode.styles.scss';

import Footer from '@layout/footer/Footer.component';
import HeaderBlock from '@layout/header/HeaderBlock.component';
import InterestingFactsComponent from '@streetcode/InterestingFactsBlock/InterestingFacts.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import PartnersComponent from '@streetcode/PartnersBlock/Partners.component';
import QRComponent from '@streetcode/QRBlock/QR.component';
import RelatedFiguresComponent from '@streetcode/RelatedFiguresBlock/RelatedFigures.component';
import SourcesComponent from '@streetcode/SourcesBlock/Sources.component';
import TextComponent from '@streetcode/TextBlock/TextBlock.component';
import TickerComponent from '@streetcode/TickerBlock/Ticker.component';
import ArtGallery from './ArtGallery/ArtGallery.component';

const StreetcodeContent = () => (
    <div className="streetcodeContainer">
        <HeaderBlock />
        <MainBlock />
        <TextComponent />
        <InterestingFactsComponent />
        <ArtGallery />
        <RelatedFiguresComponent />
        <SourcesComponent />
        <QRComponent />
        <PartnersComponent />
        <TickerComponent />
        <Footer />
    </div>
);

export default StreetcodeContent;
