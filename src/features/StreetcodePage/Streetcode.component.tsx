import './Streetcode.styles.scss';

import { useState } from 'react';
import NavigableBlockWrapper, { MeasuredBlock }
    from '@features/ProgressBar/block-wrappers/StreetcodePageWrapper.component';
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

const StreetcodeContent = () => {
    const [blocks, setBlocks] = useState<MeasuredBlock[]>([]);

    return (
        <div className="streetcodeContainer">
            <ProgressBar blocks={blocks} />
            <MainBlock />
            <NavigableBlockWrapper setBlocks={setBlocks}>
                <TextComponent />
                <InterestingFactsComponent />
                <RelatedFiguresComponent />
                <SourcesComponent />
                <InterestingFactsComponent />
            </NavigableBlockWrapper>
            <QRComponent />
            <PartnersComponent />
            <TickerComponent />
            <Footer />
        </div>
    );
};

export default StreetcodeContent;
