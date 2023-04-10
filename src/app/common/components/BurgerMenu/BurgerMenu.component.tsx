import './BurgerMenu.styles.scss';
import  burgerIcon  from '@assets/images/header/burger.png';
import burgerIconMobile from '@assets/images/header/burger_mobile.png';
import useWindowSize from '../../hooks/stateful/useWindowSize.hook';

interface Props {
    onClick?: () => void;
}

const BurgerMenu = ({ onClick} : Props) => {
    const windowSize = useWindowSize();
    
    return (
        <div className="burgerMenuContainer" onClick={onClick}>
            <img alt="burger" src={ 
                windowSize.width > 1024 ?
                burgerIcon :
                burgerIconMobile
            }/>
        </div>
    );
};

export default BurgerMenu;
