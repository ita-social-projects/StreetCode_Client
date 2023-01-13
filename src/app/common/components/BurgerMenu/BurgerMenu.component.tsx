import './BurgerMenu.styles.scss';

interface Props {
    onClick?: () => void;
}

const BurgerMenu = ({ onClick }: Props) => (
    <div className="burgerMenuContainer" onClick={onClick}>
        <span className="burgerMenuItem" />
        <span className="burgerMenuItem" />
        <span className="burgerMenuItem" />
    </div>
);

export default BurgerMenu;
