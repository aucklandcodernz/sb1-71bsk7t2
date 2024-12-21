import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
  type: 'clock-in' | 'clock-out';
}

interface LocationMapProps {
  locations: Location[];
}

export const LocationMap = ({ locations }: LocationMapProps) => {
  if (locations.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border">
        <p className="text-gray-500">No location data available</p>
      </div>
    );
  }

  const center = {
    lat: locations[0].latitude,
    lng: locations[0].longitude,
  };

  const clockInIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const clockOutIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
          <Marker
            key={`${location.type}-${index}`}
            position={[location.latitude, location.longitude]}
            icon={location.type === 'clock-in' ? clockInIcon : clockOutIcon}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  {location.type === 'clock-in' ? (
                    <>
                      <LogIn size={16} className="text-green-600" />
                      <span className="font-medium text-green-600">Clock In</span>
                    </>
                  ) : (
                    <>
                      <LogOut size={16} className="text-red-600" />
                      <span className="font-medium text-red-600">Clock Out</span>
                    </>
                  )}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock size={14} className="mr-1" />
                  {format(new Date(location.timestamp), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};