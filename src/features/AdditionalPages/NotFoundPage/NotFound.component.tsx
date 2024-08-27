import './NotFound.styles.scss';

import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const redirect = () => {
        navigate('../');
    };

    return (
        <div className="notFoundContainer">
            <Helmet>
                <title>Сторінка не знайдена | Streetcode</title>
                <meta name="description" content="Сторінка, яку ви шукаєте, не існує або була переміщена. Поверніться на головну сторінку або скористайтеся навігацією, щоб знайти те, що вам потрібно." />
            </Helmet>
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
