import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import App from '@layout/app/App';
import HeaderBlock from '@layout/header/HeaderBlock.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={FRONTEND_ROUTES.BASE} element={<HeaderBlock />}>
        <Route element={<App />}>
            <Route index path={FRONTEND_ROUTES.STREETCODE.BASE} element={<StreetcodeContent />} />
            <Route path={`${FRONTEND_ROUTES.STREETCODE.BASE}/:id`} element={<></>} />
            {/* <Route path='*' element={<NotFound />} /> */}
        </Route>
    </Route>,
));

export default router;
