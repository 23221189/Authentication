import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { LuArrowUpRight } from "react-icons/lu";
import {
  getAdminProperties,
  approveProperty,
  rejectProperty,
} from "../../api/adminApi.js";
import {
  FaBuilding,
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaVideo,
  FaImage,
} from "react-icons/fa";

const VerifyProperties = () => {
  const { theme } = useTheme();
  const isOffWhite = theme === "offwhite";
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectProperty, setSelectProperty] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionloading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showBill, setShowBill] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await getAdminProperties();
      const allProperties = res.data.properties || [];

      const pendingStatuses = new Set([
        "pending",
        "assigned",
        "under_admin_review",
        "pending_verification",
        "verification_pending",
        "submitted",
        "awaiting_verification",
        "verification_requested",
        "pending_review",
        "awaiting_review",
      ]);

      const normalizeStatus = (value) =>
        String(value || "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_");

      const pendingProperties = allProperties.filter((property) => {
        const statuses = [
          property?.status,
          property?.verificationStatus,
          property?.verification?.status,
          property?.verificationReport?.status,
          property?.propertyStatus,
        ]
          .filter(Boolean)
          .map(normalizeStatus);

        return statuses.some((status) => pendingStatuses.has(status));
      });

      setProperties(pendingProperties);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load listings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      setActionloading(true);

      await approveProperty(id, remarks);

      setMessage({
        type: "success",
        text: "Property has been Approved and Published successfully!",
      });

      setSelectProperty(null);
      setRemarks("");
      loadProperties();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Approve failed.",
      });
    } finally {
      setActionloading(false);
    }
  };

  const reject = async (id) => {
    if (!remarks) {
      alert("Please provide rejection reason/remarks for the owner.");
      return;
    }

    try {
      setActionloading(true);

      await rejectProperty(id, remarks);

      setMessage({
        type: "success",
        text: "Property listing has been rejected.",
      });

      setSelectProperty(null);
      setRemarks("");
      loadProperties();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Rejection failed.",
      });
    } finally {
      setActionloading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "published") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/25";
    }

    if (status === "pending") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent-hover)] border border-[var(--theme-accent)]/25";
    }

    return "bg-red-500/10 text-[var(--theme-accent)] border border-red-500/20";
  };

  return (
    <div
      style={{ "--theme-accent-rgb": isOffWhite ? "139,90,43" : "201,164,92" }}
      className="
        w-full min-w-0
        space-y-5 sm:space-y-6
        font-sans
        text-[var(--theme-text)]
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-[var(--theme-card)]
        [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)]
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]
      "
    >
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-bold border ${
            message.type === "success"
              ? "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/20"
              : "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/20"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">
              {message.type === "success" ? "✓" : "⚠"}
            </span>

            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-[0_0_28px_rgba(var(--theme-accent-rgb),0.14)] transition-all duration-300 hover:border-[var(--theme-accent)]/35 hover:shadow-[0_12px_40px_rgba(var(--theme-accent-rgb),0.25)]">
        <div className="flex flex-col gap-4 border-b border-[var(--theme-border)] bg-[var(--theme-card)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--theme-text)]">
              Property Listings Review
            </h2>

            <p className="mt-1 text-xs font-medium text-[var(--theme-muted-dark)]">
              Live database properties with Cloudinary proofs
            </p>
          </div>

          <button
            onClick={loadProperties}
            className="
              self-start
              rounded-xl
              bg-[var(--theme-surface)]
              border border-[var(--theme-accent)]
              px-4
              py-2.5
              text-xs
              font-bold
              text-[var(--theme-accent)]
              shadow-lg
              shadow-[var(--theme-accent)]/20
              transition-all duration-300
              hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)]
              hover:-translate-y-0.5
              hover:shadow-[0_8px_30px_rgba(var(--theme-accent-rgb),0.32)]
              active:scale-95
              cursor-pointer
            "
          >
            🔄 Refresh List
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--theme-border)] border-t-[var(--theme-accent)]" />

            <p className="text-sm font-medium text-[var(--theme-muted-dark)]">
              Loading properties...
            </p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] text-2xl text-[var(--theme-accent)]">
              <FaBuilding />
            </div>

            <p className="text-sm font-bold text-[var(--theme-text)]">
              No Properties Found
            </p>

            <p className="mt-1 text-xs font-medium text-[var(--theme-muted-dark)]">
              There are no properties pending review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-[var(--theme-border)] bg-[var(--theme-card)] text-xs uppercase text-[var(--theme-muted-dark)]">
                <tr>
                  <th className="p-4 font-bold tracking-wider">Title</th>

                  <th className="p-4 font-bold tracking-wider">City</th>

                  <th className="p-4 font-bold tracking-wider">Monthly Rent</th>

                  <th className="p-4 font-bold tracking-wider">Room Type</th>

                  <th className="p-4 font-bold tracking-wider">Status</th>

                  <th className="p-4 text-center font-bold tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--theme-border)]">
                {properties.map((item) => (
                  <tr
                    key={item._id}
                    className="transition-all duration-300 hover:bg-[var(--theme-card)] hover:shadow-[inset_4px_0_0_rgba(var(--theme-accent-rgb),0.55)]"
                  >
                    <td className="p-4 text-sm font-bold text-[var(--theme-text)]">
                      {item.title}
                    </td>

                    <td className="p-4 font-medium text-[var(--theme-muted-light)]">
                      {item.address?.city || "N/A"}
                    </td>

                    <td className="p-4 font-extrabold text-[var(--theme-accent)]">
                      PKR {item.pricing?.monthlyRent?.toLocaleString() || 0}
                    </td>
                    <td className="p-4 font-medium capitalize text-[var(--theme-muted-light)]">
                      {item.roomTypes?.length > 0
                        ? item.roomTypes
                            .map((room) => room.category)
                            .filter(Boolean)
                            .join(", ")
                        : "N/A"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                          item.status,
                        )}`}
                      >
                        {item.status?.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectProperty(item)}
                        className="
                          rounded-xl
                          bg-[var(--theme-accent)]
                          px-4
                          py-2.5
                          text-xs
                          font-bold
                          text-[var(--theme-button-text)]
                          shadow-lg
                          shadow-[var(--theme-accent)]/20
                          transition-all
                          hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)]
                          active:scale-95
                          cursor-pointer
                        "
                      >
                        Inspect & Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--theme-overlay)] p-4 backdrop-blur-sm">
          <div
            className="
              max-h-[92vh]
              w-full
              max-w-3xl
              overflow-y-auto
              overflow-x-hidden
              rounded-3xl
              border
              border-[var(--theme-border)]
              bg-[var(--theme-card)]
              shadow-[0_0_35px_rgba(var(--theme-accent-rgb),0.18)]
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-[var(--theme-card)]
              [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)]
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]
            "
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--theme-border)] bg-[var(--theme-card)] px-6 py-5">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 px-3 py-1 text-xs font-bold text-[var(--theme-accent)]">
                  <FaBuilding />
                  Property Verification
                </div>

                <h3 className="truncate text-xl font-extrabold tracking-tight text-[var(--theme-text)]">
                  {selectProperty.title}
                </h3>

                <p className="mt-1 text-xs font-medium text-[var(--theme-muted-dark)]">
                  {selectProperty.address?.street},{" "}
                  {selectProperty.address?.city}
                </p>

                <span
                  className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusStyle(
                    selectProperty.status,
                  )}`}
                >
                  {selectProperty.status === "published"
                    ? "✓ Verified & Published"
                    : selectProperty.status === "pending"
                      ? "Pending Review"
                      : selectProperty.status}
                </span>
              </div>

              <button
                onClick={() => setSelectProperty(null)}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[var(--theme-border)]
                  bg-[var(--theme-card)]
                  text-xl
                  font-bold
                  text-[var(--theme-muted-light)]
                  transition-all duration-300
                  hover:border-[var(--theme-accent)]/30
                  hover:-translate-y-0.5
                  hover:shadow-[0_8px_26px_rgba(var(--theme-accent-rgb),0.20)]
                  hover:bg-[var(--theme-accent)]/10
                  hover:text-[var(--theme-accent)]
                  cursor-pointer
                "
              >
                ×
              </button>
            </div>

            <div className="space-y-6 sm:space-y-7 p-4 sm:p-6">
              <div>
                <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                  <FaImage className="text-[var(--theme-accent)]" />
                  Owner-Uploaded Property Images (
                  {selectProperty.images?.length || 0})
                </label>

                {selectProperty.images?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectProperty.images.map((url, i) => (
                      <img
                        onClick={() => window.open(url, "_blank")}
                        key={i}
                        src={url}
                        alt="property"
                        className="
                          h-28
                          w-full
                          cursor-pointer
                          rounded-xl
                          border
                          border-[var(--theme-border)]
                          bg-[var(--theme-card)]
                          object-cover
                          shadow-[0_0_14px_rgba(var(--theme-accent-rgb),0.10)]
                          transition-opacity
                          hover:opacity-80
                        "
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 text-xs font-medium text-[var(--theme-muted-dark)]">
                    No property images uploaded.
                  </div>
                )}
              </div>

              <div>
                <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                  <FaVideo className="text-[var(--theme-accent)]" />
                  Owner-Uploaded Property Video(s) (
                  {selectProperty.video?.length || 0})
                </label>

                {selectProperty.video?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {selectProperty.video.map((url, i) => (
                      <div
                        key={i}
                        className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/35 hover:shadow-[0_10px_30px_rgba(var(--theme-accent-rgb),0.22)]"
                      >
                        <video
                          src={url}
                          controls
                          className="h-full max-h-56 w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 p-3 text-xs font-medium text-[var(--theme-accent-hover)]">
                    No video uploaded by the owner while listing this property.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                  <FaImage className="text-[var(--theme-accent)]" />
                  Agent Verification Photos (
                  {selectProperty.agentVerificationPhotos?.length || 0})
                </label>

                {selectProperty.agentVerificationPhotos?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectProperty.agentVerificationPhotos.map((url, i) => (
                      <img
                        onClick={() => window.open(url, "_blank")}
                        key={i}
                        src={url}
                        alt="agent verification"
                        className="
                            h-28
                            w-full
                            cursor-pointer
                            rounded-xl
                            border
                            border-[var(--theme-border)]
                            bg-[var(--theme-card)]
                            object-cover
                            shadow-[0_0_14px_rgba(var(--theme-accent-rgb),0.10)]
                            transition-opacity
                            hover:opacity-80
                          "
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 p-3 text-xs font-medium text-[var(--theme-accent-hover)]">
                    No verification photos uploaded by agent yet.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                  <FaVideo className="text-[var(--theme-accent)]" />
                  Agent Live Physical Inspection Video
                </label>

                {selectProperty.agentVerificationVideo ? (
                  <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/35 hover:shadow-[0_10px_30px_rgba(var(--theme-accent-rgb),0.22)]">
                    <video
                      src={selectProperty.agentVerificationVideo}
                      controls
                      className="h-full max-h-72 w-full object-contain"
                    />
                  </div>
                ) : (
                  <p className="rounded-xl border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 p-3 text-xs font-medium text-[var(--theme-accent-hover)]">
                    No live verification video uploaded by agent yet.
                  </p>
                )}
              </div>

              {selectProperty.agentRemarks && (
                <div className="rounded-xl border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 p-4">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                    Agent Remarks
                  </span>

                  <p className="text-sm font-medium leading-relaxed text-[var(--theme-muted-light)]">
                    {selectProperty.agentRemarks}
                  </p>
                </div>
              )}

              {selectProperty.electricityBill && (
                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-[var(--theme-muted-light)]">
                      <FaFileAlt className="text-[var(--theme-accent)]" />
                      Electricity Bill / Ownership Proof
                    </span>

                    <button
                      type="button"
                      onClick={() => setShowBill(true)}
                      className="flex items-center gap-1 rounded-lg border border-[var(--theme-accent)] bg-[var(--theme-surface)] px-3 py-2 text-xs font-bold text-[var(--theme-accent)] transition-all hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] active:scale-95 cursor-pointer"
                    >
                      View Bill
                      <LuArrowUpRight />
                    </button>
                  </div>

                  {showBill && (
                    <div
                      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--theme-overlay)] p-3 sm:p-6 backdrop-blur-sm"
                      onClick={() => setShowBill(false)}
                    >
                      <div
                        className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-[0_0_40px_rgba(var(--theme-accent-rgb),0.22)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-3 sm:px-5">
                          <div className="flex items-center gap-2">
                            <FaFileAlt className="text-[var(--theme-accent)]" />
                            <h4 className="text-sm sm:text-base font-extrabold text-[var(--theme-text)]">
                              Electricity Bill / Ownership Proof
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowBill(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--theme-border)] text-[var(--theme-muted-light)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] cursor-pointer"
                          >
                            <FaTimes />
                          </button>
                        </div>

                        <div className="max-h-[calc(92vh-58px)] overflow-auto bg-[var(--theme-card)] p-3 sm:p-5">
                          <img
                            src={selectProperty.electricityBill}
                            alt="Electricity Bill / Ownership Proof"
                            className="mx-auto max-h-[65vh] w-auto max-w-full rounded-xl border border-[var(--theme-border)] object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {[
                "pending",
                "assigned",
                "under_admin_review",
                "verified",
              ].includes(selectProperty.status) ? (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-bold text-[var(--theme-muted-light)]">
                      Admin Remarks{" "}
                      <span className="font-medium text-[var(--theme-muted-dark)]">
                        (Optional for Approval / Required for Reject)
                      </span>
                    </label>

                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter remarks or instructions for the property owner..."
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-[var(--theme-border)]
                        bg-[var(--theme-card)]
                        p-3.5
                        text-sm
                        font-medium
                        text-[var(--theme-text)]
                        outline-none
                        transition-all
                        placeholder:text-[var(--theme-muted-dark)]
                        focus:border-[var(--theme-accent)]
                        focus:ring-2
                        focus:ring-[var(--theme-accent)]/20
                      "
                      rows="3"
                    />
                  </div>

                  <div className="flex flex-col justify-end gap-3 border-t border-[var(--theme-border)] pt-5 sm:flex-row">
                    <button
                      disabled={actionLoading}
                      onClick={() => reject(selectProperty._id)}
                      className="
                        flex w-full
                        items-center
                        justify-center
                        gap-2 sm:w-auto
                        rounded-xl
                        border
                        border-[var(--theme-accent)]/30
                        bg-[var(--theme-accent)]/5
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-[var(--theme-accent)]
                        transition-colors
                        hover:bg-[var(--theme-accent)]/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        cursor-pointer
                      "
                    >
                      <FaTimes />

                      {actionLoading ? "Processing..." : "Reject Listing"}
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => approve(selectProperty._id)}
                      className="
                        flex w-full
                        items-center
                        justify-center
                        gap-2 sm:w-auto
                        rounded-xl
                        bg-[var(--theme-surface)]
                        border border-[var(--theme-accent)]
                        px-6
                        py-3
                        text-sm
                        font-bold
                        text-[var(--theme-accent)]
                        shadow-lg
                        shadow-[var(--theme-accent)]/20
                        transition-all duration-300
                        hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)]
                        hover:-translate-y-0.5
                        hover:shadow-[0_8px_30px_rgba(var(--theme-accent-rgb),0.32)]
                        active:scale-95
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        cursor-pointer
                      "
                    >
                      <FaCheck />

                      {actionLoading ? "Processing..." : "Approve & Publish"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 text-center text-sm font-bold text-[var(--theme-muted-dark)]">
                  {selectProperty.status === "published"
                    ? "This property is already verified and published. No further action needed."
                    : `This property listing was rejected${
                        selectProperty.adminRemarks
                          ? `: "${selectProperty.adminRemarks}"`
                          : "."
                      }`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyProperties;