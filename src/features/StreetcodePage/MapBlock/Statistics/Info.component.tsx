import './Info.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button, Popover } from 'antd';

import StreetcodeCoordinatesApi from '@/app/api/additional-content/streetcode-cooridnates.api';
import ToponymsApi from '@/app/api/map/toponyms.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import Toponym from '@/models/toponyms/toponym.model';

import StatisticsComponent from './Statistics.component';

interface Props {
    streetcodeCoordinates: StreetcodeCoordinate[],
    toponyms: Toponym[]
}

const InfoComponent = ({ streetcodeCoordinates, toponyms }: Props) => {
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    const { modalStore: { setModal } } = useModalContext();
    const handleHoverChange = (open: boolean) => {
        setHovered(open);
        setClicked(false);
    };

    const handleClickChange = (open: boolean) => {
        setHovered(false);
        setClicked(open);
    };

    const onBtnClick = () => {
        setModal('statistics');
    };

    const isMobile = window.innerWidth < 1024;

    const content = (
        <StatisticsComponent toponyms={toponyms} streetcodeCoordinates={streetcodeCoordinates} />
    );

    return (
        <>
            {isMobile ? (
                <Button
                    className="infoButton"
                    icon={<InfoCircleOutlined className="infoIcon" />}
                    onClick={onBtnClick}
                />
            ) : (
                <Popover
                    overlayClassName="transparent-popover"
                    className="infoContainer"
                    placement="bottomLeft"
                    content={content}
                    trigger="hover"
                    open={hovered}
                    onOpenChange={handleHoverChange}
                >
                    <Popover
                        overlayClassName="transparent-popover"
                        className="infoContainer"
                        placement="bottomLeft"
                        content={content}
                        trigger="click"
                        open={clicked}
                        onOpenChange={handleClickChange}
                    >
                        <Button
                            className="infoButton"
                            icon={<InfoCircleOutlined className="infoIcon" />}
                        />
                    </Popover>
                </Popover>
            )}
        </>
    );
};

export default observer(InfoComponent);
