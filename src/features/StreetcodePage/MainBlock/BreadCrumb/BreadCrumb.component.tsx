import './BreadCrumb.styles.scss';
import { Breadcrumb } from 'antd';

interface Props {
    separator?: JSX.Element | string;
}

const BreadCrumb = ({ separator = '->' }: Props) => (
    <Breadcrumb className={"breadcrumbContainer"} separator={separator}>
        <Breadcrumb.Item className={"activeLink"} href='_blank'>
            стріткоди
        </Breadcrumb.Item>
        <Breadcrumb.Item href='_blank'>
            михайло грушевський
        </Breadcrumb.Item>
    </Breadcrumb>
);

export default BreadCrumb;