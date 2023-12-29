import './BreadCrumbForNews.styles.scss';

import { Breadcrumb } from 'antd';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import News from '@/models/news/news.model';

interface Props {
    separator?: JSX.Element | string;
    news?: News;
}

const BreadCrumbForNews = ({ separator = '->', news }: Props) => (
    <Breadcrumb className="breadcrumbForNewsContainer" separator={separator}>
        <Breadcrumb.Item className="activeLink" href={FRONTEND_ROUTES.BASE}>
            Головна
        </Breadcrumb.Item>
        <Breadcrumb.Item>
            Новина
        </Breadcrumb.Item>
    </Breadcrumb>
);

export default BreadCrumbForNews;
