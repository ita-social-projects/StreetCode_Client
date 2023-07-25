import './Streetcode.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ScrollToTopBtn from '@components/ScrollToTopBtn/ScrollToTopBtn.component';
import ProgressBar from '@features/ProgressBar/ProgressBar.component';
import { useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';
import DonateBtn from '@streetcode/DonateBtn/DonateBtn.component';
import MainBlock from '@streetcode/MainBlock/MainBlock.component';
import QRBlock from '@streetcode/QRBlock/QR.component';
import SourcesBlock from '@streetcode/SourcesBlock/Sources.component';
import TextBlockComponent from '@streetcode/TextBlock/TextBlock.component';
import TickerBlock from '@streetcode/TickerBlock/Ticker.component';

import StatisticRecordApi from '@/app/api/analytics/statistic-record.api';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import TagsModalComponent from '@/app/common/components/modals/Tags/TagsModal.component';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import Streetcode from '@/models/streetcode/streetcode-types.model';

import ArtGalleryBlockComponent from './ArtGalleryBlock/ArtGalleryBlock.component';
import InterestingFactsComponent from './InterestingFactsBlock/InterestingFacts.component';
import MapBlock from './MapBlock/MapBlock.component';
import PartnersComponent from './PartnersBlock/Partners.component';
import RelatedFiguresComponent from './RelatedFiguresBlock/RelatedFigures.component';
import TimelineBlockComponent from './TimelineBlock/TimelineBlock.component';

const StreetcodeContent = () => {
    const { streetcodeStore } = useStreetcodeDataContext();
    const { setCurrentStreetcodeId } = streetcodeStore;
    const pageLoadercontext = useStreecodePageLoaderContext();
    const streetcodeUrl = useRef<string>(useRouteUrl());

    const [activeTagId, setActiveTagId] = useState(0);
    const [activeBlock, setActiveBlock] = useState(0);
    const [streetcode, setStreecode] = useState<Streetcode>();

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const isMobile = useMediaQuery({
        query: '(max-width: 4800px)',
    });
    const checkExist = async (qrId: number) => {
        const exist = await StatisticRecordApi.existByQrId(qrId);
        return exist;
    };

    const checkStreetcodeExist = async (url: string) => {
        const exist = await StreetcodesApi.existWithUrl(url);
        return exist;
    };

    const addCount = async (qrId: number) => {
        await StatisticRecordApi.update(qrId);
    };

    useAsync(() => {
        Promise.all([checkStreetcodeExist(streetcodeUrl.current)])
            .then((response) => {
                if (!response[0]) {
                    navigate(`${FRONTEND_ROUTES.OTHER_PAGES.ERROR404}`, { replace: true });
                }
            });

        const idParam = searchParams.get('qrid');
        if (idParam !== null) {
            const tempId = +idParam;
            Promise.all([checkExist(tempId), addCount(tempId)]).then(
                (resp) => {
                    if (resp.at(0) && resp.at(1) !== null) {
                        searchParams.delete('qrid');
                        setSearchParams(searchParams);
                    }
                },
            ).catch(
                () => {
                    navigate(`${FRONTEND_ROUTES.OTHER_PAGES.ERROR404}`, { replace: true });
                },
            );
        }
    });

    useEffect(() => {
        setCurrentStreetcodeId(streetcodeUrl.current).then((val) => setStreecode(val));
    }, []);

    return (
        <div className="streetcodeContainer">
            {!pageLoadercontext.isPageLoaded && (
                <div className="loader-container">
                    <img
                        className="spinner"
                        alt=""
                        src={isMobile
                            ? require('@images/gifs/Logo-animation_web.gif')
                            : require('@images/gifs/Logo-animation_mob.gif')}
                    />
                </div>
            )}
            <ProgressBar>
                <MainBlock
                    streetcode={streetcode}
                    setActiveTagId={setActiveTagId}
                    setActiveBlock={setActiveBlock}
                />
                <TextBlockComponent />
                <InterestingFactsComponent />
                <TimelineBlockComponent />
                <MapBlock />
                <ArtGalleryBlockComponent />
                <RelatedFiguresComponent setActiveTagId={setActiveTagId} />
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
            <TickerBlock />
            <TagsModalComponent
                activeTagId={activeTagId}
                setActiveTagId={setActiveTagId}
                activeTagBlock={activeBlock}
            />
        </div>
    );
};

export default observer(StreetcodeContent);
