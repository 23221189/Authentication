import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  getAllComplaints,
  respondToComplaint,
  updateComplaintStatus,
} from "../../api/complaintApi";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaExclamationCircle,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaTag,
  FaReply,
  FaChevronDown,
} from "react-icons/fa";

function AdminComplaints() {
  const { theme } = useTheme();
  const isOffWhite = theme === "offwhite";
  const accentRgb = isOffWhite ? "139,90,43" : "201,164,92";

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState("");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Not available";

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await getAllComplaints();

      setComplaints(
        (res.data?.complaints || []).map((item) => ({
          ...item,
          id: item.id,
          date: formatDate(item.date),
          adminResponse: item.adminResponse || "",
        }))
      );
    } catch (err) {
      setLoadError(
        err.response?.data?.message || "Could not load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        complaint.id.toLowerCase().includes(query) ||
        complaint.userName.toLowerCase().includes(query) ||
        complaint.subject.toLowerCase().includes(query) ||
        complaint.category.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" || complaint.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        complaint.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    complaints,
    searchQuery,
    roleFilter,
    statusFilter,
    priorityFilter,
  ]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(
      (item) => item.status === "Pending"
    ).length,
    inProgress: complaints.filter(
      (item) => item.status === "In Progress"
    ).length,
    resolved: complaints.filter(
      (item) => item.status === "Resolved"
    ).length,
  };

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(true);

      await updateComplaintStatus(id, status);
      await loadComplaints();

      setSelectedComplaint((prev) =>
        prev && prev.id === id ? { ...prev, status } : prev
      );
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not update complaint status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setResponse("");
  };

  const closeComplaint = () => {
    setSelectedComplaint(null);
    setResponse("");
  };

  const handleResponse = async () => {
    if (!selectedComplaint || !response.trim()) return;

    try {
      setActionLoading(true);

      await respondToComplaint(selectedComplaint.id, response);
      await loadComplaints();

      setSelectedComplaint((prev) =>
        prev
          ? {
              ...prev,
              status: "In Progress",
              adminResponse: response,
            }
          : prev
      );

      setResponse("");
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not send the response."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Pending") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent-hover)] border border-[var(--theme-accent)]/20";
    }

    if (status === "In Progress") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
    }

    if (status === "Resolved") {
      return "bg-[var(--theme-accent)]/15 text-[var(--theme-accent-hover)] border border-[var(--theme-accent)]/30";
    }

    return "bg-[var(--theme-surface)] text-[var(--theme-muted-dark)] border border-[var(--theme-border)]";
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") {
      return "bg-[var(--theme-accent)]/15 text-[var(--theme-accent-hover)] border border-[var(--theme-accent)]/30";
    }

    if (priority === "Medium") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
    }

    return "bg-[var(--theme-surface)] text-[var(--theme-muted-dark)] border border-[var(--theme-border)]";
  };

  const cardBase =
    `bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/40 hover:bg-[var(--theme-surface)] hover:shadow-[0_0_34px_rgba(var(--theme-accent-rgb),0.22)] active:translate-y-0`;

  const innerCardBase =
    `rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_28px_rgba(var(--theme-accent-rgb),0.18)]`;

  const infoCardBase =
    `rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_26px_rgba(var(--theme-accent-rgb),0.18)]`;

  const roleOptions = [
    { label: "All Roles", value: "All" },
    { label: "Tenant", value: "Tenant" },
    { label: "Property Owner", value: "Property Owner" },
    { label: "Agent", value: "Agent" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Resolved", value: "Resolved" },
  ];

  const priorityOptions = [
    { label: "All Priority", value: "All" },
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const getSelectedLabel = (options, value) =>
    options.find((option) => option.value === value)?.label || value;


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[data-complaint-filter-dropdown]")) {
        setRoleOpen(false);
        setStatusOpen(false);
        setPriorityOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const dropdownClass =
    `absolute left-0 top-full z-50 mt-1 w-full max-h-40 overflow-y-auto overflow-x-hidden rounded-lg sm:mt-2 sm:max-h-none sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[0_0_30px_rgba(var(--theme-accent-rgb),0.16)]`;

  const optionClass = (selected) =>
    `w-full px-2.5 py-2 sm:px-4 sm:py-3 text-left text-[10px] sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
      selected
        ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
        : "text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)]"
    }`;

  return (
    <>
      <div className="w-full text-[var(--theme-text)]" style={{ "--theme-accent-rgb": accentRgb }}>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)] tracking-tight">
            Complaints & <span className="text-[var(--theme-accent)]">Support</span>
          </h2>

          <p className="mt-2 text-sm text-[var(--theme-muted-dark)] font-medium">
            Manage and respond to user complaints and support requests.
          </p>
        </div>

        {loadError && (
          <div className="mb-6 rounded-xl border border-[var(--theme-accent)]/25 bg-[var(--theme-accent)]/10 px-4 py-3 text-sm font-medium text-[var(--theme-accent-hover)] shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(var(--theme-accent-rgb),0.16)]">
            {loadError}
          </div>
        )}

        {loading && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm font-medium text-[var(--theme-muted-dark)] shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_24px_rgba(var(--theme-accent-rgb),0.16)]">
            <div className="animate-spin w-4 h-4 border-2 border-[var(--theme-accent)] border-t-transparent rounded-full" />
            Loading complaints...
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 mb-4 sm:mb-8">
          <div className={`${cardBase} p-2.5 sm:p-5`}>
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 text-lg text-[var(--theme-accent)] border border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--theme-accent)]/15 hover:border-[var(--theme-accent)]/40 hover:shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.30)]">
                <FaExclamationCircle />
              </div>

              <span className="text-xs font-bold text-[var(--theme-muted-dark)]">
                All
              </span>
            </div>

            <p className="mt-2 sm:mt-5 text-[9px] sm:text-sm font-medium text-[var(--theme-muted-dark)]">
              Total Complaints
            </p>

            <h3 className="mt-0.5 text-lg sm:text-2xl font-extrabold text-[var(--theme-text)]">
              {stats.total}
            </h3>
          </div>

          <div className={`${cardBase} p-2.5 sm:p-5`}>
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 text-lg text-[var(--theme-accent-hover)] border border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--theme-accent)]/15 hover:border-[var(--theme-accent)]/40 hover:shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.30)]">
                <FaClock />
              </div>

              <span className="rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent-hover)] border border-[var(--theme-accent)]/20 px-2.5 py-1 text-xs font-bold">
                Pending
              </span>
            </div>

            <p className="mt-2 sm:mt-5 text-[9px] sm:text-sm font-medium text-[var(--theme-muted-dark)]">
              Pending
            </p>

            <h3 className="mt-0.5 text-lg sm:text-2xl font-extrabold text-[var(--theme-text)]">
              {stats.pending}
            </h3>
          </div>

          <div className={`${cardBase} p-2.5 sm:p-5`}>
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 text-lg text-[var(--theme-accent)] border border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--theme-accent)]/15 hover:border-[var(--theme-accent)]/40 hover:shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.30)]">
                <FaSpinner />
              </div>

              <span className="rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 px-2.5 py-1 text-xs font-bold">
                Active
              </span>
            </div>

            <p className="mt-2 sm:mt-5 text-[9px] sm:text-sm font-medium text-[var(--theme-muted-dark)]">
              In Progress
            </p>

            <h3 className="mt-0.5 text-lg sm:text-2xl font-extrabold text-[var(--theme-text)]">
              {stats.inProgress}
            </h3>
          </div>

          <div className={`${cardBase} p-2.5 sm:p-5`}>
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/15 text-lg text-[var(--theme-accent-hover)] border border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--theme-accent)]/20 hover:border-[var(--theme-accent)]/40 hover:shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.30)]">
                <FaCheckCircle />
              </div>

              <span className="rounded-full bg-[var(--theme-accent)]/15 text-[var(--theme-accent-hover)] border border-[var(--theme-accent)]/30 px-2.5 py-1 text-xs font-bold">
                Completed
              </span>
            </div>

            <p className="mt-2 sm:mt-5 text-[9px] sm:text-sm font-medium text-[var(--theme-muted-dark)]">
              Resolved
            </p>

            <h3 className="mt-0.5 text-lg sm:text-2xl font-extrabold text-[var(--theme-text)]">
              {stats.resolved}
            </h3>
          </div>
        </div>

        <div className={`${cardBase} p-1.5 sm:p-5 mb-3 sm:mb-6`}>
          <div className="flex flex-col gap-1 sm:gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-xs sm:text-base text-[var(--theme-muted-dark)]" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaint ID, user, subject..."
                className="h-7 sm:h-11 w-full rounded-lg sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] pl-9 sm:pl-11 pr-3 sm:pr-4 text-[10px] sm:text-sm font-medium text-[var(--theme-text)] outline-none transition-all focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20 placeholder:text-[var(--theme-muted-dark)]"
              />
            </div>

            <div className="grid grid-cols-3 gap-0.5 sm:gap-3 xl:flex">
              <div className="relative" data-complaint-filter-dropdown>
                <button
                  type="button"
                  onClick={() => {
                    setRoleOpen((prev) => !prev);
                    setStatusOpen(false);
                    setPriorityOpen(false);
                  }}
                  className="flex h-7 sm:h-11 w-full items-center justify-between gap-0.5 sm:gap-4 rounded-md sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-1.5 sm:px-4 text-[8px] sm:text-sm font-bold text-[var(--theme-text)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)] hover:bg-[var(--theme-surface)] hover:shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.16)] sm:min-w-40 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FaFilter className="text-xs text-[var(--theme-accent)]" />
                    {getSelectedLabel(roleOptions, roleFilter)}
                  </span>

                  <FaChevronDown className={`text-xs text-[var(--theme-accent)] transition-transform ${roleOpen ? "rotate-180" : ""}`} />
                </button>

                {roleOpen && (
                  <div className={dropdownClass}>
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setRoleFilter(option.value);
                          setRoleOpen(false);
                        }}
                        className={optionClass(roleFilter === option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" data-complaint-filter-dropdown>
                <button
                  type="button"
                  onClick={() => {
                    setStatusOpen((prev) => !prev);
                    setRoleOpen(false);
                    setPriorityOpen(false);
                  }}
                  className="flex h-7 sm:h-11 w-full items-center justify-between gap-0.5 sm:gap-4 rounded-md sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-1.5 sm:px-4 text-[8px] sm:text-sm font-bold text-[var(--theme-text)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)] hover:bg-[var(--theme-surface)] hover:shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.16)] sm:min-w-40 cursor-pointer"
                >
                  <span>
                    {getSelectedLabel(statusOptions, statusFilter)}
                  </span>

                  <FaChevronDown className={`text-xs text-[var(--theme-accent)] transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                </button>

                {statusOpen && (
                  <div className={dropdownClass}>
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option.value);
                          setStatusOpen(false);
                        }}
                        className={optionClass(statusFilter === option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" data-complaint-filter-dropdown>
                <button
                  type="button"
                  onClick={() => {
                    setPriorityOpen((prev) => !prev);
                    setRoleOpen(false);
                    setStatusOpen(false);
                  }}
                  className="flex h-7 sm:h-11 w-full items-center justify-between gap-0.5 sm:gap-4 rounded-md sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-1.5 sm:px-4 text-[8px] sm:text-sm font-bold text-[var(--theme-text)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)] hover:bg-[var(--theme-surface)] hover:shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.16)] sm:min-w-40 cursor-pointer"
                >
                  <span>
                    {getSelectedLabel(priorityOptions, priorityFilter)}
                  </span>

                  <FaChevronDown className={`text-xs text-[var(--theme-accent)] transition-transform ${priorityOpen ? "rotate-180" : ""}`} />
                </button>

                {priorityOpen && (
                  <div className={dropdownClass}>
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setPriorityFilter(option.value);
                          setPriorityOpen(false);
                        }}
                        className={optionClass(priorityFilter === option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardBase} overflow-hidden`}>
          <div className="border-b border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                  Support Requests
                </h3>

                <p className="mt-1 text-sm text-[var(--theme-muted-dark)] font-medium">
                  Review and manage user complaints.
                </p>
              </div>

              <span className="rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 px-3 py-1.5 text-xs font-bold w-fit">
                {filteredComplaints.length} Results
              </span>
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--theme-accent)]/10 text-2xl text-[var(--theme-accent)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--theme-accent)]/15 hover:shadow-[0_0_24px_rgba(var(--theme-accent-rgb),0.18)]">
                <FaExclamationCircle />
              </div>

              <h4 className="mt-4 text-sm font-bold text-[var(--theme-text)]">
                No Complaints Found
              </h4>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[var(--theme-muted-dark)] font-medium">
                No complaint matches your current search or filters.
              </p>
            </div>
          ) : (
            <div className="hidden md:block overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--theme-border)] bg-[var(--theme-surface)]">
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Complaint
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Priority
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--theme-border)]">
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--theme-surface)] hover:shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.14)]"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-bold text-[var(--theme-text)]">
                            {complaint.subject}
                          </p>

                          <p className="mt-1 text-xs font-bold text-[var(--theme-accent)]">
                            {complaint.id}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-accent)]/10 font-bold text-[var(--theme-accent)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--theme-accent)]/15 hover:shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.18)]">
                            {complaint.userName.charAt(0)}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[var(--theme-text)]">
                              {complaint.userName}
                            </p>

                            <p className="text-xs text-[var(--theme-muted-dark)] font-medium">
                              {complaint.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] px-3 py-1.5 text-xs font-bold text-[var(--theme-muted-light)] transition-all duration-300 hover:border-[var(--theme-accent)]/30 hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)]">
                          {complaint.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.16)] ${getPriorityClass(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--theme-muted-dark)]">
                          <FaCalendarAlt className="text-[var(--theme-accent)]" />
                          {complaint.date}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.16)] ${getStatusClass(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openComplaint(complaint)}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--theme-accent)] bg-[var(--theme-accent)]/10 px-4 text-xs font-bold text-[var(--theme-accent)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:shadow-[0_0_26px_rgba(var(--theme-accent-rgb),0.22)] active:translate-y-0 cursor-pointer"
                        >
                          <FaEye />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 p-2 md:hidden">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-[var(--theme-text)]">
                      {complaint.subject}
                    </p>
                    <p className="mt-0.5 truncate text-[9px] font-bold text-[var(--theme-accent)]">
                      {complaint.id}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-bold ${getStatusClass(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg border border-[var(--theme-border)] p-2">
                    <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">User</p>
                    <p className="mt-0.5 truncate text-[10px] font-bold text-[var(--theme-text)]">{complaint.userName}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--theme-border)] p-2">
                    <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">Category</p>
                    <p className="mt-0.5 truncate text-[10px] font-bold text-[var(--theme-muted-light)]">{complaint.category}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--theme-border)] p-2">
                    <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">Priority</p>
                    <span className={`inline-block mt-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${getPriorityClass(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <div className="rounded-lg border border-[var(--theme-border)] p-2">
                    <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">Date</p>
                    <p className="mt-0.5 truncate text-[9px] font-medium text-[var(--theme-muted-dark)]">{complaint.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => openComplaint(complaint)}
                  className="mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--theme-accent)] bg-[var(--theme-accent)]/10 text-[10px] font-bold text-[var(--theme-accent)] cursor-pointer"
                >
                  <FaEye />
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
          <div className="max-h-[86vh] w-[calc(100vw-24px)] max-w-[360px] overflow-hidden rounded-xl sm:max-h-[92vh] sm:w-full sm:max-w-3xl sm:rounded-3xl bg-[var(--theme-surface)] shadow-[0_0_38px_rgba(var(--theme-accent-rgb),0.20)] border border-[var(--theme-border)] transition-all duration-300 hover:border-[var(--theme-accent)]/30">
            <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 sm:px-7 sm:py-5 sticky top-0 z-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                  {selectedComplaint.id}
                </p>

                <h3 className="mt-1 text-xl font-extrabold text-[var(--theme-text)] tracking-tight">
                  Complaint Details
                </h3>
              </div>

              <button
                onClick={closeComplaint}
                className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--theme-surface)] text-[var(--theme-muted-dark)] border border-[var(--theme-border)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.18)] cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="max-h-[calc(86vh-68px)] overflow-y-auto p-3 sm:max-h-[calc(92vh-90px)] sm:p-7 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4">
                <div className={infoCardBase}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)]">
                      <FaUser />
                    </div>

                    <div>
                      <p className="text-[8px] sm:text-xs font-bold text-[var(--theme-muted-dark)] uppercase tracking-wider">
                        User
                      </p>

                      <p className="text-[10px] sm:text-sm font-bold text-[var(--theme-text)] mt-0.5">
                        {selectedComplaint.userName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={infoCardBase}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--theme-accent)]/15 text-[var(--theme-accent-hover)]">
                      <FaEnvelope />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] sm:text-xs font-bold text-[var(--theme-muted-dark)] uppercase tracking-wider">
                        Email
                      </p>

                      <p className="truncate text-sm font-bold text-[var(--theme-text)] mt-0.5">
                        {selectedComplaint.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={infoCardBase}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)]">
                      <FaTag />
                    </div>

                    <div>
                      <p className="text-[8px] sm:text-xs font-bold text-[var(--theme-muted-dark)] uppercase tracking-wider">
                        Role
                      </p>

                      <p className="text-[10px] sm:text-sm font-bold text-[var(--theme-text)] mt-0.5">
                        {selectedComplaint.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={infoCardBase}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--theme-accent)]/15 text-[var(--theme-accent-hover)]">
                      <FaCalendarAlt />
                    </div>

                    <div>
                      <p className="text-[8px] sm:text-xs font-bold text-[var(--theme-muted-dark)] uppercase tracking-wider">
                        Submitted Date
                      </p>

                      <p className="text-[10px] sm:text-sm font-bold text-[var(--theme-text)] mt-0.5">
                        {selectedComplaint.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={innerCardBase}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Subject
                    </p>

                    <h4 className="mt-1 text-lg font-extrabold text-[var(--theme-text)]">
                      {selectedComplaint.subject}
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.16)] ${getPriorityClass(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority} Priority
                    </span>

                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.16)] ${getStatusClass(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-bold text-[var(--theme-muted-light)]">
                    {selectedComplaint.category}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Complaint Description
                  </p>

                  <div className="mt-2 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] p-4 transition-all duration-300 hover:border-[var(--theme-accent)]/25 hover:shadow-[0_5px_16px_rgba(var(--theme-accent-rgb),0.10)]">
                    <p className="text-sm leading-6 text-[var(--theme-muted-light)] font-medium">
                      {selectedComplaint.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className={innerCardBase}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--theme-accent)]/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--theme-accent)]/15 hover:shadow-[0_0_14px_rgba(var(--theme-accent-rgb),0.20)]">
                    <FaReply className="text-[var(--theme-accent)]" />
                  </div>

                  <h4 className="text-base font-extrabold text-[var(--theme-text)]">
                    Admin Response
                  </h4>
                </div>

                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Write a response to the user..."
                  rows="4"
                  className="mt-4 w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 text-sm text-[var(--theme-text)] outline-none transition-all focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20 font-medium placeholder:text-[var(--theme-muted-dark)]"
                />

                <button
                  onClick={handleResponse}
                  disabled={!response.trim() || actionLoading}
                  className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] px-5 text-sm font-bold text-[var(--theme-button-text)] shadow-lg shadow-[var(--theme-accent)]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(var(--theme-accent-rgb),0.26)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaReply />
                  )}

                  {actionLoading ? "Sending..." : "Send Response"}
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_28px_rgba(var(--theme-accent-rgb),0.18)]">
                <h4 className="text-sm font-extrabold text-[var(--theme-text)]">
                  Update Complaint Status
                </h4>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateStatus(
                        selectedComplaint.id,
                        "In Progress"
                      )
                    }
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--theme-accent)] bg-[var(--theme-accent)]/10 px-4 py-2.5 text-sm font-bold text-[var(--theme-accent)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:shadow-[0_7px_20px_rgba(var(--theme-accent-rgb),0.25)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FaSpinner />
                    Mark In Progress
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        selectedComplaint.id,
                        "Resolved"
                      )
                    }
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] px-4 py-2.5 text-sm font-bold text-[var(--theme-button-text)] shadow-lg shadow-[var(--theme-accent)]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(var(--theme-accent-rgb),0.26)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FaCheckCircle />
                    Mark Resolved
                  </button>

                  <button
                    onClick={closeComplaint}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-2.5 text-sm font-bold text-[var(--theme-muted-light)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)]/30 hover:shadow-[0_5px_18px_rgba(var(--theme-accent-rgb),0.15)] cursor-pointer"
                  >
                    <FaTimes />
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminComplaints;
