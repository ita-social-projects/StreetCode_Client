
import './StatisticsModal.styles.scss';
import Toponym from '@/models/toponyms/toponym.model';
import { Modal } from 'antd';
import useMobx from '@/app/stores/root-store';
import { observer } from 'mobx-react-lite';
import ToponymsApi from '@/app/api/map/toponyms.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';


const countByStreetType = (toponyms: Toponym[]): Map<string, number> => {
    return toponyms?.reduce((acc, toponym) => {
      const streetType = toponym.streetType;
      if (streetType) {
        acc.set(streetType, (acc.get(streetType) || 0) + 1);
      }
      return acc;
    }, new Map());
  };

const StatisticsModal = () => {
    const { streetcodeStore: { getStreetCodeId } } = useMobx();
    const toponyms = useAsync(() => ToponymsApi
    .getByStreetcodeId(getStreetCodeId), [getStreetCodeId]).value as Toponym[];
    const {  modalStore } = useMobx();
    const { setModal, modalsState: { statistics } } = modalStore;
    const countByStreetTypeMap = countByStreetType(toponyms);
    const handleModalClose = () => {
        setModal('statistics'); 
    };

    return (
        <Modal 
        className='statisticsModal'
        maskClosable
        centered
        footer={null}
        open={statistics.isOpen}
        onCancel={handleModalClose}
        closeIcon={<CancelBtn />}>
            <div className='statisticsModalsContainer'>
            <h1>В Україні іменем Михайла Грушевського названі:</h1>
            <div className="streetsBlock" style={{ display: 'flex', flexWrap: 'wrap'}}>
                {countByStreetTypeMap && [...countByStreetTypeMap.entries()].map(([streetType, count]) => (
                    <p style={{ flexBasis: '50%', width: '45%' }}>
                        {streetType}: <span>{count}</span> 
                    </p>
                ))}
            </div>
            </div>
        </Modal>
    );
};
export default observer(StatisticsModal);