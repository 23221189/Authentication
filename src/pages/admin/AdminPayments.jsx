import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  getAllPayments,
  transfer,
  refundPayment,
  getAllAgentCommissions,
  markCommissionPaid,
} from "../../api/paymentApi";
import PaymentDetails from "../../components/PaymentDetails";
import CommissionDetails from "../../components/CommissionDetails";
import {
  FaMoneyBillWave,
  FaBuilding,
  FaSearch,
  FaCreditCard,
  FaCashRegister,
  FaWallet,
  FaShieldAlt,
  FaUserTie,
} from "react-icons/fa";

function AdminPayments() {
  const { theme } = useTheme();
  const isOffWhite = theme === "offwhite";
  const accentRgb = isOffWhite ? "139,90,43" : "201,164,92";
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [commissions, setCommissions] = useState([]);
  const [commissionsLoading, setCommissionsLoading] = useState(true);
  const [commissionError, setCommissionError] = useState("");
  const [payoutLoadingId, setPayoutLoadingId] = useState(null);

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Not available";

  const formatPaymentForDisplay = (payment) => ({
    id: payment._id,
    tenant: payment.tenant?.fullname || "Tenant",
    tenantEmail: payment.tenant?.email || "Not provided",
    owner: payment.owner?.fullname || "Property Owner",
    ownerEmail: payment.owner?.email || "Not provided",
    property: payment.property?.title || "Property",
    amount: Number(payment.amount || 0),
    method: payment.method === "cash" ? "Cash" : "Online",
    isPaid: Boolean(payment.paidAt),
    transferredToOwner: Boolean(payment.transferredToOwner),
    transferredAt: payment.transferredAt,
    refundAmount: Number(payment.refundAmount || 0),
    refundStatus: payment.refundStatus || "none",
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
  });

  const getStatusLabel = (payment) => {
    if (payment.refundStatus === "full") return "Refunded";
    if (payment.refundStatus === "partial") return "Partially Refunded";
    if (payment.transferredToOwner) return "Transferred to Owner";
    if (payment.isPaid) return "Received";
    return "Pending";
  };

  const getStatusClasses = (payment) => {
    const label = getStatusLabel(payment);

    if (label === "Refunded" || label === "Partially Refunded") {
      return "border";
    }

    if (label === "Transferred to Owner") {
      return "border";
    }

    if (label === "Received") {
      return "border";
    }

    return "border";
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await getAllPayments();

      const mapped = (res.data?.payments || []).map(
        formatPaymentForDisplay
      );

      setPayments(mapped);
      return mapped;
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not load payments."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const formatCommissionForDisplay = (commission) => ({
    id: commission._id,
    agent: commission.agent?.fullname || "Agent",
    agentEmail: commission.agent?.email || "Not provided",
    property: commission.property?.title || "Property",
    amount: Number(commission.amount || 0),
    status: commission.status === "paid" ? "Paid" : "Pending",
    earnedAt: commission.earnedAt || commission.createdAt,
    paidAt: commission.paidAt,
    checkInDate: commission.booking?.checkInDate,
    checkOutDate: commission.booking?.checkOutDate,
    transferProof: commission.transferProof || null,
  });

  const loadCommissions = async () => {
    try {
      setCommissionsLoading(true);
      setCommissionError("");

      const res = await getAllAgentCommissions();

      const mapped = (
        res.data?.commissions || []
      ).map(formatCommissionForDisplay);

      setCommissions(mapped);
    } catch (err) {
      setCommissionError(
        err.response?.data?.message ||
          "Could not load agent commissions."
      );
    } finally {
      setCommissionsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
    loadCommissions();
  }, []);

  const handleMarkCommissionPaid = async (id, file) => {
    try {
      setPayoutLoadingId(id);

      await markCommissionPaid(id, file);
      await loadCommissions();

      setSelectedCommission(null);
    } catch (err) {
      setCommissionError(
        err.response?.data?.message ||
          "Could not mark this commission as paid."
      );
    } finally {
      setPayoutLoadingId(null);
    }
  };

  function openPayment(payment) {
    setSelectedPayment(payment);
  }

  function closePayment() {
    setSelectedPayment(null);
  }

  function openCommission(commission) {
    setSelectedCommission(commission);
  }

  function closeCommission() {
    setSelectedCommission(null);
  }

  const tabs = [
    "All",
    "Online",
    "Cash",
    "Transferred",
    "Refunded",
    "Agent Commissions",
  ];

  const filteredPayments = useMemo(() => {
    if (activeTab === "Agent Commissions") return [];

    return payments.filter((payment) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        payment.tenant.toLowerCase().includes(search) ||
        payment.owner.toLowerCase().includes(search) ||
        payment.property.toLowerCase().includes(search);

      let matchesTab = true;

      if (activeTab === "Online") {
        matchesTab = payment.method === "Online";
      }

      if (activeTab === "Cash") {
        matchesTab = payment.method === "Cash";
      }

      if (activeTab === "Transferred") {
        matchesTab = payment.transferredToOwner;
      }

      if (activeTab === "Refunded") {
        matchesTab = payment.refundStatus !== "none";
      }

      return matchesSearch && matchesTab;
    });
  }, [payments, searchTerm, activeTab]);

  const filteredCommissions = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return commissions.filter(
      (c) =>
        c.agent.toLowerCase().includes(search) ||
        c.property.toLowerCase().includes(search)
    );
  }, [commissions, searchTerm]);

  const totalCommissionPending = commissions
    .filter((c) => c.status === "Pending")
    .reduce((total, c) => total + c.amount, 0);

  const totalReceived = payments
    .filter((p) => p.isPaid)
    .reduce((total, p) => total + p.amount, 0);

  const onlineTotal = payments
    .filter((p) => p.isPaid && p.method === "Online")
    .reduce((total, p) => total + p.amount, 0);

  const cashTotal = payments
    .filter((p) => p.isPaid && p.method === "Cash")
    .reduce((total, p) => total + p.amount, 0);

  const pendingTransfer = payments
    .filter((p) => p.isPaid && !p.transferredToOwner)
    .reduce((total, p) => total + p.amount, 0);

  const refundedTotal = payments
    .filter((p) => p.refundStatus !== "none")
    .reduce((total, p) => total + p.refundAmount, 0);

  const handleTransfer = async (id, file) => {
    try {
      setActionLoading(true);

      await transfer(id, file);

      const updated = await loadPayments();

      const refreshed = updated
        ? updated.find((p) => p.id === id)
        : null;

      setSelectedPayment(refreshed || null);
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not mark this payment as transferred."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefund = async (id, amount) => {
    try {
      setActionLoading(true);

      await refundPayment(id, amount);
      await loadPayments();

      closePayment();
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not process this refund."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const cardBase =
    "rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0";

  const statCards = [
    {
      title: "Total Received",
      value: totalReceived,
      icon: FaMoneyBillWave,
    },
    {
      title: "Online Payments",
      value: onlineTotal,
      icon: FaCreditCard,
    },
    {
      title: "Cash Payments",
      value: cashTotal,
      icon: FaCashRegister,
    },
    {
      title: "Pending Transfer",
      value: pendingTransfer,
      icon: FaWallet,
    },
    {
      title: "Refunded",
      value: refundedTotal,
      icon: FaMoneyBillWave,
    },
    {
      title: "Agent Commission Due",
      value: totalCommissionPending,
      icon: FaUserTie,
    },
  ];

  return (
    <>
      <div className="w-full min-w-0 max-w-full overflow-x-hidden" style={{ color: "var(--theme-text)", "--theme-accent-rgb": accentRgb }}>
        <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)] tracking-tight">
            Payment <span className="text-[var(--theme-accent)]">Management</span>
          </h1>

          <p className="mt-1 text-sm text-[var(--theme-muted)] font-medium">
             Monitor payments, transfers, refunds and agent commissions
          </p>
          </div>

          <div className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] px-2.5 py-2 shadow-[0_0_20px_rgba(201,164,92,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_24px_rgba(201,164,92,0.16)] sm:w-fit sm:px-4">
            <FaShieldAlt className="shrink-0 text-[var(--theme-accent)]" />
            <span className="text-[10px] font-bold text-[var(--theme-text)] sm:text-sm">
              Secure Payment Management
            </span>
          </div>
        </div>

        {loadError && (
          <div className="mb-6 rounded-xl border border-[var(--theme-accent)]/25 bg-[var(--theme-accent)]/10 px-4 py-3 text-sm font-medium text-[var(--theme-accent-hover)] shadow-[0_0_18px_rgba(201,164,92,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(201,164,92,0.16)]">
            {loadError}
          </div>
        )}

        {loading && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm font-medium text-[var(--theme-muted-dark)] shadow-[0_0_20px_rgba(201,164,92,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_22px_rgba(201,164,92,0.16)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--theme-accent)] border-t-transparent" />
            Loading payments...
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-8 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-6">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`${cardBase} flex min-w-0 items-center justify-between p-2.5 sm:p-5`} style={{ backgroundColor: "var(--theme-card)", borderColor: "var(--theme-border)", boxShadow: isOffWhite ? "0 0 22px rgba(43,33,24,0.08)" : "0 0 22px rgba(0,0,0,0.25)" }}
              >
                <div className="min-w-0 pr-3">
                  <p className="text-[8px] font-bold leading-tight text-[var(--theme-muted-dark)] sm:text-xs">
                    {item.title}
                  </p>

                  <h2 className="mt-1 text-[11px] sm:text-base font-extrabold text-[var(--theme-text)] whitespace-nowrap">
                    Rs. {item.value.toLocaleString()}
                  </h2>
                </div>

                <div className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/40 hover:bg-[var(--theme-accent)]/15 hover:shadow-[0_0_26px_rgba(201,164,92,0.30)] sm:h-11 sm:w-11">
                  <Icon />
                </div>
              </div>
            );
          })}
        </div>

        <div className={`${cardBase} overflow-hidden`} style={{ backgroundColor: "var(--theme-card)", borderColor: "var(--theme-border)", boxShadow: isOffWhite ? "0 0 22px rgba(43,33,24,0.08)" : "0 0 22px rgba(0,0,0,0.25)" }}>
          <div className="border-b bg-[var(--theme-surface)] p-2.5 sm:p-5 lg:p-6" style={{ borderColor: isOffWhite ? "#000000" : "var(--theme-border)" }}>
            <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid w-full min-w-0 grid-cols-3 gap-1.5 sm:flex sm:gap-2 sm:overflow-x-auto sm:pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[#3a3328] [&::-webkit-scrollbar-thumb]:rounded-full">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap rounded-lg border px-1.5 py-2 text-[9px] leading-tight sm:px-4 sm:py-2.5 sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer sm:px-4 sm:text-sm ${
                      activeTab === tab
                        ? "border-[var(--theme-accent)] bg-[var(--theme-accent)] text-[#171717] shadow-[0_0_24px_rgba(201,164,92,0.22)]"
                        : "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-muted-dark)] hover:border-[var(--theme-accent)]/30 hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] hover:shadow-[0_0_22px_rgba(201,164,92,0.16)]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full min-w-0 shrink-0 xl:w-80">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-muted-dark)]" />

                <input
                  type="text"
                  placeholder="Search tenant, owner or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 w-full rounded-lg sm:h-11 sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] pl-10 pr-4 text-sm font-medium text-[var(--theme-text)] outline-none transition-all duration-300 placeholder:text-[var(--theme-muted-dark)] focus:border-[var(--theme-accent)] focus:bg-[var(--theme-surface)] focus:ring-2 focus:ring-[var(--theme-accent)]/20 hover:border-[var(--theme-accent)]/30"
                />
              </div>
            </div>
          </div>

          {activeTab === "Agent Commissions" ? (
            <>
              <div className={`md:hidden divide-y ${isOffWhite ? "divide-[#000000]" : "divide-[var(--theme-border)]"}`}>
                {commissionError && (
                  <div className="m-3 rounded-lg border border-[var(--theme-accent)]/25 bg-[var(--theme-accent)]/10 px-3 py-2 text-[10px] font-medium text-[var(--theme-accent-hover)]">
                    {commissionError}
                  </div>
                )}

                {commissionsLoading ? (
                  <div className="px-4 py-10 text-center text-xs font-medium text-[var(--theme-muted-dark)]">
                    Loading commissions...
                  </div>
                ) : filteredCommissions.length > 0 ? (
                  filteredCommissions.map((c) => (
                    <div key={c.id} className="min-w-0 bg-[var(--theme-surface)] p-3">
                      <div className="flex min-w-0 items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-extrabold text-[var(--theme-text)]">{c.agent}</p>
                          <p className="mt-0.5 truncate text-[9px] text-[var(--theme-muted-dark)]">{c.property}</p>
                        </div>
                        <span className="shrink-0 rounded-md border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 px-2 py-1 text-[8px] font-bold text-[var(--theme-accent)]">
                          {c.status}
                        </span>
                      </div>

                      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                        <div className="min-w-0 rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                          <p className="text-[8px] font-bold uppercase text-[var(--theme-muted-dark)]">Commission</p>
                          <p className="mt-0.5 truncate text-[9px] font-extrabold text-[var(--theme-text)]">Rs. {c.amount.toLocaleString()}</p>
                        </div>
                        <div className="min-w-0 rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                          <p className="text-[8px] font-bold uppercase text-[var(--theme-muted-dark)]">Date</p>
                          <p className="mt-0.5 truncate text-[9px] font-bold text-[var(--theme-muted-light)]">{formatDate(c.paidAt || c.earnedAt)}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => openCommission(c)}
                        className="mt-2.5 w-full rounded-lg border border-[var(--theme-accent)] py-2 text-[10px] font-bold text-[var(--theme-accent)] transition-all hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] cursor-pointer"
                      >
                        {c.status === "Pending" ? "Pay Agent" : "View Details"}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-10 text-center text-xs font-medium text-[var(--theme-muted-dark)]">
                    No agent commissions found.
                  </div>
                )}
              </div>

              <div className="hidden md:block w-full max-w-full overflow-x-auto">
                {commissionError && (
                  <div className="m-4 rounded-xl border border-[var(--theme-accent)]/25 bg-[var(--theme-accent)]/10 px-4 py-3 text-sm font-medium text-[var(--theme-accent-hover)]">
                    {commissionError}
                  </div>
                )}
                {commissionsLoading && (
                  <div className="m-4 flex items-center gap-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm font-medium text-[var(--theme-muted-dark)]">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--theme-accent)] border-t-transparent" />
                    Loading commissions...
                  </div>
                )}
                <table className="w-full table-fixed min-w-[900px]">
                  <thead>
                    <tr className="border-b bg-[var(--theme-surface)]" style={{ borderColor: isOffWhite ? "#000000" : "var(--theme-border)" }}>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Agent</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Property</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Commission</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Date</th>
                      <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--theme-text)]">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isOffWhite ? "divide-[#000000]" : "divide-[var(--theme-border)]"}`}>
                    {filteredCommissions.length > 0 ? filteredCommissions.map((c) => (
                      <tr key={c.id} className="hover:bg-[var(--theme-accent)]/5">
                        <td className="px-4 py-3 text-sm font-bold text-[var(--theme-text)]">{c.agent}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[var(--theme-muted-light)]">{c.property}</td>
                        <td className="px-4 py-3 text-sm font-extrabold text-[var(--theme-text)]">Rs. {c.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-lg border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--theme-accent)]">{c.status}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--theme-muted-dark)]">{formatDate(c.paidAt || c.earnedAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => openCommission(c)} className="rounded-lg border border-[var(--theme-accent)] px-3 py-1.5 text-[11px] font-bold text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] cursor-pointer">
                            {c.status === "Pending" ? "Pay Agent" : "View Details"}
                          </button>
                        </td>
                      </tr>
                    )) : !commissionsLoading && (
                      <tr><td colSpan="6" className="px-6 py-16 text-center text-sm text-[var(--theme-muted-dark)]">No agent commissions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className={`md:hidden divide-y ${isOffWhite ? "divide-[#000000]" : "divide-[var(--theme-border)]"}`}>
                {filteredPayments.length > 0 ? filteredPayments.map((payment) => (
                  <div key={payment.id} className="min-w-0 bg-[var(--theme-surface)] p-3">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold text-[var(--theme-text)]">{payment.tenant}</p>
                        <p className="mt-0.5 truncate text-[9px] text-[var(--theme-muted-dark)]">{payment.property}</p>
                      </div>
                      <span className={`shrink-0 inline-flex rounded-md px-2 py-1 text-[8px] font-bold ${getStatusClasses(payment)}`} style={{ color: "var(--theme-accent)", backgroundColor: `rgba(${accentRgb},0.10)`, borderColor: `rgba(${accentRgb},0.20)` }}>
                        {getStatusLabel(payment)}
                      </span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      <div className="min-w-0 rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] font-bold uppercase text-[var(--theme-muted-dark)]">Owner</p>
                        <p className="mt-0.5 truncate text-[9px] font-bold text-[var(--theme-muted-light)]">{payment.owner}</p>
                      </div>
                      <div className="min-w-0 rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] font-bold uppercase text-[var(--theme-muted-dark)]">Amount</p>
                        <p className="mt-0.5 truncate text-[9px] font-extrabold text-[var(--theme-text)]">Rs. {payment.amount.toLocaleString()}</p>
                      </div>
                      <div className="min-w-0 rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] font-bold uppercase text-[var(--theme-muted-dark)]">Method</p>
                        <p className="mt-0.5 truncate text-[9px] font-bold text-[var(--theme-muted-light)]">{payment.method}</p>
                      </div>
                      <div className="min-w-0 rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] font-bold uppercase text-[var(--theme-muted-dark)]">Date</p>
                        <p className="mt-0.5 truncate text-[9px] font-bold text-[var(--theme-muted-light)]">{formatDate(payment.paidAt || payment.createdAt)}</p>
                      </div>
                    </div>
                    <button onClick={() => openPayment(payment)} className="mt-2.5 w-full rounded-lg border border-[var(--theme-accent)] py-2 text-[10px] font-bold text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] cursor-pointer">
                      View Details
                    </button>
                  </div>
                )) : (
                  <div className="px-4 py-10 text-center text-sm text-[var(--theme-muted-dark)]">No payments found.</div>
                )}
              </div>

              <div className="hidden md:block w-full max-w-full overflow-x-auto">
                <table className="w-full table-fixed min-w-[900px]">
                  <thead>
                    <tr className="border-b bg-[var(--theme-surface)]" style={{ borderColor: isOffWhite ? "#000000" : "var(--theme-border)" }}>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Tenant</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Property</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Owner</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Amount</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Method</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">Date</th>
                      <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--theme-text)]">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isOffWhite ? "divide-[#000000]" : "divide-[var(--theme-border)]"}`}>
                    {filteredPayments.length > 0 ? filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-[var(--theme-accent)]/5">
                        <td className="px-4 py-3 text-sm font-bold text-[var(--theme-text)]">{payment.tenant}</td>
                        <td className="px-4 py-3 text-sm text-[var(--theme-muted-light)]">{payment.property}</td>
                        <td className="px-4 py-3 text-sm text-[var(--theme-muted-light)]">{payment.owner}</td>
                        <td className="px-4 py-3 text-sm font-extrabold text-[var(--theme-text)]">Rs. {payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-[var(--theme-muted-light)]">{payment.method}</td>
                        <td className="px-4 py-3"><span className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-bold ${getStatusClasses(payment)}`} style={{ color: "var(--theme-accent)", backgroundColor: `rgba(${accentRgb},0.10)`, borderColor: `rgba(${accentRgb},0.20)` }}>{getStatusLabel(payment)}</span></td>
                        <td className="px-4 py-3 text-sm text-[var(--theme-muted-dark)]">{formatDate(payment.paidAt || payment.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => openPayment(payment)} className="rounded-lg border border-[var(--theme-accent)] px-3 py-1.5 text-[11px] font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] cursor-pointer">View Details</button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="8" className="px-6 py-16 text-center text-sm text-[var(--theme-muted-dark)]">No payments found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-2 sm:p-4" style={{ backgroundColor: isOffWhite ? "rgba(255,253,248,0.80)" : "rgba(5,5,5,0.80)" }}>
          <div className="w-full max-w-[280px] max-h-[78vh] overflow-x-hidden overflow-y-auto sm:max-w-2xl">
            <PaymentDetails
          payment={selectedPayment}
          onClose={closePayment}
          onTransfer={handleTransfer}
          onRefund={handleRefund}
          actionLoading={actionLoading}
          formatDate={formatDate}
          getStatusLabel={getStatusLabel}
          getStatusClasses={getStatusClasses}
            />
          </div>
        </div>
      )}

      {selectedCommission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-2 sm:p-4" style={{ backgroundColor: isOffWhite ? "rgba(255,253,248,0.80)" : "rgba(5,5,5,0.80)" }}>
          <div className="w-full max-w-[280px] max-h-[78vh] overflow-x-hidden overflow-y-auto sm:max-w-2xl">
            <CommissionDetails
          commission={selectedCommission}
          onClose={closeCommission}
          onMarkPaid={handleMarkCommissionPaid}
          actionLoading={
            payoutLoadingId === selectedCommission.id
          }
          formatDate={formatDate}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPayments;