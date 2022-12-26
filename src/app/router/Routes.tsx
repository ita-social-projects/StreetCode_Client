import { createBrowserRouter, RouteObject } from "react-router-dom";
import {FRONTEND_ROUTES} from "../common/contants/frontend-routes.constants";
import App from "app/layout/app/App";
import Streetcode from "components/Streetcode.component";

export const routes: RouteObject[] = [
    {
        path: FRONTEND_ROUTES.BASE,
        element: <App />,
        children: [
            //TODO fill paths
            {path: FRONTEND_ROUTES.STREETCODE.BASE, element: <Streetcode/>}
            //{/*{path: '*', element: <NotFound />},*/}
        ]
    }
]

const router = createBrowserRouter(routes);
export default router;