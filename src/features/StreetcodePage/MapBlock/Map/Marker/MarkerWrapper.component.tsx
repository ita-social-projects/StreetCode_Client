import { Marker } from "react-leaflet";
import L from 'leaflet';
import MarkerCircle from "@streetcode/MapBlock/Map/Marker/MarkerCircle";
import * as ReactDOMServer from 'react-dom/server';

const CustomMarker = () => {
    const myHtml = ReactDOMServer.renderToString(<MarkerCircle/>);
    const myIcon = L.divIcon({
        html: myHtml,
        iconAnchor: [0,0],
        className: 'my-custom-marker'
    });
    return (
        <Marker position={[51.505, -0.09]} icon={myIcon} />
    );
};

export default CustomMarker;