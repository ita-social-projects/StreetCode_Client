import './BreadCrumb.styles.scss';

import { Breadcrumb } from 'antd';

import Streetcode from '@/models/streetcode/streetcode-types.model';
import News from '@/models/news/news.model';


interface Props {
    separator?: JSX.Element | string;
    news?: News;
}

const BreadCrumb = ({ separator = '->', news }: Props) => (
    <Breadcrumb className="breadcrumbContainer" separator={separator}>
        <Breadcrumb.Item className="activeLink" href="_blank">
            Головна
        </Breadcrumb.Item>
        <Breadcrumb.Item href="_blank">
            {/* {streetcode?.firstName ?? streetcode?.title}
            {' '}
            {streetcode?.lastName} */}
            {/* {news?.title} */}
            Новина
        </Breadcrumb.Item>
    </Breadcrumb>
);

export default BreadCrumb;
