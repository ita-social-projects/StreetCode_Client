import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ForFansMainPage from '@features/AdminPage/ForFansPage/ForFansMainPage.component';
import App from '@layout/app/App.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import ProtectedComponent from '@/app/common/components/ProtectedComponent.component';
import ContactUs from '@/features/AdditionalPages/ContactUsPage/ContanctUs.component';
import NotFound from '@/features/AdditionalPages/NotFoundPage/NotFound.component';
import PartnersPage from '@/features/AdditionalPages/PartnersPage/Partners.component';
import PrivatePolicy from '@/features/AdditionalPages/PrivatePolicyPage/PrivatePolicy.component';
import SupportUs from '@/features/AdditionalPages/SupportUsPage/SupportUs.component';
import AdminPage from '@/features/AdminPage/AdminPage.component';
import AdminLogin from '@/features/AdminPage/Login/AdminLogin.component';
import NewStreetcode from '@/features/AdminPage/NewStreetcode/MainNewStreetcode.component';
import Partners from '@/features/AdminPage/PartnersPage/Partners.component';
import TermDictionary from '@/features/AdminPage/TermDictionary/TermDictionary.component';
import StreetcodeCatalog from '@/features/StreetcodeCatalogPage/StreetcodeCatalog.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={FRONTEND_ROUTES.BASE} element={<App />}>
        <Route
            index
            path={`${FRONTEND_ROUTES.ADMIN.BASE}`}
            element={<ProtectedComponent><AdminPage /></ProtectedComponent>}
        />
        <Route
            index
            path={`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/:id`}
            element={<ProtectedComponent><NewStreetcode /></ProtectedComponent>}
        />
        <Route
            index
            path={FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}
            element={<ProtectedComponent><NewStreetcode /><ProtectedComponent>}
        />
        <Route
            index
            path={FRONTEND_ROUTES.ADMIN.FOR_FANS}
            element={<ProtectedComponent><ForFansMainPage /></ProtectedComponent>}
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
        <Route path="/404" element={<NotFound />} />
        <Route path="/privacy-policy" element={<PrivatePolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/partners-page" element={<PartnersPage />} />
        <Route path="/support-us" element={<SupportUs />} />
        <Route index path="/:id" element={<StreetcodeContent />} />
    </Route>,
));

export default router;
