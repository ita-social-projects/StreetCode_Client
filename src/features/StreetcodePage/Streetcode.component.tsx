import './Streetcode.styles.scss';

import { useEffect, useState } from 'react';
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

const StreetcodeContent = () => {
    const isSticky = () => {
        const buttonDonate = document.querySelector('.donateBtnContainer');
        const buttonUp = document.querySelector('.scrollToTopBtnContainer');
        if (buttonDonate !== null && buttonUp !== null) {
            const scrollTop = window.scrollY;
            if (scrollTop >= 8050) {
                buttonDonate.classList.add('stickyDonate');
                buttonUp.classList.add('stickyToTop');
            } else {
                buttonDonate.classList.remove('stickyDonate');
                buttonUp.classList.remove('stickyToTop');
            }
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    }, []);

    return (
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
            <div className="stickies">
                <ScrollToTopBtn />
                <DonateBtn />
            </div>
            <Footer />
        </div>
    );
};

export default StreetcodeContent;
