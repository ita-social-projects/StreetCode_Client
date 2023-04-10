import './NotFound.styles.scss';

const NotFound = () => (
    <div className="notFoundContainer">
        <div className="notFoundNumber">404</div>
        <div className="content">
            А нехай йому!
            <br />
            Історія ще не створила цієї сторінки.
        </div>
        <div className="redirect">
            <a href="https://streetcode/main.com" className="redirectToMain">Гайда на головну!</a>
        </div>
    </div>
);

export default NotFound;
