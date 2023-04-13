import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ForFansMainPage from '@features/AdminPage/ForFansPage/ForFansMainPage.component';
import ForFansBlock from '@features/AdminPage/NewStreetcode/ForFansBlock/ForFansBlock.component';
import App from '@layout/app/App.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import ContactUs from '@/features/AdditionalPages/ContactUsPage/ContanctUs.component';
import NotFound from '@/features/AdditionalPages/NotFoundPage/NotFound.component';
import PartnersPage from '@/features/AdditionalPages/PartnersPage/Partners.component';
import PrivatePolicy from '@/features/AdditionalPages/PrivatePolicyPage/PrivatePolicy.component';
import AdminPage from '@/features/AdminPage/AdminPage.component';
import NewStreetcode from '@/features/AdminPage/NewStreetcode/MainNewStreetcode.component';
import Partners from '@/features/AdminPage/PartnersPage/Partners.component';
import TermDictionary from '@/features/AdminPage/TermDictionary/TermDictionary.component';
import StreetcodeCatalog from '@/features/StreetcodeCatalogPage/StreetcodeCatalog.component';
import SupportUs from '@/features/AdditionalPages/SupportUsPage/SupportUs.component';

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
        <Route path="*" element={<NotFound />} />
        <Route path="/privacy-policy" element={<PrivatePolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/partners-page" element={<PartnersPage />} />
        <Route path="/support-us" element={<SupportUs />} />
    </Route>,
));

export default router;
