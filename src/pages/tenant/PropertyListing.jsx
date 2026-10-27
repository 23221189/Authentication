import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiStar,
  FiChevronRight,
  FiSearch,
  FiCalendar,
  FiCheck,
  FiSliders,
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import cozyHomeBg from "../../assets/images/cozy-home-bg.jpeg";
import cozyHomeBg2 from "../../assets/images/cozy-home-bg2.jpeg";
import { useTheme } from "../../context/ThemeContext.jsx";

const DEFAULT_CENTER = { lat: 30.3753, lng: 69.3451 };
const FIXED_PROPERTY_TYPES = ["House", "Apartment", "Hostel"];
const FIXED_ROOM_TYPES = ["Single", "Shared"];

const ADDRESS_NOISE_WORDS = [
  "pakistan",
  "punjab",
  "sindh",
  "khyber pakhtunkhwa",
  "kpk",
  "balochistan",
  "islamabad capital territory",
  "azad kashmir",
  "gilgit-baltistan",
  "gilgit baltistan",
];

const cleanLocationLabel = (locationStr) => {
  if (!locationStr) return "";

  const parts = locationStr
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p && !ADDRESS_NOISE_WORDS.includes(p.toLowerCase()));

  return parts.join(", ") || locationStr;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const getPropertyLatLng = (property) => {
  const coords = property?.address?.coordinates;

  if (Array.isArray(coords) && coords.length === 2) {
    const [lng, lat] = coords;

    if (typeof lat === "number" && typeof lng === "number") {
      return { lat, lng };
    }
  }

  return null;
};

const PropertyListing = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const location = searchParams.get("location") || "";
  const cleanedLocation = cleanLocationLabel(location);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState(location);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFacilities, setExpandedFacilities] = useState({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get(
          location
            ? `/properties?location=${encodeURIComponent(location)}`
            : "/properties",
        );

        setProperties(response.data.properties || response.data || []);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    setSelectedFacilities([]);
    setSelectedType("");
    setSelectedRoomType("");
    setSearchInput(location);
  }, [location]);

  const uniqueFacilities = useMemo(() => {
    const facilitySet = new Set();

    properties.forEach((p) => {
      (p.facilities || []).forEach((f) => facilitySet.add(f));

      const acOptions = [
        ...(p.roomTypes || []).map((rt) => rt.acType),
        ...(p.rooms || []).map((r) => r.acType),
      ].filter(Boolean);

      acOptions.forEach((ac) => facilitySet.add(ac));
    });

    return Array.from(facilitySet).sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const typeStr = (p.type || p.propertyType || "").trim().toLowerCase();

      let normalizedType = "House";

      if (typeStr === "apartment" || typeStr === "flat") {
        normalizedType = "Apartment";
      } else if (typeStr === "hostel" || typeStr === "pg") {
        normalizedType = "Hostel";
      }

      const matchesType = !selectedType || normalizedType === selectedType;

      const matchesFacility =
        selectedFacilities.length === 0 ||
        selectedFacilities.every((f) => {
          if ((p.facilities || []).includes(f)) return true;

          if (f === "AC" || f === "Non-AC") {
            return (
              (p.roomTypes || []).some(
                (rt) => rt.acType === f && (rt.availableRooms ?? 1) > 0,
              ) ||
              (p.rooms || []).some(
                (r) => r.acType === f && r.status !== "booked",
              )
            );
          }

          return false;
        });

      const matchesRoomType =
        !selectedRoomType ||
        p.roomType === selectedRoomType ||
        (p.roomTypes || []).some(
          (rt) =>
            rt.category === selectedRoomType && (rt.availableRooms ?? 1) > 0,
        ) ||
        (p.rooms || []).some(
          (r) => r.category === selectedRoomType && r.status !== "booked",
        );

      return matchesType && matchesFacility && matchesRoomType;
    });
  }, [properties, selectedFacilities, selectedType, selectedRoomType]);

  const toggleRoomType = (type) => {
    setSelectedRoomType((prev) => (prev === type ? "" : type));
  };

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility],
    );
  };

  const togglePropertyType = (type) => {
    setSelectedType((prev) => (prev === type ? "" : type));
  };

  const toggleFacilities = (propertyId) => {
    setExpandedFacilities((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  const clearAllFilters = () => {
    setSelectedFacilities([]);
    setSelectedType("");
    setSelectedRoomType("");
  };

  const mapCenter = useMemo(() => {
    const first = filteredProperties.map(getPropertyLatLng).find(Boolean);

    return first
      ? [first.lat, first.lng]
      : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
  }, [filteredProperties]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchInput.trim()) {
      setSearchParams({
        location: searchInput.trim(),
      });
    } else {
      setSearchParams({});
    }
  };

  const totalActiveFilters =
    selectedFacilities.length +
    (selectedType ? 1 : 0) +
    (selectedRoomType ? 1 : 0);

  return (
    <div className="w-full min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans transition-colors duration-300">
      {/* ============================================================
          SEARCH BANNER
      ============================================================ */}
      <div
        className="w-full min-h-[230px] md:min-h-[280px] pt-16 pb-20 px-4 relative overflow-hidden flex items-center"
        style={{
          backgroundImage: `url(${
            theme === "offwhite" ? cozyHomeBg2 : cozyHomeBg
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="max-w-5xl w-full mx-auto relative z-10">
          <form
            onSubmit={handleSearchSubmit}
            className={`rounded-xl p-2.5 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 transition-all duration-300 ${
              theme === "offwhite"
                ? "bg-[#f7f1e7]/95 border border-[#8B5A2B] shadow-[0_0_24px_rgba(85,44,6,0.12)]"
                : "bg-[var(--theme-surface)]/95 shadow-[0_0_28px_rgba(0,0,0,0.14)] border border-[var(--theme-accent)]/70 hover:border-[var(--theme-accent)] hover:shadow-[0_0_34px_rgba(0,0,0,0.16)]"
            }`}
          >
            {/* Location */}
            <div className="flex items-center gap-3 w-full md:w-[38%] py-2 px-3 md:px-4">
              <FiMapPin className="text-[var(--theme-accent)] text-lg flex-shrink-0" />

              <div className="flex flex-col w-full text-left">
                <span className="text-[11px] font-bold text-[var(--theme-accent)] tracking-wider">
                  Location
                </span>

                <input
                  type="text"
                  placeholder="Where are you going.."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full text-xs font-medium text-[var(--theme-text)] outline-none placeholder-[var(--theme-muted-dark)] bg-transparent"
                />
              </div>
            </div>

            <div className="hidden md:block h-7 w-px bg-[var(--theme-border)]" />

            {/* Check-in */}
            <div className="flex items-center gap-3 w-full md:w-[25%] py-2 px-3 md:px-4">
              <FiCalendar
                className={`text-lg flex-shrink-0 ${
                  theme === "offwhite" ? "text-[#8B5A2B]" : "text-[#D4AF5A]"
                }`}
              />

              <div className="flex flex-col w-full text-left">
                <span className="text-[11px] font-bold text-[var(--theme-accent)] tracking-wider">
                  Check-in
                </span>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={`w-full text-xs font-medium text-[var(--theme-text)] outline-none placeholder-[var(--theme-muted-dark)] bg-transparent ${
                    theme === "offwhite" ? "date-icon-brown" : "date-icon-gold"
                  }`}
                />
              </div>
            </div>

            <div className="hidden md:block h-7 w-px bg-[var(--theme-border)]" />

            {/* Check-out */}
            <div className="flex items-center gap-3 w-full md:w-[25%] py-2 px-3 md:px-4">
              <FiCalendar
                className={`text-lg flex-shrink-0 ${
                  theme === "offwhite" ? "text-[#8B5A2B]" : "text-[#D4AF5A]"
                }`}
              />

              <div className="flex flex-col w-full text-left">
                <span className="text-[11px] font-bold text-[var(--theme-accent)] tracking-wider">
                  Check-out
                </span>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={`w-full text-xs font-medium text-[var(--theme-text)] outline-none placeholder-[var(--theme-muted-dark)] bg-transparent ${
                    theme === "offwhite" ? "date-icon-brown" : "date-icon-gold"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="font-extrabold px-5 md:px-6 py-3 rounded-lg flex items-center justify-center gap-2 shrink-0 text-xs md:text-sm cursor-pointer transition-all active:scale-95"
              style={{
                backgroundColor: "var(--theme-accent)",
                color: "var(--theme-button-text)",
              }}
            >
              <FiSearch className="text-lg" />
              Search Property
            </button>
          </form>
        </div>
      </div>

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[var(--theme-accent)] mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <Link
            to="/"
            className="hover:text-[var(--theme-accent-hover)] hover:underline font-medium"
          >
            House
          </Link>

          {cleanedLocation && (
            <>
              <FiChevronRight className="text-[9px] text-[var(--theme-muted-dark)]" />

              <span className="hover:text-[var(--theme-accent-hover)] hover:underline cursor-pointer font-medium">
                {cleanedLocation}
              </span>
            </>
          )}

          <FiChevronRight className="text-[9px] text-[var(--theme-muted-dark)]" />

          <span className="text-[var(--theme-muted-dark)] font-medium">
            Search results
          </span>
        </nav>

        <div className="pb-5">
          <h1 className="text-2xl font-extrabold text-[var(--theme-text)] tracking-tight">
            {cleanedLocation ? `${cleanedLocation}: ` : "All Locations: "}

            <span className="font-normal text-xl text-[var(--theme-muted-light)]">
              {filteredProperties.length.toLocaleString()} Properties Found
            </span>
          </h1>
        </div>

        {/* Layout: Sidebar + Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start mt-2">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="w-full flex items-center justify-between bg-[var(--theme-surface)] border border-[var(--theme-accent)]/50 rounded-lg px-4 py-3 text-[var(--theme-text)] shadow-[0_0_18px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all"
            >
              <span className="flex items-center gap-2 text-xs font-bold">
                <FiSliders className="text-[var(--theme-accent)] text-base" />
                Filters
                {totalActiveFilters > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-[var(--theme-accent)] text-[var(--theme-surface)] text-[10px] flex items-center justify-center">
                    {totalActiveFilters}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Mobile Filter Modal */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-[9998] bg-black/35 flex items-center justify-center p-3">
              <div className="w-[92%] max-w-sm max-h-[58vh] overflow-y-auto bg-[var(--theme-surface)] border border-[var(--theme-accent)]/50 rounded-xl shadow-[0_0_24px_rgba(0,0,0,0.14)]">
                <div className="sticky top-0 z-10 bg-[var(--theme-surface)] px-3 py-2 border-b border-[var(--theme-border)] flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-[var(--theme-text)]">
                    Filter by
                  </h2>

                  <div className="flex items-center gap-3">
                    {totalActiveFilters > 0 && (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="text-[10px] font-bold text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)]"
                      >
                        Clear all
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowMobileFilters(false)}
                      className="w-8 h-8 rounded-full border border-[var(--theme-border)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-surface)] transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3">
                  {/* Property Type */}
                  <div className="pb-3 mb-3 border-b border-[var(--theme-border)]">
                    <h3 className="text-xs font-extrabold text-[var(--theme-text)] mb-2 uppercase tracking-wider">
                      Property type
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {FIXED_PROPERTY_TYPES.map((type) => (
                        <label
                          key={type}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                            selectedType === type
                              ? "border-[var(--theme-accent)] text-[var(--theme-accent)]"
                              : "border-[var(--theme-border)] text-[var(--theme-muted-light)]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedType === type}
                            onChange={() => togglePropertyType(type)}
                            className="w-3.5 h-3.5 accent-[var(--theme-accent)] cursor-pointer"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Room Type */}
                  <div className="pb-3 mb-3 border-b border-[var(--theme-border)]">
                    <h3 className="text-xs font-extrabold text-[var(--theme-text)] mb-2 uppercase tracking-wider">
                      Room type
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {FIXED_ROOM_TYPES.map((type) => (
                        <label
                          key={type}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                            selectedRoomType === type
                              ? "border-[var(--theme-accent)] text-[var(--theme-accent)]"
                              : "border-[var(--theme-border)] text-[var(--theme-muted-light)]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRoomType === type}
                            onChange={() => toggleRoomType(type)}
                            className="w-3.5 h-3.5 accent-[var(--theme-accent)] cursor-pointer"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Facilities */}
                  {uniqueFacilities.length > 0 && (
                    <div>
                      <h3 className="text-xs font-extrabold text-[var(--theme-text)] mb-2 uppercase tracking-wider">
                        Facilities
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {uniqueFacilities.map((facility) => (
                          <label
                            key={facility}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                              selectedFacilities.includes(facility)
                                ? "border-[var(--theme-accent)] text-[var(--theme-accent)]"
                                : "border-[var(--theme-border)] text-[var(--theme-muted-light)]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedFacilities.includes(facility)}
                              onChange={() => toggleFacility(facility)}
                              className="w-3.5 h-3.5 accent-[var(--theme-accent)] cursor-pointer"
                            />
                            {facility}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full mt-3 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-surface)] font-bold text-xs py-2.5 rounded-lg transition-all"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4">
            {/* Map Preview */}
            <div className="relative h-36 w-full rounded-lg overflow-hidden border border-[var(--theme-border)] shadow-[0_0_18px_rgba(0,0,0,0.10)] group transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.14)]">
              <MapContainer
                key={location || "side-all"}
                center={mapCenter}
                zoom={location ? 11 : 5}
                zoomControl={false}
                attributionControl={false}
                dragging={false}
                scrollWheelZoom={false}
                style={{
                  height: "100%",
                  width: "100%",
                  zIndex: 0,
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {filteredProperties.map((property) => {
                  const pos = getPropertyLatLng(property);

                  if (!pos) return null;

                  return (
                    <Marker
                      key={property._id}
                      position={[pos.lat, pos.lng]}
                      icon={markerIcon}
                    />
                  );
                })}
              </MapContainer>

              <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-[400] pointer-events-none">
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="pointer-events-auto bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] font-bold text-xs px-4 py-2.5 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.16)] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <FiMapPin className="text-[var(--theme-bg)] text-sm" />
                  Show on map
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            <div className="border border-[var(--theme-border)] rounded-lg p-4 bg-[var(--theme-surface)] shadow-[0_0_18px_rgba(0,0,0,0.10)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/60 hover:bg-[var(--theme-surface)] hover:shadow-[0_0_24px_rgba(0,0,0,0.15)]">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)] mb-3">
                <h2 className="font-extrabold text-[var(--theme-text)] text-sm">
                  Filter by:
                </h2>

                {totalActiveFilters > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] hover:underline font-bold cursor-pointer transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Property Type */}
              <div className="pb-3 mb-3 border-b border-[var(--theme-border)]">
                <h3 className="text-xs font-extrabold text-[var(--theme-text)] mb-2 uppercase tracking-wider">
                  Property type
                </h3>

                <div className="flex flex-col gap-2.5">
                  {FIXED_PROPERTY_TYPES.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-xs text-[var(--theme-muted-light)] cursor-pointer select-none hover:text-[var(--theme-accent)] font-medium transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedType === type}
                        onChange={() => togglePropertyType(type)}
                        className="w-4 h-4 rounded border-[var(--theme-border)] text-[var(--theme-accent)] accent-[var(--theme-accent)] focus:ring-[var(--theme-accent)] cursor-pointer"
                      />

                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Room Type */}
              <div className="pb-3 mb-3 border-b border-[var(--theme-border)]">
                <h3 className="text-xs font-extrabold text-[var(--theme-text)] mb-2 uppercase tracking-wider">
                  Room type
                </h3>

                <div className="flex flex-col gap-2.5">
                  {FIXED_ROOM_TYPES.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-xs text-[var(--theme-muted-light)] cursor-pointer select-none hover:text-[var(--theme-accent)] font-medium transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoomType === type}
                        onChange={() => toggleRoomType(type)}
                        className="w-4 h-4 rounded border-[var(--theme-border)] text-[var(--theme-accent)] accent-[var(--theme-accent)] focus:ring-[var(--theme-accent)] cursor-pointer"
                      />

                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              {uniqueFacilities.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold text-[var(--theme-text)] mb-2 uppercase tracking-wider">
                    Facilities
                  </h3>

                  <div className="flex flex-col gap-2.5">
                    {uniqueFacilities.map((facility) => (
                      <label
                        key={facility}
                        className="flex items-center gap-2 text-xs text-[var(--theme-muted-light)] cursor-pointer select-none hover:text-[var(--theme-accent)] font-medium transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFacilities.includes(facility)}
                          onChange={() => toggleFacility(facility)}
                          className="w-4 h-4 rounded border-[var(--theme-border)] text-[var(--theme-accent)] accent-[var(--theme-accent)] focus:ring-[var(--theme-accent)] cursor-pointer"
                        />

                        <span>{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ============================================================
              PROPERTIES LISTING
          ============================================================ */}
          <div>
            {/* Loading */}
            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-[var(--theme-border)] border-t-[var(--theme-accent)] rounded-full mx-auto mb-4"></div>

                <p className="text-[var(--theme-muted-light)] font-medium text-sm">
                  Loading properties...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="text-center py-20">
                <p className="text-[var(--theme-accent-hover)] font-bold text-sm bg-[var(--theme-surface)] border border-[var(--theme-accent)]/20 rounded-lg py-4 px-6 inline-block shadow-[0_0_18px_rgba(0,0,0,0.10)]">
                  {error}
                </p>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && filteredProperties.length === 0 && (
              <div className="border border-[var(--theme-border)] rounded-lg p-8 text-center bg-[var(--theme-surface)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/60 hover:shadow-[0_0_22px_rgba(0,0,0,0.14)]">
                <p className="text-[var(--theme-text)] font-bold mb-2">
                  No properties match your selection.
                </p>

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] hover:underline font-extrabold cursor-pointer transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* ✅ FIXED: All Properties — One Grid, No Grouping */}
            {!loading && !error && filteredProperties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredProperties.map((property) => {
                  const monthlyRent = Number(
                    property.pricing?.monthlyRent || property.price || 0,
                  );

                  const dailyRent = Number(
                    property.pricing?.dailyRent ||
                      property.dailyPrice ||
                      Math.round(monthlyRent / 30) ||
                      0,
                  );

                  const reviewCount = Number(property.reviewCount || 0);
                  const rating = Number(property.averageRating || 0);
                  const hasRating = reviewCount > 0 && rating > 0;

                  const ratingLabel =
                    rating >= 4.5
                      ? "Superb"
                      : rating >= 4
                        ? "Very Good"
                        : rating >= 3
                          ? "Good"
                          : "Fair";

                  return (
                    <div
                      key={property._id}
                      className="border border-[var(--theme-accent)] hover:border-[var(--theme-accent-hover)] rounded-lg overflow-hidden bg-[var(--theme-surface)] shadow-[0_0_18px_rgba(0,0,0,0.10)] hover:shadow-[0_0_28px_rgba(0,0,0,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image */}
                        <div className="relative w-full h-36 sm:h-48 md:h-52 bg-[var(--theme-surface)] overflow-hidden">
                          <img
                            src={
                              property.images?.[0] ||
                              property.image ||
                              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
                            }
                            alt={property.title}
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          />

                          <span className="absolute top-2 left-2 bg-[var(--theme-surface)]/95 text-[var(--theme-accent)] text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm border border-[var(--theme-accent)]">
                            {property.type ||
                              property.propertyType ||
                              "House"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-sm text-[var(--theme-text)] leading-snug line-clamp-1 mb-1">
                            {property.title}
                          </h3>

                          <div className="flex items-center gap-1 text-[11px] text-[var(--theme-muted-light)] mb-2">
                            <FiMapPin className="text-[var(--theme-accent)] text-xs flex-shrink-0" />

                            <span className="truncate font-medium">
                              {(
                                property.address?.city ||
                                property.city ||
                                location ||
                                "Pakistan"
                              )
                                .charAt(0)
                                .toUpperCase() +
                                (
                                  property.address?.city ||
                                  property.city ||
                                  location ||
                                  "Pakistan"
                                )
                                  .slice(1)
                                  .toLowerCase()}

                              {property.address?.area
                                ? `, ${property.address.area}`
                                : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs mb-2.5">
                            {hasRating ? (
                              <>
                                <div className="flex items-center text-[var(--theme-accent)] text-xs">
                                  <FiStar />

                                  <span className="ml-1 font-bold text-[var(--theme-text)] text-[11px]">
                                    {rating.toFixed(1)}
                                  </span>
                                </div>

                                <span className="bg-[var(--theme-surface)] text-[var(--theme-accent)] font-bold px-2 py-0.5 rounded-md text-[10px] border border-[var(--theme-accent)]/30">
                                  {ratingLabel}
                                </span>

                                <span className="text-[var(--theme-muted-dark)] text-[10px] font-medium">
                                  &middot; ({reviewCount}{" "}
                                  {reviewCount === 1 ? "review" : "reviews"})
                                </span>
                              </>
                            ) : (
                              <span className="text-[var(--theme-muted-dark)] text-[10px] italic font-medium">
                                No reviews yet
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {(property.facilities || [])
                              .slice(
                                0,
                                expandedFacilities[property._id]
                                  ? property.facilities.length
                                  : 3,
                              )
                              .map((f) => (
                                <span
                                  key={f}
                                  className="flex items-center gap-0.5 text-[10px] bg-[var(--theme-surface)] text-[var(--theme-accent)] border border-[var(--theme-accent)]/25 px-1.5 py-0.5 rounded-md font-bold"
                                >
                                  <FiCheck className="text-[var(--theme-accent)] text-[10px]" />
                                  {f}
                                </span>
                              ))}

                            {(property.facilities?.length || 0) > 3 && (
                              <button
                                type="button"
                                onClick={() => toggleFacilities(property._id)}
                                className="text-[10px] text-[var(--theme-accent)] font-bold self-center hover:text-[var(--theme-accent-hover)] hover:underline cursor-pointer"
                              >
                                {expandedFacilities[property._id]
                                  ? "Show less"
                                  : `+${property.facilities.length - 3} more`}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2.5 sm:pt-3 border-t border-[var(--theme-border)] bg-[var(--theme-surface)]">
                        <div className="flex justify-between items-baseline mb-3">
                          <div>
                            <span className="text-[10px] text-[var(--theme-muted-dark)] block leading-tight font-bold uppercase tracking-wider">
                              Daily Rent
                            </span>

                            <span className="text-xs font-bold text-[var(--theme-text)]">
                              PKR {dailyRent.toLocaleString()}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-[var(--theme-muted-dark)] block leading-tight font-bold uppercase tracking-wider">
                              Monthly Rent
                            </span>

                            <span className="text-sm font-extrabold text-[var(--theme-accent)]">
                              PKR {monthlyRent.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/property/${property._id}`);
                            setTimeout(() => {
                              window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: "instant",
                              });
                            }, 50);
                          }}
                          className="w-full text-xs font-bold py-2.5 rounded-md transition-all active:scale-95 cursor-pointer"
                          style={{
                            backgroundColor:
                              theme === "offwhite"
                                ? "#8B5A2B"
                                : "var(--theme-accent)",
                            color:
                              theme === "offwhite"
                                ? "#FFFFFF"
                                : "var(--theme-button-text)",
                            boxShadow:
                              theme === "offwhite"
                                ? "none"
                                : "0 0 18px rgba(0,0,0,0.15)",
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          MAP MODAL
      ============================================================ */}
      {showMapModal && (
        <div className="fixed inset-0 bg-[var(--theme-overlay)] backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[var(--theme-surface)] w-full max-w-5xl h-[85vh] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-[var(--theme-accent)]">
            <div className="px-5 py-4 bg-[var(--theme-surface)] text-[var(--theme-text)] flex justify-between items-center border-b border-[var(--theme-border)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[var(--theme-surface)] border border-[var(--theme-accent)]/30 flex items-center justify-center">
                  <FiMapPin className="text-[var(--theme-accent)]" />
                </div>

                <h3 className="font-extrabold text-sm tracking-tight">
                  Interactive Map View
                </h3>
              </div>

              <button
                onClick={() => setShowMapModal(false)}
                className="w-9 h-9 rounded-md bg-[var(--theme-surface)] hover:bg-[var(--theme-accent)] text-[var(--theme-accent)] hover:text-[var(--theme-bg)] flex items-center justify-center font-bold text-lg cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 w-full h-full relative">
              <MapContainer
                center={mapCenter}
                zoom={12}
                scrollWheelZoom={true}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {filteredProperties.map((property) => {
                  const pos = getPropertyLatLng(property);

                  if (!pos) return null;

                  return (
                    <Marker
                      key={property._id}
                      position={[pos.lat, pos.lng]}
                      icon={markerIcon}
                      eventHandlers={{
                        click: () => {
                          navigate(`/property/${property._id}`);
                          setTimeout(() => {
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: "instant",
                            });
                          }, 50);
                        },
                      }}
                    >
                      <Popup>
                        <div className="text-xs bg-[var(--theme-card)] text-[var(--theme-text)] p-1 rounded">
                          <p className="font-bold text-[#8b6d37]">
                            {property.title}
                          </p>

                          <p className="text-[var(--theme-muted-light)]">
                            {property.address?.city}
                          </p>

                          <p className="font-bold text-[var(--theme-text)] mt-1">
                            Rs.{" "}
                            {Number(
                              property.pricing?.monthlyRent ||
                                property.price ||
                                0,
                            ).toLocaleString()}{" "}
                            / month
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListing;