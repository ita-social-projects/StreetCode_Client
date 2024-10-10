import './AdminPage.styles.scss';

import { Helmet } from 'react-helmet';

import PageBar from './PageBar/PageBar.component';
import StreetcodesTable from './StreetcodesTable/StreetcodesTable.component';

const AdminPage = () => (
    <div className="adminPageContainer">
        <Helmet>
            <title>Панель адміна | Streetcode</title>
            <meta name="description" content="Це сторінка адміна, де ти можеш керувати та налаштовувати інформацію на сайті." />
        </Helmet>
        <PageBar />
        <StreetcodesTable />
    </div>
);

export default AdminPage;
