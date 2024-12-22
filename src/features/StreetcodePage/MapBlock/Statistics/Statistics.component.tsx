import "./Statistics.styles.scss";

import { useEffect, useState } from "react";

import StreetcodeCoordinate from "@/models/additional-content/coordinate.model";
import Toponym from "@/models/toponyms/toponym.model";

interface Props {
    streetcodeCoordinates: StreetcodeCoordinate[];
    toponyms: Toponym[];
}

const countByStreetType = (toponyms: Toponym[]): Map<string, number> =>
    toponyms?.reduce((acc, toponym) => {
        const { streetType } = toponym;
        if (streetType) {
            acc.set(streetType, (acc.get(streetType) || 0) + 1);
        }
        return acc;
    }, new Map());

const StatisticsComponent = ({ toponyms }: Props) => {
    const [headingText, setHeadingText] = useState("цього history-коду");
    useEffect(() => {
        const updateHeadingText = () => {
            const headingElement = document.querySelector("h2.streetcodeTitle");
            if (headingElement) {
                setHeadingText(
                    headingElement.textContent || "цього history-коду"
                );
            }
        };

        updateHeadingText();
    }, []);

    const countByStreetTypeMap = countByStreetType(toponyms);
    return (
        <div className="statisticsContainer">
            <h1>В Україні іменем «{headingText}» названі:</h1>
            <div
                className="streetsBlock"
                style={{ display: "flex", flexWrap: "wrap" }}
            >
                {countByStreetTypeMap &&
                    [...countByStreetTypeMap.entries()].map(
                        ([streetType, count]) => (
                            <p style={{ flexBasis: "100%", width: "45%" }}>
                                {streetType}:<span>{count}</span>
                            </p>
                        )
                    )}
            </div>
        </div>
    );
};
export default StatisticsComponent;
