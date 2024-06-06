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
    const { streetcodeArtSlideStore: {streetcodeArtSlides}} = useMobx();
    const { artStore: { mutationObserved } } = useMobx();
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { artGallery: { isOpen, fromCardId } } } = modalStore;

    const arts = streetcodeArtSlides.flatMap((artslide) => (artslide.streetcodeArts.flatMap((art) => (art.art))))

    const [isCaptionEnabled, setIsCaptionEnabled] = useState(true);

    const slides = useMemo(() => arts.map(
        ({ image: { base64, mimeType }, description, title }, index) => {
          let src = base64ToUrl(base64, mimeType);
          if (!src) {
            src = ''; //replace with default src
          }

          console.log("new img");

          return {
            src,
            title: `${index + 1}/${arts.length}`,
            description: `${title ?? ''} \n\n${description ?? ''}`,
          };
        }
      ), [arts]);
      

    const currentArtIndex = useMemo(() => arts.findIndex(
        (art) => art.id === fromCardId,
    ), [mutationObserved, fromCardId]);

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
            index={currentArtIndex}
            className={`lightbox ${!isCaptionEnabled ? 'lightboxDisabled' : ''}`}
            slides={slides}
            plugins={[Captions]}
        />
    );
};
export default observer(LightboxComponent);
