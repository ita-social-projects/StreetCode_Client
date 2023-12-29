import './BreadCrumb.styles.scss';

import { Breadcrumb } from 'antd';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import Streetcode from '@/models/streetcode/streetcode-types.model';

interface Props {
    separator?: JSX.Element | string;
    streetcode?: Streetcode;
}

const BreadCrumb = ({ separator = '->', streetcode }: Props) => (
    <Breadcrumb className="breadcrumbContainer" separator={separator}>
        <Breadcrumb.Item className="activeLink" href={FRONTEND_ROUTES.OTHER_PAGES.CATALOG}>
            стріткоди
        </Breadcrumb.Item>
        <Breadcrumb.Item>
            {streetcode?.title}
        </Breadcrumb.Item>
    </Breadcrumb>
);

export default BreadCrumb;
