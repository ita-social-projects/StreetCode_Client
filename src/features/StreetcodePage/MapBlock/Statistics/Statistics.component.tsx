import './Statistics.styles.scss';

import React, { useEffect, useState } from 'react';

interface Statistics {
    toponymName:string,
    toponymNumber:number
}

const StatisticsComponent = () => {
    const statisticObjects : Statistics[] = [
        { toponymName: 'вулиця', toponymNumber: 9472 },
        { toponymName: 'провулок', toponymNumber: 1178 },
        { toponymName: 'площа', toponymNumber: 39 },
    ];

    return (
        <div className="statisticsContainer">
            <h1>В Україні іменем Михайла Грушевського названі:</h1>
            <div className="streetsBlock">
                {statisticObjects.map((toponym) => (
                    <p>
                        <span>{toponym.toponymNumber}</span>
                        {toponym.toponymName}
                    </p>
                ))}
            </div>
        </div>
    );
};
export default StatisticsComponent;
