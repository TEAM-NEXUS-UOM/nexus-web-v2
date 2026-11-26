// Illustrative map only: OSM tiles + markers + straight dashed lines between stops.
// No routing, no distance calculation. Replace the internals when real route data exists.
import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import { Icon, divIcon, latLngBounds, type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Vite fingerprints asset URLs, so Leaflet cannot guess its default icon paths from CSS.
// Point the default icon at the bundled images (used by any marker without a custom icon).
delete (Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface MapPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface Props {
  depot: MapPoint;
  stops: MapPoint[]; // in stop order
}

const badgeIcon = (text: string, depot: boolean) =>
  divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow ${
      depot ? "bg-slate-800" : "bg-primary"
    }">${text}</span>`,
  });

const toLatLng = (p: MapPoint): LatLngTuple => [p.latitude, p.longitude];

// pointsKey is a sorted JSON list, so reordering stops (same bounds) does not re-fit the view.
function FitToPoints({ pointsKey }: { pointsKey: string }) {
  const map = useMap();
  useEffect(() => {
    const points = JSON.parse(pointsKey) as LatLngTuple[];
    if (points.length > 1) {
      map.fitBounds(latLngBounds(points), { padding: [32, 32] });
    }
  }, [map, pointsKey]);
  return null;
}

function RouteMapPlaceholder({ depot, stops }: Props) {
  const depotLatLng = toLatLng(depot);
  const path = [depotLatLng, ...stops.map(toLatLng), depotLatLng];
  const pointsKey = JSON.stringify(
    [...path].sort((a, b) => a[0] - b[0] || a[1] - b[1]),
  );

  return (
    <div className="relative isolate z-0 overflow-hidden rounded-lg border border-slate-200">
      <MapContainer
        center={depotLatLng}
        zoom={11}
        scrollWheelZoom={false}
        className="h-80 w-full lg:h-[26rem]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToPoints pointsKey={pointsKey} />
        <Polyline
          positions={path}
          pathOptions={{ color: "#2858a8", weight: 3, dashArray: "6 8" }}
        />
        <Marker position={depotLatLng} icon={badgeIcon("A", true)}>
          <Tooltip>{depot.name}</Tooltip>
        </Marker>
        {stops.map((stop, index) => (
          <Marker
            key={stop.id}
            position={toLatLng(stop)}
            icon={badgeIcon(String(index + 1), false)}
          >
            <Tooltip>{stop.name}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default RouteMapPlaceholder;
