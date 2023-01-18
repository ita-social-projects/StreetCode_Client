import './Statistics.styles.scss';

import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import Toponym from '@/models/toponyms/toponym.model';

interface Props {
    streetcodeCoordinates: StreetcodeCoordinate[],
    toponyms: Toponym[]
}

const StatisticsComponent = ({ toponyms }: Props) => {
    const statisticObjects = [
        { toponymName: 'вулиця', toponymNumber: 9472 },
        { toponymName: 'провулок', toponymNumber: 1178 },
        { toponymName: 'площа', toponymNumber: 39 },
    ];
    console.log(toponyms);
    return (
        <div className="statisticsContainer">
            <h1>В Україні іменем Михайла Грушевського названі:</h1>
            <div className="streetsBlock">
                {toponyms?.map((toponym) => (
                    <p>
                        <span>{toponym.coordinates.length}</span>
                        {toponym.title}
                    </p>
                ))}
            </div>
        </div>
    );
};
export default StatisticsComponent;
