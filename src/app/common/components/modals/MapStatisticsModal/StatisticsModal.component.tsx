import './StatisticsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';

import { Modal } from 'antd';

import ToponymsApi from '@/app/api/map/toponyms.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import useMobx, { useModalContext, useStreetcodeDataContext } from '@/app/stores/root-store';
import Toponym from '@/models/toponyms/toponym.model';

const countByStreetType = (toponyms: Toponym[]): Map<string, number> => toponyms?.reduce((acc, toponym) => {
    const { streetType } = toponym;
    if (streetType) {
        acc.set(streetType, (acc.get(streetType) || 0) + 1);
    }
    return acc;
}, new Map());

const StatisticsModal = () => {
    const { streetcodeStore: { getStreetCodeId } } = useStreetcodeDataContext();
    const toponyms = useAsync(() => {
        const streetcodeId = getStreetCodeId;
        if (streetcodeId > 0) {
            ToponymsApi.getByStreetcodeId(streetcodeId);
        }
    }, [getStreetCodeId]).value as Toponym[];
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { statistics } } = modalStore;
    const countByStreetTypeMap = countByStreetType(toponyms);
    const handleModalClose = () => {
        setModal('statistics');
    };

    return (
        <Modal
            className="statisticsModal"
            maskClosable
            centered
            footer={null}
            open={statistics.isOpen}
            onCancel={handleModalClose}
            closeIcon={<CancelBtn />}
        >
            <div className="statisticsModalsContainer">
                <h1>В Україні іменем Михайла Грушевського названі:</h1>
                <div className="streetsBlock" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {countByStreetTypeMap && [...countByStreetTypeMap.entries()].map(([streetType, count]) => (
                        <p style={{ flexBasis: '50%', width: '45%' }}>
                            {streetType}
:
                            {' '}
                            <span>{count}</span>
                        </p>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
export default observer(StatisticsModal);
