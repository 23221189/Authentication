import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaShieldAlt,
  FaBuilding,
  FaArrowRight,
  FaMapMarkerAlt,
  FaChevronRight,
} from "react-icons/fa";
import { getAgentProperties } from "../../api/PropertyApi";

const STATUS_LABELS = {
  assigned: "Pending",
  pending: "Pending",
  verified: "Verified",
  published: "Verified",
  rejected: "Rejected",
};

function formatAddress(address) {
  if (!address) return "Location not specified";
  return [address.street, address.area, address.city]
    .filter(Boolean)
    .join(", ");
}

function timeAgo(dateString) {
  if (!dateString) return "";

  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.round(diffMins / 60);

  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);

  return `${diffDays}d ago`;
}

const AgentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [assignedProperties, setAssignedProperties] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        setLoadError("");

        const { data } = await getAgentProperties();

        const properties = (data?.properties || []).map((p) => ({
          id: p._id,
          name: p.title,
          location: formatAddress(p.address),
          status: STATUS_LABELS[p.status] || "Pending",
          rawStatus: p.status,
          assignedDate: p.createdAt
            ? new Date(p.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "",
          updatedAt: p.updatedAt,
        }));

        setAssignedProperties(properties);
      } catch (error) {
        console.error("Failed to load agent dashboard:", error);

        setLoadError(
          error.response?.data?.message ||
            "Failed to load your assigned properties."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const recentActivity = assignedProperties
    .filter(
      (item) =>
        item.status === "Verified" || item.status === "Rejected"
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt) - new Date(a.updatedAt)
    )
    .slice(0, 5)
    .map((item) => ({
      type: item.status === "Verified" ? "verified" : "rejected",
      title:
        item.status === "Verified"
          ? "Property Verified"
          : "Property Rejected",
      description: item.name,
      time: timeAgo(item.updatedAt),
    }));

  const currentAssignedProperties = assignedProperties.filter(
    (item) => item.rawStatus === "assigned"
  );

  const totalAssigned = currentAssignedProperties.length;
  const totalActivity = assignedProperties.length;

  const pendingCount = currentAssignedProperties.length;

  const verifiedCount = assignedProperties.filter(
    (item) => item.status === "Verified"
  ).length;

  const rejectedCount = assignedProperties.filter(
    (item) => item.status === "Rejected"
  ).length;

  const pendingPercent =
    totalActivity === 0
      ? 0
      : Math.round((pendingCount / totalActivity) * 100);

  const verifiedPercent =
    totalActivity === 0
      ? 0
      : Math.round((verifiedCount / totalActivity) * 100);

  const rejectedPercent =
    totalActivity === 0
      ? 0
      : Math.round((rejectedCount / totalActivity) * 100);

  const donutStyle = {
    background:
      totalActivity === 0
        ? "conic-gradient(#3a3328 0% 100%)"
        : `conic-gradient(#c9a45c 0% ${pendingPercent}%, #8f7440 ${pendingPercent}% ${pendingPercent + verifiedPercent}%, #5a4a2e ${pendingPercent + verifiedPercent}% 100%)`,
  };

  const getStatusStyle = (status) => {
    if (status === "Verified") {
      return "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20";
    }

    if (status === "Rejected") {
      return "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20";
    }

    return "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20";
  };

  const cardBase =
    "bg-[#050505] border border-[#c9a45c]/35 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(201,164,92,0.28)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)]";

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#f5efe3] font-sans min-w-0 overflow-x-hidden">

      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-3 sm:gap-5 mb-5 sm:mb-7">

        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#c9a45c] leading-tight">
            Agent <span className="text-[#c9a45c]">Dashboard</span>
          </h1>

          <p className="text-xs sm:text-base text-[#9f988d] mt-1.5 sm:mt-2 font-medium max-w-2xl leading-relaxed">
            Manage your assigned properties and keep track of verification activity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-[#050505] border border-[#c9a45c]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.4)] w-fit transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a45c] hover:shadow-[0_10px_28px_rgba(201,164,92,0.22)] active:shadow-[0_0_28px_rgba(201,164,92,0.32)]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center shrink-0">
            <FaCalendarAlt className="text-[#c9a45c]" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#777066]">
              Today
            </p>

            <p className="text-xs sm:text-sm font-bold text-[#f5efe3]">
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                weekday: "long",
              })}
            </p>
          </div>
        </div>

      </div>

      {loadError && (
        <div className="mb-4 sm:mb-6 flex items-start gap-2.5 sm:gap-3 bg-[#c9a45c]/5 border border-[#c9a45c]/20 text-[#c9a45c] rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold">
          <FaTimesCircle className="shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {isLoading ? (
        <div className={`${cardBase} min-h-[300px] sm:min-h-[420px] flex flex-col items-center justify-center p-5`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center mb-5">
            <div className="w-8 h-8 border-4 border-[#3a3328] border-t-[#c9a45c] rounded-full animate-spin"></div>
          </div>

          <h3 className="text-base font-extrabold text-[#f5efe3]">
            Loading Dashboard
          </h3>

          <p className="text-sm text-[#777066] mt-1">
            Fetching your assigned properties...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4 mb-4 sm:mb-6">

            <div className={`${cardBase} p-2.5 sm:p-4 group cursor-pointer min-w-0`}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 text-[#c9a45c] text-sm sm:text-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:border-[#c9a45c]/40 group-hover:bg-[#c9a45c]/15 group-hover:shadow-[0_0_20px_rgba(201,164,92,0.22)]">
                  <FaClipboardList />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] sm:text-xs font-semibold text-[#9f988d]">
                    Total Assigned
                  </p>
                  <h2 className="mt-0.5 truncate text-sm sm:text-xl font-extrabold text-[#f5efe3]">
                    {totalAssigned}
                  </h2>
                </div>
              </div>

              <Link to="/agentproperties" className="mt-2 inline-flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-[#c9a45c] hover:text-[#dfbf7b] transition-all duration-300">
                View properties
                <FaArrowRight className="text-[8px]" />
              </Link>
            </div>

            <div className={`${cardBase} p-2.5 sm:p-4 group cursor-pointer min-w-0`}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 text-[#c9a45c] text-sm sm:text-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:border-[#c9a45c]/40 group-hover:bg-[#c9a45c]/15 group-hover:shadow-[0_0_20px_rgba(201,164,92,0.22)]">
                  <FaClock />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] sm:text-xs font-semibold text-[#9f988d]">
                    Pending Verification
                  </p>
                  <h2 className="mt-0.5 truncate text-sm sm:text-xl font-extrabold text-[#f5efe3]">
                    {pendingCount}
                  </h2>
                </div>
              </div>

              <Link to="/agentproperties?status=Pending" className="mt-2 inline-flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-[#c9a45c] hover:text-[#dfbf7b] transition-all duration-300">
                Review pending
                <FaArrowRight className="text-[8px]" />
              </Link>
            </div>

            <div className={`${cardBase} p-2.5 sm:p-4 group cursor-pointer min-w-0`}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 text-[#c9a45c] text-sm sm:text-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:border-[#c9a45c]/40 group-hover:bg-[#c9a45c]/15 group-hover:shadow-[0_0_20px_rgba(201,164,92,0.22)]">
                  <FaCheckCircle />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] sm:text-xs font-semibold text-[#9f988d]">
                    Verified Properties
                  </p>
                  <h2 className="mt-0.5 truncate text-sm sm:text-xl font-extrabold text-[#f5efe3]">
                    {verifiedCount}
                  </h2>
                </div>
              </div>

              <Link to="/agenthistory?status=Verified" className="mt-2 inline-flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-[#c9a45c] hover:text-[#dfbf7b] transition-all duration-300">
                View verified
                <FaArrowRight className="text-[8px]" />
              </Link>
            </div>

            <div className={`${cardBase} p-2.5 sm:p-4 group cursor-pointer min-w-0`}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 text-[#c9a45c] text-sm sm:text-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:border-[#c9a45c]/40 group-hover:bg-[#c9a45c]/15 group-hover:shadow-[0_0_20px_rgba(201,164,92,0.22)]">
                  <FaTimesCircle />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] sm:text-xs font-semibold text-[#9f988d]">
                    Rejected Properties
                  </p>
                  <h2 className="mt-0.5 truncate text-sm sm:text-xl font-extrabold text-[#f5efe3]">
                    {rejectedCount}
                  </h2>
                </div>
              </div>

              <Link to="/agenthistory?status=Rejected" className="mt-2 inline-flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-[#c9a45c] hover:text-[#dfbf7b] transition-all duration-300">
                View history
                <FaArrowRight className="text-[8px]" />
              </Link>
            </div>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-5">

            <div className={`${cardBase} xl:col-span-5 overflow-hidden min-w-0`}>
              <div className="flex items-center justify-between px-3.5 sm:px-6 py-3.5 sm:py-5 border-b border-[#c9a45c]/20">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#f5efe3]">
                    Assigned Properties
                  </h2>

                  <p className="text-xs text-[#777066] mt-1">
                    Your latest assignments
                  </p>
                </div>

                <Link to="/agentproperties" className="text-xs font-bold text-[#c9a45c] hover:text-[#dfbf7b] transition-all duration-300 hover:-translate-y-0.5">
                  View All
                </Link>
              </div>

              {currentAssignedProperties.length === 0 ? (
                <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
                    <FaBuilding className="text-[#c9a45c] text-2xl" />
                  </div>

                  <h3 className="text-base font-extrabold text-[#f5efe3] mt-5">
                    No Properties Assigned
                  </h3>

                  <p className="text-sm text-[#777066] mt-2 max-w-xs leading-6">
                    Properties assigned to you by the Admin will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#c9a45c]/15">
                  {currentAssignedProperties.slice(0, 5).map((item) => {
                    const isActionable = item.rawStatus === "assigned";
                    const Wrapper = isActionable ? Link : "div";
                    const wrapperProps = isActionable
                      ? {
                          to: `/agentpropertyverification/${item.id}`,
                        }
                      : {};

                    return (
                      <Wrapper
                        key={item.id}
                        {...wrapperProps}
                        className={`block p-5 transition-all duration-300 ${isActionable ? "hover:bg-[#c9a45c]/5 hover:-translate-y-0.5 hover:shadow-[inset_4px_0_0_rgba(201,164,92,0.55)] cursor-pointer" : "hover:bg-[#c9a45c]/5"}`}
                      >
                        <div className="flex items-start gap-3.5">

                          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center shrink-0">
                            <FaBuilding className="text-[#c9a45c]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-xs sm:text-sm font-extrabold text-[#f5efe3] truncate">
                                {item.name}
                              </h3>

                              <span className={`text-[9px] sm:text-[10px] px-2 py-1 rounded-lg font-extrabold shrink-0 ${getStatusStyle(item.status)}`}>
                                {item.status}
                              </span>
                            </div>

                            <p className="flex items-center gap-1.5 text-xs text-[#9f988d] mt-2 truncate font-medium">
                              <FaMapMarkerAlt className="text-[#c9a45c] shrink-0 text-[10px]" />
                              {item.location}
                            </p>

                            <div className="flex items-center justify-between gap-2 mt-2">
                              <p className="text-[11px] text-[#777066] font-medium">
                                Assigned {item.assignedDate}
                              </p>

                              {isActionable && (
                                <FaChevronRight className="text-[#777066] text-[10px]" />
                              )}
                            </div>
                          </div>

                        </div>
                      </Wrapper>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={`${cardBase} xl:col-span-3 p-3.5 sm:p-6 min-w-0`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#f5efe3]">
                    Verification
                  </h2>

                  <p className="text-xs text-[#777066] mt-1">
                    Current distribution
                  </p>
                </div>

                <div className="w-9 h-9 rounded-lg bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
                  <FaShieldAlt className="text-[#c9a45c] text-sm" />
                </div>
              </div>

              <div className="flex justify-center mt-5 sm:mt-8">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1" style={donutStyle}>
                  <div className="absolute inset-3 bg-[#050505] border border-[#3a3328] rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#f5efe3]">
                      {totalActivity}
                    </span>

                    <span className="text-[10px] uppercase tracking-widest text-[#777066] font-bold mt-1">
                      Total
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4">

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#c9a45c]"></span>
                    <span className="text-sm text-[#bdb6aa] font-semibold">
                      Pending
                    </span>
                  </div>

                  <span className="text-sm font-extrabold text-[#f5efe3]">
                    {pendingCount}
                    <span className="text-[#777066] font-medium ml-1">
                      ({pendingPercent}%)
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#8f7440]"></span>
                    <span className="text-sm text-[#bdb6aa] font-semibold">
                      Verified
                    </span>
                  </div>

                  <span className="text-sm font-extrabold text-[#f5efe3]">
                    {verifiedCount}
                    <span className="text-[#777066] font-medium ml-1">
                      ({verifiedPercent}%)
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#5a4a2e]"></span>
                    <span className="text-sm text-[#bdb6aa] font-semibold">
                      Rejected
                    </span>
                  </div>

                  <span className="text-sm font-extrabold text-[#f5efe3]">
                    {rejectedCount}
                    <span className="text-[#777066] font-medium ml-1">
                      ({rejectedPercent}%)
                    </span>
                  </span>
                </div>

              </div>
            </div>

            <div className={`${cardBase} xl:col-span-4 overflow-hidden min-w-0`}>
              <div className="px-3.5 sm:px-6 py-3.5 sm:py-5 border-b border-[#c9a45c]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-[#f5efe3]">
                      Recent Activity
                    </h2>

                    <p className="text-xs text-[#777066] mt-1">
                      Latest verification updates
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-lg bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
                    <FaClock className="text-[#c9a45c] text-sm" />
                  </div>
                </div>
              </div>

              {recentActivity.length === 0 ? (
                <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
                    <FaClock className="text-[#c9a45c] text-xl" />
                  </div>

                  <h3 className="font-extrabold text-[#f5efe3] mt-4">
                    No Activity Yet
                  </h3>

                  <p className="text-sm text-[#777066] mt-2 max-w-xs leading-6">
                    Your recent verification activity will appear here.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-5">
                  {recentActivity.map((item, index) => (
                    <div key={index} className="flex gap-2.5 sm:gap-3.5 rounded-xl p-2 -m-2 transition-all duration-300 hover:bg-[#c9a45c]/5 hover:-translate-y-0.5">

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === "verified" ? "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20" : "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20"}`}>
                        {item.type === "verified" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaTimesCircle />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-extrabold text-[#f5efe3] truncate">
                          {item.title}
                        </p>

                        <p className="text-xs text-[#9f988d] font-medium mt-1 truncate">
                          {item.description}
                        </p>

                        <p className="text-[11px] text-[#777066] mt-1.5 font-medium">
                          {item.time}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              <div className="px-3.5 sm:px-5 py-3 sm:py-4 border-t border-[#c9a45c]/20">
                <Link to="/agenthistory" className="flex items-center justify-center gap-2 text-sm text-[#c9a45c] hover:text-[#dfbf7b] font-bold transition-all duration-300 hover:-translate-y-0.5">
                  View all activity
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>

          </div>
        </>
      )}

      <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-[#c9a45c]/30 bg-[#050505] p-3.5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c] hover:shadow-[0_12px_35px_rgba(201,164,92,0.24)] active:shadow-[0_0_32px_rgba(201,164,92,0.35)]">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 sm:gap-5">

          <div className="flex items-start gap-2.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center shrink-0">
              <FaShieldAlt className="text-[#c9a45c]" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#f5efe3]">
                Verification Matters
              </h3>

              <p className="text-xs sm:text-sm text-[#9f988d] font-medium mt-1 leading-6 max-w-3xl">
                Make sure to verify all property details accurately. Your verification helps us maintain trust and safety in our community.
              </p>
            </div>
          </div>

          <Link to="/agentguidelines" className="inline-flex items-center justify-center gap-2 border border-[#c9a45c]/40 text-[#c9a45c] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#c9a45c]/10 hover:border-[#c9a45c] transition-all w-full lg:w-auto shrink-0">
            Verification Guidelines
            <FaArrowRight className="text-[10px]" />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default AgentDashboard;