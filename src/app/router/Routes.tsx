import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import App from '@layout/app/App.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import ContactUs from '@/features/AdditionalPages/ContactUsPage/ContanctUs.component';
import NotFound from '@/features/AdditionalPages/NotFoundPage/NotFound.component';
import PrivatePolicy from '@/features/AdditionalPages/PrivatePolicyPage/PrivatePolicy.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={FRONTEND_ROUTES.BASE} element={<App />}>
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/:id`} element={<StreetcodeContent />} />
        {/* <Route index path={FRONTEND_ROUTES.STREETCODE.BASE} element={<StreetcodeContent />} /> */}
        <Route path="*" element={<NotFound />} />
        <Route path="/privacy-policy" element={<PrivatePolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
    </Route>,
));

export default router;
