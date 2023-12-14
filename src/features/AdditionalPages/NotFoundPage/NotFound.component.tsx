import './NotFound.styles.scss';

import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const redirect = () => {
        navigate('../');
    };

    return (
        <div className="notFoundContainer">
            <div className="notFoundNumber">404</div>
            <div className="content">
            А нехай йому!
                <br />
            Історія ще не створила цієї сторінки.
            </div>
            <button type="button" className="redirectToMain" onClick={redirect}>
                Гайда на головну!
            </button>
        </div>
    );
};

export default NotFound;
