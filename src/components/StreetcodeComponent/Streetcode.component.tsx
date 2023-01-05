import './Streetcode.styles.scss';

import { FC, useEffect } from 'react';
import HeaderBlock from '@features/HeaderBlock/HeaderBlock.component';
import MainBlock from '@features/MainBlock/MainBlock.component';
import PartnersComponent from '@features/PartnersBlock/Partners.component';
import RelatedFiguresComponent from '@features/RelatedFiguresBlock/RelatedFigures.component';
import SourcesComponent from '@features/SourcesBlock/Sources.component';
import TextComponent from '@features/TextBlock/Text.component';
import TickerComponent from '@features/TickerBlock/Ticker.component';
import Footer from '@layout/footer/Footer.component';

import InterestingFactsComponent from '../InterestingFacts/InterestingFacts.component';
import QRComponent from '../QRBlock/QR.component';

interface Props {

}

function StreetcodeContent(props: Props) {
  const a = 3;

    return (
      <div className="streetcodeContainer">
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
}

export default StreetcodeContent;
