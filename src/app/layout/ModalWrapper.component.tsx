import ConfirmationModal from '@components/modals/ConfirmationModal/ConfirmationModal.component';
import DeleteStreetcodeModal from '@components/modals/DeleteStreetcode/DeleteStreetcodeModal.component';
import DonatesModal from '@components/modals/Donates/DonatesModal.component';
import HeaderLoginModal from '@components/modals/HeaderLogin/HeaderLoginModal.component';
import LightboxModal from '@components/modals/Lightbox/Lightbox.component';
import PartnersModal from '@components/modals/Partners/PartnersModal.component';
import RelatedFigureItemModal from '@components/modals/RelatedFigures/RelatedFigureItemModal.component';
import RelatedFiguresModal from '@components/modals/RelatedFigures/RelatedFiguresModal.component';
import SourcesModal from '@components/modals/Sources/SourcesModal.component';
import StatisticsModal from '@components/modals/MapStatisticsModal/StatisticsModal.component';
const ModalWrapper = () => (
    <>
        <InterestingFactsModal />
        <RelatedFiguresModal />
        <SourcesModal />
        <DonatesModal />
        <HeaderLoginModal />
        <LightboxModal />
        <PartnersModal />
        <DeleteStreetcodeModal />
        <ConfirmationModal />
        <RelatedFigureItemModal />
        <StatisticsModal/>
    </>
);

export default ModalWrapper;
