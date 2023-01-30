import './Statistics.styles.scss';

import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import Toponym from '@/models/toponyms/toponym.model';

interface Props {
    streetcodeCoordinates: StreetcodeCoordinate[],
    toponyms: Toponym[]
}

const countByStreetType = (toponyms: Toponym[]): Map<string, number> => {
    return toponyms?.reduce((acc, toponym) => {
      const streetType = toponym.streetType;
      if (streetType) {
        acc.set(streetType, (acc.get(streetType) || 0) + 1);
      }
      return acc;
    }, new Map());
  };

const StatisticsComponent = ({ toponyms }: Props) => {
    const countByStreetTypeMap = countByStreetType(toponyms);
    return (
        <div className="statisticsContainer">
            <h1>В Україні іменем Михайла Грушевського названі:</h1>
            <div className="streetsBlock" style={{ display: 'flex', flexWrap: 'wrap'}}>
                {countByStreetTypeMap && [...countByStreetTypeMap.entries()].map(([streetType, count]) => (
                    <p style={{ flexBasis: '50%', width: '45%' }}>
                        {streetType}: <span>{count}</span> 
                    </p>
                ))}
            </div>
        </div>
    );
};
export default StatisticsComponent;
