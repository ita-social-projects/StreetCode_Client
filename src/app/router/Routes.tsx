import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ForFansBlock from '@features/AdminPage/NewStreetcode/ForFansBlock/ForFansBlock.component';
import App from '@layout/app/App.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import AdminPage from '@/features/AdminPage/AdminPage.component';
import NewStreetcode from '@/features/AdminPage/NewStreetcode/MainNewStreetcode.component';
import ForFansMainPage from '@features/AdminPage/ForFansPage/ForFansMainPage.component';
import Partners from '@/features/AdminPage/PartnersPage/Partners.component';
import TermDictionary from '@/features/AdminPage/TermDictionary/TermDictionary.component';
import StreetcodeCatalog from '@/features/StreetcodeCatalogPage/StreetcodeCatalog.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={FRONTEND_ROUTES.BASE} element={<App />}>
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/:id`} element={<StreetcodeContent />} />
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel`} element={<AdminPage />} />
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/new-streetcode`} element={<NewStreetcode />} />
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/for-fans-page`} element={<ForFansMainPage />} />
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/dictionary`} element={<TermDictionary />} />
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/dictionary`} element={<TermDictionary />} />
        <Route index path={`${FRONTEND_ROUTES.ADMIN.BASE}`} element={<AdminPage />} />
        <Route index path={`${FRONTEND_ROUTES.ADMIN.BASE}/new-streetcode`} element={<NewStreetcode />} />
        <Route index path={`${FRONTEND_ROUTES.ADMIN.BASE}/for-fans`} element={<ForFansBlock />} />
        <Route index path={`${FRONTEND_ROUTES.ADMIN.BASE}/partners`} element={<Partners />} />
        <Route index path={`${FRONTEND_ROUTES.ADMIN.BASE}/dictionary`} element={<TermDictionary />} />
        <Route index path={`${FRONTEND_ROUTES.CATALOG.BASE}`} element={<StreetcodeCatalog />} />
        {/* <Route index path={FRONTEND_ROUTES.STREETCODE.BASE} element={<StreetcodeContent />} /> */}
        {/* <Route path='*' element={<NotFound />} /> */}
    </Route>,
));

export default router;
