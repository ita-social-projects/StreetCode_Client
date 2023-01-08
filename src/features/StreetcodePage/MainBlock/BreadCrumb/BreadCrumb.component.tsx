import './BreadCrumb.styles.scss';
import { Breadcrumb } from 'antd';
import useMobx from '@/app/stores/root-store';

interface Props {
    separator?: JSX.Element | string;
    streetcodeId: number;
}

const BreadCrumb = ({ separator = '->', streetcodeId}: Props) => {
    const { streetcodesStore: { StreetcodeMap } } = useMobx();

    return(
    <Breadcrumb className={"breadcrumbContainer"} separator={separator}>
        <Breadcrumb.Item className={"activeLink"} href='_blank'>
            стріткоди
        </Breadcrumb.Item>
        <Breadcrumb.Item href='_blank'>
            {StreetcodeMap.get(streetcodeId)?.firstName} {StreetcodeMap.get(streetcodeId)?.lastName}
        </Breadcrumb.Item>
    </Breadcrumb>
);
}
export default BreadCrumb;