import ConfirmationModal from '@components/modals/ConfirmationModal/ConfirmationModal.component';
import DonatesModal from '@components/modals/Donates/DonatesModal.component';
import HeaderLoginModal from '@components/modals/HeaderLogin/HeaderLoginModal.component';
import InterestingFactsModal from '@components/modals/InterestingFacts/InterestingFactsModal.component';
import LightboxModal from '@components/modals/Lightbox/Lightbox.component';
import RelatedFiguresModal from '@components/modals/RelatedFigures/RelatedFiguresModal.component';
import SourcesModal from '@components/modals/Sources/SourcesModal.component';

import DeleteStreetcodeModal from '../common/components/modals/DeleteStreetcode/DeleteStreetcodeModal.component';

const ModalWrapper = () => (
    <>
        <InterestingFactsModal />
        <RelatedFiguresModal />
        <SourcesModal />
        <DonatesModal />
        <HeaderLoginModal />
        <LightboxModal />
        <DeleteStreetcodeModal />
        <ConfirmationModal />
    </>
);

export default ModalWrapper;
