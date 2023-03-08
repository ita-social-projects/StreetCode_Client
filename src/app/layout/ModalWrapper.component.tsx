import DonatesModal from '@components/modals/Donates/DonatesModal.component';
import HeaderLoginModal from '@components/modals/HeaderLogin/HeaderLoginModal.component';
import InterestingFactsModal from '@components/modals/InterestingFacts/InterestingFactsModal.component';
import InterestingFactsModalAdd from '@/app/common/components/modals/InterestingFacts/admin/InterestingFactsModalAdd.component';
import InterestingFactsModalEdit from '@/app/common/components/modals/InterestingFacts/admin/InterestingFactsModalEdit.component';
import LightboxModal from '@components/modals/Lightbox/Lightbox.component';
import RelatedFiguresModal from '@components/modals/RelatedFigures/RelatedFiguresModal.component';
import SourcesModal from '@components/modals/Sources/SourcesModal.component';

const ModalWrapper = () => (
    <>
        <InterestingFactsModal />
        <RelatedFiguresModal />
        <SourcesModal />
        <DonatesModal />
        <HeaderLoginModal />
        <LightboxModal />
        <InterestingFactsModalAdd />
        <InterestingFactsModalEdit />
    </>
);

export default ModalWrapper;
