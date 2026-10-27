import { useEffect, useMemo, useState } from "react";
import {
  getAllAgents,
  approveAgent as approveAgentApi,
  rejectAgent as rejectAgentApi,
} from "../../api/authApi";
import {
  FaSearch,
  FaUserTie,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaTimes,
  FaTimesCircle,
  FaIdCard,
  FaVenusMars,
  FaUniversity,
  FaUserPlus,
  FaCheck,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

function AdminAgents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [documentAgent, setDocumentAgent] = useState(null);
  const [accountAgent, setAccountAgent] = useState(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [assignedArea, setAssignedArea] = useState("");

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const capitalize = (value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Not available";

  const formatAgentForDisplay = (agent) => {
    const statusMap = {
      pending: "Pending",
      approved: "Active",
      rejected: "Rejected",
    };

   const cnicFrontImage =
  agent.cnicFrontImage ||
  "https://placehold.co/1000x620?text=No+CNIC+Image";

const cnicBackImage =
  agent.cnicBackImage ||
  "https://placehold.co/1000x620?text=No+CNIC+Image";

    return {
      id: agent._id,
      name: agent.fullname || "Agent",
      email: agent.email || "Not provided",
      cnic: agent.cnic || "Not provided",
      accountNumber: agent.accountNumber || "Not provided",
      gender: capitalize(agent.gender) || "Not provided",
      status: statusMap[agent.verificationStatus] || "Pending",
      registeredDate: formatDate(agent.createdAt),
      assignedArea: agent.assignedArea || "",
      city:
        agent.city ||
        agent.address?.city ||
        agent.location?.city ||
        agent.addressCity ||
        "Not provided",
      address:
        typeof agent.address === "string"
          ? agent.address
          : agent.address?.street ||
            agent.address?.fullAddress ||
            agent.fullAddress ||
            agent.location?.address ||
            "Not provided",
    cnicFront: cnicFrontImage,
cnicBack: cnicBackImage,
    };
  };

  const loadAgents = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await getAllAgents();
      setAgents((res.data?.agents || []).map(formatAgentForDisplay));
    } catch (err) {
      setLoadError(
        err.response?.data?.message || "Could not load agents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.cnic.includes(searchQuery);

      const matchesStatus =
        statusFilter === "All" || agent.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [agents, searchQuery, statusFilter]);

  const totalAgents = agents.length;

  const activeAgents = agents.filter(
    (agent) => agent.status === "Active"
  ).length;

  const pendingAgents = agents.filter(
    (agent) => agent.status === "Pending"
  ).length;

  const acceptAgent = (agent) => {
    setAccountAgent(agent);
    setAssignedArea(agent.assignedArea || "");
    setAccountCreated(false);
    setSelectedAgent(null);
    setDocumentAgent(null);
  };

  const rejectAgent = async (agent) => {
    try {
      await rejectAgentApi(agent.id);
      await loadAgents();
    } catch (err) {
      setLoadError(
        err.response?.data?.message || "Could not reject this agent."
      );
    } finally {
      setSelectedAgent(null);
      setDocumentAgent(null);
    }
  };

  const createAgentAccount = async () => {
    if (!accountAgent) return;

    if (!assignedArea.trim()) {
      setLoadError(
        "Assigned Area / City is required — without it this agent will never be matched to a property for verification."
      );
      return;
    }

    try {
      await approveAgentApi(
        accountAgent.id,
        assignedArea.trim()
      );

      await loadAgents();
      setAccountCreated(true);
      setLoadError("");
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not create the agent account."
      );
      setAccountAgent(null);
    }
  };

  const closeAccountModal = () => {
    setAccountAgent(null);
    setAccountCreated(false);
    setAssignedArea("");
  };

  const getStatusStyle = (status) => {
    if (status === "Active") {
      return "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20";
    }

    if (status === "Pending") {
      return "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20";
    }

    return "bg-[#050505] text-[#9f988d] border border-[#3a3328]";
  };

  const cardBase =
    "bg-[#050505] rounded-2xl border border-[#3a3328] shadow-[0_0_18px_rgba(201,164,92,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c]/40 hover:bg-[#050505] hover:shadow-[0_0_28px_rgba(201,164,92,0.14)] active:translate-y-0 active:shadow-[0_0_24px_rgba(201,164,92,0.16)]";

  const iconBase =
    "transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[#c9a45c]/15 hover:border-[#c9a45c]/40 hover:shadow-[0_0_18px_rgba(201,164,92,0.28)]";

  const buttonBase =
    "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(201,164,92,0.28)] active:translate-y-0";

  return (
    <>
      <div className="w-full min-w-0 max-w-full overflow-x-hidden text-[#f5efe3]">

        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl lg:text-4xl text-xs sm:text-base font-extrabold text-[#f5efe3] tracking-tight">
            Agent <span className="text-[#c9a45c]">Management</span>
          </h1>
        </div>

        {loadError && (
          <div className={`${cardBase} mb-6 px-4 py-3 text-sm font-medium text-[#c9a45c]`}>
            {loadError}
          </div>
        )}

        {loading && (
          <div className={`${cardBase} mb-6 flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#9f988d]`}>
            <div className="animate-spin w-4 h-4 border-2 border-[#c9a45c] border-t-transparent rounded-full"></div>
            Loading agents...
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-3 mb-6 sm:mb-8">

          <div className={`${cardBase} group cursor-pointer p-3.5 sm:p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center ${iconBase}`}>
              <FaUserTie className="text-[#c9a45c] text-lg transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-[#9f988d] truncate">
                Total Agents
              </p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#f5efe3]">
                  {totalAgents}
                </h2>
                <p className="text-[9px] sm:text-[10px] text-[#777066] font-medium">
                  Registered
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBase} group cursor-pointer p-3.5 sm:p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center ${iconBase}`}>
              <FaCheckCircle className="text-[#c9a45c] text-lg transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-[#9f988d] truncate">
                Active Agents
              </p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#f5efe3]">
                  {activeAgents}
                </h2>
                <p className="text-[9px] sm:text-[10px] text-[#777066] font-medium">
                  Approved
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBase} group cursor-pointer p-3.5 sm:p-4 flex items-center gap-3 col-span-2 sm:col-span-2 xl:col-span-1`}>
            <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center ${iconBase}`}>
              <FaClock className="text-[#c9a45c] text-lg transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-[#9f988d] truncate">
                Pending Requests
              </p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#f5efe3]">
                  {pendingAgents}
                </h2>
                <p className="text-[9px] sm:text-[10px] text-[#777066] font-medium">
                  Waiting
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className={`${cardBase} overflow-hidden`}>

          <div className="border-b border-[#3a3328] bg-[#050505] p-2.5 sm:p-5">

            <div className="flex flex-col gap-2.5 sm:gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div className="relative w-full xl:max-w-md">

                <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#777066]" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email or CNIC..."
                  className="w-full rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] py-2.5 sm:py-3 pl-9 sm:pl-11 pr-3 sm:pr-4 text-xs sm:text-sm font-medium text-[#bdb6aa] outline-none transition-all duration-300 focus:border-[#c9a45c] focus:bg-[#050505] focus:ring-2 focus:ring-[#c9a45c]/20 placeholder:text-[#777066]"
                />

              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">

                <div className="relative w-full sm:w-44 max-w-full">

                  <button
                    type="button"
                    onClick={() => setStatusOpen((prev) => !prev)}
                    className={`w-full rounded-lg sm:rounded-xl border bg-[#050505] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#c9a45c] outline-none transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                      statusOpen
                        ? "border-[#c9a45c] ring-2 ring-[#c9a45c]/20 shadow-[0_0_18px_rgba(201,164,92,0.15)]"
                        : "border-[#3a3328] hover:border-[#c9a45c]/40 hover:-translate-y-0.5"
                    }`}
                  >
                    <span>
                      {statusFilter === "All" ? "All Status" : statusFilter}
                    </span>

                    <span className={`text-[#c9a45c] text-lg leading-none transition-transform duration-300 ${statusOpen ? "rotate-180" : ""}`}>
                      ⌄
                    </span>
                  </button>

                  {statusOpen && (
                    <div className="absolute left-0 right-0 z-50 mt-1.5 w-full overflow-hidden rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">

                      {[
                        { value: "All", label: "All Status" },
                        { value: "Pending", label: "Pending" },
                        { value: "Active", label: "Active" },
                        { value: "Rejected", label: "Rejected" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setStatusFilter(option.value);
                            setStatusOpen(false);
                          }}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                            statusFilter === option.value
                              ? "bg-[#c9a45c] text-[#171717]"
                              : "bg-[#050505] text-[#f5efe3] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c] hover:pl-5"
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

            {pendingAgents > 0 && (
              <div className={`${cardBase} mt-3 sm:mt-4 flex items-start sm:items-center gap-2.5 sm:gap-3 rounded-xl border-[#c9a45c]/20 bg-[#050505] px-3 sm:px-4 py-2.5 sm:py-3 shadow-none hover:translate-y-0 hover:shadow-[0_0_18px_rgba(201,164,92,0.10)]`}>

                <div className={`w-8 h-8 rounded-lg bg-[#c9a45c]/10 flex items-center justify-center shrink-0 ${iconBase}`}>
                  <FaClock className="text-[#c9a45c] text-sm" />
                </div>

                <p className="text-xs sm:text-sm text-[#bdb6aa] font-medium leading-5">
                  <span className="font-extrabold text-[#c9a45c]">
                    {pendingAgents} pending request{pendingAgents > 1 ? "s" : ""}
                  </span>{" "}
                  waiting for account creation.
                </p>

              </div>
            )}

          </div>

          <div className="w-full max-w-full">
            <div className="md:hidden p-2.5 space-y-2.5">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-[#3a3328] bg-[#050505] p-2.5 transition-all duration-300 hover:border-[#c9a45c]/30 hover:shadow-[0_0_18px_rgba(201,164,92,0.12)]"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 font-extrabold text-[#c9a45c] ${iconBase}`}>
                        {agent.name.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="truncate text-xs font-bold text-[#f5efe3]">
                          {agent.name}
                        </p>
                        <p className="mt-0.5 truncate text-[9px] text-[#777066] font-medium">
                          {agent.email}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className={`shrink-0 rounded-lg border border-[#c9a45c]/40 bg-[#050505] px-2.5 py-1.5 text-[9px] font-bold text-[#c9a45c] ${buttonBase} hover:bg-[#c9a45c] hover:!text-white cursor-pointer`}
                      >
                        View Detail
                      </button>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <div className="min-w-0 overflow-hidden rounded-lg border border-[#3a3328] px-2 py-1.5">
                        <p className="text-[8px] font-bold uppercase tracking-wider text-[#777066]">
                          CNIC
                        </p>
                        <div className="mt-0.5 flex min-w-0 items-center gap-1">
                          <FaIdCard className="shrink-0 text-[9px] text-[#c9a45c]" />
                          <p className="truncate text-[9px] font-semibold text-[#bdb6aa]">
                            {agent.cnic}
                          </p>
                        </div>
                      </div>

                      <div className="min-w-0 overflow-hidden rounded-lg border border-[#3a3328] px-2 py-1.5">
                        <p className="text-[8px] font-bold uppercase tracking-wider text-[#777066]">
                          Status
                        </p>
                        <span className={`mt-0.5 inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[8px] font-bold ${getStatusStyle(agent.status)}`}>
                          {agent.status === "Active" ? (
                            <FaCheckCircle />
                          ) : agent.status === "Pending" ? (
                            <FaClock />
                          ) : (
                            <FaTimesCircle />
                          )}
                          {agent.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1.5">
                      <p className="min-w-0 truncate text-[8px] text-[#777066]">
                        Registered {agent.registeredDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-10 text-center">
                  <div className={`mx-auto mb-3 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-[#c9a45c]/10 text-lg text-[#c9a45c] border border-[#c9a45c]/15 ${iconBase}`}>
                    <FaUserTie />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#f5efe3]">
                    No Agent Requests Found
                  </h3>
                  <p className="mt-1 text-[10px] leading-4 text-[#777066] font-medium">
                    No agent matches your current filters.
                  </p>
                </div>
              )}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#050505] border-b border-[#3a3328]">
                  <tr className="text-left text-xs uppercase tracking-wider text-[#9f988d]">
                    <th className="px-6 py-4 font-bold">Agent</th>
                    <th className="px-6 py-4 font-bold">Email</th>
                    <th className="px-6 py-4 font-bold">CNIC</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#3a3328]">
                  {filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                      <tr
                        key={agent.id}
                        className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#050505] hover:shadow-[0_5px_20px_rgba(201,164,92,0.10)]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 font-extrabold text-[#c9a45c] ${iconBase}`}>
                              {agent.name.charAt(0)}
                            </div>

                            <div className="min-w-0">
                              <p className="font-bold text-[#f5efe3] text-sm truncate">
                                {agent.name}
                              </p>
                              <p className="mt-1 text-xs text-[#777066] font-medium">
                                Registered {agent.registeredDate}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#bdb6aa] transition-all duration-300 hover:-translate-y-0.5 hover:text-[#c9a45c]">
                            <FaEnvelope className="text-[#c9a45c]" />
                            {agent.email}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#bdb6aa] transition-all duration-300 hover:-translate-y-0.5 hover:text-[#c9a45c]">
                            <FaIdCard className="text-[#c9a45c]" />
                            {agent.cnic}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(201,164,92,0.20)] ${getStatusStyle(agent.status)}`}>
                            {agent.status === "Active" ? (
                              <FaCheckCircle />
                            ) : agent.status === "Pending" ? (
                              <FaClock />
                            ) : (
                              <FaTimesCircle />
                            )}
                            {agent.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end">
                            <button
                              onClick={() => setSelectedAgent(agent)}
                              className={`flex items-center gap-2 rounded-xl border border-[#c9a45c]/50 bg-[#050505] px-4 py-2.5 text-sm font-bold text-[#c9a45c] ${buttonBase} hover:bg-[#c9a45c] hover:text-white hover:border-[#c9a45c] cursor-pointer`}
                            >
                              <FaFileAlt />
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c9a45c]/10 text-2xl text-[#c9a45c] border border-[#c9a45c]/15 ${iconBase}`}>
                            <FaUserTie />
                          </div>

                          <h3 className="text-lg font-extrabold text-[#f5efe3]">
                            No Agent Requests Found
                          </h3>

                          <p className="mt-1 text-sm text-[#777066] font-medium">
                            No agent matches your current filters.
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

      </div>

      {selectedAgent && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2.5 py-3 sm:p-4 backdrop-blur-sm overflow-hidden"
          onClick={() => setSelectedAgent(null)}
        >

          <div
            className="max-h-[88vh] w-full max-w-[360px] sm:max-w-2xl min-w-0 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#050505] [&::-webkit-scrollbar-thumb]:bg-[#3a3328] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#c9a45c] rounded-xl sm:rounded-3xl bg-[#050505] shadow-[0_0_40px_rgba(201,164,92,0.15)] border border-[#3a3328]"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="flex min-w-0 items-center justify-between bg-linear-to-r from-[#8f7440] via-[#6f5a32] to-[#c9a45c] px-3 sm:px-6 py-3 sm:py-5 text-[#171717] sticky top-0 z-10">

              <div>
                <h2 className="text-sm sm:text-xl font-extrabold tracking-tight">
                  Agent Request Details
                </h2>

                <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-sm text-[#171717]/70 font-medium">
                  Complete application information
                </p>
              </div>

              <button
                onClick={() => setSelectedAgent(null)}
                className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#050505]/15 ${buttonBase} hover:bg-[#050505]/25 cursor-pointer`}
              >
                <FaTimes />
              </button>

            </div>

            <div className="p-2.5 sm:p-6">

              <div className={`mb-3 sm:mb-6 flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl bg-[#050505] border border-[#3a3328] p-2.5 sm:p-5 cursor-pointer ${buttonBase} hover:border-[#c9a45c]/30`}>

                <div className={`flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#c9a45c] text-base sm:text-2xl font-extrabold text-[#171717] shadow-lg shadow-[#c9a45c]/30 ${iconBase}`}>
                  {selectedAgent.name.charAt(0)}
                </div>

                <div className="min-w-0">

                  <h3 className="text-sm sm:text-xl font-extrabold text-[#f5efe3] truncate">
                    {selectedAgent.name}
                  </h3>

                  <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-sm text-[#9f988d] font-medium">
                    Agent Application
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">

                <div className={`rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] p-2.5 sm:p-4 cursor-pointer ${buttonBase} hover:border-[#c9a45c]/30`}>
                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#777066]">
                    Full Name
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-[#f5efe3]">
                    {selectedAgent.name}
                  </p>
                </div>

                <div className={`rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] p-2.5 sm:p-4 cursor-pointer ${buttonBase} hover:border-[#c9a45c]/30`}>
                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#777066]">
                    Email Address
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm break-all font-bold text-[#f5efe3]">
                    {selectedAgent.email}
                  </p>
                </div>

                <div className={`rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] p-2.5 sm:p-4 cursor-pointer ${buttonBase} hover:border-[#c9a45c]/30`}>
                  <p className="flex items-center gap-2 text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#777066]">
                    <FaIdCard className="text-[#c9a45c]" />
                    CNIC
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-[#f5efe3]">
                    {selectedAgent.cnic}
                  </p>
                </div>

                <div className={`rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] p-2.5 sm:p-4 cursor-pointer ${buttonBase} hover:border-[#c9a45c]/30`}>
                  <p className="flex items-center gap-2 text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#777066]">
                    <FaUniversity className="text-[#c9a45c]" />
                    Account Number
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm break-all font-bold text-[#f5efe3]">
                    {selectedAgent.accountNumber}
                  </p>
                </div>

                <div className={`rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] p-2.5 sm:p-4 cursor-pointer ${buttonBase} hover:border-[#c9a45c]/30`}>
                  <p className="flex items-center gap-2 text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#777066]">
                    <FaVenusMars className="text-[#c9a45c]" />
                    Gender
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-[#f5efe3]">
                    {selectedAgent.gender}
                  </p>
                </div>

                <div className={`rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] p-2.5 sm:p-4 cursor-pointer ${buttonBase} hover:border-[#c9a45c]/30`}>
                  <p className="flex items-center gap-2 text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#777066]">
                    <FaCalendarAlt className="text-[#c9a45c]" />
                    Registered Date
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-[#f5efe3]">
                    {selectedAgent.registeredDate}
                  </p>
                </div>

                <div className={`rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] p-2.5 sm:p-4 cursor-pointer ${buttonBase} hover:border-[#c9a45c]/30`}>
                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#777066]">
                    City
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-[#f5efe3]">
                    {selectedAgent.city}
                  </p>
                </div>

                <div className={`rounded-lg sm:rounded-xl border border-[#3a3328] bg-[#050505] p-2.5 sm:p-4 cursor-pointer col-span-2 sm:col-span-2 ${buttonBase} hover:border-[#c9a45c]/30`}>
                  <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#777066]">
                    Address
                  </p>
                  <p className="mt-1 break-words font-bold text-[#f5efe3]">
                    {selectedAgent.address}
                  </p>
                </div>

              </div>

              <button
                onClick={() => {
                  setDocumentAgent(selectedAgent);
                  setSelectedAgent(null);
                }}
                className={`mt-4 w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] font-bold shadow-lg shadow-[#c9a45c]/25 ${buttonBase} cursor-pointer`}
              >
                <FaFileAlt />
                View Documents
              </button>

              {selectedAgent.status === "Pending" && (

                <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">

                  <button
                    onClick={() => acceptAgent(selectedAgent)}
                    className={`flex items-center justify-center gap-2 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#171717] shadow-lg shadow-[#c9a45c]/25 ${buttonBase} cursor-pointer`}
                  >
                    <FaCheck />
                    Accept Request
                  </button>

                  <button
                    onClick={() => rejectAgent(selectedAgent)}
                    className={`flex items-center justify-center gap-2 rounded-xl border border-[#3a3328] bg-[#050505] py-3 font-bold text-[#bdb6aa] hover:bg-[#c9a45c] hover:text-white hover:border-[#c9a45c] ${buttonBase} cursor-pointer`}
                  >
                    <FaTimesCircle />
                    Reject Request
                  </button>

                </div>

              )}

              <button
                onClick={() => setSelectedAgent(null)}
                className={`mt-3 w-full rounded-xl border border-[#3a3328] bg-[#050505] py-3 font-bold text-[#bdb6aa] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c] ${buttonBase} cursor-pointer`}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {documentAgent && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-2.5 py-3 sm:p-4 backdrop-blur-sm overflow-hidden">

          <div className="max-h-[88vh] w-full max-w-[360px] sm:max-w-5xl min-w-0 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#050505] [&::-webkit-scrollbar-thumb]:bg-[#3a3328] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#c9a45c] rounded-xl sm:rounded-3xl bg-[#050505] shadow-[0_0_40px_rgba(201,164,92,0.15)] border border-[#3a3328]">

            <div className="flex min-w-0 items-center justify-between bg-linear-to-r from-[#8f7440] via-[#6f5a32] to-[#c9a45c] px-3 sm:px-6 py-3 sm:py-5 text-[#171717] sticky top-0 z-10">

              <div>
                <h2 className="text-sm sm:text-xl font-extrabold tracking-tight">
                  Verification Documents
                </h2>

                <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-sm text-[#171717]/70 font-medium">
                  Review submitted CNIC documents
                </p>
              </div>

              <button
                onClick={() => setDocumentAgent(null)}
                className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#050505]/15 ${buttonBase} hover:bg-[#050505]/25 cursor-pointer`}
              >
                <FaTimes />
              </button>

            </div>

            <div className="p-2.5 sm:p-6">

              <div className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-2">

                <div className="group">

                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-extrabold text-[#f5efe3]">
                      CNIC Front
                    </h3>

                    <span className="rounded-full bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20 px-2 py-0.5 text-[9px] sm:text-xs font-bold">
                      Front
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[#3a3328] bg-[#050505] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/40 hover:shadow-[0_8px_25px_rgba(201,164,92,0.15)]">
                    <img
                      src={documentAgent.cnicFront}
                      alt="CNIC Front"
                      className="h-36 sm:h-80 w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                </div>

                <div className="group">

                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-extrabold text-[#f5efe3]">
                      CNIC Back
                    </h3>

                    <span className="rounded-full bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20 px-2 py-0.5 text-[9px] sm:text-xs font-bold">
                      Back
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[#3a3328] bg-[#050505] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/40 hover:shadow-[0_8px_25px_rgba(201,164,92,0.15)]">
                    <img
                      src={documentAgent.cnicBack}
                      alt="CNIC Back"
                      className="h-36 sm:h-80 w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                </div>

              </div>

              {documentAgent.status === "Pending" && (

                <div className="mt-7 grid grid-cols-2 gap-2 sm:gap-3">

                  <button
                    onClick={() => acceptAgent(documentAgent)}
                    className={`flex items-center justify-center gap-2 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] py-3.5 font-bold text-[#171717] shadow-lg shadow-[#c9a45c]/25 ${buttonBase} cursor-pointer`}
                  >
                    <FaCheck />
                    Accept Request
                  </button>

                  <button
                    onClick={() => rejectAgent(documentAgent)}
                    className={`flex items-center justify-center gap-2 rounded-xl border border-[#3a3328] bg-[#050505] py-3.5 font-bold text-[#bdb6aa] hover:bg-[#c9a45c] hover:text-white hover:border-[#c9a45c] ${buttonBase} cursor-pointer`}
                  >
                    <FaTimesCircle />
                    Reject Request
                  </button>

                </div>

              )}

              <button
                onClick={() => {
                  setDocumentAgent(null);
                  setSelectedAgent(documentAgent);
                }}
                className={`mt-3 flex w-full items-center justify-center rounded-xl border border-[#3a3328] bg-[#050505] py-3 font-bold text-[#bdb6aa] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c] ${buttonBase} cursor-pointer`}
              >
              Close
              </button>

            </div>

          </div>

        </div>

      )}

      {accountAgent && (

        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-2.5 py-3 sm:p-4 backdrop-blur-sm overflow-hidden">

          <div className="w-full max-w-lg overflow-hidden rounded-xl sm:rounded-3xl bg-[#050505] shadow-[0_0_40px_rgba(201,164,92,0.15)] border border-[#3a3328]">

            {!accountCreated ? (

              <>

                <div className="flex min-w-0 items-center justify-between bg-linear-to-r from-[#8f7440] via-[#6f5a32] to-[#c9a45c] px-3 sm:px-6 py-3 sm:py-5 text-[#171717]">

                  <div>
                    <h2 className="text-sm sm:text-xl font-extrabold tracking-tight">
                      Create Agent Account
                    </h2>

                    <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-sm text-[#171717]/70 font-medium">
                      Admin account creation
                    </p>
                  </div>

                  <button
                    onClick={closeAccountModal}
                    className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#050505]/15 ${buttonBase} hover:bg-[#050505]/25 cursor-pointer`}
                  >
                    <FaTimes />
                  </button>

                </div>

                <div className="p-2.5 sm:p-6">

                  <div className="rounded-2xl border border-[#c9a45c]/20 bg-[#050505] p-2.5 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/35 hover:shadow-[0_8px_25px_rgba(201,164,92,0.12)]">

                    <div className="flex items-start gap-4">

                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#c9a45c] text-[#171717] shadow-lg shadow-[#c9a45c]/30 ${iconBase}`}>
                        <FaUserPlus />
                      </div>

                      <div>
                        <h3 className="font-extrabold text-[#f5efe3]">
                          Confirm Account Creation
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#9f988d] font-medium">
                          This agent request has been reviewed. Confirm to create the official agent account.
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="mt-5 rounded-xl border border-[#3a3328] bg-[#050505] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/30 hover:shadow-[0_8px_20px_rgba(201,164,92,0.10)]">

                    <label className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#9f988d]">
                      Assigned Area / City <span className="text-[#c9a45c]">*</span>
                    </label>

                    <input
                      type="text"
                      required
                      value={assignedArea}
                      onChange={(e) => setAssignedArea(e.target.value)}
                      placeholder="e.g. Sheikhupura"
                      className={`mt-2 w-full rounded-lg border px-3 py-2.5 text-sm font-medium outline-none transition-all duration-300 bg-[#050505] text-[#f5efe3] placeholder:text-[#777066] ${
                        !assignedArea.trim()
                          ? "border-[#3a3328] focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/20"
                          : "border-[#3a3328] focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/20"
                      }`}
                    />

                    <p className="mt-2 text-[11px] text-[#777066] font-medium leading-relaxed">
                      Properties are auto-matched to agents by comparing this value against a property's city/area — leaving it blank means this agent will never receive a verification request.
                    </p>

                  </div>

                  <div className="mt-5 rounded-xl border border-[#3a3328] bg-[#050505] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/30 hover:shadow-[0_8px_20px_rgba(201,164,92,0.10)]">

                    <div className="flex items-center gap-3">

                      <div className={`w-9 h-9 rounded-lg bg-[#c9a45c]/10 flex items-center justify-center shrink-0 ${iconBase}`}>
                        <FaEnvelope className="text-[#c9a45c]" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs text-[#9f988d] font-medium">
                          Login credentials will be sent to the registered email
                        </p>

                        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm break-all font-bold text-[#f5efe3]">
                          {accountAgent.email}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3">

                    <button
                      onClick={createAgentAccount}
                      disabled={!assignedArea.trim()}
                      className={`flex items-center justify-center gap-2 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] py-3 font-bold shadow-lg shadow-[#c9a45c]/25 ${buttonBase} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#c9a45c] cursor-pointer`}
                    >
                      <FaCheck />
                      Create Account
                    </button>

                    <button
                      onClick={closeAccountModal}
                      className={`rounded-xl border border-[#3a3328] bg-[#050505] py-3 font-bold text-[#bdb6aa] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c] ${buttonBase} cursor-pointer`}
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              </>

            ) : (

              <>

                <div className="p-3 sm:p-6 text-center">

                  <div className={`mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#c9a45c]/10 text-[#c9a45c] ${iconBase}`}>
                    <FaCheck className="text-2xl" />
                  </div>

                  <h2 className="mt-5 text-base sm:text-2xl font-extrabold text-[#f5efe3] tracking-tight">
                    Account Created Successfully
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#9f988d] font-medium">
                    The agent account has been created successfully. Login credentials will be sent to the agent's registered email address.
                  </p>

                  <div className="mt-5 rounded-xl border border-[#c9a45c]/20 bg-[#c9a45c]/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(201,164,92,0.15)]">

                    <div className="flex items-center justify-center gap-2 text-[#c9a45c]">

                      <FaEnvelope />

                      <span className="break-all font-bold">
                        {accountAgent.email}
                      </span>

                    </div>

                  </div>

                  <button
                    onClick={closeAccountModal}
                    className={`mt-6 w-full rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] py-3 font-bold shadow-lg shadow-[#c9a45c]/25 ${buttonBase} cursor-pointer`}
                  >
                    Done
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </>
  );
}

export default AdminAgents;