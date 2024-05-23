import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import App from '@layout/app/App.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import ProtectedComponent from '@/app/common/components/ProtectedComponent.component';
import AboutUsPage from '@/features/AboutUsPage/AboutUsPage.component';
import ContactUs from '@/features/AdditionalPages/ContactUsPage/ContanctUs.component';
import NewsPage from '@/features/AdditionalPages/NewsPage/News.component';
import NotFound from '@/features/AdditionalPages/NotFoundPage/NotFound.component';
import PartnersPage from '@/features/AdditionalPages/PartnersPage/Partners.component';
import PrivatePolicy from '@/features/AdditionalPages/PrivatePolicyPage/PrivatePolicy.component';
import SupportUs from '@/features/AdditionalPages/SupportUsPage/SupportUs.component';
import AdminPage from '@/features/AdminPage/AdminPage.component';
import Analytics from '@/features/AdminPage/Analytics/Analytics.component';
import JobPage from '@/features/AdminPage/JobsPage/JobsPage.component';
import AdminLogin from '@/features/AdminPage/Login/AdminLogin.component';
import News from '@/features/AdminPage/NewsPage/News.component';
import NewStreetcode from '@/features/AdminPage/NewStreetcode/MainNewStreetcode.component';
import Partners from '@/features/AdminPage/PartnersPage/Partners.component';
import TeamPage from '@/features/AdminPage/TeamPage/TeamPage.component';
import TermDictionary from '@/features/AdminPage/TermDictionary/TermDictionary.component';
import StreetcodeCatalog from '@/features/StreetcodeCatalogPage/StreetcodeCatalog.component';
import ContextMainPage from '@features/AdminPage/ContextPage/ContextMainPage.component';
import EditorPage from '@/features/AdminPage/EditorPage/EditorPage.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<App />}>
        <Route
            path={FRONTEND_ROUTES.ADMIN.BASE}
            element={<ProtectedComponent><AdminPage /></ProtectedComponent>}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.BASE}/:id`}
            element={<ProtectedComponent><StreetcodeContent /></ProtectedComponent>}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/:id`}
            element={<ProtectedComponent><NewStreetcode /></ProtectedComponent>}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}
            element={<ProtectedComponent><NewStreetcode /></ProtectedComponent>}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.EDITOR}
            element={<ProtectedComponent><EditorPage /></ProtectedComponent>}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.PARTNERS}
            element={<ProtectedComponent><Partners /></ProtectedComponent>}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.CONTEXT}
            element={<ProtectedComponent><ContextMainPage /></ProtectedComponent>}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.ANALYTICS}/:id`}
            element={<Analytics />}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.DICTIONARY}
            element={(
                <ProtectedComponent>
                    <TermDictionary />
                </ProtectedComponent>
            )}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.NEWS}
            element={<ProtectedComponent><News /></ProtectedComponent>}
        />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.CATALOG} element={<StreetcodeCatalog />} />

        <Route
            path={FRONTEND_ROUTES.ADMIN.TEAM}
            element={(
                <ProtectedComponent>
                    <TeamPage />
                </ProtectedComponent>
            )}
        />
        <Route path={FRONTEND_ROUTES.ADMIN.JOBS} element={<ProtectedComponent><JobPage /></ProtectedComponent>} />
        <Route path="*" element={<NotFound />} />
        <Route index path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.ERROR404} element={<NotFound />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.PRIVACY_POLICY} element={<PrivatePolicy />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US} element={<ContactUs />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.PARTNERS} element={<PartnersPage />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US} element={<SupportUs />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.NEWS} element={<NewsPage />} />
        <Route index path="/:id" element={<StreetcodeContent />} />
        <Route index path={`${FRONTEND_ROUTES.OTHER_PAGES.NEWS}/:id`} element={<NewsPage />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.ABOUT_US} element={<AboutUsPage />} />
        <Route
            path={`${FRONTEND_ROUTES.OTHER_PAGES.ABOUT_US}/:section`}
            element={<AboutUsPage />}
        />
    </Route>,
));

export default router;
