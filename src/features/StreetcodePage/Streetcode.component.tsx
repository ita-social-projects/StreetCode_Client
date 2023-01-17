import './Streetcode.styles.scss';

import Footer from '@layout/footer/Footer.component';
import HeaderBlock from '@layout/header/HeaderBlock.component';
import InterestingFactsComponent from '@streetcode/InterestingFactsBlock/InterestingFacts.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import PartnersComponent from '@streetcode/PartnersBlock/Partners.component';
import ProgressBar from '@streetcode/ProgressBar/ProgressBar.component';
import QRComponent from '@streetcode/QRBlock/QR.component';
import RelatedFiguresComponent from '@streetcode/RelatedFiguresBlock/RelatedFigures.component';
import SourcesComponent from '@streetcode/SourcesBlock/Sources.component';
import TextComponent from '@streetcode/TextBlock/TextBlock.component';
import TickerComponent from '@streetcode/TickerBlock/Ticker.component';
import StreetcodePageWrapper, {Block} from './StreetcodePageWrapper.component';
import { useState } from 'react';

const StreetcodeContent = () => {
    const [blocks, setBlocks] = useState<Block[]>([])
    return (
        <div className="streetcodeContainer">
            <HeaderBlock />
            <ProgressBar blocks={blocks}/>
            <MainBlock />
            <StreetcodePageWrapper setBlocks={setBlocks}>
                <TextComponent />
                <InterestingFactsComponent />
                <RelatedFiguresComponent />
                <SourcesComponent />
            </StreetcodePageWrapper>
            <QRComponent />
            <PartnersComponent />
            <TickerComponent />
            <Footer />
        </div>
    )
}

export default StreetcodeContent;
