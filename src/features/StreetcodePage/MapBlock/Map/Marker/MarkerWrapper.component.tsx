import "./Marker.styles.scss"

import { Marker } from "react-leaflet";
import L from 'leaflet';

interface Props {
    latitude: number, 
    longtitude: number,
    description: string,
    title: string
}

const CustomMarker = (props: Props) => {
    const myIcon = L.divIcon({
        html: "<div class='markerCircle'></div>",
        iconAnchor: [0,0],
        className: 'my-custom-marker'
    });
    return (
        <Marker position={[props.latitude, props.longtitude]} icon={myIcon} />
    );
};

export default CustomMarker;