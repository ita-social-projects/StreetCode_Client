import './Info.styles.scss';
import useMobx from '@/app/stores/root-store';
import { observer } from 'mobx-react-lite';
import { Button, Popover, Space } from 'antd';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import Toponym from '@/models/toponyms/toponym.model';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import ToponymsApi from '@/app/api/map/toponyms.api';
import StreetcodeCoordinatesApi from '@/app/api/additional-content/streetcode-cooridnates.api';
import StatisticsComponent from './Statistics.component';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';


const InfoComponent = () => {
    const id = useRouteId();
    const toponyms = useAsync(() => ToponymsApi
    .getAll(), []).value as Toponym[];
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
  
    const hide = () => {
      setClicked(false);
      setHovered(false);
    };
  
    const handleHoverChange = (open: boolean) => {
      setHovered(open);
      setClicked(false);
    };
  
    const handleClickChange = (open: boolean) => {
      setHovered(false);
      setClicked(open);
    }; 
    const streetcodeCoordinates = useAsync(() => StreetcodeCoordinatesApi
    .getByStreetcodeId(id), [id]).value as StreetcodeCoordinate[];

    const content = (
        <StatisticsComponent toponyms={toponyms} streetcodeCoordinates={streetcodeCoordinates} />
      );
    

    return ( 
        <Popover
      className="infoContainer" placement="bottomLeft"
      content={content}
      trigger="hover"      
      open={hovered}
      onOpenChange={handleHoverChange}
    >
      <Popover
      
       className="infoContainer" placement="bottomLeft"
        content={content}
        trigger="click"      
        open={clicked}
        onOpenChange={handleClickChange}
      >
        <Button  className="infoButton" icon={<InfoCircleOutlined className="infoIcon" style={{ fontSize: '325%'}}/> }> </Button>
      </Popover>
    </Popover>  
            // <Popover className="infoContainer" placement="bottomLeft"  content={content}  >
            // <Button  className="infoButton" icon={<InfoCircleOutlined className="infoIcon" style={{ fontSize: '325%'}}/> }> </Button>
            // </Popover>
       
    );
};
export default observer(InfoComponent);