import DonatesModal from '@components/modals/Donates/DonatesModal.component';
import HeaderLoginModal from '@components/modals/HeaderLogin/HeaderLoginModal.component';
import InterestingFactsModal from '@components/modals/InterestingFacts/InterestingFactsModal.component';
import LightboxModal from '@components/modals/Lightbox/Lightbox.component';
import RelatedFiguresModal from '@components/modals/RelatedFigures/RelatedFiguresModal.component';
import SourcesModal from '@components/modals/Sources/SourcesModal.component';
import AddTermModal from '@components/modals/Terms/AddTerm/AddTermModal.component';
import DeleteTermModal from '@components/modals/Terms/DeleteTerm/DeleteTermModal.component';
import EditTermModal from '@components/modals/Terms/EditTerm/EditTermModal.component';
import DeleteStreetcodeModal from '../common/components/modals/DeleteStreetcode/DeleteStreetcodeModal.component';

const ModalWrapper = () => (
    <>
        <InterestingFactsModal />
        <RelatedFiguresModal />
        <SourcesModal />
        <DonatesModal />
        <HeaderLoginModal />
        <LightboxModal />
        <AddTermModal />
        <EditTermModal />
        <DeleteTermModal />
        <DeleteStreetcodeModal />
    </>
);

export default ModalWrapper;
