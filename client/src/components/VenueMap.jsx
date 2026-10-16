import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const pinIcon = L.divIcon({
  className: 'venue-pin',
  iconSize: [44, 54],
  iconAnchor: [22, 52],
  popupAnchor: [0, -46],
  html: `<svg width="44" height="54" viewBox="0 0 44 54" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 53C22 53 4 33.5 4 21a18 18 0 0 1 36 0c0 12.5-18 32-18 32z" fill="#133a2b" stroke="#cfa75e" stroke-width="1.5"/>
    <path d="M22 29c-.2 0-.4-.1-.5-.2C18.6 26.4 16 24.3 16 21.4 16 19.6 17.4 18 19.2 18c1.2 0 2.2.7 2.8 1.7.6-1 1.6-1.7 2.8-1.7 1.8 0 3.2 1.6 3.2 3.4 0 2.9-2.6 5-5.5 7.4-.1.1-.3.2-.5.2z" fill="#efdfba"/>
  </svg>`,
});

export default function VenueMap({ position, zoom, label }) {
  return (
    <MapContainer center={position} zoom={zoom} className="h-full w-full" scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="venue-tiles"
      />
      {label && (
        <Marker position={position} icon={pinIcon}>
          <Popup>{label}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
