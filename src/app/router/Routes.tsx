import { createBrowserRouter, RouteObject } from "react-router-dom";
import { FRONTEND_ROUTES } from "@common/contants/frontend-routes.constants";

import StreetcodeContent from "@/components/StreetcodeComponent/Streetcode.component";
import App from "@layout/app/App";

export const routes: RouteObject[] = [
    {
        path: FRONTEND_ROUTES.BASE,
        element: <App />,
        children: [
            //TODO fill paths
            {path: FRONTEND_ROUTES.STREETCODE.BASE, element: <StreetcodeContent/>}
            //{/*{path: '*', element: <NotFound />},*/}
        ]
    }
]

const router = createBrowserRouter(routes);
export default router;