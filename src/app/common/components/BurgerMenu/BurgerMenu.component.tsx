import { url } from 'inspector';
import './BurgerMenu.styles.scss';
import  burgerIcon  from '../../../../assets/images/header/burger.png';

interface Props {
    onClick?: () => void;
}

const BurgerMenu = ({ onClick} : Props) => (
    <div className="burgerMenuContainer" onClick={onClick}>
        <img src={burgerIcon} alt="burger"/>
    </div>
);

export default BurgerMenu;
