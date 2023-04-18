import { Table } from 'antd';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';

type Props = {
  streetcodeCoordinates: StreetcodeCoordinate[];
};

const MapTableAdmin = ({ streetcodeCoordinates }: Props) => {
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Широта',
      dataIndex: 'latitude',
      key: 'latitude',
    },
    {
      title: 'Довгота',
      dataIndex: 'longtitude',
      key: 'longtitude',
    },
  ];

  return (
    <Table dataSource={streetcodeCoordinates} columns={columns} />
  );
};

export default MapTableAdmin;