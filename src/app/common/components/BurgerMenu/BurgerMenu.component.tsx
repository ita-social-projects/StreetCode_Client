import './BurgerMenu.styles.scss';

interface Props {
    onClick?: () => void;
}

function BurgerMenu({ onClick }: Props) {
  return (
    <div className="burgerMenuContainer" onClick={onClick}>
      <span className="burgerMenuItem" />
      <span className="burgerMenuItem" />
      <span className="burgerMenuItem" />
    </div>
);
}

export default BurgerMenu;
