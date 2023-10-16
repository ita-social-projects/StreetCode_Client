import './LightboxComponent.styles.scss';

import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import useMobx, { useModalContext } from '@stores/root-store';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/styles.css';

const LightboxComponent = () => {
    const { artStore: { arts } } = useMobx();
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { artGallery: { isOpen, fromCardId } } } = modalStore;

    const [isCaptionEnabled, setIsCaptionEnabled] = useState(true);

    const slides = useMemo(() => arts.map(
        ({ image: { base64, mimeType }, description, title }) => ({
            src: base64ToUrl(base64, mimeType),
            title: `'REMOVED_INDEX'/${arts.length}`,
            description: `${title ?? ''}. \n\n${description ?? ''}`,
        }),

    ), [arts]);

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
