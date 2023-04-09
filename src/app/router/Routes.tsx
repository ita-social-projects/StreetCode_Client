import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ForFans from '@features/AdminPage/ForFans/ForFans.component';
import App from '@layout/app/App.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import AdminPage from '@/features/AdminPage/AdminPage.component';
import AdminLogin from '@/features/AdminPage/Login/AdminLogin.component';
import NewStreetcode from '@/features/AdminPage/NewStreetcode/MainNewStreetcode.component';
import Partners from '@/features/AdminPage/PartnersPage/Partners.component';
import TermDictionary from '@/features/AdminPage/TermDictionary/TermDictionary.component';
import StreetcodeCatalog from '@/features/StreetcodeCatalogPage/StreetcodeCatalog.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={FRONTEND_ROUTES.BASE} element={<App />}>
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/:id`} element={<StreetcodeContent />} />
        <Route index path={`${FRONTEND_ROUTES.ADMIN.BASE}`} element={<AdminPage />} />
        <Route index path={FRONTEND_ROUTES.ADMIN.NEW_STREETCODE} element={<NewStreetcode />} />
        <Route index path={FRONTEND_ROUTES.ADMIN.FOR_FANS} element={<ForFans />} />
        <Route index path={FRONTEND_ROUTES.ADMIN.PARTNERS} element={<Partners />} />
        <Route index path={FRONTEND_ROUTES.ADMIN.DICTIONARY} element={<TermDictionary />} />
        <Route index path={FRONTEND_ROUTES.CATALOG.BASE} element={<StreetcodeCatalog />} />
        <Route index path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />
        {/* <Route path='*' element={<NotFound />} /> */}
    </Route>,
));

export default router;
