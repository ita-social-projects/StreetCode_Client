import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ContextMainPage from '@features/AdminPage/ContextPage/ContextMainPage.component';
import ForgotPassword from '@features/Auth/ForgotPassword/ForgotPassword.component';
import ForgotPasswordResetComponent from '@features/Auth/ForgotPassword/ForgotPasswordReset.component';
import Login from '@features/Auth/Login/Login.component';
import RegistrationPage from '@features/Auth/RegistrationPage/RegistrationPage.component';
import UserProfile from '@features/UserProfile/UserProfile.component';
import App from '@layout/app/App.component';
import { UserRole } from '@models/user/user.model';
import PDFPreviewPage from '@streetcode/PdfPreviewPage/PdfPreviewPage';
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
import EditorPage from '@/features/AdminPage/EditorPage/EditorPage.component';
import JobPage from '@/features/AdminPage/JobsPage/JobsPage.component';
import News from '@/features/AdminPage/NewsPage/News.component';
import NewStreetcode from '@/features/AdminPage/NewStreetcode/MainNewStreetcode.component';
import Partners from '@/features/AdminPage/PartnersPage/Partners.component';
import TeamPage from '@/features/AdminPage/TeamPage/TeamPage.component';
import TermDictionary from '@/features/AdminPage/TermDictionary/TermDictionary.component';
import StreetcodeCatalog from '@/features/StreetcodeCatalogPage/StreetcodeCatalog.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<App />}>
        <Route
            path={FRONTEND_ROUTES.ADMIN.BASE}
            element={<ProtectedComponent allowedRoles={[UserRole.Admin]}><AdminPage /></ProtectedComponent>}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.BASE}/:id`}
            element={<ProtectedComponent allowedRoles={[UserRole.Admin]}><StreetcodeContent /></ProtectedComponent>}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/:id`}
            element={<ProtectedComponent allowedRoles={[UserRole.Admin]}><NewStreetcode /></ProtectedComponent>}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}
            element={<ProtectedComponent allowedRoles={[UserRole.Admin]}><NewStreetcode /></ProtectedComponent>}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.EDITOR}
            element={<ProtectedComponent allowedRoles={[UserRole.Admin]}><EditorPage /></ProtectedComponent>}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.PARTNERS}
            element={<ProtectedComponent allowedRoles={[UserRole.Admin]}><Partners /></ProtectedComponent>}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.CONTEXT}
            element={<ProtectedComponent allowedRoles={[UserRole.Admin]}><ContextMainPage /></ProtectedComponent>}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.ANALYTICS}/:id`}
            element={<Analytics />}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.DICTIONARY}
            element={(
                <ProtectedComponent allowedRoles={[UserRole.Admin]}>
                    <TermDictionary />
                </ProtectedComponent>
            )}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.NEWS}
            element={<ProtectedComponent allowedRoles={[UserRole.Admin]}><News /></ProtectedComponent>}
        />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.CATALOG} element={<StreetcodeCatalog />} />

        <Route
            path={FRONTEND_ROUTES.ADMIN.TEAM}
            element={(
                <ProtectedComponent allowedRoles={[UserRole.Admin]}>
                    <TeamPage />
                </ProtectedComponent>
            )}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.JOBS}
            element={(
                <ProtectedComponent allowedRoles={[UserRole.Admin]}>
                    <JobPage />
                </ProtectedComponent>
            )}
        />
        <Route path="*" element={<NotFound />} />
        <Route index path={FRONTEND_ROUTES.AUTH.LOGIN} element={<Login />} />
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
        <Route path="/:id/pdf-preview" element={<PDFPreviewPage />} />
        <Route path={FRONTEND_ROUTES.AUTH.REGISTER} element={<RegistrationPage />} />
        <Route
            path={FRONTEND_ROUTES.OTHER_PAGES.PROFILE}
            element={(
                <ProtectedComponent allowedRoles={[UserRole.User]}>
                    <UserProfile />
                </ProtectedComponent>
            )}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-reset" element={<ForgotPasswordResetComponent />} />
    </Route>,
));

export default router;
