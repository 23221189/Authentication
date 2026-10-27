import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaClock,
  FaWallet,
  FaArrowRight,
} from "react-icons/fa";
import { getPaymentById } from "../api/paymentApi";
import { useTheme } from "../context/ThemeContext.jsx";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 20000;

const Payemntcallback = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("paymentId");
  const status = searchParams.get("status");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  const pollTimerRef = useRef(null);
  const stopPollingAtRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchOnce() {
      const { data } = await getPaymentById(paymentId);
      return data?.payment || null;
    }

    async function verify() {
      if (!paymentId) {
        setLoading(false);
        return;
      }

      try {
        const p = await fetchOnce();

        if (cancelled) return;

        setPayment(p);

        if (status === "processing" && p?.status !== "paid") {
          stopPollingAtRef.current =
            Date.now() + POLL_TIMEOUT_MS;

          poll();
          return;
        }
      } catch (err) {
        if (!cancelled) setPayment(null);
        if (!cancelled) setLoading(false);
        return;
      }

      if (!cancelled) setLoading(false);
    }

    function poll() {
      pollTimerRef.current = setTimeout(async () => {
        if (cancelled) return;

        try {
          const p = await fetchOnce();

          if (cancelled) return;

          setPayment(p);

          if (
            p?.status === "paid" ||
            Date.now() >= stopPollingAtRef.current
          ) {
            if (p?.status !== "paid") {
              setTimedOut(true);
            }

            setLoading(false);
            return;
          }

          poll();
        } catch (err) {
          if (!cancelled) {
            setTimedOut(true);
            setLoading(false);
          }
        }
      }, POLL_INTERVAL_MS);
    }

    verify();

    return () => {
      cancelled = true;

      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, [paymentId, status]);

  const finalStatus = payment?.status || status;

  const isPaid =
    finalStatus === "paid" ||
    finalStatus === "success";

  const isCancelled =
    status === "cancelled" && !isPaid;

  const isStillProcessing =
    !isPaid &&
    !isCancelled &&
    !loading &&
    timedOut;

  const isOffWhite = theme === "offwhite";

  const cardShadow = isOffWhite
    ? "0 0 20px rgba(43,33,24,0.10)"
    : "0 0 20px rgba(0,0,0,0.28)";

  const hoverShadow = isOffWhite
    ? "0 0 30px rgba(139,90,43,0.16)"
    : "0 0 30px rgba(0,0,0,0.38)";

  const accentGlow = isOffWhite
    ? "0 0 18px rgba(139,90,43,0.08)"
    : "0 0 18px rgba(201,164,92,0.08)";

  const accentBorder = isOffWhite
    ? "rgba(139,90,43,0.30)"
    : "rgba(201,164,92,0.30)";

  const accentBorderStrong = isOffWhite
    ? "rgba(139,90,43,0.40)"
    : "rgba(201,164,92,0.40)";

  const accentGlowStrong = isOffWhite
    ? "0 0 20px rgba(139,90,43,0.10)"
    : "0 0 20px rgba(201,164,92,0.10)";

  const buttonShadow = isOffWhite
    ? "0 0 18px rgba(139,90,43,0.18)"
    : "0 0 18px rgba(201,164,92,0.18)";

  const buttonHoverShadow = isOffWhite
    ? "0 0 26px rgba(139,90,43,0.28)"
    : "0 0 26px rgba(201,164,92,0.28)";

  return (
    <div
      className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-6 sm:p-6 font-sans transition-colors duration-500"
      style={{
        backgroundColor: "var(--theme-bg)",
      }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-500 hover:-translate-y-1"
        style={{
          backgroundColor: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          boxShadow: cardShadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor =
            accentBorderStrong;
          e.currentTarget.style.boxShadow =
            hoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor =
            "var(--theme-border)";
          e.currentTarget.style.boxShadow =
            cardShadow;
        }}
      >
        <div
          className="h-1 w-full"
          style={{
            backgroundColor:
              "var(--theme-accent)",
            boxShadow:
              `0 0 10px ${
                isOffWhite
                  ? "rgba(139,90,43,0.20)"
                  : "rgba(201,164,92,0.20)"
              }`,
          }}
        />

        <div className="p-6 sm:p-10 text-center">
          {loading ? (
            <div className="py-5 sm:py-6">
              <div
                className="mx-auto mb-5 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl sm:rounded-2xl"
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  border:
                    `1px solid ${accentBorder}`,
                  color:
                    "var(--theme-accent)",
                  boxShadow: accentGlow,
                }}
              >
                <FaWallet className="text-xl sm:text-2xl" />
              </div>

              <div
                className="mx-auto mb-5 h-9 w-9 sm:h-10 sm:w-10 animate-spin rounded-full border-4"
                style={{
                  borderColor:
                    "var(--theme-border)",
                  borderTopColor:
                    "var(--theme-accent)",
                }}
              />

              <h2
                className="text-base sm:text-lg font-extrabold tracking-tight"
                style={{
                  color: "var(--theme-text)",
                }}
              >
                Confirming your payment...
              </h2>

              <p
                className="mt-2 text-xs sm:text-sm font-medium leading-6"
                style={{
                  color:
                    "var(--theme-muted-dark)",
                }}
              >
                Please wait while we verify with
                the gateway.
              </p>
            </div>
          ) : isPaid ? (
            <>
              <div
                className="mx-auto mb-5 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2"
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  borderColor:
                    accentBorderStrong,
                  boxShadow:
                    accentGlowStrong,
                }}
              >
                <FaCheckCircle
                  className="text-3xl sm:text-4xl"
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                />
              </div>

              <h1
                className="text-xl sm:text-2xl font-extrabold tracking-tight"
                style={{
                  color:
                    "var(--theme-text)",
                }}
              >
                Payment{" "}
                <span
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                >
                  Successful
                </span>
              </h1>

              <p
                className="mt-3 text-xs sm:text-sm font-medium leading-6"
                style={{
                  color:
                    "var(--theme-muted-dark)",
                }}
              >
                Your payment
                {payment?.amount
                  ? ` of Rs. ${Number(
                      payment.amount
                    ).toLocaleString()} `
                  : " "}
                has been received. A receipt has been
                saved to your bookings.
              </p>

              <div
                className="mx-auto mt-5 w-fit max-w-full rounded-full px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold"
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  border:
                    `1px solid ${accentBorder}`,
                  color:
                    "var(--theme-accent)",
                  boxShadow:
                    accentGlow,
                }}
              >
                Payment Confirmed
              </div>
            </>
          ) : isCancelled ? (
            <>
              <div
                className="mx-auto mb-5 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2"
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  borderColor:
                    accentBorder,
                  boxShadow:
                    accentGlow,
                }}
              >
                <FaBan
                  className="text-3xl sm:text-4xl"
                  style={{
                    color:
                      "var(--theme-accent-hover)",
                  }}
                />
              </div>

              <h1
                className="text-xl sm:text-2xl font-extrabold tracking-tight"
                style={{
                  color:
                    "var(--theme-text)",
                }}
              >
                Payment{" "}
                <span
                  style={{
                    color:
                      "var(--theme-accent-hover)",
                  }}
                >
                  Cancelled
                </span>
              </h1>

              <p
                className="mt-3 text-xs sm:text-sm font-medium leading-6"
                style={{
                  color:
                    "var(--theme-muted-dark)",
                }}
              >
                You cancelled the payment before it
                was completed. You can try again
                anytime from your bookings.
              </p>
            </>
          ) : isStillProcessing ? (
            <>
              <div
                className="mx-auto mb-5 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2"
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  borderColor:
                    accentBorder,
                  boxShadow:
                    accentGlow,
                }}
              >
                <FaClock
                  className="text-3xl sm:text-4xl"
                  style={{
                    color:
                      "var(--theme-accent-hover)",
                  }}
                />
              </div>

              <h1
                className="text-xl sm:text-2xl font-extrabold tracking-tight"
                style={{
                  color:
                    "var(--theme-text)",
                }}
              >
                Still{" "}
                <span
                  style={{
                    color:
                      "var(--theme-accent-hover)",
                  }}
                >
                  Processing
                </span>
              </h1>

              <p
                className="mt-3 text-xs sm:text-sm font-medium leading-6"
                style={{
                  color:
                    "var(--theme-muted-dark)",
                }}
              >
                We're still waiting for confirmation
                from the payment gateway. This can take
                a moment — check My Bookings shortly, it
                will update automatically once confirmed.
              </p>

              <div
                className="mx-auto mt-5 w-fit max-w-full rounded-full px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold"
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  border:
                    `1px solid ${accentBorder}`,
                  color:
                    "var(--theme-accent-hover)",
                  boxShadow:
                    accentGlow,
                }}
              >
                Awaiting Confirmation
              </div>
            </>
          ) : (
            <>
              <div
                className="mx-auto mb-5 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2"
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  borderColor:
                    accentBorder,
                  boxShadow:
                    accentGlow,
                }}
              >
                <FaTimesCircle
                  className="text-3xl sm:text-4xl"
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                />
              </div>

              <h1
                className="text-xl sm:text-2xl font-extrabold tracking-tight"
                style={{
                  color:
                    "var(--theme-text)",
                }}
              >
                Payment{" "}
                <span
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                >
                  Failed
                </span>
              </h1>

              <p
                className="mt-3 text-xs sm:text-sm font-medium leading-6"
                style={{
                  color:
                    "var(--theme-muted-dark)",
                }}
              >
                We couldn't confirm this payment. No
                amount was deducted if the transaction
                wasn't completed. Please try again.
              </p>
            </>
          )}

          <Link
            to="/mybooking"
            className="mt-7 sm:mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            style={{
              backgroundColor:
                "var(--theme-accent)",
              color:
                "var(--theme-button-text)",
              border:
                "1px solid var(--theme-accent)",
              boxShadow: buttonShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--theme-accent-hover)";
              e.currentTarget.style.boxShadow =
                buttonHoverShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--theme-accent)";
              e.currentTarget.style.boxShadow =
                buttonShadow;
            }}
          >
            Go to My Bookings
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Payemntcallback;