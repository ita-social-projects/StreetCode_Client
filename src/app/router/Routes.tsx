import { createBrowserRouter, RouteObject } from 'react-router-dom';


import { FRONTEND_ROUTES } from '@common/constants/frontend-routes.constants';
import App from '@layout/app/App';
import StreetcodeContent from '@/components/StreetcodeComponent/Streetcode.component';

export const routes: RouteObject[] = [
    {
        path: FRONTEND_ROUTES.BASE,
        element: <App />,
        children: [
            // TODO fill paths
            { path: FRONTEND_ROUTES.STREETCODE.BASE, element: <StreetcodeContent /> },
            // {/*{path: '*', element: <NotFound />},*/}
        ],
    },
];

const router = createBrowserRouter(routes);
export default router;
