import { useEffect, useState } from "react";
import { getMyAgentCommissions } from "../../api/paymentApi";
import {
  FaWallet,
  FaClock,
  FaCheckCircle,
  FaBuilding,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

function AgentPayments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [payoutHistory, setPayoutHistory] = useState([]);

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    async function fetchPayments() {
      try {
        setIsLoading(true);
        setError("");

        const res = await getMyAgentCommissions();
        const commissions = res.data?.commissions || [];

        const formatBookingDate = (value) =>
          value
            ? new Date(value).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—";

        const mapped = commissions.map((item) => ({
          id: item._id,
          property: item.property?.title || "Property",
          location: item.property?.address
            ? [item.property.address.area, item.property.address.city]
                .filter(Boolean)
                .join(", ")
            : "",
          date: new Date(
            item.paidAt || item.earnedAt || item.createdAt
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          bookingDates: `${formatBookingDate(
            item.booking?.checkInDate
          )} → ${formatBookingDate(item.booking?.checkOutDate)}`,
          amount: item.amount,
          status: item.status === "paid" ? "Paid" : "Pending",
        }));

        setPayoutHistory(mapped);
      } catch (error) {
        console.log(error);
        setError(
          error.response?.data?.message ||
            "Unable to load payment information."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPayments();
  }, []);

  const totalEarnings = payoutHistory.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const paidPayouts = payoutHistory.filter(
    (item) => item.status === "Paid"
  );

  const pendingPayouts = payoutHistory.filter(
    (item) => item.status === "Pending"
  );

  const totalPaid = paidPayouts.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const totalPending = pendingPayouts.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25";
    }

    return "bg-[#050505] text-[#c9a45c] border border-[#3a3328]";
  };

  const cardBase =
    "bg-[#050505] rounded-2xl shadow-lg shadow-black/25 border border-[#c9a45c]/35 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)]";

  return (
    <div className="w-full min-w-0 text-[#f5efe3]">

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#c9a45c] tracking-tight">
            My <span className="text-[#c9a45c]">Earnings</span>
          </h1>

          <p className="text-[#9f988d] mt-2 text-sm sm:text-base font-medium">
            Track your verification commissions and payment history.
          </p>
        </div>

        <div className="bg-[#050505] border border-[#c9a45c]/30 rounded-xl px-4 py-3 hover:border-[#c9a45c] hover:bg-[#050505] transition-all duration-300 shadow-lg shadow-black/40 active:shadow-[0_0_24px_rgba(201,164,92,0.28)] w-fit shrink-0">
          <span className="text-sm font-bold text-[#bdb6aa] flex items-center gap-2">
            <FaCalendarAlt className="text-[#c9a45c]" />
            {currentDate}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className={`${cardBase} min-h-[380px] flex flex-col items-center justify-center`}>
          <div className="w-10 h-10 border-4 border-[#c9a45c] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#bdb6aa] font-bold mt-4">
            Loading payment information...
          </p>
        </div>
      ) : error ? (
        <div className={`${cardBase} min-h-[380px] flex flex-col items-center justify-center px-5`}>
          <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center">
            <FaInfoCircle className="text-[#c9a45c] text-2xl" />
          </div>

          <h3 className="text-lg font-extrabold text-[#f5efe3] mt-4">
            Unable to Load Payments
          </h3>

          <p className="text-sm text-[#9f988d] text-center mt-2 font-medium">
            {error}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

            <div className={`${cardBase} p-5 sm:p-6 hover:border-[#c9a45c] hover:-translate-y-1 hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)] transition-all duration-300`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
                  <FaWallet className="text-[#c9a45c] text-xl" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-[#9f988d] font-medium">
                    Total Earnings
                  </p>

                  <h2 className="text-2xl font-extrabold text-[#f5efe3] mt-0.5 truncate">
                    PKR {totalEarnings.toLocaleString()}
                  </h2>

                  <p className="text-xs text-[#c9a45c] mt-1 font-semibold">
                    Total Commission
                  </p>
                </div>
              </div>
            </div>

            <div className={`${cardBase} p-5 sm:p-6 hover:border-[#c9a45c] hover:-translate-y-1 hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)] transition-all duration-300`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#050505] border border-[#3a3328] flex items-center justify-center shrink-0">
                  <FaClock className="text-[#c9a45c] text-xl" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-[#9f988d] font-medium">
                    Pending Payout
                  </p>

                  <h2 className="text-2xl font-extrabold text-[#f5efe3] mt-0.5 truncate">
                    PKR {totalPending.toLocaleString()}
                  </h2>

                  <p className="text-xs text-[#c9a45c] mt-1 font-semibold">
                    {pendingPayouts.length} Pending
                  </p>
                </div>
              </div>
            </div>

            <div className={`${cardBase} p-5 sm:p-6 hover:border-[#c9a45c] hover:-translate-y-1 hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)] transition-all duration-300`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-[#c9a45c] text-xl" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-[#9f988d] font-medium">
                    Received
                  </p>

                  <h2 className="text-2xl font-extrabold text-[#f5efe3] mt-0.5 truncate">
                    PKR {totalPaid.toLocaleString()}
                  </h2>

                  <p className="text-xs text-[#c9a45c] mt-1 font-semibold">
                    {paidPayouts.length} Paid
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className={`${cardBase} mt-6 overflow-hidden`}>

            <div className="p-5 sm:p-6 border-b border-[#c9a45c]/20 bg-[#050505]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                    Payment History
                  </h2>

                  <p className="text-sm text-[#9f988d] mt-1 font-medium">
                    Commission earned from bookings on properties you verified.
                  </p>
                </div>

                <span className="rounded-full bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20 px-3 py-1.5 text-xs font-bold w-fit">
                  {payoutHistory.length} Transactions
                </span>
              </div>
            </div>

            {payoutHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-5 min-h-[380px]">
                <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center">
                  <FaWallet className="text-[#c9a45c] text-2xl" />
                </div>

                <h3 className="text-lg font-extrabold text-[#f5efe3] mt-4">
                  No Payment Yet
                </h3>

                <p className="text-sm text-[#9f988d] text-center max-w-md mt-2 leading-relaxed font-medium">
                  Once you successfully verify a property and Admin processes
                  your commission, your payment details will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#050505] [&::-webkit-scrollbar-thumb]:bg-[#3a3328] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#c9a45c]">
                <table className="w-full min-w-[800px]">

                  <thead>
                    <tr className="bg-[#050505] border-b border-[#c9a45c]/20 text-left">
                      <th className="px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                        Property
                      </th>

                      <th className="px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                        Verified On
                      </th>

                      <th className="px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                        Booking (Check In → Out)
                      </th>

                      <th className="px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                        Commission
                      </th>

                      <th className="px-5 py-4 text-xs font-bold text-[#777066] uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#c9a45c]/15">
                    {payoutHistory.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#050505] hover:border-l-2 hover:border-[#c9a45c]/50 transition-all duration-200"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
                              <FaBuilding className="text-[#c9a45c]" />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-[#f5efe3]">
                                {item.property}
                              </p>

                              <p className="text-xs text-[#777066] mt-1 font-medium">
                                {item.location}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#bdb6aa] font-medium">
                          {item.date}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#bdb6aa] font-medium">
                          {item.bookingDates}
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-extrabold text-[#c9a45c]">
                            PKR {Number(item.amount || 0).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusStyle(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </div>

          <div className="mt-6 bg-[#050505] border border-[#c9a45c]/35 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-lg shadow-black/45 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)]">
            <div className="w-10 h-10 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
              <FaInfoCircle className="text-[#c9a45c] text-lg" />
            </div>

            <div>
              <h3 className="font-extrabold text-[#c9a45c] text-base">
                How Payments Work
              </h3>

              <p className="text-sm text-[#bdb6aa] mt-1.5 leading-relaxed font-medium">
                You earn a commission every time a tenant successfully pays for
                a booking on a property you verified. Once the payment is
                confirmed, Admin processes your commission and updates its
                payment status. Paid commissions are transferred to the bank
                account linked to your agent profile.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AgentPayments;