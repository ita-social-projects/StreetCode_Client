import './RedirectPage.styles.scss';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // api calls

        // first call for add +1

        // second call to get url

        // redirect

        console.log('Redirect is on...');

        setTimeout(() => {
            navigate('/streetcode/taras-shevchenko');
        }, 3000);
    });

    return (
        <div>
            <p>Redirect...</p>
        </div>
    );
};

export default RedirectPage;
