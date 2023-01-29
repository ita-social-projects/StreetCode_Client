import "./Marker.styles.scss"

import { Marker, Popup } from "react-leaflet";
import L from 'leaflet';

interface Props {
    latitude: number, 
    longtitude: number,
    description: string,
    title: string
}

const CustomMarker = ({ description, latitude, longtitude }: Props) => {
    const myIcon = L.divIcon({
        html: "<div class='markerCircle'></div>",
        iconAnchor: [0,0],
        className: 'my-custom-marker'
    });

    return (
        <>
            {latitude && longtitude &&
                <Marker position={[latitude, longtitude]} icon={myIcon} >
                    <Popup>
                        {description}
                    </Popup>
                </Marker>}
        </>
    );
};

export default CustomMarker;