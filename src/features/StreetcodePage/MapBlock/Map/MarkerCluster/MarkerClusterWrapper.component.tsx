import './MarkerCluster.styles.scss'

import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'

interface Props {
    children: React.ReactNode
}

const createClusterCustomIcon = function (cluster: any) {
    return L.divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className: "customMarkerCluster",
      iconSize: L.point(28, 28, true)
    });
};

const CustomMarkerCluster = (props: Props) => (
    <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon} showCoverageOnHover={false} >
        {props.children}
    </MarkerClusterGroup>
);

export default CustomMarkerCluster;