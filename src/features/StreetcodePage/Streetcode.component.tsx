/* eslint-disable import/extensions */
/* eslint-disable global-require */
import './Streetcode.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ScrollToTopBtn from '@components/ScrollToTopBtn/ScrollToTopBtn.component';
import ProgressBar from '@features/ProgressBar/ProgressBar.component';
import { useModalContext, useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';
import DonateBtn from '@streetcode/DonateBtn/DonateBtn.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import QRBlock from '@streetcode/QRBlock/QR.component';
import SourcesBlock from '@streetcode/SourcesBlock/Sources.component';
import TextBlockComponent from '@streetcode/TextBlock/TextBlock.component';
import TickerBlock from '@streetcode/TickerBlock/Ticker.component';
import { toStreetcodeRedirectClickEvent } from '@utils/googleAnalytics.unility';
import { clearWindowHistoryState } from '@utils/window.utility';

import StatisticRecordApi from '@/app/api/analytics/statistic-record.api';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import ArtGallery from '@/app/common/components/ArtGallery/ArtGalleryBlock.component';
import TagsModalComponent from '@/app/common/components/modals/Tags/TagsModal.component';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import AuthService from '@/app/common/services/auth-service/AuthService';
import Streetcode from '@/models/streetcode/streetcode-types.model';

import InterestingFactsComponent from './InterestingFactsBlock/InterestingFacts.component';
import PartnersComponent from './PartnersBlock/Partners.component';
import RelatedFiguresComponent from './RelatedFiguresBlock/RelatedFigures.component';
import TimelineBlockComponent from './TimelineBlock/TimelineBlock.component';

const StreetcodeContent = () => {
    const { streetcodeStore } = useStreetcodeDataContext();
    const { setCurrentStreetcodeId } = streetcodeStore;
    const pageLoadercontext = useStreecodePageLoaderContext();
    const streetcodeUrl = useRef<string>(useRouteUrl());
    const [streetcodeUrlState, setStreetcodeUrlState] = useState(streetcodeUrl.current);

    const [activeTagId, setActiveTagId] = useState(0);
    const [showAllTags, setShowAllTags] = useState<boolean>(false);
    const [streetcode, setStreetcode] = useState<Streetcode>();

    const [ref, inView] = useInView({ threshold: 1 });
    const showModalOnScroll = useRef(true);
    const [haveBeenDisplayed, setHaveBeenDisplayed] = useState(false);
    const { modalStore: { setModal } } = useModalContext();

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const isMobile = useMediaQuery({
        query: '(max-width: 4800px)',
    });

    const handleSurveyModalOpen = () => {
        if (inView && !haveBeenDisplayed) {
            setHaveBeenDisplayed(true);
            setModal('survey', undefined, true);
            showModalOnScroll.current = false;
        }
    };
    setTimeout(handleSurveyModalOpen, 500);

    useAsync(async () => {
        const idParam = searchParams.get('qrid');
        if (idParam !== null) {
            const tempId = +idParam;
            try {
                const [exists] = await Promise.all([
                    StatisticRecordApi.existByQrId(tempId),
                    StatisticRecordApi.update(tempId),
                ]);
                if (exists) {
                    searchParams.delete('qrid');
                    setSearchParams(searchParams);
                }
            } catch {
                navigate(`/${streetcodeUrl.current}`, { replace: true });
            }
        }
    }, [streetcodeUrl, searchParams]);

    useEffect(() => {
        setCurrentStreetcodeId(streetcodeUrl.current).then((val) => {
            if ((val?.status === 0 && AuthService.isAdmin()) || val?.status !== 0) {
                setStreetcode(val);
            } else {
                navigate(`${FRONTEND_ROUTES.OTHER_PAGES.ERROR404}`, { replace: true });
            }
        });

        const fromPage = location.state?.fromPage;

        if (fromPage) {
            toStreetcodeRedirectClickEvent(streetcodeUrl.current, fromPage);
            clearWindowHistoryState();
        }

        return () => pageLoadercontext.resetLoadedBlocks();
    }, [streetcodeUrlState]);

    useEffect(() => {
        if (id) {
            streetcodeUrl.current = id;
            setStreetcodeUrlState(id);
        }
    }, [location.pathname, id]);

    return (
        <div className={`streetcodeContainer ${!pageLoadercontext.isPageLoaded ? 'no-scroll' : ''}`}>
            {!pageLoadercontext.isPageLoaded && (
                <div className="loader-container">
                    <img
                        className="spinner"
                        alt=""
                        src={isMobile
                            ? require('@images/gifs/Logo-animation_web.webp')
                            : require('@images/gifs/Logo-animation_mob.webp')}
                    />
                </div>
            )}
            <ProgressBar>
                <MainBlock
                    streetcode={streetcode}
                    setActiveTagId={setActiveTagId}
                    setShowAllTags={setShowAllTags}
                />
                <TextBlockComponent />
                <InterestingFactsComponent />
                <TimelineBlockComponent />
                {pageLoadercontext.isPageLoaded ? (
                    <ArtGallery isFillArtsStore />
                ) : (
                    <></>
                )}
                <RelatedFiguresComponent
                    streetcode={streetcode}
                    setActiveTagId={setActiveTagId}
                    setShowAllTags={setShowAllTags}
                />
                <SourcesBlock />
            </ProgressBar>
            <QRBlock />
            <PartnersComponent />
            <div className="sticky">
                <div className="sticky-content">
                    <ScrollToTopBtn />
                    <DonateBtn />
                </div>
            </div>
            <div ref={ref}>
                <TickerBlock type="subtitle" />
            </div>
            <TagsModalComponent
                activeTagId={activeTagId}
                setActiveTagId={setActiveTagId}
                showAllTags={showAllTags}
                setShowAllTags={setShowAllTags}
            />
        </div>
    );
};

export default observer(StreetcodeContent);
