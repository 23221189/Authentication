import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import axiosClient from "../../api/axiosClient";
import {
  getAdminProperties,
  approveProperty,
  rejectProperty,
} from "../../api/adminApi";
import {
  FaSearch,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaCheck,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaUserTie,
  FaHome,
  FaMoneyBillWave,
  FaUsers,
  FaCalendarAlt,
  FaEye,
  FaWifi,
  FaCar,
  FaSnowflake,
  FaUtensils,
  FaBed,
} from "react-icons/fa";

const SERVER_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const resolveImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${SERVER_ORIGIN}${img}`;
};

const mapStatus = (status) => {
  if (status === "published" || status === "approved") return "Active";
  if (status === "rejected") return "Rejected";
  return "Pending";
};

const normalizeProperty = (p) => ({
  id: p._id,
  name: p.title || "Untitled Property",
  owner: p.owner?.fullname || p.owner?.email || "Unknown Owner",
  location: [p.address?.area, p.address?.city]
    .filter(Boolean)
    .join(", "),
  type: p.propertyType,
  price: p.pricing?.monthlyRent
    ? `Rs. ${Number(p.pricing.monthlyRent).toLocaleString()}`
    : "N/A",
  status: mapStatus(p.status),
  image: resolveImageUrl(p.images?.[0]),
  images: (p.images || []).map(resolveImageUrl),
  video: (p.video || []).map(resolveImageUrl),
  registeredDate: p.createdAt
    ? new Date(p.createdAt).toLocaleDateString()
    : "",
  rooms: p.totalRooms ?? 0,
  guests: p.availableRooms ?? 0,
  facilities: p.facilities || [],
  description: p.description || "No description provided.",
});

function AdminProperties() {
  const { theme } = useTheme();
  const isOffWhite = theme === "offwhite";
  const accentRgb = isOffWhite ? "139,90,43" : "201,164,92";
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [typeOpen, setTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[data-property-filter-dropdown]")) {
        setTypeOpen(false);
        setStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminProperties();
      const raw = res.data.properties || [];

      setProperties(raw.map(normalizeProperty));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        property.name.toLowerCase().includes(query) ||
        property.owner.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        property.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        property.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [
    properties,
    searchQuery,
    statusFilter,
    typeFilter,
  ]);

  const totalProperties = properties.length;

  const activeProperties = properties.filter(
    (p) => p.status === "Active"
  ).length;

  const pendingProperties = properties.filter(
    (p) => p.status === "Pending"
  ).length;

  const rejectedProperties = properties.filter(
    (p) => p.status === "Rejected"
  ).length;

  const updateStatus = async (id, status) => {
    try {
      setError("");

      if (status === "Active") {
        await axiosClient.put(`/properties/${id}/approve`, {
          adminRemarks: "",
        });
      } else if (status === "Rejected") {
        await axiosClient.put(`/properties/${id}/reject`, {
          adminRemarks: "Property did not meet the verification requirements.",
        });
      }

      setSelectedProperty(null);
      await loadProperties();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update property status."
      );
    }
  };

  const getFacilityIcon = (facility) => {
    if (facility === "WiFi") return <FaWifi />;
    if (facility === "Parking") return <FaCar />;
    if (facility === "AC") return <FaSnowflake />;
    if (facility === "Kitchen") return <FaUtensils />;

    return <FaCheckCircle />;
  };

  const cardBase = "rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1";

  return (
    <>
      <div className="w-full min-w-0 max-w-full overflow-x-hidden" style={{ backgroundColor: isOffWhite ? "var(--theme-bg)" : "#000000", color: "var(--theme-text)", "--theme-accent-rgb": accentRgb }}>

        <div className="mb-6 sm:mb-8">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)] tracking-tight">
            Property{" "}
            <span className="text-[var(--theme-accent)]">
              Management
            </span>
          </h1>

          <p className="mt-1 text-sm text-[var(--theme-muted-dark)] font-medium">
            Review and manage all property listings
          </p>

        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-5 mb-5 sm:mb-8">

          <div
            className={`${cardBase} p-2.5 sm:p-5 flex items-center justify-between hover:border-[var(--theme-accent)]/30 hover:-translate-y-1 transition-all duration-300`} style={{ backgroundColor: isOffWhite ? "var(--theme-card)" : "#050505", borderColor: "var(--theme-border)", boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}
          >

            <div>

              <p className="text-[9px] sm:text-sm text-[var(--theme-muted-dark)] font-bold leading-tight">
                Total Properties
              </p>

              <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--theme-text)] mt-1">
                {totalProperties}
              </h2>

            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center">
              <FaBuilding className="text-[var(--theme-accent)] text-base sm:text-xl" />
            </div>

          </div>


          <div
            className={`${cardBase} p-2.5 sm:p-5 flex items-center justify-between hover:border-[var(--theme-accent)]/30 hover:-translate-y-1 transition-all duration-300`} style={{ backgroundColor: isOffWhite ? "var(--theme-card)" : "#050505", borderColor: "var(--theme-border)", boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}
          >

            <div>

              <p className="text-[9px] sm:text-sm text-[var(--theme-muted-dark)] font-bold leading-tight">
                Active Properties
              </p>

              <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--theme-text)] mt-1">
                {activeProperties}
              </h2>

            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center">
              <FaCheckCircle className="text-[var(--theme-accent)] text-base sm:text-xl" />
            </div>

          </div>


          <div
            className={`${cardBase} p-2.5 sm:p-5 flex items-center justify-between hover:border-[var(--theme-accent)]/30 hover:-translate-y-1 transition-all duration-300`} style={{ backgroundColor: isOffWhite ? "var(--theme-card)" : "#050505", borderColor: "var(--theme-border)", boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}
          >

            <div>

              <p className="text-[9px] sm:text-sm text-[var(--theme-muted-dark)] font-bold leading-tight">
                Pending Verification
              </p>

              <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--theme-text)] mt-1">
                {pendingProperties}
              </h2>

            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center">
              <FaClock className="text-[var(--theme-accent)] text-base sm:text-xl" />
            </div>

          </div>


          <div
            className={`${cardBase} p-2.5 sm:p-5 flex items-center justify-between hover:border-[var(--theme-accent)]/30 hover:-translate-y-1 transition-all duration-300`} style={{ backgroundColor: isOffWhite ? "var(--theme-card)" : "#050505", borderColor: "var(--theme-border)", boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}
          >

            <div>

              <p className="text-[9px] sm:text-sm text-[var(--theme-muted-dark)] font-bold leading-tight">
                Rejected Properties
              </p>

              <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--theme-text)] mt-1">
                {rejectedProperties}
              </h2>

            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center">
              <FaTimesCircle className="text-[var(--theme-accent)] text-base sm:text-xl" />
            </div>

          </div>

        </div>


        <div className={`${cardBase} overflow-hidden`} style={{ backgroundColor: isOffWhite ? "var(--theme-card)" : "#050505", borderColor: "var(--theme-border)", boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}>

          <div className="p-3 sm:p-5 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]">

            <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">

              <div className="relative w-full xl:max-w-md">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-muted-dark)]" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search property, owner or location..."
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] outline-none text-sm font-medium text-[var(--theme-muted-light)] transition-all focus:border-[var(--theme-accent)] focus:bg-[var(--theme-surface)] focus:ring-2 focus:ring-[var(--theme-accent)]/20 placeholder:text-[var(--theme-muted-dark)]"
                />

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto">

                <div data-property-filter-dropdown className="relative w-full sm:w-44">

                  <button
                    type="button"
                    onClick={() => {
                      setTypeOpen((prev) => !prev);
                      setStatusOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-[var(--theme-surface)] outline-none text-sm font-bold text-[var(--theme-accent)] cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      typeOpen
                        ? "border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/20"
                        : "border-[var(--theme-border)]"
                    }`}
                  >

                    <span>
                      {typeFilter === "All"
                        ? "All Types"
                        : typeFilter}
                    </span>

                    <span
                      className={`text-[var(--theme-accent)] text-sm sm:text-lg leading-none transition-transform duration-200 ${
                        typeOpen ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>

                  </button>


                  {typeOpen && (
                    <div className="absolute z-50 mt-1.5 w-full max-h-40 overflow-y-auto overflow-x-hidden rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[0_0_24px_rgba(var(--theme-accent-rgb),0.18)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full">

                      {[
                        {
                          value: "All",
                          label: "All Types",
                        },
                        {
                          value: "Apartment",
                          label: "Apartment",
                        },
                        {
                          value: "PG",
                          label: "PG",
                        },
                        {
                          value: "House",
                          label: "House",
                        },
                        {
                          value: "Hostel",
                          label: "Hostel",
                        },
                      ].map((option) => (

                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setTypeFilter(option.value);
                            setTypeOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm font-bold transition-colors cursor-pointer ${
                            typeFilter === option.value
                              ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
                              : "text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)]"
                          }`}
                        >
                          {option.label}
                        </button>

                      ))}

                    </div>
                  )}

                </div>


                <div data-property-filter-dropdown className="relative w-full sm:w-44">

                  <button
                    type="button"
                    onClick={() => {
                      setStatusOpen((prev) => !prev);
                      setTypeOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-[var(--theme-surface)] outline-none text-sm font-bold text-[var(--theme-accent)] cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      statusOpen
                        ? "border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/20"
                        : "border-[var(--theme-border)]"
                    }`}
                  >

                    <span>
                      {statusFilter === "All"
                        ? "All Status"
                        : statusFilter}
                    </span>

                    <span
                      className={`text-[var(--theme-accent)] text-sm sm:text-lg leading-none transition-transform duration-200 ${
                        statusOpen ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>

                  </button>


                  {statusOpen && (
                    <div className="absolute z-50 mt-1.5 w-full max-h-40 overflow-y-auto overflow-x-hidden rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[0_0_24px_rgba(var(--theme-accent-rgb),0.18)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full">

                      {[
                        {
                          value: "All",
                          label: "All Status",
                        },
                        {
                          value: "Active",
                          label: "Active",
                        },
                        {
                          value: "Pending",
                          label: "Pending",
                        },
                        {
                          value: "Rejected",
                          label: "Rejected",
                        },
                      ].map((option) => (

                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setStatusFilter(option.value);
                            setStatusOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm font-bold transition-colors cursor-pointer ${
                            statusFilter === option.value
                              ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
                              : "text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)]"
                          }`}
                        >
                          {option.label}
                        </button>

                      ))}

                    </div>
                  )}

                </div>

              </div>

            </div>


            {pendingProperties > 0 && (

              <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-[#c9a45c]/10 via-[var(--theme-card)] to-[#c9a45c]/10 border border-[var(--theme-accent)]/20">

                <div className="w-8 h-8 rounded-lg bg-[var(--theme-accent)]/10 flex items-center justify-center shrink-0">

                  <FaClock className="text-[var(--theme-accent)] text-sm" />

                </div>

                <p className="text-sm text-[var(--theme-muted-light)] font-medium">

                  <span className="font-extrabold text-[var(--theme-accent)]">
                    {pendingProperties}{" "}
                    {pendingProperties > 1
                      ? "properties are"
                      : "property is"}
                  </span>{" "}
                  waiting for admin verification.

                </p>

              </div>

            )}

          </div>


          <div className="md:hidden divide-y divide-[var(--theme-border)]">
            {loading ? (
              <div className="px-4 py-10 text-center text-[var(--theme-muted-dark)] font-medium">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-[var(--theme-accent)] border-t-transparent rounded-full"></div>
                  Loading properties...
                </div>
              </div>
            ) : error ? (
              <div className="px-4 py-10 text-center text-[var(--theme-accent)] font-medium text-sm">
                {error}
              </div>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="p-3.5 min-w-0" style={{ backgroundColor: isOffWhite ? "var(--theme-surface)" : "#050505" }}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-14 h-14 shrink-0 rounded-xl object-cover border border-[var(--theme-border)]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-[var(--theme-text)] truncate">
                        {property.name}
                      </p>

                      <p className="mt-1 text-[10px] text-[var(--theme-muted-dark)] font-medium truncate">
                        {property.owner}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-[10px] text-[var(--theme-muted-dark)] font-medium truncate">
                        <FaMapMarkerAlt className="text-[var(--theme-accent)] shrink-0" />
                        <span className="truncate">{property.location || "Location not available"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-3">
                    <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] px-2 py-1.5 min-w-0">
                      <p className="text-[8px] uppercase font-bold text-[var(--theme-muted-dark)]">Type</p>
                      <p className="mt-0.5 text-[10px] font-bold text-[var(--theme-accent)] truncate">
                        {property.type}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] px-2 py-1.5 min-w-0">
                      <p className="text-[8px] uppercase font-bold text-[var(--theme-muted-dark)]">Price</p>
                      <p className="mt-0.5 text-[10px] font-bold text-[var(--theme-text)] truncate">
                        {property.price}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] px-2 py-1.5 min-w-0">
                      <p className="text-[8px] uppercase font-bold text-[var(--theme-muted-dark)]">Status</p>
                      <p className="mt-0.5 text-[10px] font-bold text-[var(--theme-accent)] truncate">
                        {property.status}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="mt-2.5 w-full py-2 rounded-lg bg-[var(--theme-surface)] hover:bg-[var(--theme-accent)] text-[var(--theme-accent)] hover:text-[var(--theme-button-text)] border-2 border-[var(--theme-accent)] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.18)] active:scale-95 cursor-pointer"
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="px-4 py-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] flex items-center justify-center mb-3">
                  <FaBuilding className="text-lg" />
                </div>
                <h3 className="text-sm font-extrabold text-[var(--theme-text)]">
                  No Properties Found
                </h3>
                <p className="text-xs text-[var(--theme-muted-dark)] mt-1 font-medium">
                  No property matches your current filters.
                </p>
              </div>
            )}
          </div>

          <div className="hidden md:block w-full max-w-full overflow-hidden">

            <table className="w-full table-fixed">

              <thead className="bg-[var(--theme-surface)] border-b border-[var(--theme-border)]">

                <tr className="text-left text-xs uppercase tracking-wider text-[var(--theme-muted-dark)]">

                  <th className="px-3 lg:px-5 py-4 font-bold">
                    Property
                  </th>

                  <th className="px-3 lg:px-5 py-4 font-bold">
                    Owner
                  </th>

                  <th className="px-3 lg:px-5 py-4 font-bold">
                    Location
                  </th>

                  <th className="px-3 lg:px-5 py-4 font-bold">
                    Type
                  </th>

                  <th className="px-3 lg:px-5 py-4 font-bold">
                    Price
                  </th>

                  <th className="px-3 lg:px-5 py-4 font-bold">
                    Status
                  </th>

                  <th className="px-3 lg:px-5 py-4 font-bold">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-[var(--theme-border)]">

                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-6 py-16 text-center"
                    >

                      <div className="flex items-center justify-center gap-3 text-[var(--theme-muted-dark)] font-medium">

                        <div className="animate-spin w-4 h-4 border-2 border-[var(--theme-accent)] border-t-transparent rounded-full"></div>

                        Loading properties...

                      </div>

                    </td>

                  </tr>

                ) : error ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-6 py-16 text-center text-[var(--theme-accent)] font-medium"
                    >
                      {error}
                    </td>

                  </tr>

                ) : filteredProperties.length > 0 ? (

                  filteredProperties.map((property) => (

                    <tr
                      key={property.id}
                      className="hover:bg-[var(--theme-surface)] hover:shadow-[0_6px_24px_rgba(var(--theme-accent-rgb),0.14)] transition-all duration-300"
                    >

                      <td className="px-3 lg:px-5 py-4">

                        <div className="flex items-center gap-3">

                          <img
                            src={property.image}
                            alt={property.name}
                            className="w-14 h-14 rounded-xl object-cover border border-[var(--theme-border)]"
                          />

                          <div>

                            <p className="font-bold text-[var(--theme-text)] text-sm">
                              {property.name}
                            </p>

                            <p className="text-xs text-[var(--theme-muted-dark)] mt-1 font-medium">
                              Listed {property.registeredDate}
                            </p>

                          </div>

                        </div>

                      </td>


                      <td className="px-3 lg:px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-[var(--theme-muted-light)] font-medium">

                          <FaUserTie className="text-[var(--theme-accent)]" />

                          {property.owner}

                        </div>

                      </td>


                      <td className="px-3 lg:px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-[var(--theme-muted-light)] font-medium">

                          <FaMapMarkerAlt className="text-[var(--theme-accent)]" />

                          {property.location}

                        </div>

                      </td>


                      <td className="px-3 lg:px-5 py-4">

                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 text-xs font-bold">

                          <FaHome />

                          {property.type}

                        </span>

                      </td>


                      <td className="px-6 py-5 text-sm font-extrabold text-[var(--theme-text)]">
                        {property.price}
                      </td>


                      <td className="px-3 lg:px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
                            property.status === "Active"
                              ? "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20"
                              : property.status === "Pending"
                              ? "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20"
                              : "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20"
                          }`}
                        >

                          {property.status === "Active" ? (
                            <FaCheckCircle />
                          ) : property.status === "Pending" ? (
                            <FaClock />
                          ) : (
                            <FaTimesCircle />
                          )}

                          {property.status}

                        </span>

                      </td>


                      <td className="px-3 lg:px-5 py-4">

                        <button
                          onClick={() =>
                            setSelectedProperty(property)
                          }
                          className="px-4 py-2.5 rounded-xl bg-[var(--theme-surface)] hover:bg-[var(--theme-accent)] text-[var(--theme-accent)] hover:text-[var(--theme-button-text)] border-2 border-[var(--theme-accent)] transition-all text-xs font-bold flex items-center gap-2 shadow-[0_0_28px_rgba(var(--theme-accent-rgb),0.25)] active:scale-95 cursor-pointer"
                        >

                          <FaEye />

                          View Details

                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-6 py-16 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="w-16 h-16 rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] flex items-center justify-center mb-4">

                          <FaBuilding className="text-2xl" />

                        </div>

                        <h3 className="text-lg font-extrabold text-[var(--theme-text)]">
                          No Properties Found
                        </h3>

                        <p className="text-sm text-[var(--theme-muted-dark)] mt-1 font-medium">
                          No property matches your current filters.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {selectedProperty && (

        <div className="fixed inset-0 z-50 bg-[var(--theme-overlay)] backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">

          <div className="w-full max-w-[360px] sm:max-w-4xl rounded-2xl sm:rounded-3xl shadow-[0_0_32px_rgba(var(--theme-accent-rgb),0.18)] border border-[var(--theme-border)] overflow-x-hidden overflow-y-auto max-h-[88vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]">


            <div className="px-3.5 py-3 sm:px-6 sm:py-5 bg-linear-to-r from-[#8f7440] via-[#6f5a32] to-[#c9a45c] text-[var(--theme-button-text)] flex items-center justify-between sticky top-0 z-10">

              <div>

                <h2 className="text-base sm:text-2xl font-extrabold tracking-tight truncate pr-2">
                  Property Details
                </h2>

                <p className="text-[10px] sm:text-sm text-[var(--theme-button-text)]/70 mt-0.5 sm:mt-1 font-medium truncate">
                  Complete property listing information
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedProperty(null)
                }
                className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-surface)]/15 shrink-0 hover:bg-[var(--theme-surface)]/25 transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>

            </div>


            <div className="p-3 sm:p-6 min-w-0">


              <div className="mb-4 sm:mb-6">

                <div className="relative rounded-2xl overflow-hidden bg-[var(--theme-surface)] border border-[var(--theme-border)]">

                  <img
                    src={selectedProperty.images?.[0] || selectedProperty.image}
                    alt={selectedProperty.name}
                    className="w-full h-40 sm:h-72 object-cover"
                  />

                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs font-bold shadow-[0_0_24px_rgba(var(--theme-accent-rgb),0.18)] ${
                        selectedProperty.status === "Active"
                          ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
                          : selectedProperty.status === "Pending"
                          ? "bg-[var(--theme-surface)] text-[var(--theme-accent)] border border-[var(--theme-accent)]/30"
                          : "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
                      }`}
                    >

                      {selectedProperty.status === "Active" ? (
                        <FaCheckCircle />
                      ) : selectedProperty.status === "Pending" ? (
                        <FaClock />
                      ) : (
                        <FaTimesCircle />
                      )}

                      {selectedProperty.status}

                    </span>

                  </div>

                </div>

                {selectedProperty.images?.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-3 min-w-0">
                    {selectedProperty.images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="rounded-xl overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)]"
                      >
                        <img
                          src={imageUrl}
                          alt={`${selectedProperty.name} ${index + 1}`}
                          className="w-full h-16 sm:h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>


              <div className="mb-4 sm:mb-6">

                <h3 className="text-base sm:text-2xl font-extrabold text-[var(--theme-text)] tracking-tight break-words">
                  {selectedProperty.name}
                </h3>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-medium">

                  <span className="flex items-center gap-2">

                    <FaMapMarkerAlt className="text-[var(--theme-accent)]" />

                    {selectedProperty.location}

                  </span>

                  <span className="flex items-center gap-2">

                    <FaHome className="text-[var(--theme-accent)]" />

                    {selectedProperty.type}

                  </span>

                </div>

              </div>


              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 min-w-0">

                <div className="p-2.5 sm:p-4 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_6px_22px_rgba(var(--theme-accent-rgb),0.16)]">

                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 truncate">

                    <FaUserTie className="text-[var(--theme-accent)]" />

                    Property Owner

                  </p>

                  <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                    {selectedProperty.owner}
                  </p>

                </div>


                <div className="p-2.5 sm:p-4 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_6px_22px_rgba(var(--theme-accent-rgb),0.16)]">

                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 truncate">

                    <FaMoneyBillWave className="text-[var(--theme-accent)]" />

                    Monthly Price

                  </p>

                  <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                    {selectedProperty.price}
                  </p>

                </div>


                <div className="p-2.5 sm:p-4 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_6px_22px_rgba(var(--theme-accent-rgb),0.16)]">

                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 truncate">

                    <FaBed className="text-[var(--theme-accent)]" />

                    Available Rooms

                  </p>

                  <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                    {selectedProperty.rooms} Rooms
                  </p>

                </div>


                <div className="p-2.5 sm:p-4 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_6px_22px_rgba(var(--theme-accent-rgb),0.16)]">

                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 truncate">

                    <FaUsers className="text-[var(--theme-accent)]" />

                    Guest Capacity

                  </p>

                  <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                    {selectedProperty.guests} Guests
                  </p>

                </div>


                <div className="p-2.5 sm:p-4 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_6px_22px_rgba(var(--theme-accent-rgb),0.16)]">

                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 truncate">

                    <FaCalendarAlt className="text-[var(--theme-accent)]" />

                    Listed Date

                  </p>

                  <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                    {selectedProperty.registeredDate}
                  </p>

                </div>


                <div className="p-2.5 sm:p-4 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_6px_22px_rgba(var(--theme-accent-rgb),0.16)]">

                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 truncate">

                    <FaMapMarkerAlt className="text-[var(--theme-accent)]" />

                    Location

                  </p>

                  <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                    {selectedProperty.location}
                  </p>

                </div>

              </div>


              <div className="mt-4 sm:mt-6">

                <h3 className="text-sm sm:text-lg font-extrabold text-[var(--theme-text)] mb-2 sm:mb-3 tracking-tight">
                  Facilities
                </h3>

                <div className="flex flex-wrap gap-1.5 sm:gap-3 min-w-0">

                  {selectedProperty.facilities.length > 0 ? (

                    selectedProperty.facilities.map(
                      (facility, index) => (

                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-muted-light)] text-sm font-bold"
                        >

                          <span className="text-[var(--theme-accent)]">
                            {getFacilityIcon(facility)}
                          </span>

                          {facility}

                        </span>

                      )
                    )

                  ) : (

                    <p className="text-sm text-[var(--theme-muted-dark)] font-medium">
                      No facilities listed.
                    </p>

                  )}

                </div>

              </div>


              <div className="mt-4 sm:mt-6">

                <h3 className="text-sm sm:text-lg font-extrabold text-[var(--theme-text)] mb-2 sm:mb-3 tracking-tight">

                  Owner-Uploaded Video

                  {selectedProperty.video.length > 0
                    ? ` (${selectedProperty.video.length})`
                    : ""}

                </h3>


                {selectedProperty.video.length > 0 ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {selectedProperty.video.map(
                      (videoUrl, index) => (

                        <video
                          key={index}
                          src={videoUrl}
                          controls
                          className="w-full max-w-full rounded-xl border border-[var(--theme-border)] max-h-48 sm:max-h-72 object-contain bg-[var(--theme-bg)]"
                        />

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-[var(--theme-accent)] bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 rounded-xl px-4 py-3 font-medium">
                    No video uploaded by the owner for this property.
                  </p>

                )}

              </div>


              <div className="mt-4 sm:mt-6 p-3 sm:p-5 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)]">

                <h3 className="text-lg font-extrabold text-[var(--theme-text)] mb-2 tracking-tight">
                  Property Description
                </h3>

                <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-[var(--theme-muted-light)] font-medium break-words">
                  {selectedProperty.description}
                </p>

              </div>


              {selectedProperty.status === "Pending" && (

                <div className="mt-4 sm:mt-6">

                  <div className="p-4 rounded-xl bg-linear-to-r from-[#c9a45c]/10 via-[var(--theme-card)] to-[#c9a45c]/10 border border-[var(--theme-accent)]/20 mb-4">

                    <div className="flex items-start gap-3">

                      <div className="w-8 h-8 rounded-lg bg-[var(--theme-accent)]/10 flex items-center justify-center shrink-0 mt-0.5">

                        <FaClock className="text-[var(--theme-accent)] text-sm" />

                      </div>

                      <div>

                        <p className="font-extrabold text-[var(--theme-text)]">
                          Verification Required
                        </p>

                        <p className="text-sm text-[var(--theme-muted-light)] mt-1 font-medium">
                          This property is waiting for admin verification. Review the listing before approving or rejecting it.
                        </p>

                      </div>

                    </div>

                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <button
                      onClick={() =>
                        updateStatus(
                          selectedProperty.id,
                          "Active"
                        )
                      }
                      className="py-2.5 sm:py-3.5 rounded-xl bg-[var(--theme-surface)] hover:bg-[var(--theme-accent)] text-[var(--theme-accent)] hover:text-[var(--theme-button-text)] border-2 border-[var(--theme-accent)] font-bold transition-all shadow-[0_0_28px_rgba(var(--theme-accent-rgb),0.25)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >

                      <FaCheck />

                      Approve Property

                    </button>


                    <button
                      onClick={() =>
                        updateStatus(
                          selectedProperty.id,
                          "Rejected"
                        )
                      }
                      className="py-2.5 sm:py-3.5 rounded-xl border-2 border-[var(--theme-accent)] bg-[var(--theme-surface)] text-[var(--theme-accent)] font-bold transition-all hover:bg-[var(--theme-accent)]/10 hover:border-[var(--theme-accent)]/30 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(var(--theme-accent-rgb),0.18)] flex items-center justify-center gap-2 cursor-pointer"
                    >

                      <FaTimesCircle />

                      Reject Property

                    </button>

                  </div>

                </div>

              )}


              <button
                onClick={() =>
                  setSelectedProperty(null)
                }
                className="w-full mt-3 py-2.5 sm:py-3.5 rounded-xl bg-[var(--theme-surface)] hover:bg-[var(--theme-accent)] text-[var(--theme-accent)] hover:text-[var(--theme-button-text)] border-2 border-[var(--theme-accent)] font-bold transition-all shadow-[0_0_28px_rgba(var(--theme-accent-rgb),0.25)] active:scale-[0.98] cursor-pointer"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default AdminProperties;