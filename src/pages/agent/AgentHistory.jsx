import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAgentProperties } from "../../api/PropertyApi";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaHistory,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const HISTORY_STATUS_LABELS = {
  verified: "Verified",
  published: "Verified",
  rejected: "Rejected",
};

const FILTERS = ["All", "Verified", "Rejected"];

function mapHistoryRecord(p) {
  return {
    _id: p._id,
    status: HISTORY_STATUS_LABELS[p.status],
    requestId: p._id,
    verificationDate: p.verifiedAt || p.updatedAt,
    action: p.agentRemarks || p.adminRemarks || "—",
    property: {
      _id: p._id,
      name: p.title,
      streetNo: p.address?.street || "",
      houseNo: p.address?.area || "",
      location: [p.address?.street, p.address?.area, p.address?.city]
        .filter(Boolean)
        .join(", "),
    },
  };
}

function AgentHistory() {
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get("status");

  const [activeFilter, setActiveFilter] = useState(
    statusFromUrl === "Verified" || statusFromUrl === "Rejected"
      ? statusFromUrl
      : "All"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const { data } = await getAgentProperties();

      const mapped = (data?.properties || [])
        .map(mapHistoryRecord)
        .filter((record) => record.status);

      setHistory(mapped);
    } catch (error) {
      console.error("Failed to load verification history:", error);
      setLoadError(
        error.response?.data?.message ||
          "Failed to load your verification history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "Verified" || status === "Rejected") {
      setActiveFilter(status);
    } else {
      setActiveFilter("All");
    }
  }, [searchParams]);

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return history.filter((record) => {
      const matchesFilter =
        activeFilter === "All" || record.status === activeFilter;

      const propertyName = record.property?.name?.toLowerCase() || "";
      const location = record.property?.location?.toLowerCase() || "";
      const streetNo = record.property?.streetNo?.toLowerCase() || "";
      const houseNo = record.property?.houseNo?.toLowerCase() || "";
      const requestId = record.requestId?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        propertyName.includes(query) ||
        location.includes(query) ||
        streetNo.includes(query) ||
        houseNo.includes(query) ||
        requestId.includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [history, activeFilter, searchQuery]);

  const verifiedCount = history.filter(
    (item) => item.status === "Verified"
  ).length;

  const rejectedCount = history.filter(
    (item) => item.status === "Rejected"
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    if (status === "Verified") {
      return "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25";
    }

    return "bg-[#050505] text-[#c9a45c] border border-[#3a3328]";
  };

  const cardBase =
    "bg-[#050505] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.45)] border border-[#c9a45c]/35 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(0,0,0,0.65)] active:translate-y-0 active:shadow-[0_0_32px_rgba(0,0,0,0.75)]";

  return (
    <div className="w-full text-[#f5efe3]">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#c9a45c]tracking-tight">
            Verification <span className="text-[#c9a45c]">History</span>
          </h1>

          <p className="text-[#9f988d] mt-2 text-sm sm:text-base font-medium">
            Review your previous property verification activities.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchHistory}
          disabled={loading}
          className="self-start inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] text-sm font-extrabold shadow-lg shadow-black/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">

        <div className={`${cardBase} p-5 flex items-center gap-4 hover:border-[#c9a45c]/30 hover:-translate-y-1 transition-all duration-300`}>
          <div className="w-14 h-14 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
            <FaHistory className="text-[#c9a45c] text-xl" />
          </div>

          <div>
            <p className="text-sm text-[#9f988d] font-medium">
              Total Records
            </p>
            <h2 className="text-2xl font-extrabold text-[#f5efe3] mt-0.5">
              {history.length}
            </h2>
          </div>
        </div>

        <div className={`${cardBase} p-5 flex items-center gap-4 hover:border-[#c9a45c]/30 hover:-translate-y-1 transition-all duration-300`}>
          <div className="w-14 h-14 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
            <FaCheckCircle className="text-[#c9a45c] text-xl" />
          </div>

          <div>
            <p className="text-sm text-[#9f988d] font-medium">
              Verified
            </p>
            <h2 className="text-2xl font-extrabold text-[#c9a45c] mt-0.5">
              {verifiedCount}
            </h2>
          </div>
        </div>

        <div className={`${cardBase} p-5 flex items-center gap-4 hover:border-[#c9a45c]/30 hover:-translate-y-1 transition-all duration-300`}>
          <div className="w-14 h-14 rounded-xl bg-[#050505] border border-[#3a3328] flex items-center justify-center shrink-0">
            <FaTimesCircle className="text-[#c9a45c] text-xl" />
          </div>

          <div>
            <p className="text-sm text-[#9f988d] font-medium">
              Rejected
            </p>
            <h2 className="text-2xl font-extrabold text-[#c9a45c] mt-0.5">
              {rejectedCount}
            </h2>
          </div>
        </div>

      </div>

      <div className={`${cardBase} p-4 sm:p-5 mb-6 sm:mb-8`}>
        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777066] text-sm" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search property, location, street, house or request ID..."
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
                    ? "bg-[#c9a45c] text-[#171717] shadow-lg shadow-black/40"
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
            Loading verification history...
          </p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className={`${cardBase} min-h-[380px] flex flex-col items-center justify-center px-5`}>
          <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center">
            <FaHistory className="text-[#c9a45c] text-2xl" />
          </div>

          <h3 className="text-lg font-extrabold text-[#f5efe3] mt-4">
            No Verification History Found
          </h3>

          <p className="text-sm text-[#9f988d] mt-2 text-center font-medium">
            No records match the selected status or search.
          </p>
        </div>
      ) : (
        <div className={`${cardBase} overflow-hidden`}>

          <div className="px-5 py-4 border-b border-[#c9a45c]/20 bg-[#050505]">
            <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
              Verification Records
            </h2>

            <p className="text-xs text-[#777066] mt-1 font-medium">
              Showing {filteredHistory.length}{" "}
              {filteredHistory.length === 1 ? "record" : "records"}
            </p>
          </div>

          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#050505] [&::-webkit-scrollbar-thumb]:bg-[#3a3328] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#c9a45c]">
            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="bg-[#050505] border-b border-[#c9a45c]/20">
                  <th className="text-left px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                    Property
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                    Address
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                    Request ID
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                    Date
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                    Action
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#c9a45c]/15">
                {filteredHistory.map((record) => (
                  <tr
                    key={record._id}
                    className="hover:bg-[#050505] hover:border-l-2 hover:border-[#c9a45c]/50 transition-all duration-200"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
                          <FaBuilding className="text-[#c9a45c]" />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#f5efe3]">
                            {record.property?.name}
                          </p>

                          <p className="text-xs text-[#777066] mt-0.5 font-medium">
                            {record.property?._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-[#bdb6aa] font-medium">
                        {record.property?.streetNo},{" "}
                        {record.property?.houseNo}
                      </p>

                      <p className="text-xs text-[#777066] flex items-center gap-1.5 mt-1 font-medium">
                        <FaMapMarkerAlt className="text-[#c9a45c]" />
                        {record.property?.location}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-[#bdb6aa] bg-[#050505] border border-[#3a3328] px-2.5 py-1.5 rounded-lg">
                        {record.requestId}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#bdb6aa] font-medium">
                        <FaCalendarAlt className="text-[#777066] text-xs" />
                        {formatDate(record.verificationDate)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-[#bdb6aa] font-medium">
                        {record.action}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusStyle(
                          record.status
                        )}`}
                      >
                        {record.status === "Verified" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaTimesCircle />
                        )}
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentHistory;