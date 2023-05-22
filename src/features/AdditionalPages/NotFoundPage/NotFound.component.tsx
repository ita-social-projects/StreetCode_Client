import './NotFound.styles.scss';

import { useNavigate } from 'react-router-dom';
import Footer from '@layout/footer/Footer.component';

import Link from 'antd/es/typography/Link';

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
            <div className="redirect">
                <Link onClick={redirect} className="redirectToMain">Гайда на головну!</Link>
            </div>
        </div>
    );
};

export default NotFound;
