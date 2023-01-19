import './DonateBtn.styles.scss';

import HandWithCoin from '@images/donates/HandWithCoin.svg';

import useMobx from '@stores/root-store';

const DonateBtn = () => {
    const { modalStore: { setModal } } = useMobx();

    return (
        <div
            className="donateBtnContainer"
            onClick={() => setModal('donates')}
        >
            <div className="donateBtnCircle">
                <HandWithCoin />
            </div>
            <h2 className="donateBtnText">
                задонатити
            </h2>
        </div>
    );
};

export default DonateBtn;
