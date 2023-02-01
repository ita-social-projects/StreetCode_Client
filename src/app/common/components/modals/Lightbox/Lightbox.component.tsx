import './LightboxComponent.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import useMobx from '@stores/root-store';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/styles.css';

const LightboxComponent = () => {
    const { streetcodeArtStore, modalStore } = useMobx();
    const { setModal, modalsState: { artGallery } } = modalStore;
    const index = artGallery.fromCardId!;
    const { getStreetcodeArtArray } = streetcodeArtStore;

    const slides = getStreetcodeArtArray.map((item) => ({
        src: item.art.image.url.href,
        title: `${item.index}/${getStreetcodeArtArray.length}`,
        description: `${
            item.art.image.url.title ? item.art.image.url.title : ''
        }. ${item.art.description ? item.art.description : ''}`,
    }));
    const [state, setState] = useState<boolean>(true);
    const [remaining, setRemaining] = useState<number>(0);

    const onIdle = () => {
        setState(false);
    };

    const onActive = () => {
        setState(true);
    };

    const { getRemainingTime } = useIdleTimer({
        onIdle,
        onActive,
        timeout: 3_000,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(getRemainingTime() / 1000));
        }, 500);

        return () => {
            clearInterval(interval);
        };
    });
    return (
        <Lightbox
            open={artGallery.isOpen}
            close={() => setModal('artGallery')}
            index={index}
            className={state ? 'lightboxWithCaptions' : 'lightboxWithoutCaptions'}
            slides={slides}
            plugins={[Captions]}
        />
    );
};
export default observer(LightboxComponent);
