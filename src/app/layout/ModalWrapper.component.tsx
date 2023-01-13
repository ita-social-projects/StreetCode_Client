import InterestingFactsModal from '@components/modals/InterestingFacts/InterestingFactsModal.component';
import SourcesModal from '@components/modals/Sources/SourcesModal.component';
import RelatedFiguresModal from '../common/components/modals/RelatedFigures/RelatedFiguresModal.component';

const ModalWrapper = () => (
    <>
        <InterestingFactsModal />
        <RelatedFiguresModal />
        <SourcesModal />
    </>
);

export default ModalWrapper;
