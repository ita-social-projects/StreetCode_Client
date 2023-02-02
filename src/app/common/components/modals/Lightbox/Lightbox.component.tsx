import './LightboxComponent.styles.scss';

import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import useMobx from '@stores/root-store';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/styles.css';

const LightboxComponent = () => {
    const { streetcodeArtStore: { getStreetcodeArtArray }, modalStore } = useMobx();
    const { setModal, modalsState: { artGallery: { isOpen, fromCardId } } } = modalStore;

    const [isCaptionEnabled, setIsCaptionEnabled] = useState(true);

    const slides = useMemo(() => getStreetcodeArtArray.map(
        ({ art: { image: { url }, description }, index }) => ({
            src: url.href,
            title: `${index}/${getStreetcodeArtArray.length}`,
            description: `${url.title ?? ''}. ${description ?? ''}`,
        }),
    ), [getStreetcodeArtArray]);

    const onIdleTimerHandlers = useMemo(() => ({
        onIdle: () => setIsCaptionEnabled(false),
        onActive: () => setIsCaptionEnabled(true),
    }), []);

    useIdleTimer({
        ...onIdleTimerHandlers,
        timeout: 3_000,
    });

    return (
        <Lightbox
            open={isOpen}
            close={() => setModal('artGallery')}
            index={fromCardId}
            className={`lightbox ${!isCaptionEnabled ? 'disabled' : ''}`}
            slides={slides}
            plugins={[Captions]}
        />
    );
};
export default observer(LightboxComponent);
