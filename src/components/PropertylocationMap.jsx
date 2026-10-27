import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTheme } from "../context/ThemeContext.jsx";

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const PropertyLocationMap = ({ property }) => {
  const { theme } = useTheme();

  const isOffWhite = theme === "offwhite";

  const coords = property?.location?.coordinates;

  const cardShadow = isOffWhite
    ? "0 0 18px rgba(43,33,24,0.08)"
    : "0 0 18px rgba(0,0,0,0.25)";

  const hoverShadow = isOffWhite
    ? "0 0 28px rgba(139,90,43,0.14)"
    : "0 0 28px rgba(0,0,0,0.35)";

  const hoverBorder = isOffWhite
    ? "rgba(139,90,43,0.60)"
    : "rgba(201,164,92,0.60)";

  const buttonShadow = isOffWhite
    ? "0 0 18px rgba(139,90,43,0.20)"
    : "0 0 18px rgba(201,164,92,0.20)";

  const buttonHoverShadow = isOffWhite
    ? "0 0 24px rgba(139,90,43,0.30)"
    : "0 0 24px rgba(201,164,92,0.30)";

  const ringColor = isOffWhite
    ? "rgba(43,33,24,0.20)"
    : "rgba(245,239,227,0.20)";

  if (!coords || coords.length !== 2) {
    return (
      <div
        className="h-72 w-full rounded-xl border border-dashed flex items-center justify-center transition-all duration-500"
        style={{
          borderColor:
            "var(--theme-border)",
          backgroundColor:
            "var(--theme-surface)",
          boxShadow: cardShadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor =
            hoverBorder;
          e.currentTarget.style.boxShadow =
            hoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor =
            "var(--theme-border)";
          e.currentTarget.style.boxShadow =
            cardShadow;
        }}
      >
        <div className="text-center px-6">
          <p
            className="text-sm font-bold mb-1"
            style={{
              color:
                "var(--theme-text)",
            }}
          >
            Location not available
          </p>

          <p
            className="text-xs font-medium"
            style={{
              color:
                "var(--theme-muted-dark)",
            }}
          >
            This property doesn't have map coordinates yet.
          </p>
        </div>
      </div>
    );
  }

  const [lng, lat] = coords;

  return (
    <div
      className="h-80 w-full rounded-xl overflow-hidden transition-all duration-500 relative"
      style={{
        backgroundColor:
          "var(--theme-surface)",
        border:
          "1px solid var(--theme-border)",
        boxShadow: cardShadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor =
          hoverBorder;
        e.currentTarget.style.boxShadow =
          hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor =
          "var(--theme-border)";
        e.currentTarget.style.boxShadow =
          cardShadow;
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{
          height: "100%",
          width: "100%",
        }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[lat, lng]}
          icon={markerIcon}
        >
          <Popup>
            <span
              className="text-sm font-bold"
              style={{
                color: isOffWhite
                  ? "#2b2118"
                  : "#f5efe3",
              }}
            >
              {property.title ||
                "Property location"}
            </span>
          </Popup>
        </Marker>
      </MapContainer>

      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 z-[999] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
        style={{
          backgroundColor:
            "var(--theme-accent)",
          color:
            "var(--theme-button-text)",
          boxShadow: buttonShadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            "var(--theme-accent-hover)";
          e.currentTarget.style.boxShadow =
            buttonHoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            "var(--theme-accent)";
          e.currentTarget.style.boxShadow =
            buttonShadow;
        }}
      >
        <span className="text-sm">
          📍
        </span>

        Open in Google Maps
      </a>

      <div
        className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset"
        style={{
          "--tw-ring-color": ringColor,
        }}
      />
    </div>
  );
};

export default PropertyLocationMap;