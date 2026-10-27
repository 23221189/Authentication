import { useState } from "react";
import {
  FaTimes,
  FaPaperPlane,
  FaUpload,
  FaUserTie,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext.jsx";

function CommissionDetails({
  commission,
  onClose,
  onMarkPaid,
  actionLoading,
  formatDate,
}) {
  const { theme } = useTheme();

  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleMarkPaidClick = () => {
    if (!proofFile) return;
    onMarkPaid(commission.id, proofFile);
  };

  const overlayColor =
    theme === "offwhite"
      ? "rgba(255,253,248,0.90)"
      : "rgba(5,5,5,0.90)";

  const infoBox =
    "rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5";

  const infoLabel =
    "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider";

  const infoValue =
    "mt-1.5 break-words text-sm font-bold";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm font-sans"
      style={{
        backgroundColor: overlayColor,
      }}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl transition-all duration-500 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full"
        style={{
          backgroundColor: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          boxShadow:
            theme === "offwhite"
              ? "0 0 30px rgba(139,90,43,0.12)"
              : "0 0 24px rgba(201,164,92,0.10)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{
            backgroundColor: "var(--theme-surface)",
            borderBottom:
              "1px solid var(--theme-border)",
          }}
        >
          <div className="min-w-0">
            <div
              className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
              style={{
                border:
                  "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
                backgroundColor: "var(--theme-card)",
                color: "var(--theme-accent)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 12px rgba(139,90,43,0.06)"
                    : "0 0 12px rgba(201,164,92,0.06)",
              }}
            >
              <FaUserTie />
              Agent Payment
            </div>

            <h2
              className="text-xl font-extrabold tracking-tight"
              style={{
                color: "var(--theme-text)",
              }}
            >
              Agent Commission
            </h2>

            <p
              className="mt-1 truncate text-sm font-bold"
              style={{
                color: "var(--theme-accent)",
              }}
            >
              Rs. {commission.amount.toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 cursor-pointer"
            style={{
              border:
                "1px solid var(--theme-border)",
              backgroundColor: "var(--theme-card)",
              color: "var(--theme-muted-light)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "var(--theme-accent)";
              e.currentTarget.style.color =
                "var(--theme-accent)";
              e.currentTarget.style.boxShadow =
                theme === "offwhite"
                  ? "0 0 18px rgba(139,90,43,0.15)"
                  : "0 0 18px rgba(201,164,92,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "var(--theme-border)";
              e.currentTarget.style.color =
                "var(--theme-muted-light)";
              e.currentTarget.style.boxShadow =
                "none";
            }}
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold"
            style={{
              border:
                "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
              backgroundColor: "var(--theme-card)",
              color: "var(--theme-accent)",
            }}
          >
            {commission.status === "Paid" ? (
              <>
                <FaCheckCircle className="text-[10px]" />
                Paid
              </>
            ) : (
              <>
                <FaClock className="text-[10px]" />
                Pending
              </>
            )}
          </span>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div
              className={infoBox}
              style={{
                backgroundColor: "var(--theme-card)",
                border:
                  "1px solid var(--theme-border)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.06)"
                    : "0 0 16px rgba(201,164,92,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 20px rgba(139,90,43,0.12)"
                    : "0 0 20px rgba(201,164,92,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-border)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.06)"
                    : "0 0 16px rgba(201,164,92,0.06)";
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                <FaUserTie
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
                Agent
              </p>

              <p
                className={infoValue}
                style={{
                  color: "var(--theme-text)",
                }}
              >
                {commission.agent}
              </p>

              <p
                className="mt-0.5 break-all text-xs font-medium"
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                {commission.agentEmail}
              </p>
            </div>

            <div
              className={infoBox}
              style={{
                backgroundColor: "var(--theme-card)",
                border:
                  "1px solid var(--theme-border)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.06)"
                    : "0 0 16px rgba(201,164,92,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 20px rgba(139,90,43,0.12)"
                    : "0 0 20px rgba(201,164,92,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-border)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.06)"
                    : "0 0 16px rgba(201,164,92,0.06)";
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                <FaBuilding
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
                Property
              </p>

              <p
                className={infoValue}
                style={{
                  color: "var(--theme-text)",
                }}
              >
                {commission.property}
              </p>
            </div>

            <div
              className={`${infoBox} sm:col-span-2`}
              style={{
                backgroundColor: "var(--theme-card)",
                border:
                  "1px solid var(--theme-border)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.06)"
                    : "0 0 16px rgba(201,164,92,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-border)";
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                <FaCalendarAlt
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
                Booking
              </p>

              <p
                className={infoValue}
                style={{
                  color: "var(--theme-text)",
                }}
              >
                {commission.checkInDate
                  ? formatDate(commission.checkInDate)
                  : "—"}
                {" → "}
                {commission.checkOutDate
                  ? formatDate(commission.checkOutDate)
                  : "—"}
              </p>
            </div>

            <div
              className={infoBox}
              style={{
                backgroundColor: "var(--theme-card)",
                border:
                  "1px solid var(--theme-border)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.06)"
                    : "0 0 16px rgba(201,164,92,0.06)",
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                <FaCalendarAlt
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
                Earned On
              </p>

              <p
                className={infoValue}
                style={{
                  color: "var(--theme-text)",
                }}
              >
                {formatDate(commission.earnedAt)}
              </p>
            </div>

            <div
              className={infoBox}
              style={{
                backgroundColor: "var(--theme-card)",
                border:
                  "1px solid var(--theme-border)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.06)"
                    : "0 0 16px rgba(201,164,92,0.06)",
              }}
            >
              <p
                className={infoLabel}
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                <FaCalendarAlt
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
                Paid On
              </p>

              <p
                className={infoValue}
                style={{
                  color: "var(--theme-text)",
                }}
              >
                {commission.status === "Paid"
                  ? formatDate(commission.paidAt)
                  : "Not yet"}
              </p>
            </div>

            {commission.transferProof && (
              <div
                className={`${infoBox} sm:col-span-2`}
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  border:
                    "1px solid var(--theme-border)",
                  boxShadow:
                    theme === "offwhite"
                      ? "0 0 16px rgba(139,90,43,0.06)"
                      : "0 0 16px rgba(201,164,92,0.06)",
                }}
              >
                <p
                  className="mb-2 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color:
                      "var(--theme-muted-dark)",
                  }}
                >
                  Transfer Proof
                </p>

                <a
                  href={commission.transferProof}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={commission.transferProof}
                    alt="Transfer proof"
                    className="max-h-48 rounded-xl object-contain transition-all duration-300 hover:opacity-90 cursor-pointer"
                    style={{
                      border:
                        "1px solid var(--theme-border)",
                      backgroundColor:
                        "var(--theme-surface)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--theme-accent)";
                      e.currentTarget.style.boxShadow =
                        theme === "offwhite"
                          ? "0 0 18px rgba(139,90,43,0.12)"
                          : "0 0 18px rgba(201,164,92,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--theme-border)";
                      e.currentTarget.style.boxShadow =
                        "none";
                    }}
                  />
                </a>
              </div>
            )}
          </div>

          {commission.status === "Pending" && (
            <div
              className="mt-6 rounded-2xl p-4 transition-all duration-300"
              style={{
                backgroundColor:
                  "var(--theme-card)",
                border:
                  "1px solid var(--theme-border)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.06)"
                    : "0 0 16px rgba(201,164,92,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 22px rgba(139,90,43,0.10)"
                    : "0 0 22px rgba(201,164,92,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-border)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.06)"
                    : "0 0 16px rgba(201,164,92,0.06)";
              }}
            >
              <p
                className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color: "var(--theme-muted-light)",
                }}
              >
                <FaUpload
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
                Attach Transfer Proof Screenshot (required)
              </p>

              <label
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 text-sm font-medium transition-all duration-300"
                style={{
                  borderColor:
                    "var(--theme-border)",
                  backgroundColor:
                    "var(--theme-surface)",
                  color:
                    "var(--theme-muted-light)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--theme-accent)";
                  e.currentTarget.style.color =
                    "var(--theme-accent)";
                  e.currentTarget.style.boxShadow =
                    theme === "offwhite"
                      ? "0 0 18px rgba(139,90,43,0.10)"
                      : "0 0 18px rgba(201,164,92,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--theme-border)";
                  e.currentTarget.style.color =
                    "var(--theme-muted-light)";
                  e.currentTarget.style.boxShadow =
                    "none";
                }}
              >
                <FaUpload
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />

                {proofFile
                  ? proofFile.name
                  : "Click to select screenshot"}

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
                    border:
                      "1px solid var(--theme-border)",
                    backgroundColor:
                      "var(--theme-surface)",
                    boxShadow:
                      theme === "offwhite"
                        ? "0 0 14px rgba(139,90,43,0.06)"
                        : "0 0 14px rgba(201,164,92,0.06)",
                  }}
                >
                  <img
                    src={proofPreview}
                    alt="Preview"
                    className="mx-auto max-h-40 rounded-lg object-contain"
                  />
                </div>
              )}

              <button
                onClick={handleMarkPaidClick}
                disabled={actionLoading || !proofFile}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor:
                    "var(--theme-accent)",
                  color:
                    "var(--theme-button-text)",
                  boxShadow:
                    theme === "offwhite"
                      ? "0 0 18px rgba(139,90,43,0.18)"
                      : "0 0 18px rgba(201,164,92,0.18)",
                }}
                onMouseEnter={(e) => {
                  if (!actionLoading && proofFile) {
                    e.currentTarget.style.backgroundColor =
                      "var(--theme-accent-hover)";
                    e.currentTarget.style.boxShadow =
                      theme === "offwhite"
                        ? "0 0 24px rgba(139,90,43,0.28)"
                        : "0 0 24px rgba(201,164,92,0.28)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--theme-accent)";
                  e.currentTarget.style.boxShadow =
                    theme === "offwhite"
                      ? "0 0 18px rgba(139,90,43,0.18)"
                      : "0 0 18px rgba(201,164,92,0.18)";
                }}
              >
                <FaPaperPlane />

                {actionLoading
                  ? "Processing..."
                  : "Mark Commission as Paid"}
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-3 w-full rounded-xl py-3 font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            style={{
              border:
                "1px solid var(--theme-border)",
              backgroundColor:
                "var(--theme-card)",
              color:
                "var(--theme-muted-light)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "var(--theme-accent)";
              e.currentTarget.style.color =
                "var(--theme-accent)";
              e.currentTarget.style.boxShadow =
                theme === "offwhite"
                  ? "0 0 18px rgba(139,90,43,0.12)"
                  : "0 0 18px rgba(201,164,92,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "var(--theme-border)";
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

export default CommissionDetails;