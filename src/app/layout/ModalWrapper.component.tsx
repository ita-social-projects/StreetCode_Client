import DonatesModal from '@components/modals/Donates/DonatesModal.component';
import HeaderLoginModal from '@components/modals/HeaderLogin/HeaderLoginModal.component';
import InterestingFactsModal from '@components/modals/InterestingFacts/InterestingFactsModal.component';
import LightboxModal from '@components/modals/Lightbox/Lightbox.component';
import RelatedFiguresModal from '@components/modals/RelatedFigures/RelatedFiguresModal.component';
import RelatedFigureItemModal from '@components/modals/RelatedFigures/RelatedFigureItemModal.component';
import SourcesModal from '@components/modals/Sources/SourcesModal.component';
import InterestingFactsAdminModal from '@components/modals/InterestingFacts/FactsAdminModal/InterestingFactsAdminModal.component';

import DeleteStreetcodeModal from '../common/components/modals/DeleteStreetcode/DeleteStreetcodeModal.component';

const ModalWrapper = () => (
    <>
        <InterestingFactsModal />
        <RelatedFiguresModal />
        <SourcesModal />
        <DonatesModal />
        <HeaderLoginModal />
        <LightboxModal />
        <RelatedFigureItemModal />
        <InterestingFactsAdminModal />
    </>
);

export default ModalWrapper;
