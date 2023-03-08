import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ForFans from '@features/AdminPage/ForFans/ForFans.component';
import App from '@layout/app/App.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import AdminPage from '@/features/AdminPage/AdminPage.component';
import NewStreetcode from '@/features/AdminPage/NewStreetcode/MainNewStreetcode.component';
import TermDictionary from '@/features/AdminPage/TermDictionary/TermDictionary.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={FRONTEND_ROUTES.BASE} element={<App />}>
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/:id`} element={<StreetcodeContent />} />

        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel`} element={<AdminPage />} />
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/new-streetcode`} element={<NewStreetcode />} />
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/for-fans`} element={<ForFans />} />
        <Route index path={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/dictionary`} element={<TermDictionary />} />
        {/* <Route index path={FRONTEND_ROUTES.STREETCODE.BASE} element={<StreetcodeContent />} /> */}
        {/* <Route path='*' element={<NotFound />} /> */}
    </Route>,
));

export default router;
