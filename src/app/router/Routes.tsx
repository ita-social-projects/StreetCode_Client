import { createBrowserRouter, RouteObject } from "react-router-dom";
import { API_ROUTES } from "app/common/contants/routes.constants";
import App from "app/layout/app/App";

export const routes: RouteObject[] = [
    {
        path: API_ROUTES.BASE,
        element: <App />,
        children: [
            //TODO fill paths
            {/*{path: '*', element: <NotFound />},*/}
        ]
    }
]

const router = createBrowserRouter(routes);
export default router;