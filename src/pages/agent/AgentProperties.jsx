import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAgentProperties } from "../../api/PropertyApi";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaClipboardCheck,
  FaSyncAlt,
  FaExclamationCircle,
} from "react-icons/fa";

const STATUS_META = {
  pending: {
    label: "Pending",
    classes: "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25",
  },
  assigned: {
    label: "Pending",
    classes: "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25",
  },
  verified: {
    label: "Pending",
    classes: "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25",
  },
  published: {
    label: "Published",
    classes: "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-[#050505] text-[#c9a45c] border border-[#3a3328]",
  },
};

const FILTERS = ["All", "Pending"];

function mapProperty(p) {
  const meta =
    STATUS_META[p.status] || {
      label: p.status || "Other",
      classes: "bg-[#050505] text-[#9f988d] border border-[#3a3328]",
    };

  return {
    _id: p._id,
    rawStatus: p.status,
    statusLabel: meta.label,
    statusClasses: meta.classes,
    isPending: ["assigned", "pending", "verified"].includes(p.status),
    canStartVerification: ["assigned", "pending"].includes(p.status),
    isActive: p.isActive !== false,
    requestedAt: p.createdAt,
    property: {
      name: p.title,
      streetNo: p.address?.street || "",
      houseNo: p.address?.area || "",
      location: [p.address?.street, p.address?.area, p.address?.city]
        .filter(Boolean)
        .join(", "),
      coordinates: p.address?.coordinates || null,
    },
  };
}

function AgentProperties() {
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get("status");

  const initialFilter = FILTERS.includes(statusFromUrl)
    ? statusFromUrl
    : "All";

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const { data } = await getAgentProperties();
      const mapped = (data?.properties || []).map(mapProperty);

      setRequests(mapped);
    } catch (error) {
      console.error("Failed to load verification requests:", error);
      setLoadError(
        error.response?.data?.message ||
          "Failed to load your verification requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const urlStatus = searchParams.get("status");
    setActiveFilter(FILTERS.includes(urlStatus) ? urlStatus : "All");
  }, [searchParams]);

const scopedRequests = useMemo(() => {
  return requests.filter(
    (request) =>
      ["pending", "assigned", "verified"].includes(
        request.rawStatus
      ) && request.isActive
  );
}, [requests]);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return scopedRequests.filter((request) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Pending" && request.isPending);

      const propertyName = request.property?.name?.toLowerCase() || "";
      const location = request.property?.location?.toLowerCase() || "";
      const streetNo = request.property?.streetNo?.toLowerCase() || "";
      const houseNo = request.property?.houseNo?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        propertyName.includes(query) ||
        location.includes(query) ||
        streetNo.includes(query) ||
        houseNo.includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [scopedRequests, activeFilter, searchQuery]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const cardBase =
    "bg-[#050505] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.55)] border border-[#c9a45c]/35 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(201,164,92,0.28)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)]";

  return (
    <div className="w-full text-[#f5efe3]">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#c9a45c] tracking-tight">
            Verification <span className="text-[#c9a45c]">Requests</span>
          </h1>

          <p className="text-[#9f988d] mt-2 text-sm sm:text-base font-medium">
            Review and verify properties assigned to you.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRequests}
          disabled={loading}
          className="self-start inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] text-sm font-extrabold shadow-[0_8px_24px_rgba(0,0,0,0.55)] hover:shadow-[0_0_28px_rgba(201,164,92,0.32)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className={`${cardBase} p-4 sm:p-5 mb-6 sm:mb-8`}>
        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777066] text-sm" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search property, location, street or house..."
              className="w-full h-11 border border-[#3a3328] rounded-xl pl-11 pr-4 text-sm font-medium text-[#f5efe3] bg-[#050505] placeholder:text-[#777066] outline-none focus:border-[#c9a45c] focus:bg-[#050505] focus:ring-2 focus:ring-[#c9a45c]/10 transition-all"
            />
          </div>

          <div className="flex gap-1.5 bg-[#050505] border border-[#3a3328] rounded-xl p-1 overflow-x-auto shrink-0">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === filter
                    ? "bg-[#c9a45c] text-[#171717] shadow-[0_8px_24px_rgba(0,0,0,0.55)] hover:shadow-[0_0_28px_rgba(201,164,92,0.32)]"
                    : "text-[#bdb6aa] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

        </div>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-[#3a3328] bg-[#050505] text-[#c9a45c] text-sm px-4 py-3 font-medium">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className={`${cardBase} min-h-[380px] flex flex-col items-center justify-center`}>
          <div className="animate-spin w-10 h-10 border-4 border-[#c9a45c] border-t-transparent rounded-full mb-4"></div>

          <p className="text-[#bdb6aa] font-bold mt-2">
            Loading verification requests...
          </p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className={`${cardBase} min-h-[380px] flex flex-col items-center justify-center px-5`}>
          <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/30 flex items-center justify-center shadow-[0_0_16px_rgba(201,164,92,0.14)] transition-all duration-300 group-hover:shadow-[0_0_22px_rgba(201,164,92,0.28)]">
            <FaExclamationCircle className="text-[#c9a45c] text-2xl" />
          </div>

          <h3 className="text-lg font-extrabold text-[#f5efe3] mt-4">
            No Verification Requests
          </h3>

          <p className="text-sm text-[#9f988d] mt-2 text-center font-medium max-w-sm">
            No pending properties are currently assigned to you. Check back
            later or refresh the list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className={`${cardBase} group`}
            >
              <div className="p-5">

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-11 h-11 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/30 flex items-center justify-center shadow-[0_0_16px_rgba(201,164,92,0.14)] transition-all duration-300 group-hover:shadow-[0_0_22px_rgba(201,164,92,0.28)] shrink-0">
                      <FaBuilding className="text-[#c9a45c]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-[#777066] font-bold">
                        Verification Request
                      </p>

                      <h3 className="text-base font-bold text-[#f5efe3] mt-0.5 truncate">
                        {request.property?.name}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${request.statusClasses}`}
                  >
                    {request.statusLabel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">

                  <div className="rounded-xl bg-[#050505] border border-[#3a3328] p-3">
                    <p className="text-[11px] text-[#777066] font-bold uppercase tracking-wider">
                      Street No.
                    </p>

                    <p className="text-sm font-bold text-[#f5efe3] mt-1">
                      {request.property?.streetNo || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#050505] border border-[#3a3328] p-3">
                    <p className="text-[11px] text-[#777066] font-bold uppercase tracking-wider">
                      House No.
                    </p>

                    <p className="text-sm font-bold text-[#f5efe3] mt-1">
                      {request.property?.houseNo || "—"}
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-2 mt-4">
                  <FaMapMarkerAlt className="text-[#c9a45c] mt-0.5 text-sm shrink-0" />

                  {request.property?.coordinates?.length === 2 ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${request.property.coordinates[1]},${request.property.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-[#c9a45c] hover:text-[#dfbf7b] hover:underline leading-5 font-medium line-clamp-2"
                    >
                      {request.property?.location}
                    </a>
                  ) : (
                    <p className="text-sm text-[#9f988d] leading-5 font-medium line-clamp-2">
                      {request.property?.location}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <FaCalendarAlt className="text-[#777066] text-sm" />

                  <p className="text-xs text-[#9f988d] font-medium">
                    Assigned on {formatDate(request.requestedAt)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#c9a45c]/20">
                  <span className="text-[11px] text-[#777066] font-bold uppercase tracking-wider">
                    Request ID
                  </span>

                  <span className="text-xs font-bold text-[#bdb6aa] truncate max-w-[150px]">
                    {request._id}
                  </span>
                </div>

                {request.canStartVerification ? (
                  <Link
                    to={`/agentpropertyverification/${request._id}`}
                    className="block w-full text-center mt-5 py-3 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] text-sm font-extrabold shadow-[0_8px_24px_rgba(0,0,0,0.55)] hover:shadow-[0_0_28px_rgba(201,164,92,0.32)] hover:scale-[1.02] transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <FaClipboardCheck />
                      Start Verification
                    </span>
                  </Link>
                ) : (
                  <div className="w-full text-center mt-5 py-3 rounded-xl bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20 text-sm font-bold">
                    Verification already submitted
                  </div>
                )}

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default AgentProperties;