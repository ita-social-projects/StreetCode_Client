import './HeaderDrawer.styles.scss';

import BurgerMenu from '@components/BurgerMenu/BurgerMenu.component';
import useToggle from '@hooks/stateful/useToggle.hook';

import { Drawer } from 'antd';

const HeaderDrawer = () => {
    const { toggleState: drawerState, handlers: { toggle: toggleDrawer } } = useToggle();

    return (
        <>
            <Drawer
                placement="right"
                closable
                onClose={toggleDrawer}
                open={drawerState}
            >
                <div className="headerDrawerContainer">
                    <span>Головна</span>
                    <span>Стріткоди</span>
                    <span>Про нас</span>
                    <span>Партнери</span>
                    <span>Донати</span>
                    <span>Вакансії</span>
                    <span>Контакти</span>
                </div>
            </Drawer>
            <BurgerMenu onClick={toggleDrawer} />
        </>
    );
};

export default HeaderDrawer;
