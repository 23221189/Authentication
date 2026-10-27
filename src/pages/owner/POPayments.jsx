import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import {
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaCreditCard,
  FaHandHoldingUsd,
  FaEye,
  FaUniversity,
  FaList,
  FaInfoCircle,
  FaChevronDown,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function POPayments() {
  const [activeTab, setActiveTab] = useState("all");
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const mobileTabRef = useRef(null);
  const { ownerPayment: initialPayments } = useAuth();
  const [tenantPayments, setTenantPayments] = useState(initialPayments || []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileTabRef.current &&
        !mobileTabRef.current.contains(event.target)
      ) {
        setMobileTabOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchLatestPayments = async () => {
      try {
        const res = await axiosClient.get("/payment/owner");
        const list = res.data?.payments || res.data?.payment || [];
        setTenantPayments(list);
      } catch (err) {
        console.error("Failed to load owner payments:", err);
      }
    };

    fetchLatestPayments();
  }, []);

  const adminPayments = tenantPayments.filter(
    (payment) => payment.transferredToOwner === true
  );

  const paidPayments = tenantPayments.filter(
    (payment) => (payment.status || "").toLowerCase() === "paid"
  );

  const pendingPayments = tenantPayments.filter(
    (payment) => (payment.status || "").toLowerCase() === "pending"
  );

  const totalReceived = adminPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const totalPending = pendingPayments.reduce(
    (total, payment) =>
      total + Number(payment.amount || payment.rent || 0),
    0
  );

  const filteredPayments = tenantPayments.filter((payment) => {
    const method = (
      payment.method ||
      payment.source ||
      ""
    ).toLowerCase();

    if (activeTab === "online") return method === "online";
    if (activeTab === "arrival")
      return method === "cash" || method === "arrival";

    return true;
  });

  function handleViewPayment(payment) {
    setSelectedPayment(payment);
  }

  function getPaymentId(payment, index) {
    return payment.id || payment._id || index;
  }

  function getTenantName(payment) {
    return (
      payment.tenant?.fullname ||
      payment.tenant?.name ||
      payment.name ||
      payment.tenantName ||
      "Tenant"
    );
  }

  function getTenantPhone(payment) {
    return (
      payment.tenant?.phone ||
      payment.tenant?.email ||
      payment.phone ||
      "Not available"
    );
  }

  function getPropertyName(payment) {
    return (
      payment.property?.title ||
      payment.property?.name ||
      payment.propertyName ||
      (typeof payment.property === "string"
        ? payment.property
        : "Property")
    );
  }

  function getRoomName(payment) {
    return (
      payment.booking?.room ||
      payment.room ||
      payment.roomType ||
      "Room"
    );
  }

  function getPaymentAmount(payment) {
    return Number(payment.amount || payment.rent || 0);
  }

  const cardBase =
    "bg-[#050505] rounded-2xl shadow-[0_10px_32px_rgba(0,0,0,0.72)] border border-[#c9a45c]/30 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/40 hover:bg-[#050505] hover:shadow-[0_10px_30px_rgba(201,164,92,0.18)]";

  return (
    <>

<style>{`
.payment-tab {
  color: #bdb6aa;
  transition: all 0.3s ease;
}

.payment-tab:hover {
  color: #8b5e2b;
  background: rgba(139,94,43,0.12);
}

.active-payment-tab !bg-[#8b5e2b] !text-white {
  background: #8b5e2b !important;
  color: #ffffff !important;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}
`}</style>

      <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex font-sans transition-colors duration-300">
      <main className="px-3 sm:px-5 lg:px-7 pt-1 sm:pt-2 pb-7 max-w-[1450px] mx-auto w-full">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)] mt-3">
                                    Payment Management
                                </h1>
             <p className="text-[var(--theme-muted-dark)] mt-2 text-sm sm:text-base leading-relaxed">
            Track tenant payments and payment transfers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">

            <div className="bg-[#050505] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-[0_10px_32px_rgba(0,0,0,0.72)] border border-[#c9a45c]/30 hover:border-[#c9a45c]/70 hover:-translate-y-1 hover:bg-[#050505] hover:shadow-[0_14px_38px_rgba(201,164,92,0.24)] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-13 sm:h-13 rounded-xl bg-[#050505] border border-[#c9a45c]/35 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(201,164,92,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#050505] hover:border-[#c9a45c]/65 hover:shadow-[0_0_28px_rgba(201,164,92,0.38)]">
                  <FaMoneyBillWave className="text-[#c9a45c] text-base sm:text-2xl drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] sm:text-sm text-[#9f988d] font-medium">
                    Total Received
                  </p>

                  <h2 className="text-base sm:text-2xl font-extrabold text-[#f5efe3] mt-1 wrap-break-word">
                    PKR {totalReceived.toLocaleString()}
                  </h2>

                  <p className="text-xs text-[#c9a45c] mt-1 font-semibold">
                    From Admin
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#050505] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-[0_10px_32px_rgba(0,0,0,0.72)] border border-[#c9a45c]/30 hover:border-[#c9a45c]/70 hover:-translate-y-1 hover:bg-[#050505] hover:shadow-[0_14px_38px_rgba(201,164,92,0.24)] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-13 sm:h-13 rounded-xl bg-[#050505] border border-[#c9a45c]/35 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(201,164,92,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#050505] hover:border-[#c9a45c]/65 hover:shadow-[0_0_28px_rgba(201,164,92,0.38)]">
                  <FaClock className="text-[#dfbf7b] text-base sm:text-2xl" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] sm:text-sm text-[#9f988d] font-medium">
                    Pending Payments
                  </p>

                  <h2 className="text-base sm:text-2xl font-extrabold text-[#f5efe3] mt-1 wrap-break-word">
                    PKR {totalPending.toLocaleString()}
                  </h2>

                  <p className="text-xs text-[#c9a45c] mt-1 font-semibold">
                    {pendingPayments.length} Pending
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#050505] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-[0_10px_32px_rgba(0,0,0,0.72)] border border-[#c9a45c]/30 hover:border-[#c9a45c]/70 hover:-translate-y-1 hover:bg-[#050505] hover:shadow-[0_14px_38px_rgba(201,164,92,0.24)] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-13 sm:h-13 rounded-xl bg-[#050505] border border-[#c9a45c]/35 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(201,164,92,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#050505] hover:border-[#c9a45c]/65 hover:shadow-[0_0_28px_rgba(201,164,92,0.38)]">
                  <FaCheckCircle className="text-[#c9a45c] text-base sm:text-2xl drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] sm:text-sm text-[#9f988d] font-medium">
                    Paid Tenants
                  </p>

                  <h2 className="text-base sm:text-2xl font-extrabold text-[#f5efe3] mt-1">
                    {paidPayments.length}
                  </h2>

                  <p className="text-xs text-[#c9a45c] mt-1 font-semibold">
                    This Month
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#050505] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-[0_10px_32px_rgba(0,0,0,0.72)] border border-[#c9a45c]/30 hover:border-[#c9a45c]/70 hover:-translate-y-1 hover:bg-[#050505] hover:shadow-[0_14px_38px_rgba(201,164,92,0.24)] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-13 sm:h-13 rounded-xl bg-[#050505] border border-[#c9a45c]/35 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(201,164,92,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#050505] hover:border-[#c9a45c]/65 hover:shadow-[0_0_28px_rgba(201,164,92,0.38)]">
                  <FaUsers className="text-[#c9a45c] text-base sm:text-2xl drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] sm:text-sm text-[#9f988d] font-medium">
                    Total Tenants
                  </p>

                  <h2 className="text-base sm:text-2xl font-extrabold text-[#f5efe3] mt-1">
                    {tenantPayments.length}
                  </h2>

                  <p className="text-xs text-[#c9a45c] mt-1 font-semibold">
                    All Properties
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#050505] rounded-xl border border-[var(--theme-accent)]/25 border border-[#c9a45c]/30 mt-4 sm:mt-6 overflow-visible">
            <div className="sm:hidden p-1.5">
              <div ref={mobileTabRef} className="relative w-full">
                <button
                  type="button"
                  onClick={() => setMobileTabOpen((prev) => !prev)}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#050505] border border-[#c9a45c]/55 text-[#c9a45c] text-xs font-bold outline-none cursor-pointer focus:border-[#c9a45c] focus:ring-1 focus:ring-[#c9a45c]/20 flex items-center justify-between transition-all"
                >
                  <span>
                    {activeTab === "all"
                      ? "All Payments"
                      : activeTab === "online"
                      ? "Online Payments"
                      : "Arrival / Hand Payments"}
                  </span>
                  <FaChevronDown
                    className={`text-[#c9a45c] text-xs transition-transform duration-200 ${
                      mobileTabOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileTabOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-[100] rounded-lg bg-[#050505] border border-[#c9a45c]/60 shadow-[0_12px_30px_rgba(0,0,0,0.9)] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("all");
                        setMobileTabOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold transition-all ${
                        activeTab === "all"
                          ? "bg-[#c9a45c] text-[#050505]"
                          : "bg-[#050505] text-[#c9a45c] hover:bg-[#c9a45c]/10"
                      }`}
                    >
                      All Payments
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("online");
                        setMobileTabOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold transition-all ${
                        activeTab === "online"
                          ? "bg-[#c9a45c] text-[#050505]"
                          : "bg-[#050505] text-[#c9a45c] hover:bg-[#c9a45c]/10"
                      }`}
                    >
                      Online Payments
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("arrival");
                        setMobileTabOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold transition-all ${
                        activeTab === "arrival"
                          ? "bg-[#c9a45c] text-[#050505]"
                          : "bg-[#050505] text-[#c9a45c] hover:bg-[#c9a45c]/10"
                      }`}
                    >
                      Arrival / Hand Payments
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden sm:grid sm:grid-cols-3">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 lg:px-6 py-3.5 lg:py-5 flex items-center justify-center gap-2 lg:gap-3 font-bold text-xs lg:text-sm transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "text-[#171717] bg-[#c9a45c] shadow-lg shadow-black/20"
                    : "text-[#bdb6aa] hover:text-[#dfbf7b] hover:bg-[#c9a45c]/10"
                }`}
              >
                <FaList />
                All Payments
              </button>

              <button
                onClick={() => setActiveTab("online")}
                className={`px-4 lg:px-6 py-3.5 lg:py-5 flex items-center justify-center gap-2 lg:gap-3 font-bold text-xs lg:text-sm transition-all cursor-pointer ${
                  activeTab === "online"
                    ? "text-[#171717] bg-[#c9a45c] shadow-lg shadow-black/20"
                    : "text-[#bdb6aa] hover:text-[#dfbf7b] hover:bg-[#c9a45c]/10"
                }`}
              >
                <FaCreditCard />
                Online Payments
              </button>

              <button
                onClick={() => setActiveTab("arrival")}
                className={`px-4 lg:px-6 py-3.5 lg:py-5 flex items-center justify-center gap-2 lg:gap-3 font-bold text-xs lg:text-sm transition-all cursor-pointer ${
                  activeTab === "arrival"
                    ? "text-[#171717] bg-[#c9a45c] shadow-lg shadow-black/20"
                    : "text-[#bdb6aa] hover:text-[#dfbf7b] hover:bg-[#c9a45c]/10"
                }`}
              >
                <FaHandHoldingUsd />
                Arrival / Hand Payments
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">

            <div className={`xl:col-span-2 ${cardBase}`}>
              <div className="p-2.5 sm:p-6 border-b border-[#3a3328] bg-[#050505]">
                <h2 className="text-base sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                  Tenant Payments
                </h2>

                <p className="text-xs sm:text-sm text-[#9f988d] mt-1 font-medium">
                  Check which tenants have paid their rent.
                </p>
              </div>

              {filteredPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-5">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#050505] border border-[#c9a45c]/35 flex items-center justify-center shadow-[0_0_18px_rgba(201,164,92,0.18)]">
                    <FaCreditCard className="text-[#c9a45c] text-lg sm:text-2xl" />
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#f5efe3] mt-3 sm:mt-4">
                    No Payments Found
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9f988d] text-center max-w-md mt-2 leading-5 sm:leading-6 font-medium">
                    There are no payments under this filter right now.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-190">
                    <thead>
                      <tr className="bg-[#050505] text-left text-xs text-[#9f988d] uppercase tracking-wider border-b border-[#3a3328]">
                        <th className="px-5 py-4 font-bold">Tenant</th>
                        <th className="px-5 py-4 font-bold">Property</th>
                        <th className="px-5 py-4 font-bold">Rent</th>
                        <th className="px-5 py-4 font-bold">Source</th>
                        <th className="px-5 py-4 font-bold">Status</th>
                        <th className="px-5 py-4 font-bold">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPayments.map((payment, index) => {
                        const isPaid =
                          (payment.status || "").toLowerCase() === "paid";

                        const sourceName =
                          payment.method ||
                          payment.source ||
                          "Online";

                        return (
                          <tr
                            key={getPaymentId(payment, index)}
                            className="border-t border-[#3a3328] hover:bg-[#c9a45c]/5 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm font-bold text-[#f5efe3]">
                                {getTenantName(payment)}
                              </p>

                              <p className="text-xs text-[#777066] mt-1 font-medium">
                                {getTenantPhone(payment)}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm text-[#f5efe3] font-semibold">
                                {getPropertyName(payment)}
                              </p>

                              <p className="text-xs text-[#777066] mt-1 font-medium">
                                {getRoomName(payment)}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-sm font-extrabold text-[#f5efe3]">
                                PKR{" "}
                                {getPaymentAmount(
                                  payment
                                ).toLocaleString()}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-xs px-3 py-1.5 rounded-lg bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20 uppercase font-bold whitespace-nowrap">
                                {sourceName}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
                                  isPaid
                                    ? "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20"
                                    : "bg-[#c9a45c]/10 text-[#dfbf7b] border border-[#c9a45c]/20"
                                }`}
                              >
                                {isPaid ? "✓ Paid" : "Pending"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <button
                                onClick={() =>
                                  handleViewPayment(payment)
                                }
                                className="border border-[#c9a45c]/60 text-[#c9a45c] px-4 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-[#c9a45c]/10 hover:border-[#c9a45c] transition-colors font-bold cursor-pointer"
                              >
                                <FaEye />
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="p-5 border-t border-[#3a3328] text-center">
                <Link
                  to="/potenants"
                  className="inline-flex items-center justify-center gap-2 border border-[#c9a45c]/60 text-[#c9a45c] px-6 sm:px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c9a45c]/10 hover:border-[#c9a45c] transition-colors"
                >
                  <FaUsers />
                  View All Tenants
                </Link>
              </div>
            </div>

            <div className={cardBase}>
              <div className="p-2.5 sm:p-6 border-b border-[#3a3328] bg-[#050505]">
                <h2 className="text-base sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                  Admin Payments to You
                </h2>

                <p className="text-xs sm:text-sm text-[#9f988d] mt-1 font-medium">
                  Payments received from Admin.
                </p>
              </div>

              {adminPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-14 px-4 sm:px-5 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#050505] border border-[#c9a45c]/35 flex items-center justify-center shadow-[0_0_18px_rgba(201,164,92,0.18)]">
                    <FaUniversity className="text-[#c9a45c] text-lg sm:text-2xl" />
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#f5efe3] mt-3 sm:mt-4">
                    No Payments Found
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9f988d] mt-2 leading-5 sm:leading-6 font-medium">
                    There are no payments under this section right now.
                  </p>
                </div>
              ) : (
                <div className="p-5">
                  <div className="bg-[#c9a45c] rounded-xl p-5 text-[#171717] shadow-lg shadow-black/20">
                    <p className="text-sm opacity-80 font-medium">
                      Total Received
                    </p>

                    <h2 className="text-2xl font-extrabold mt-2">
                      PKR {totalReceived.toLocaleString()}
                    </h2>
                  </div>

                  <div className="mt-5 space-y-5">
                    {adminPayments.map((payment, index) => (
                      <div
                        key={getPaymentId(payment, index)}
                        className="border-b border-[#3a3328] pb-5 last:border-b-0"
                      >
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs text-[#777066] font-medium">
                              {payment.transferredAt
                                ? new Date(
                                    payment.transferredAt
                                  ).toLocaleDateString()
                                : "Recently Transferred"}
                            </p>

                            <p className="text-sm font-bold mt-1 text-[#f5efe3]">
                              {getTenantName(payment)} (Rent Transfer)
                            </p>

                            <p className="text-xs text-[#c9a45c] mt-1 font-bold">
                              ✓ Received
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-sm font-extrabold text-[#f5efe3]">
                              PKR{" "}
                              {Number(
                                payment.amount || 0
                              ).toLocaleString()}
                            </p>

                            <button
                              onClick={() =>
                                handleViewPayment(payment)
                              }
                              className="mt-2 border border-[#c9a45c]/60 text-[#c9a45c] px-3 py-1 rounded-lg text-xs hover:bg-[#c9a45c]/10 transition-colors font-bold cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/potransactions"
                    className="w-full bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2 mt-5 active:scale-95"
                  >
                    <FaList />
                    View All Transactions
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 sm:mt-6 bg-[#c9a45c]/10 border border-[#c9a45c]/20 rounded-2xl p-3 sm:p-5 flex gap-3 sm:gap-4 items-start">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#050505] border border-[#c9a45c]/35 flex items-center justify-center shadow-[0_0_18px_rgba(201,164,92,0.18)] shrink-0">
              <FaInfoCircle className="text-[#c9a45c] text-sm sm:text-lg drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]" />
            </div>

            <div>
              <h3 className="font-extrabold text-[#c9a45c] text-sm sm:text-base">
                How Payments Work
              </h3>

              <p className="text-xs sm:text-sm text-[#bdb6aa] mt-1 leading-5 sm:leading-relaxed font-medium">
                Tenants can pay rent online through Admin. Admin verifies the
                payment and transfers the amount to you. Tenants can also pay
                you directly on arrival. Payment status will be updated
                accordingly.
              </p>
            </div>
          </div>
        </main>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-5">
          <div className="bg-[#050505] rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#3a3328]">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-[#f5efe3] tracking-tight">
                Payment Details
              </h2>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-9 h-9 rounded-full bg-[#050505] border border-[#3a3328] text-[#9f988d] hover:text-[#c9a45c] hover:bg-[#c9a45c]/10 hover:border-[#c9a45c]/40 transition-colors flex items-center justify-center text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">

              <div className="bg-[#050505] border border-[#c9a45c]/25 rounded-xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#c9a45c]/55 hover:bg-[#050505] hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]">
                <p className="text-xs text-[#777066] font-bold uppercase tracking-wider">
                  Tenant Name
                </p>

                <p className="font-bold text-[#f5efe3] mt-1.5">
                  {getTenantName(selectedPayment)}
                </p>
              </div>

              <div className="bg-[#050505] border border-[#c9a45c]/25 rounded-xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#c9a45c]/55 hover:bg-[#050505] hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]">
                <p className="text-xs text-[#777066] font-bold uppercase tracking-wider">
                  Amount
                </p>

                <p className="font-extrabold text-[#c9a45c] text-lg drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] mt-1.5">
                  PKR{" "}
                  {getPaymentAmount(
                    selectedPayment
                  ).toLocaleString()}
                </p>
              </div>

              <div className="bg-[#050505] border border-[#c9a45c]/25 rounded-xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#c9a45c]/55 hover:bg-[#050505] hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]">
                <p className="text-xs text-[#777066] font-bold uppercase tracking-wider">
                  Status
                </p>

                <p
                  className={`font-bold mt-1.5 capitalize ${
                    (selectedPayment.status || "").toLowerCase() ===
                    "paid"
                      ? "text-[#c9a45c]"
                      : "text-[#dfbf7b]"
                  }`}
                >
                  {(selectedPayment.status || "Pending").toLowerCase() ===
                  "paid"
                    ? "✓ Paid"
                    : "⏳ Pending"}
                </p>
              </div>

              <div className="bg-[#050505] border border-[#c9a45c]/25 rounded-xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#c9a45c]/55 hover:bg-[#050505] hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]">
                <p className="text-xs text-[#777066] font-bold uppercase tracking-wider">
                  Transfer To Owner
                </p>

                <p className="font-bold mt-1.5">
                  {selectedPayment.transferredToOwner ? (
                    <span className="text-[#c9a45c]">
                      ✓ Transferred by Admin
                    </span>
                  ) : (
                    <span className="text-[#dfbf7b]">
                      Pending Admin Transfer
                    </span>
                  )}
                </p>
              </div>

              {selectedPayment.transferProof && (
                <div className="bg-[#050505] border border-[#c9a45c]/25 rounded-xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#c9a45c]/55 hover:bg-[#050505] hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]">
                  <p className="text-xs text-[#777066] font-bold uppercase tracking-wider">
                    Transfer Receipt Proof
                  </p>

                  <a
                    href={selectedPayment.transferProof}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#c9a45c] underline font-bold mt-1.5 inline-block hover:text-[#dfbf7b]"
                  >
                    📎 View Receipt Image
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedPayment(null)}
              className="w-full mt-6 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] py-3.5 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-black/20 active:scale-95 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default POPayments;