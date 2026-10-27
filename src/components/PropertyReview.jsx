import React from "react";
import {
  FaStar,
  FaTrashCan,
  FaShieldHalved,
  FaCircleCheck,
} from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext.jsx";

const PropertyReview = ({
  reviews,
  reviewsLoading,
  user,
  onDeleteReview,
  myRating,
  setMyRating,
  myComment,
  setMyComment,
  onSubmitReview,
  reviewSubmitting,
  reviewError,
  reviewSuccess,
  canReview = false,
}) => {
  const { theme } = useTheme();

  const isOffWhite = theme === "offwhite";

  const cardShadow = isOffWhite
    ? "0 0 18px rgba(43,33,24,0.08)"
    : "0 0 18px rgba(0,0,0,0.25)";

  const hoverShadow = isOffWhite
    ? "0 0 28px rgba(139,90,43,0.14)"
    : "0 0 28px rgba(0,0,0,0.35)";

  const accentBorder30 = isOffWhite
    ? "rgba(139,90,43,0.30)"
    : "rgba(201,164,92,0.30)";

  const accentBorder50 = isOffWhite
    ? "rgba(139,90,43,0.50)"
    : "rgba(201,164,92,0.50)";

  const accentBorder60 = isOffWhite
    ? "rgba(139,90,43,0.60)"
    : "rgba(201,164,92,0.60)";

  const accentBorder20 = isOffWhite
    ? "rgba(139,90,43,0.20)"
    : "rgba(201,164,92,0.20)";

  const accentGlow8 = isOffWhite
    ? "0 0 14px rgba(139,90,43,0.08)"
    : "0 0 14px rgba(201,164,92,0.08)";

  const accentGlow6 = isOffWhite
    ? "0 0 14px rgba(139,90,43,0.06)"
    : "0 0 14px rgba(201,164,92,0.06)";

  const accentGlow12 = isOffWhite
    ? "0 0 18px rgba(139,90,43,0.12)"
    : "0 0 18px rgba(201,164,92,0.12)";

  const buttonShadow = isOffWhite
    ? "0 0 18px rgba(139,90,43,0.18)"
    : "0 0 18px rgba(201,164,92,0.18)";

  const buttonHoverShadow = isOffWhite
    ? "0 0 26px rgba(139,90,43,0.28)"
    : "0 0 26px rgba(201,164,92,0.28)";

  return (
    <div
      id="reviews"
      className="mb-14 pt-6 scroll-mt-24"
      style={{
        borderTop: "1px solid var(--theme-border)",
      }}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 mb-8"
        style={{
          borderBottom: "1px solid var(--theme-border)",
        }}
      >
        <div>
          <h2
            className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{
              color: "var(--theme-text)",
            }}
          >
            Verified Tenant Reviews ({reviews.length})
          </h2>

          <p
            className="text-sm mt-1 font-medium"
            style={{
              color: "var(--theme-muted-dark)",
            }}
          >
            Real experiences shared by booked tenants.
          </p>
        </div>

        {user?.role === "admin" && (
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2"
            style={{
              backgroundColor: "var(--theme-surface)",
              color: "var(--theme-accent)",
              border: `1px solid ${accentBorder30}`,
              boxShadow: accentGlow8,
            }}
          >
            <FaShieldHalved />
            Admin Moderation Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {reviewsLoading ? (
          <div
            className="col-span-2 text-center py-8 rounded-xl"
            style={{
              backgroundColor: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
              boxShadow: cardShadow,
            }}
          >
            <div
              className="animate-spin w-8 h-8 border-4 rounded-full mx-auto mb-3"
              style={{
                borderColor: "var(--theme-border)",
                borderTopColor: "var(--theme-accent)",
              }}
            />

            <p
              className="text-sm font-medium"
              style={{
                color: "var(--theme-muted-dark)",
              }}
            >
              Loading reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div
            className="col-span-2 text-center py-10 rounded-xl text-sm transition-all duration-500"
            style={{
              backgroundColor: "var(--theme-surface)",
              color: "var(--theme-muted-dark)",
              border: "1px dashed var(--theme-border)",
              boxShadow: cardShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                accentBorder50;
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
            <p
              className="font-bold"
              style={{
                color: "var(--theme-text)",
              }}
            >
              No reviews yet.
            </p>

            <p className="text-xs mt-1 font-medium">
              Once you book and stay, you can share your
              experience here!
            </p>
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="rounded-xl p-5 relative transition-all duration-500"
              style={{
                backgroundColor: "var(--theme-surface)",
                border: "1px solid var(--theme-border)",
                boxShadow: cardShadow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  accentBorder60;
                e.currentTarget.style.transform =
                  "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  hoverShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-border)";
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  cardShadow;
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "var(--theme-bg)",
                      border: `1px solid ${accentBorder30}`,
                      color: "var(--theme-accent)",
                      boxShadow: accentGlow8,
                    }}
                  >
                    {r.user?.fullname?.[0]?.toUpperCase() ||
                      "T"}
                  </div>

                  <div>
                    <span
                      className="font-bold text-sm block"
                      style={{
                        color: "var(--theme-text)",
                      }}
                    >
                      {r.user?.fullname ||
                        "Verified Tenant"}
                    </span>

                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5"
                      style={{
                        color: "var(--theme-accent)",
                        backgroundColor:
                          "var(--theme-bg)",
                        border: `1px solid ${accentBorder20}`,
                      }}
                    >
                      <FaCircleCheck className="text-[8px]" />
                      Verified Booking
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center text-xs gap-0.5"
                    style={{
                      color: "var(--theme-accent)",
                    }}
                  >
                    {Array.from({
                      length: r.rating || 5,
                    }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>

                  {user?.role === "admin" && (
                    <button
                      type="button"
                      onClick={() =>
                        onDeleteReview(r._id)
                      }
                      className="border border-transparent p-1.5 rounded-lg cursor-pointer transition-all"
                      style={{
                        color: "var(--theme-accent)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                          "var(--theme-accent-hover)";
                        e.currentTarget.style.backgroundColor =
                          "var(--theme-bg)";
                        e.currentTarget.style.borderColor =
                          accentBorder30;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color =
                          "var(--theme-accent)";
                        e.currentTarget.style.backgroundColor =
                          "transparent";
                        e.currentTarget.style.borderColor =
                          "transparent";
                      }}
                      title="Delete review"
                    >
                      <FaTrashCan className="text-xs" />
                    </button>
                  )}
                </div>
              </div>

              <p
                className="text-sm leading-relaxed mt-3 font-medium"
                style={{
                  color: "var(--theme-muted-light)",
                }}
              >
                {r.comment}
              </p>

              <p
                className="text-[10px] mt-3 font-medium"
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                {new Date(
                  r.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {canReview ? (
        <form
          onSubmit={onSubmitReview}
          className="rounded-xl p-5 sm:p-6 transition-all duration-500"
          style={{
            backgroundColor: "var(--theme-surface)",
            border: "1px solid var(--theme-border)",
            boxShadow: cardShadow,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor =
              accentBorder60;
            e.currentTarget.style.transform =
              "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              hoverShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              "var(--theme-border)";
            e.currentTarget.style.transform =
              "translateY(0)";
            e.currentTarget.style.boxShadow =
              cardShadow;
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "var(--theme-bg)",
                border: `1px solid ${accentBorder30}`,
                boxShadow: accentGlow8,
              }}
            >
              <FaStar
                style={{
                  color: "var(--theme-accent)",
                }}
              />
            </div>

            <h3
              className="font-extrabold text-base sm:text-lg tracking-tight"
              style={{
                color: "var(--theme-text)",
              }}
            >
              Submit Your Stay Feedback
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="text-sm mr-2 font-bold"
              style={{
                color: "var(--theme-muted-light)",
              }}
            >
              Your Rating:
            </span>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() =>
                    setMyRating(star)
                  }
                  className="cursor-pointer text-xl hover:scale-110 transition-transform"
                >
                  <FaStar
                    style={{
                      color:
                        star <= myRating
                          ? "var(--theme-accent)"
                          : "var(--theme-muted-dark)",
                    }}
                  />
                </button>
              ))}
            </div>

            <span
              className="text-sm font-bold ml-2"
              style={{
                color: "var(--theme-accent)",
              }}
            >
              {myRating} / 5 Stars
            </span>
          </div>

          <textarea
            value={myComment}
            onChange={(e) =>
              setMyComment(e.target.value)
            }
            placeholder="Share your experience regarding room cleanliness, environment, host behavior..."
            rows={4}
            className="w-full rounded-lg p-4 text-sm font-medium outline-none resize-none transition-all placeholder:opacity-70"
            style={{
              backgroundColor: "var(--theme-bg)",
              border: "1px solid var(--theme-border)",
              color: "var(--theme-text)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                accentBorder60;
              e.currentTarget.style.boxShadow =
                accentGlow8;
            }}
            onMouseLeave={(e) => {
              if (
                document.activeElement !==
                e.currentTarget
              ) {
                e.currentTarget.style.borderColor =
                  "var(--theme-border)";
                e.currentTarget.style.boxShadow =
                  "none";
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor =
                "var(--theme-accent)";
              e.currentTarget.style.boxShadow =
                accentGlow12;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                "var(--theme-border)";
              e.currentTarget.style.boxShadow =
                "none";
            }}
          />

          {reviewError && (
            <p
              className="text-xs mt-3 p-3 rounded-lg font-medium"
              style={{
                color: "var(--theme-accent)",
                backgroundColor: "var(--theme-bg)",
                border: `1px solid ${accentBorder30}`,
                boxShadow: accentGlow6,
              }}
            >
              ⚠️ {reviewError}
            </p>
          )}

          {reviewSuccess && (
            <p
              className="text-xs mt-3 p-3 rounded-lg font-bold"
              style={{
                color: "var(--theme-accent)",
                backgroundColor: "var(--theme-bg)",
                border: `1px solid ${accentBorder30}`,
                boxShadow: accentGlow6,
              }}
            >
              ✓ {reviewSuccess}
            </p>
          )}

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p
              className="text-[11px] font-medium"
              style={{
                color: "var(--theme-muted-dark)",
              }}
            >
              Your review will be checked to ensure it is authentic.
            </p>

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="font-extrabold text-sm px-8 py-3 rounded-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor:
                  "var(--theme-accent)",
                color:
                  "var(--theme-button-text)",
                boxShadow: buttonShadow,
              }}
              onMouseEnter={(e) => {
                if (!reviewSubmitting) {
                  e.currentTarget.style.backgroundColor =
                    "var(--theme-accent-hover)";
                  e.currentTarget.style.boxShadow =
                    buttonHoverShadow;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--theme-accent)";
                e.currentTarget.style.boxShadow =
                  buttonShadow;
              }}
            >
              {reviewSubmitting
                ? "Posting..."
                : user
                ? "Submit Review"
                : "Login to Review"}
            </button>
          </div>
        </form>
      ) : (
        <div
          className="rounded-xl p-5 sm:p-6 text-center"
          style={{
            backgroundColor: "var(--theme-surface)",
            border: "1px solid var(--theme-border)",
            boxShadow: cardShadow,
          }}
        >
          <div
            className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: "var(--theme-bg)",
              border: `1px solid ${accentBorder30}`,
              color: "var(--theme-accent)",
            }}
          >
            <FaShieldHalved />
          </div>

          <p
            className="font-extrabold text-sm sm:text-base"
            style={{
              color: "var(--theme-text)",
            }}
          >
            Review Available After Your Stay
          </p>

          <p
            className="text-xs sm:text-sm mt-2 font-medium"
            style={{
              color: "var(--theme-muted-light)",
            }}
          >
            You can submit your review after your booked
            stay has been completed.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyReview;