import "./Marker.styles.scss"

import { Marker, Popup } from "react-leaflet";
import L from 'leaflet';

interface Props {
    latitude: number, 
    longtitude: number,
    description: string,
    title: string,
    isStreetcode: boolean
}

const CustomMarker = ({ description, latitude, longtitude, isStreetcode }: Props) => {
    const markerClassName = isStreetcode ? "markerCircle streetcodes" : "markerCircle";

    const myIcon = L.divIcon({
        html: `<div class="${markerClassName}"></div>`,
        iconAnchor: [0, 0],
        className: 'my-custom-marker'
    });

    return (
        <>
            {latitude && longtitude && (
                <Marker position={[latitude, longtitude]} icon={myIcon}>
                    <Popup>
                        {description}
                    </Popup>
                </Marker>
            )}
        </>
    );
};

export default CustomMarker;