import './Streetcode.styles.scss';

import { lazy, Suspense, useEffect, useState } from 'react';
import ScrollToTopBtn from '@components/ScrollToTopBtn/ScrollToTopBtn.component';
import ProgressBar from '@features/ProgressBar/ProgressBar.component';
import Footer from '@layout/footer/Footer.component';
import useMobx from '@stores/root-store';
import DonateBtn from '@streetcode/DonateBtn/DonateBtn.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import QRBlock from '@streetcode/QRBlock/QR.component';
import SourcesBlock from '@streetcode/SourcesBlock/Sources.component';
import TextBlockComponent from '@streetcode/TextBlock/TextBlock.component';
import TickerBlock from '@streetcode/TickerBlock/Ticker.component';

import TagsModalComponent from '@/app/common/components/modals/Tags/TagsModal.component';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import dayjs from 'dayjs';

const PartnersLazyComponent = lazy(() => import('@streetcode/PartnersBlock/Partners.component'));
const MapLazy = lazy(() => import('@streetcode/MapBlock/MapBlock.component'));
const InterestingFactsLazy = lazy(() => import('@streetcode/InterestingFactsBlock/InterestingFacts.component'));
const TimelineLazy = lazy(() => import('@streetcode/TimelineBlock/TimelineBlock.component'));
const ArtGalleryLazy = lazy(() => import('@streetcode/ArtGalleryBlock/ArtGalleryBlock.component'));
const RelatedFiguresLazy = lazy(() => import('@streetcode/RelatedFiguresBlock/RelatedFigures.component'));

const StreetcodeContent = () => {
    const streetcodeUrl = useRouteUrl();
    const [activeTagId, setActiveTagId] = useState(0);
    const [activeBlock, setActiveBlock] = useState(0);
    const { streetcodeStore } = useMobx();
    const { setCurrentStreetcodeId } = streetcodeStore;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setCurrentStreetcodeId(streetcodeUrl).then(() => {
            setTimeout(() => {
                setLoaded(true);
            }, 100);
        });
    }, [setCurrentStreetcodeId, streetcodeUrl]);

    return (
        <div className="streetcodeContainer">
            {
                loaded && (
                    <>
                        <ProgressBar>
                            <MainBlock
                                setActiveTagId={setActiveTagId}
                                setActiveBlock={setActiveBlock}
                            />
                            <TextBlockComponent />
                            <Suspense>
                                <InterestingFactsLazy />
                            </Suspense>
                            <Suspense>
                                <TimelineLazy />
                            </Suspense>
                            <Suspense>
                                <MapLazy />
                            </Suspense>
                            <Suspense>
                                <ArtGalleryLazy />
                            </Suspense>
                            <Suspense>
                                <RelatedFiguresLazy
                                    setActiveTagId={setActiveTagId}
                                />
                            </Suspense>
                            <Suspense>
                                <SourcesBlock />
                            </Suspense>
                        </ProgressBar>
                        <QRBlock />
                        <Suspense>
                            <PartnersLazyComponent />
                        </Suspense>
                    </>
                )
            }
            <div className="sticky">
                <div className="sticky-content">
                    <ScrollToTopBtn />
                    <DonateBtn />
                </div>
            </div>
            <TickerBlock />
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
