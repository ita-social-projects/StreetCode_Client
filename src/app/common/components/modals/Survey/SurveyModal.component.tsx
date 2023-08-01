/* eslint-disable max-len */
import './SurveyModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';

import { Button, Modal } from 'antd';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import { useModalContext } from '@/app/stores/root-store';

const SurveyModal = () => {
    const SURVEY_LINK = 'https://forms.gle/eWwX5RP84X7dymLR6';
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { survey } } = modalStore;

    const handleModalClose = () => {
        setModal('survey');
    };

    return (
        <Modal
            className="surveyModal"
            open={survey.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={handleModalClose}
            closeIcon={<CancelBtn />}
        >
            <div className="surveyModalContent">
                <h1>Привіт, стріткодере/ко!</h1>
                <br />
                <h3>Цей сайт для тебе. Створений і наповнений з любов'ю, з історією та про історію. Наразі він працює в тестовому режимі. So, we need your help 😊</h3>
                <br />
                <h3>Пройди, будь ласка, коротеньке опитування, вкажи нам про всі зручності/незручності, баги/спотикачки і що ще тобі муляє. Це допоможе нам зробити сайт максимально user-friendly!</h3>
                <br />
                <h3>Зазнач в опитуванні електронну пошту, і ми подякуємо тобі креативним стікерпаком для сториз!</h3>
                <br />
                <Button className="surveyModalBtnContainer" onClick={() => open(SURVEY_LINK)}>
                    <a>Пройти опитування</a>
                </Button>
            </div>
        </Modal>
    );
};

export default observer(SurveyModal);
