import "./Streetcode.styles.scss";

import SourcesComponent from "@features/StreetcodePage/SourcesBlock/Sources.component";
import InterestingFactsComponent from "./InterestingFactsBlock/InterestingFacts.component";
import QRComponent from "./QRBlock/QR.component";
import MainBlock from "@features/StreetcodePage/MainBlock/MainBlock.component";
import TextComponent from "@streetcode/TextBlock/TextBlock.component";
import RelatedFiguresComponent from "@features/StreetcodePage/RelatedFiguresBlock/RelatedFigures.component";
import HeaderBlock from "@layout/header/HeaderBlock.component";
import TickerComponent from "@features/StreetcodePage/TickerBlock/Ticker.component";
import PartnersComponent from "@features/StreetcodePage/PartnersBlock/Partners.component";
import Footer from "@layout/footer/Footer.component";

interface Props {

}

const StreetcodeContent = (props: Props) => (
    <div className='streetcodeContainer'>
        <HeaderBlock />
        <MainBlock />
        <TextComponent />
        <InterestingFactsComponent />
        <RelatedFiguresComponent />
        <SourcesComponent />
        <QRComponent />
        <PartnersComponent />
        <TickerComponent />
        <Footer />
    </div>
);

export default StreetcodeContent;