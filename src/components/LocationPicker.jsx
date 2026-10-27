import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  FaLocationArrow,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useGeolocation } from "../hooks/useGeolocation";
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

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);

  return null;
};

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={markerIcon} />
  );
};

const LocationPicker = ({ onLocationChange }) => {
  const { theme } = useTheme();
  const { coords, status, error, getLocation } =
    useGeolocation();

  const [manualPin, setManualPin] = useState(null);

  const isOffWhite = theme === "offwhite";

  useEffect(() => {
    if (coords) {
      setManualPin({
        lat: coords.latitude,
        lng: coords.longitude,
      });

      onLocationChange?.({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }
  }, [coords, onLocationChange]);

  const handleManualPin = (latlng) => {
    setManualPin(latlng);

    onLocationChange?.({
      latitude: latlng.lat,
      longitude: latlng.lng,
    });
  };

  const defaultCenter = [31.5204, 74.3587];

  const cardShadow = isOffWhite
    ? "0 0 18px rgba(43,33,24,0.08)"
    : "0 0 18px rgba(0,0,0,0.25)";

  const hoverShadow = isOffWhite
    ? "0 0 28px rgba(139,90,43,0.16)"
    : "0 0 28px rgba(201,164,92,0.18)";

  const accentShadow = isOffWhite
    ? "0 0 18px rgba(139,90,43,0.18)"
    : "0 0 18px rgba(201,164,92,0.18)";

  const accentHoverShadow = isOffWhite
    ? "0 0 26px rgba(139,90,43,0.28)"
    : "0 0 26px rgba(201,164,92,0.28)";

  return (
    <div className="space-y-4 font-sans w-full">
      <button
        type="button"
        onClick={getLocation}
        disabled={status === "locating"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        style={{
          backgroundColor: "var(--theme-accent)",
          color: "var(--theme-button-text)",
          border: "1px solid var(--theme-accent)",
          boxShadow: accentShadow,
        }}
        onMouseEnter={(e) => {
          if (status !== "locating") {
            e.currentTarget.style.backgroundColor =
              "var(--theme-accent-hover)";
            e.currentTarget.style.transform =
              "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              accentHoverShadow;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            "var(--theme-accent)";
          e.currentTarget.style.transform =
            "translateY(0)";
          e.currentTarget.style.boxShadow =
            accentShadow;
        }}
      >
        <FaLocationArrow className="text-sm shrink-0" />

        {status === "locating"
          ? "Getting location..."
          : "Use My Current Location (GPS)"}
      </button>

      {error && (
        <div
          className="rounded-lg px-4 py-3 transition-all duration-300"
          style={{
            backgroundColor: "var(--theme-surface)",
            border:
              "1px solid color-mix(in srgb, var(--theme-accent) 40%, transparent)",
            boxShadow:
              "0 0 16px color-mix(in srgb, var(--theme-accent) 8%, transparent)",
          }}
        >
          <p
            className="text-sm font-medium leading-relaxed"
            style={{
              color: "var(--theme-accent)",
            }}
          >
            {error}
          </p>

          <p
            className="text-xs mt-1 font-medium"
            style={{
              color: "var(--theme-muted-dark)",
            }}
          >
            Don't worry! You can manually pin your
            location on the map below.
          </p>
        </div>
      )}

      <div
        className="h-64 sm:h-72 w-full rounded-xl overflow-hidden relative transition-all duration-500"
        style={{
          backgroundColor: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          boxShadow: cardShadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor =
            "var(--theme-accent)";
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
        <div
          className="absolute top-3 left-3 z-[1000] text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg pointer-events-none"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--theme-surface) 92%, transparent)",
            border:
              "1px solid color-mix(in srgb, var(--theme-accent) 40%, transparent)",
            color: "var(--theme-text)",
            backdropFilter: "blur(6px)",
          }}
        >
          Click on the map to pin your location
        </div>

        <MapContainer
          center={
            manualPin
              ? [manualPin.lat, manualPin.lng]
              : defaultCenter
          }
          zoom={13}
          style={{
            height: "100%",
            width: "100%",
          }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker
            position={manualPin}
            setPosition={handleManualPin}
          />

          {manualPin && (
            <RecenterMap
              lat={manualPin.lat}
              lng={manualPin.lng}
            />
          )}
        </MapContainer>

        <div
          className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset"
          style={{
            "--tw-ring-color":
              "color-mix(in srgb, var(--theme-accent) 10%, transparent)",
          }}
        />
      </div>

      {manualPin && (
        <div
          className="flex items-start gap-3 rounded-lg px-4 py-3 transition-all duration-300 hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--theme-surface)",
            border: "1px solid var(--theme-border)",
            boxShadow:
              "0 0 16px color-mix(in srgb, var(--theme-accent) 6%, transparent)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor =
              "var(--theme-accent)";
            e.currentTarget.style.boxShadow =
              "0 0 22px color-mix(in srgb, var(--theme-accent) 14%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              "var(--theme-border)";
            e.currentTarget.style.boxShadow =
              "0 0 16px color-mix(in srgb, var(--theme-accent) 6%, transparent)";
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--theme-card)",
              border:
                "1px solid color-mix(in srgb, var(--theme-accent) 25%, transparent)",
              boxShadow:
                "0 0 12px color-mix(in srgb, var(--theme-accent) 6%, transparent)",
            }}
          >
            <FaMapMarkerAlt
              className="text-xs"
              style={{
                color: "var(--theme-accent)",
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{
                color: "var(--theme-accent)",
              }}
            >
              Location Selected
            </p>

            <p
              className="text-sm font-bold break-all leading-relaxed"
              style={{
                color: "var(--theme-text)",
              }}
            >
              {manualPin.lat.toFixed(6)},{" "}
              {manualPin.lng.toFixed(6)}
            </p>

            {coords && (
              <p
                className="text-[11px] font-medium mt-1"
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                Accuracy ~
                {Math.round(coords.accuracy)}m
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;