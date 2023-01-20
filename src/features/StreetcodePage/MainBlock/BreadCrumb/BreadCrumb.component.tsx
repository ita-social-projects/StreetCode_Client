import './BreadCrumb.styles.scss';

import { Breadcrumb } from 'antd';

import Streetcode from '@/models/streetcode/streetcode-types.model';

interface Props {
    separator?: JSX.Element | string;
    streetcode?: Streetcode;
}

const BreadCrumb = ({ separator = '->', streetcode }: Props) => (
    <Breadcrumb className="breadcrumbContainer" separator={separator}>
        <Breadcrumb.Item className="activeLink" href="_blank">
            стріткоди
        </Breadcrumb.Item>
        <Breadcrumb.Item href="_blank">
            {streetcode?.firstName}
            {' '}
            {streetcode?.lastName}
        </Breadcrumb.Item>
    </Breadcrumb>
);

export default BreadCrumb;
