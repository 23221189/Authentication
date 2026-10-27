import { useState } from "react";
import {
  FaTimes,
  FaPaperPlane,
  FaUndo,
  FaUpload,
  FaUser,
  FaBuilding,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaExchangeAlt,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext.jsx";

function PaymentDetails({
  payment,
  onClose,
  onTransfer,
  onRefund,
  actionLoading,
  formatDate,
  getStatusLabel,
  getStatusClasses,
}) {
  const { theme } = useTheme();

  const [refundAmountInput, setRefundAmountInput] =
    useState(String(payment.amount));

  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  const isOffWhite = theme === "offwhite";

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleTransferClick = () => {
    if (!proofFile) return;

    onTransfer(payment.id, proofFile);
  };

  const handleRefundClick = () => {
    const amount = Number(refundAmountInput);

    if (!amount || amount <= 0) return;

    onRefund(payment.id, amount);
  };

  const cardShadow = isOffWhite
    ? "0 0 22px rgba(43,33,24,0.10)"
    : "0 0 22px rgba(0,0,0,0.30)";

  const hoverShadow = isOffWhite
    ? "0 0 30px rgba(139,90,43,0.16)"
    : "0 0 30px rgba(0,0,0,0.40)";

  const accentBorder = isOffWhite
    ? "rgba(139,90,43,0.30)"
    : "rgba(201,164,92,0.30)";

  const accentBorderStrong = isOffWhite
    ? "rgba(139,90,43,0.60)"
    : "rgba(201,164,92,0.60)";

  const accentGlow = isOffWhite
    ? "0 0 14px rgba(139,90,43,0.06)"
    : "0 0 14px rgba(201,164,92,0.06)";

  const accentGlowMedium = isOffWhite
    ? "0 0 18px rgba(139,90,43,0.12)"
    : "0 0 18px rgba(201,164,92,0.12)";

  const accentGlowStrong = isOffWhite
    ? "0 0 22px rgba(139,90,43,0.16)"
    : "0 0 22px rgba(201,164,92,0.16)";

  const infoBox =
    "min-w-0 rounded-lg sm:rounded-xl p-2 sm:p-4 transition-all duration-300 hover:-translate-y-0.5";

  const infoLabel =
    "flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider";

  const infoValue =
    "mt-1 sm:mt-1.5 break-words text-[10px] sm:text-sm font-bold";

  const themeBorder =
    "var(--theme-border)";

  const themeSurface =
    "var(--theme-surface)";

  const themeCard =
    "var(--theme-card)";

  const themeText =
    "var(--theme-text)";

  const themeMuted =
    "var(--theme-muted-dark)";

  const themeAccent =
    "var(--theme-accent)";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm font-sans"
      style={{
        backgroundColor:
          "var(--theme-overlay)",
      }}
    >
      <div
        className="w-[calc(100vw-32px)] max-w-[320px] max-h-[78vh] sm:w-full sm:max-w-lg sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl transition-all duration-500 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full"
        style={{
          backgroundColor:
            themeSurface,
          border:
            `1px solid ${themeBorder}`,
          boxShadow:
            cardShadow,
          scrollbarColor:
            `${themeBorder} transparent`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor =
            accentBorderStrong;
          e.currentTarget.style.boxShadow =
            hoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor =
            themeBorder;
          e.currentTarget.style.boxShadow =
            cardShadow;
        }}
      >
        <div
          className="flex items-start justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5"
          style={{
            backgroundColor:
              themeSurface,
            borderBottom:
              `1px solid ${themeBorder}`,
          }}
        >
          <div className="min-w-0">
            <div
              className="mb-2 inline-flex items-center gap-2 rounded-full px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor:
                  themeCard,
                border:
                  `1px solid ${accentBorder}`,
                color:
                  themeAccent,
                boxShadow:
                  accentGlow,
              }}
            >
              <FaMoneyBillWave />
              Payment
            </div>

            <h2
              className="text-lg sm:text-xl font-extrabold tracking-tight"
              style={{
                color:
                  themeText,
              }}
            >
              Payment Details
            </h2>

            <p
              className="mt-1 truncate text-xs sm:text-sm font-bold"
              style={{
                color:
                  themeAccent,
              }}
            >
              Rs. {payment.amount.toLocaleString()} ·{" "}
              {payment.method}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            style={{
              border:
                `1px solid ${themeBorder}`,
              backgroundColor:
                themeCard,
              color:
                "var(--theme-muted-light)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                themeAccent;
              e.currentTarget.style.color =
                themeAccent;
              e.currentTarget.style.boxShadow =
                accentGlowMedium;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                themeBorder;
              e.currentTarget.style.color =
                "var(--theme-muted-light)";
              e.currentTarget.style.boxShadow =
                "none";
            }}
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <span className="inline-flex rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-bold">
            <span className={getStatusClasses(payment)}>
              {getStatusLabel(payment)}
            </span>
          </span>

          <div className="mt-3 grid grid-cols-6 gap-1.5 sm:mt-5 sm:grid-cols-2 sm:gap-3">
            <div
              className={`${infoBox} col-span-3 sm:col-span-1`}
              style={{
                backgroundColor:
                  themeCard,
                border:
                  `1px solid ${themeBorder}`,
                boxShadow:
                  accentGlow,
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color:
                    themeMuted,
                }}
              >
                <FaUser
                  style={{
                    color:
                      themeAccent,
                  }}
                />
                Tenant
              </p>

              <p
                className={infoValue}
                style={{
                  color:
                    themeText,
                }}
              >
                {payment.tenant}
              </p>

              <p
                className="mt-0.5 truncate sm:break-all text-[8px] sm:text-xs font-medium"
                style={{
                  color:
                    themeMuted,
                }}
              >
                {payment.tenantEmail}
              </p>
            </div>

            <div
              className={`${infoBox} col-span-3 sm:col-span-1`}
              style={{
                backgroundColor:
                  themeCard,
                border:
                  `1px solid ${themeBorder}`,
                boxShadow:
                  accentGlow,
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color:
                    themeMuted,
                }}
              >
                <FaBuilding
                  style={{
                    color:
                      themeAccent,
                  }}
                />
                Property Owner
              </p>

              <p
                className={infoValue}
                style={{
                  color:
                    themeText,
                }}
              >
                {payment.owner}
              </p>

              <p
                className="mt-0.5 truncate sm:break-all text-[8px] sm:text-xs font-medium"
                style={{
                  color:
                    themeMuted,
                }}
              >
                {payment.ownerEmail}
              </p>
            </div>

            <div
              className={`${infoBox} col-span-2 sm:col-span-2`}
              style={{
                backgroundColor:
                  themeCard,
                border:
                  `1px solid ${themeBorder}`,
                boxShadow:
                  accentGlow,
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color:
                    themeMuted,
                }}
              >
                <FaBuilding
                  style={{
                    color:
                      themeAccent,
                  }}
                />
                Property
              </p>

              <p
                className={infoValue}
                style={{
                  color:
                    themeText,
                }}
              >
                {payment.property}
              </p>
            </div>

            <div
              className={`${infoBox} col-span-2 sm:col-span-1`}
              style={{
                backgroundColor:
                  themeCard,
                border:
                  `1px solid ${themeBorder}`,
                boxShadow:
                  accentGlow,
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color:
                    themeMuted,
                }}
              >
                <FaCalendarAlt
                  style={{
                    color:
                      themeAccent,
                  }}
                />
                Paid On
              </p>

              <p
                className={infoValue}
                style={{
                  color:
                    themeText,
                }}
              >
                {formatDate(payment.paidAt)}
              </p>
            </div>

            <div
              className={`${infoBox} col-span-2 sm:col-span-1`}
              style={{
                backgroundColor:
                  themeCard,
                border:
                  `1px solid ${themeBorder}`,
                boxShadow:
                  accentGlow,
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color:
                    themeMuted,
                }}
              >
                <FaExchangeAlt
                  style={{
                    color:
                      themeAccent,
                  }}
                />
                Transferred to Owner
              </p>

              <p
                className={infoValue}
                style={{
                  color:
                    themeText,
                }}
              >
                {payment.transferredToOwner
                  ? formatDate(payment.transferredAt)
                  : "Not yet"}
              </p>
            </div>

            {payment.refundStatus !== "none" && (
              <div
                className="rounded-xl p-4 sm:col-span-2"
                style={{
                  backgroundColor:
                    themeCard,
                  border:
                    `1px solid ${accentBorder}`,
                  boxShadow:
                    accentGlow,
                }}
              >
                <p
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color:
                      themeAccent,
                  }}
                >
                  <FaUndo />
                  Refund Amount
                </p>

                <p
                  className="mt-1.5 text-sm font-extrabold"
                  style={{
                    color:
                      themeAccent,
                  }}
                >
                  Rs.{" "}
                  {payment.refundAmount.toLocaleString()}
                </p>
              </div>
            )}

            {payment.transferProof && (
              <div
                className={`${infoBox} sm:col-span-2`}
                style={{
                  backgroundColor:
                    themeCard,
                  border:
                    `1px solid ${themeBorder}`,
                  boxShadow:
                    accentGlow,
                }}
              >
                <p
                  className="mb-2 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color:
                      themeMuted,
                  }}
                >
                  Transfer Proof
                </p>

                <a
                  href={payment.transferProof}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={payment.transferProof}
                    alt="Transfer proof"
                    className="max-h-48 w-full rounded-xl object-contain transition-all duration-300 hover:opacity-90 cursor-pointer"
                    style={{
                      border:
                        `1px solid ${themeBorder}`,
                      backgroundColor:
                        themeSurface,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        themeAccent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        themeBorder;
                    }}
                  />
                </a>
              </div>
            )}
          </div>

          {payment.isPaid &&
            !payment.transferredToOwner && (
              <div
                className="mt-5 sm:mt-6 rounded-2xl p-4 transition-all duration-300"
                style={{
                  backgroundColor:
                    themeCard,
                  border:
                    `1px solid ${themeBorder}`,
                  boxShadow:
                    accentGlow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    accentBorderStrong;
                  e.currentTarget.style.boxShadow =
                    accentGlowStrong;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    themeBorder;
                  e.currentTarget.style.boxShadow =
                    accentGlow;
                }}
              >
                <p
                  className="mb-3 flex items-start gap-1.5 text-[10px] font-bold uppercase tracking-wider leading-relaxed"
                  style={{
                    color:
                      themeMuted,
                  }}
                >
                  <FaUpload
                    className="mt-0.5 shrink-0"
                    style={{
                      color:
                        themeAccent,
                    }}
                  />
                  Attach Transfer Proof Screenshot
                  (required)
                </p>

                <label
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 py-5 sm:py-6 text-xs sm:text-sm font-medium text-center transition-all duration-300"
                  style={{
                    borderColor:
                      themeBorder,
                    backgroundColor:
                      themeSurface,
                    color:
                      themeMuted,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      themeAccent;
                    e.currentTarget.style.color =
                      themeAccent;
                    e.currentTarget.style.boxShadow =
                      accentGlowMedium;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      themeBorder;
                    e.currentTarget.style.color =
                      themeMuted;
                    e.currentTarget.style.boxShadow =
                      "none";
                  }}
                >
                  <FaUpload
                    className="shrink-0"
                    style={{
                      color:
                        themeAccent,
                    }}
                  />

                  <span className="break-words">
                    {proofFile
                      ? proofFile.name
                      : "Click to select screenshot"}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {proofPreview && (
                  <div
                    className="mt-3 rounded-xl p-2"
                    style={{
                      backgroundColor:
                        themeSurface,
                      border:
                        `1px solid ${themeBorder}`,
                      boxShadow:
                        accentGlow,
                    }}
                  >
                    <img
                      src={proofPreview}
                      alt="Preview"
                      className="mx-auto max-h-40 w-full rounded-lg object-contain"
                    />
                  </div>
                )}

                <button
                  onClick={handleTransferClick}
                  disabled={
                    actionLoading || !proofFile
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  style={{
                    backgroundColor:
                      themeAccent,
                    color:
                      "var(--theme-button-text)",
                    border:
                      `1px solid ${themeAccent}`,
                    boxShadow:
                      "0 0 18px color-mix(in srgb, var(--theme-accent) 18%, transparent)",
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading && proofFile) {
                      e.currentTarget.style.backgroundColor =
                        "var(--theme-accent-hover)";
                      e.currentTarget.style.boxShadow =
                        "0 0 26px color-mix(in srgb, var(--theme-accent) 28%, transparent)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      themeAccent;
                    e.currentTarget.style.boxShadow =
                      "0 0 18px color-mix(in srgb, var(--theme-accent) 18%, transparent)";
                  }}
                >
                  <FaPaperPlane />

                  {actionLoading
                    ? "Processing..."
                    : "Mark Transferred to Owner"}
                </button>
              </div>
            )}

          {payment.isPaid &&
            payment.refundStatus === "none" && (
              <div
                className="mt-4 rounded-2xl p-4 transition-all duration-300"
                style={{
                  backgroundColor:
                    themeCard,
                  border:
                    `1px solid ${themeBorder}`,
                  boxShadow:
                    accentGlow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    accentBorderStrong;
                  e.currentTarget.style.boxShadow =
                    accentGlowStrong;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    themeBorder;
                  e.currentTarget.style.boxShadow =
                    accentGlow;
                }}
              >
                <p
                  className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color:
                      themeMuted,
                  }}
                >
                  <FaMoneyBillWave
                    style={{
                      color:
                        themeAccent,
                    }}
                  />
                  Refund Amount (Rs.)
                </p>

                <input
                  type="number"
                  value={refundAmountInput}
                  onChange={(e) =>
                    setRefundAmountInput(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300"
                  style={{
                    backgroundColor:
                      themeSurface,
                    border:
                      `1px solid ${themeBorder}`,
                    color:
                      themeText,
                  }}
                  placeholder="Enter refund amount"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      themeAccent;
                    e.currentTarget.style.boxShadow =
                      accentGlowMedium;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      themeBorder;
                    e.currentTarget.style.boxShadow =
                      "none";
                  }}
                />

                <button
                  onClick={handleRefundClick}
                  disabled={actionLoading}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  style={{
                    backgroundColor:
                      themeSurface,
                    border:
                      `1px solid ${accentBorderStrong}`,
                    color:
                      themeAccent,
                    boxShadow:
                      accentGlow,
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading) {
                      e.currentTarget.style.borderColor =
                        themeAccent;
                      e.currentTarget.style.boxShadow =
                        accentGlowMedium;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      accentBorderStrong;
                    e.currentTarget.style.boxShadow =
                      accentGlow;
                  }}
                >
                  <FaUndo />

                  {actionLoading
                    ? "Processing..."
                    : "Process Refund"}
                </button>
              </div>
            )}

          <button
            onClick={onClose}
            className="mt-3 w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            style={{
              backgroundColor:
                themeSurface,
              border:
                `1px solid ${themeBorder}`,
              color:
                "var(--theme-muted-light)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                accentBorderStrong;
              e.currentTarget.style.color =
                themeAccent;
              e.currentTarget.style.boxShadow =
                accentGlowMedium;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                themeBorder;
              e.currentTarget.style.color =
                "var(--theme-muted-light)";
              e.currentTarget.style.boxShadow =
                "none";
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;