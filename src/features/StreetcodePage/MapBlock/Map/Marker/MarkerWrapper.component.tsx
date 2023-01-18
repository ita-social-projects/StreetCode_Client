import { Marker } from "react-leaflet";
import L from 'leaflet';
import MarkerCircle from "@streetcode/MapBlock/Map/Marker/MarkerCircle";
import * as ReactDOMServer from 'react-dom/server';

interface Props {
    latitude: number, 
    longtitude: number,
    description: string,
    title: string
}

const CustomMarker = (props: Props) => {
    const myHtml = ReactDOMServer.renderToString(<MarkerCircle/>);
    const myIcon = L.divIcon({
        html: myHtml,
        iconAnchor: [0,0],
        className: 'my-custom-marker'
    });
    return (
        <Marker position={[props.latitude, props.longtitude]} icon={myIcon} />
    );
};

export default CustomMarker;