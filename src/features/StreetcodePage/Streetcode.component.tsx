import './Streetcode.styles.scss';

import { lazy, Suspense, useEffect, useState } from 'react';
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

import TagsModalComponent from '@/app/common/components/modals/Tags/TagsModal.component';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
// eslint-disable-next-line import/extensions
import useMobx from '@/app/stores/root-store';

const TextLazyComponent = lazy(() => import('@streetcode/TextBlock/TextBlock.component'));
const PartnersLazyComponent = lazy(() => import('@streetcode/PartnersBlock/Partners.component'));

const StreetcodeContent = () => {
    const streetcodeUrl = useRouteUrl();
    const [activeTagId, setActiveTagId] = useState(0);
    const [activeBlock, setActiveBlock] = useState(0);
    const { streetcodeStore } = useMobx();
    const { setCurrentStreetcodeId } = streetcodeStore;
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

    useEffect(() => {
        setCurrentStreetcodeId(streetcodeUrl);
    }, [setCurrentStreetcodeId, streetcodeUrl]);

    return (
        <div className="streetcodeContainer">
            <ProgressBar>
                <MainBlock
                    setActiveTagId={setActiveTagId}
                    setActiveBlock={setActiveBlock}
                />
                <Suspense fallback={<div>Loading...</div>}>
                    <TextLazyComponent />
                </Suspense>
                <InterestingFactsBlock />
                <TimelineBlock />
                <MapBlock />
                <ArtGalleryBlock />
                <RelatedFiguresBlock
                    setActiveTagId={setActiveTagId}
                />
                <SourcesBlock />
            </ProgressBar>
            <QRBlock />
            <Suspense fallback={<div>Loading...</div>}>
                <PartnersLazyComponent />
            </Suspense>
            <TickerBlock />
            <div className="stickies">
                <ScrollToTopBtn />
                <DonateBtn />
            </div>
            <Footer />
            <TagsModalComponent
                activeTagId={activeTagId}
                setActiveTagId={setActiveTagId}
                activeTagBlock={activeBlock}
            />
        </div>
    );
};

export default StreetcodeContent;
