import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ForFans from '@features/AdminPage/ForFans/ForFans.component';
import App from '@layout/app/App.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import ProtectedComponent from '@/app/common/components/ProtectedComponent.component';
import AdminPage from '@/features/AdminPage/AdminPage.component';
import AdminLogin from '@/features/AdminPage/Login/AdminLogin.component';
import NewStreetcode from '@/features/AdminPage/NewStreetcode/MainNewStreetcode.component';
import Partners from '@/features/AdminPage/PartnersPage/Partners.component';
import TermDictionary from '@/features/AdminPage/TermDictionary/TermDictionary.component';
import StreetcodeCatalog from '@/features/StreetcodeCatalogPage/StreetcodeCatalog.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={FRONTEND_ROUTES.BASE} element={<App />}>
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/:id`} element={<StreetcodeContent />} />
        <Route
            index
            path={`${FRONTEND_ROUTES.ADMIN.BASE}`}
            element={<ProtectedComponent><AdminPage /></ProtectedComponent>}
        />
        <Route
            index
            path={FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}
            element={<ProtectedComponent><NewStreetcode /></ProtectedComponent>}
        />
        <Route
            index
            path={FRONTEND_ROUTES.ADMIN.FOR_FANS}
            element={<ProtectedComponent><ForFans /></ProtectedComponent>}
        />
        <Route
            index
            path={FRONTEND_ROUTES.ADMIN.PARTNERS}
            element={<ProtectedComponent><Partners /></ProtectedComponent>}
        />
        <Route
            index
            path={FRONTEND_ROUTES.ADMIN.DICTIONARY}
            element={(
                <ProtectedComponent>
                    <TermDictionary />
                </ProtectedComponent>
            )}
        />
        <Route index path={FRONTEND_ROUTES.CATALOG.BASE} element={<StreetcodeCatalog />} />
        <Route index path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />
        {/* <Route path='*' element={<NotFound />} /> */}
    </Route>,
));

export default router;
