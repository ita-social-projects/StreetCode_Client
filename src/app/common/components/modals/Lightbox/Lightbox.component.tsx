import './LightboxComponent.styles.scss';

import { observer } from 'mobx-react-lite';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';

import useMobx from '@/app/stores/root-store';

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
        title: `${item.artId}/${getStreetcodeArtArray.length}`,
        description: `${
            item.art.image.url.title ? item.art.image.url.title : ''
        }\n\n${item.art.description ? item.art.description : ''}`,
    }));

    return (
        <Lightbox
            open={artGallery.isOpen}
            close={() => setModal('artGallery')}
            index={index}
            className="lightbox"
            slides={slides}
            plugins={[Captions]}
        />
    );
};
export default observer(LightboxComponent);
