import './HeaderLoginModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import { useModalContext } from '@stores/root-store';
import scrollWithOffset from '@utils/window.utility';

import { Button, Modal } from 'antd';

import JobApi from '@/app/api/job/Job.api';
import {
    becomePartnerEvent,
    donateEvent,
    joinToStreetcodeClickEvent,
} from '@/app/common/utils/googleAnalytics.unility';

const HeaderLoginModal = () => {
    const [hasVacancies, setHasVacancies] = useState(false);
    const SURVEY_LINK = 'https://forms.gle/eWwX5RP84X7dymLR6';
    const { modalStore: { setModal, modalsState: { login } } } = useModalContext();

    const handleClick = () => login.isOpen = false;

    useEffect(() => {
        if (login.isOpen) {
            JobApi.getActive()
                .then((result) => {
                    setHasVacancies(result.length > 0);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [login.isOpen]);

    const becomePartnerHandler = () => {
        login.isOpen = false;
        setModal('partners');
        becomePartnerEvent('modal');
    };

    const joinToTeamHandler = () => {
        login.isOpen = false;
    };

    return (
        <Modal
            className="loginModal"
            open={login.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={handleClick}
            closeIcon={<CancelBtn />}
        >
            <div className="loginModalContent">
                <Button onClick={() => open(SURVEY_LINK)}>
                    Пройти опитування
                </Button>
                <Button onClick={becomePartnerHandler}>
                    Стати партнером
                </Button>
                {hasVacancies && (
                    <Button onClick={() => {
                        joinToStreetcodeClickEvent();
                        joinToTeamHandler();
                    }}
                    >
                        <Link
                            to={`${FRONTEND_ROUTES.OTHER_PAGES.ABOUT_US}#vacancies`}
                            scroll={(el: any) => scrollWithOffset(el, 100)}
                            className="linkInsideButton"
                        >
                            Долучитися до команди
                        </Link>
                    </Button>
                )}
                <Button onClick={() => {
                    setModal('donates');
                    setModal('login');
                    donateEvent('header_modal');
                }}
                >
                    Задонатити
                </Button>
            </div>
        </Modal>
    );
};

export default observer(HeaderLoginModal);
