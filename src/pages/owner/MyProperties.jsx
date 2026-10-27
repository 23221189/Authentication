import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaSearch,
  FaPlus,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const SERVER_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const resolveImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${SERVER_ORIGIN}${img}`;
};

function MyProperties() {
  const { ownerProperties: properties} = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const statusFilterDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const dropdown = statusFilterDropdownRef.current;

      if (statusFilterOpen && dropdown && !dropdown.contains(event.target)) {
        setStatusFilterOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [statusFilterOpen]);

  function handleSearch(event) {
    setSearchQuery(event.target.value);
  }

  function handleStatusFilter(event) {
    setStatusFilter(event.target.value);
  }

  const filteredProperties = properties.filter((item) => {
    const propertyName = item.name || item.propertyName || "";
    const propertyLocation = item.location || item.address || "";
    const propertyStatus = item.status || "";

    const matchSearch =
      searchQuery === "" ||
      propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      propertyLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === "" || propertyStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const getDisplayStatus = (status) => {
    const s = String(status || "").trim().toLowerCase();

    if (s === "approved") return "Publish";
    if (s === "published") return "Active";

    if (
      [
        "pending",
        "assigned",
        "under_admin_review",
        "verified",
        "pending approval",
        "pending_verification",
        "verification_pending",
        "submitted",
        "awaiting_verification",
        "verification_requested",
        "pending_review",
        "awaiting_review",
      ].includes(s)
    ) {
      return "Pending Approval";
    }

    return status || "Pending Approval";
  };

  const getStatusStyle = (status) => {
    const s = String(status || "").toLowerCase();

    if (s === "active" || s === "publish")
      return "bg-[#c9a45c]/15 text-[#c9a45c] border border-[#c9a45c]/30";

    if (s === "pending approval")
      return "bg-[#c9a45c]/10 text-[#dfbf7b] border border-[#c9a45c]/20";

    return "bg-[#050505] text-[#9f988d] border border-[#3a3328]";
  };;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#050505] flex font-sans">

      <main className="w-full px-2.5 sm:px-5 lg:px-8 pt-1.5 sm:pt-1 pb-5 sm:pb-7">
        <div className="max-w-6xl mx-auto w-full">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">

            <div>
               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)] mt-3">
                                  My Properties
                                </h1>

             <p className="text-[var(--theme-muted-dark)] mt-2 text-sm sm:text-base leading-relaxed">
                Manage and track all your listed properties.
              </p>
            </div>

            <Link
              to="/createlisting"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-base shadow-[0_8px_24px_rgba(201,164,92,0.28)] hover:shadow-[0_0_30px_rgba(201,164,92,0.42)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <FaPlus />
              Create Listing
            </Link>

          </div>

          <div className="bg-[#050505] rounded-xl sm:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.72)] border border-[#c9a45c]/25 p-3 sm:p-5 mb-5 sm:mb-6 transition-all duration-300 hover:border-[#c9a45c]/60 hover:bg-[#050505] hover:shadow-[0_14px_38px_rgba(201,164,92,0.20)]">

            <div className="flex flex-col md:flex-row gap-2.5 sm:gap-4">

              <div className="relative flex-1 min-w-0">

                <FaSearch className="absolute left-3.5 sm:left-4 top-1/2 text-[#9f988d] text-sm sm:text-base" />

                <input
                  type="text"
                  placeholder="Search property or location..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full border border-[#3a3328] rounded-xl py-2.5 sm:py-3 pl-9 sm:pl-11 pr-3 sm:pr-4 outline-none text-xs sm:text-sm text-[#f5efe3] bg-[#050505] hover:border-[#c9a45c]/55 focus:ring-2 focus:ring-[#c9a45c]/20 focus:border-[#c9a45c] focus:bg-[#050505] focus:shadow-[0_0_26px_rgba(201,164,92,0.30)] transition-all duration-300 font-medium placeholder:text-[#777066]"
                />

              </div>

              <div ref={statusFilterDropdownRef} className="relative w-full md:w-52">

                <button
                  type="button"
                  onClick={() =>
                    setStatusFilterOpen((prev) => !prev)
                  }
                  className={`w-full border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none text-xs sm:text-sm font-medium bg-[#050505] flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer hover:border-[#c9a45c]/55 ${
                    statusFilterOpen
                      ? "border-[#c9a45c] ring-2 ring-[#c9a45c]/20 shadow-[0_0_26px_rgba(201,164,92,0.30)]"
                      : "border-[#3a3328]"
                  }`}
                >
                  <span
                    className={
                      statusFilter
                        ? "text-[#c9a45c]"
                        : "text-[#f5efe3]"
                    }
                  >
                    {statusFilter === ""
                      ? "All Status"
                      : statusFilter}
                  </span>

                  <span
                    className={`text-[#c9a45c] text-lg leading-none transition-transform duration-200 ${
                      statusFilterOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ⌄
                  </span>
                </button>

                {statusFilterOpen && (
                  <div className="absolute z-50 left-0 w-[92%] sm:w-full mt-1 bg-[#050505] border border-[#c9a45c]/30 rounded-lg sm:rounded-xl overflow-hidden shadow-[0_10px_26px_rgba(0,0,0,0.72)]">

                    {[
                      {
                        value: "",
                        label: "All Status",
                      },
                      {
                        value: "Active",
                        label: "Active",
                      },
                      {
                        value: "Inactive",
                        label: "Inactive",
                      },
                      {
                        value: "Pending Approval",
                        label: "Pending Approval",
                      },
                      {
                        value: "Publish",
                        label: "Publish",
                      },
                    ].map((option) => (
                      <button
                        key={option.value || "all"}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option.value);
                          setStatusFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          statusFilter === option.value
                            ? "bg-[#c9a45c] text-[#171717]"
                            : "text-[#f5efe3] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c]"
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

          {filteredProperties.length === 0 ? (

            <div className="bg-[#050505] rounded-2xl shadow-[0_12px_38px_rgba(0,0,0,0.72)] border border-[#c9a45c]/25 min-h-95 sm:min-h-107.5 flex flex-col items-center justify-center py-12 px-5 text-center transition-all duration-300 hover:border-[#c9a45c]/60 hover:bg-[#050505] hover:shadow-[0_14px_38px_rgba(201,164,92,0.20)]">

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#050505] border border-[#c9a45c]/30 shadow-[0_0_24px_rgba(201,164,92,0.24)] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#050505] hover:shadow-[0_0_32px_rgba(201,164,92,0.40)]">
                <FaHome className="text-[#c9a45c] text-2xl sm:text-3xl" />
              </div>

              <h3 className="font-extrabold text-[#f5efe3] mt-5 text-lg sm:text-xl">
                {properties.length === 0
                  ? "No Properties Listed Yet"
                  : "No Properties Match Your Search"}
              </h3>

              <p className="text-sm text-[#9f988d] mt-2 text-center max-w-md leading-relaxed font-medium">
                {properties.length === 0
                  ? "You haven't listed any property yet. Add your first property to start receiving bookings."
                  : "Try adjusting your search or status filter to find what you're looking for."}
              </p>

              {properties.length === 0 && (
                <Link
                  to="/createlisting"
                  className="mt-6 inline-flex items-center gap-2 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-5 py-3 rounded-xl text-sm font-bold shadow-[0_8px_24px_rgba(201,164,92,0.28)] hover:shadow-[0_0_30px_rgba(201,164,92,0.42)] hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  <FaPlus />
                  Add Your First Property
                </Link>
              )}

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">

              {filteredProperties.map((item) => {

                const propertyName =
                  item.name ||
                  item.propertyName ||
                  "Unnamed Property";

                const propertyLocation =
                  item.location ||
                  item.address ||
                  "Location not available";

                const propertyStatus = getDisplayStatus(item.status);

                const rooms = item.rooms || 0;

                const rent = Number(item.rent) || 0;

                const bookingsCount =
                  Number(item.bookingsCount) || 0;

                const earnings =
                  Number(item.earnings) || 0;

                const propertyId =
                  item.id || item._id;

                const propertyImage =
                  resolveImageUrl(item.images?.[0]);

                return (
                  <div
                    key={propertyId}
                    className="group bg-[#050505] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.78)] border border-[#c9a45c]/25 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c]/70 hover:bg-[#050505] hover:shadow-[0_16px_44px_rgba(201,164,92,0.24)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)]"
                  >

                    <div className="h-36 sm:h-48 bg-[#050505] flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:bg-[#050505] group-hover:shadow-[inset_0_0_28px_rgba(201,164,92,0.10)]">

                      {propertyImage ? (
                        <img
                          src={propertyImage}
                          alt={propertyName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";

                            e.currentTarget.nextSibling.style.display =
                              "flex";
                          }}
                        />
                      ) : null}

                      <FaHome
                        className="text-[#c9a45c] text-4xl sm:text-5xl drop-shadow-[0_0_10px_rgba(201,164,92,0.55)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(201,164,92,0.75)]"
                        style={{
                          display: propertyImage
                            ? "none"
                            : "flex",
                        }}
                      />

                    </div>

                    <div className="p-3 sm:p-5">

                      <div className="min-w-0">

                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <h3 className="font-bold text-[#f5efe3] text-sm sm:text-lg truncate">
                            {propertyName}
                          </h3>

                          <span
                            className={`shrink-0 px-2 sm:px-2.5 py-1 rounded-lg text-[9px] sm:text-xs font-bold ${getStatusStyle(
                              propertyStatus
                            )}`}
                          >
                            {propertyStatus}
                          </span>
                        </div>

                        <div className="flex items-start gap-1.5 mt-2 text-[#9f988d]">

                          <FaMapMarkerAlt className="text-[#c9a45c] mt-0.5 shrink-0 text-xs drop-shadow-[0_0_8px_rgba(201,164,92,0.50)] transition-all duration-300" />

                          <p className="text-xs sm:text-sm line-clamp-2 font-medium">
                            {propertyLocation}
                          </p>

                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">

                        <span className="text-xs sm:text-sm text-[#9f988d] flex items-center gap-1.5 font-medium">
                          <FaBuilding className="text-[#c9a45c] drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300" />
                          {rooms} Rooms
                        </span>

                        <span className="text-sm font-extrabold text-[#c9a45c] drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]">
                          PKR {rent.toLocaleString()}

                          <span className="text-xs font-medium text-[#777066]">
                            {" "}/ month
                          </span>
                        </span>

                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[#3a3328]">

                        <div className="bg-[#050505] border border-[#c9a45c]/20 rounded-xl p-2.5 sm:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.50)] transition-all duration-300 hover:border-[#c9a45c]/50 hover:bg-[#050505] hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]">

                          <p className="text-xs text-[#9f988d] font-bold uppercase tracking-wider">
                            Bookings
                          </p>

                          <p className="font-extrabold text-[#f5efe3] mt-1 text-base sm:text-lg">
                            {bookingsCount}
                          </p>

                        </div>

                        <div className="bg-[#050505] border border-[#c9a45c]/20 rounded-xl p-2.5 sm:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.50)] transition-all duration-300 hover:border-[#c9a45c]/50 hover:bg-[#050505] hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]">

                          <p className="text-xs text-[#9f988d] font-bold uppercase tracking-wider">
                            Earnings
                          </p>

                          <p className="font-extrabold text-[#f5efe3] mt-1 text-sm sm:text-base break-all">
                            PKR {earnings.toLocaleString()}
                          </p>

                        </div>

                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 sm:mt-5">

                        <Link
                          to={`/propertyownerdetails/${propertyId}`}
                          className="text-center px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl border-2 border-[#c9a45c]/80 text-[#c9a45c] text-sm font-bold shadow-[0_5px_18px_rgba(201,164,92,0.12)] hover:bg-[#c9a45c]/10 hover:border-[#c9a45c] hover:shadow-[0_0_24px_rgba(201,164,92,0.28)] hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
                        >
                          View
                        </Link>

                        <Link
                          to={`/manageproperty/${propertyId}`}
                          className="text-center px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl border-2 border-[#c9a45c]/80 text-[#c9a45c] text-sm font-bold shadow-[0_5px_18px_rgba(201,164,92,0.12)] hover:bg-[#c9a45c]/10 hover:border-[#c9a45c] hover:shadow-[0_0_24px_rgba(201,164,92,0.28)] hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
                        >
                          Edit
                        </Link>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

          )}

        </div>
      </main>

    </div>
  );
}

export default MyProperties;