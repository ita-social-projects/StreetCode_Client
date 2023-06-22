import './LightboxComponent.styles.scss';

import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import useMobx, { useModalContext } from '@stores/root-store';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/styles.css';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

const LightboxComponent = () => {
    const { streetcodeArtStore: { getStreetcodeArtArray } } = useMobx();
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { artGallery: { isOpen, fromCardId } } } = modalStore;

    const [isCaptionEnabled, setIsCaptionEnabled] = useState(true);

    const slides = useMemo(() => getStreetcodeArtArray.map(
        ({ art: { image: { base64, mimeType }, description, title }, index }) => ({
            src: base64ToUrl(base64, mimeType),
            title: `${index}/${getStreetcodeArtArray.length}`,
            description: `${title ?? ''}. \n\n${description ?? ''}`,
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
