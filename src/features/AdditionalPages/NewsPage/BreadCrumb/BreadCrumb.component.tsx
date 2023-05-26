import './BreadCrumb.styles.scss';

import { Breadcrumb } from 'antd';
import News from '@/models/news/news.model';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';


interface Props {
    separator?: JSX.Element | string;
    news?: News;
}

const BreadCrumb = ({ separator = '->', news }: Props) => (
    <Breadcrumb className="breadcrumbContainer" separator={separator}>
        <Breadcrumb.Item className="activeLink" href={FRONTEND_ROUTES.BASE}>
            Головна
        </Breadcrumb.Item>
        <Breadcrumb.Item >
            Новина
        </Breadcrumb.Item>
    </Breadcrumb>
);

export default BreadCrumb;
