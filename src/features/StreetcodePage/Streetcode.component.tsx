import './Streetcode.styles.scss';

import ProgressBar from '@features/ProgressBar/ProgressBar.component';
import Footer from '@layout/footer/Footer.component';
import InterestingFactsComponent from '@streetcode/InterestingFactsBlock/InterestingFacts.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import PartnersComponent from '@streetcode/PartnersBlock/Partners.component';
import QRComponent from '@streetcode/QRBlock/QR.component';
import RelatedFiguresComponent from '@streetcode/RelatedFiguresBlock/RelatedFigures.component';
import SourcesComponent from '@streetcode/SourcesBlock/Sources.component';
import TextComponent from '@streetcode/TextBlock/TextBlock.component';
import TickerComponent from '@streetcode/TickerBlock/Ticker.component';

const StreetcodeContent = () => (
    <div className="streetcodeContainer">
        <MainBlock />
        <ProgressBar waitMsOnRender={50}>
            <TextComponent />
            <InterestingFactsComponent />
            <RelatedFiguresComponent />
            <SourcesComponent />
            <InterestingFactsComponent />
        </ProgressBar>
        <QRComponent />
        <PartnersComponent />
        <TickerComponent />
        <Footer />
    </div>
);

export default StreetcodeContent;
