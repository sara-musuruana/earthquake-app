import React, { useState, useEffect } from "react";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "../css/EarthquakeMap.css";
import "leaflet/dist/leaflet.css";

Leaflet.Icon.Default.imagePath = "../node_modules/leaflet";

delete Leaflet.Icon.Default.prototype._getIconUrl;

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function EarthquakeMap({ searchClicked, earthquakeData }) {
  const [showMap, setShowMap] = useState(false);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Aggiorna lo stato per mostrare la mappa quando searchClicked diventa true
    if (searchClicked) {
      setShowMap(true);
    }
  }, [searchClicked]);

  useEffect(() => {
    // Aggiorna i marker quando i dati dei terremoti cambiano
    const updatedMarkers = earthquakeData.map((earthquake) => (
      <Marker
        key={earthquake.id}
        position={[
          earthquake.geometry.coordinates[1],
          earthquake.geometry.coordinates[0],
        ]}
      >
        <Popup>
          <div>
            <h3>{earthquake.properties.place}</h3>
            <p>
              Magnitudo: {earthquake.properties.mag}
              <br />
              Data: {new Date(earthquake.properties.time).toLocaleString()}
            </p>
          </div>
        </Popup>
      </Marker>
    ));
    setMarkers(updatedMarkers);
  }, [earthquakeData]);

  return (
    <div className={`map-container ${showMap ? "visible" : "hidden"}`}>
      {showMap && (
        <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers}
        </MapContainer>
      )}
    </div>
  );
}

export default EarthquakeMap;
