import { useEffect, useState } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function POReviews() {
    const { ownerReview: reviews = [] } = useAuth();
    const [ratingFilter, setRatingFilter] = useState("");
    const [ratingFilterOpen, setRatingFilterOpen] = useState(false);

    function handleRatingFilter(event) {
        setRatingFilter(event.target.value);
    }

    useEffect(() => {
        function handleOutsideClick(event) {
            if (!event.target.closest("[data-rating-filter]")) {
                setRatingFilterOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const filteredReviews = reviews.filter((item) => {
        return (
            ratingFilter === "" ||
            Number(item.rating) === Number(ratingFilter)
        );
    });

    const totalReviews = reviews.length;

    const averageRating =
        totalReviews === 0
            ? "0.0"
            : (
                reviews.reduce(
                    (sum, item) => sum + Number(item.rating || 0),
                    0
                ) / totalReviews
            ).toFixed(1);

    const fiveStarReviews = reviews.filter(
        (item) => Number(item.rating) === 5
    ).length;

    function getReviewId(item, index) {
        return item.id || item._id || index;
    }

    function getTenantName(item) {
        return (
            item.tenantName ||
            item.tenant?.fullname ||
            item.tenant?.name ||
            "Tenant"
        );
    }

    function getPropertyName(item) {
        return (
            item.propertyName ||
            item.property?.title ||
            item.property?.name ||
            "Property"
        );
    }

    function getReviewDate(item) {
        if (item.date || item.createdAt) {
            const dateStr = item.date || item.createdAt;

            return new Date(dateStr).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        }

        return "Date not available";
    }

    const cardBase =
        "bg-[#050505] rounded-2xl shadow-[0_10px_32px_rgba(0,0,0,0.75)] border border-[#c9a45c]/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c]/70 hover:bg-[#050505] hover:shadow-[0_14px_38px_rgba(201,164,92,0.26)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)]";

    return (
        <div className="w-full text-[#f5efe3]">

            <div className="mb-6 sm:mb-8">
                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)]">
                Reviews
              </h1>

              <p className="text-[var(--theme-muted-dark)] mt-2 text-sm sm:text-base leading-relaxed">
                See what tenants are saying about your properties
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-5 mb-6 sm:mb-8">
                <div
                    className={`${cardBase} p-2.5 sm:p-6 flex items-center gap-2 sm:gap-5 min-w-0 hover:border-[#c9a45c]/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(201,164,92,0.18)]`}
>
                    <div className="w-9 h-9 sm:w-16 sm:h-16 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/30 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(201,164,92,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#c9a45c]/15 hover:shadow-[0_0_28px_rgba(201,164,92,0.38)]">
                        <FaStar className="text-[#c9a45c] text-sm sm:text-2xl drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-[8px] sm:text-sm text-[#9f988d] font-medium leading-tight">
                            Average Rating
                        </p>

                        <h2 className="text-sm sm:text-2xl font-extrabold text-[#f5efe3] mt-0.5 sm:mt-1">
                            {averageRating}{" "}
                            <span className="text-lg text-[#777066] font-semibold">
                                / 5
                            </span>
                        </h2>
                    </div>
                </div>

                <div
                    className={`${cardBase} p-2.5 sm:p-6 flex items-center gap-2 sm:gap-5 min-w-0 hover:border-[#c9a45c]/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(201,164,92,0.18)]`}
                >
                    <div className="w-9 h-9 sm:w-16 sm:h-16 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/30 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(201,164,92,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#c9a45c]/15 hover:shadow-[0_0_28px_rgba(201,164,92,0.38)]">
                        <FaUserCircle className="text-[#c9a45c] text-sm sm:text-2xl drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-[8px] sm:text-sm text-[#9f988d] font-medium leading-tight">
                            Total Reviews
                        </p>

                        <h2 className="text-sm sm:text-2xl font-extrabold text-[#f5efe3] mt-0.5 sm:mt-1">
                            {totalReviews}
                        </h2>
                    </div>
                </div>

                <div
                    className={`${cardBase} p-2.5 sm:p-6 flex items-center gap-2 sm:gap-5 min-w-0 hover:border-[#c9a45c]/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(201,164,92,0.18)]`}
                >
                    <div className="w-9 h-9 sm:w-16 sm:h-16 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/30 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(201,164,92,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#c9a45c]/15 hover:shadow-[0_0_28px_rgba(201,164,92,0.38)]">
                        <FaStar className="text-[#c9a45c] text-sm sm:text-2xl drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-[8px] sm:text-sm text-[#9f988d] font-medium leading-tight">
                            5 Star Reviews
                        </p>

                        <h2 className="text-sm sm:text-2xl font-extrabold text-[#f5efe3] mt-0.5 sm:mt-1">
                            {fiveStarReviews}
                        </h2>
                    </div>
                </div>

            </div>

            <div
                className={`${cardBase} p-4 sm:p-5 mb-6 sm:mb-8`}
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">

                    <label className="font-bold text-[#bdb6aa] text-sm shrink-0">
                        Filter by Rating
                    </label>

                    <div data-rating-filter className="relative w-full sm:w-auto min-w-32 sm:min-w-40">

                        <button
                            type="button"
                            onClick={() =>
                                setRatingFilterOpen((prev) => !prev)
                            }
                            className={`w-full border rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 outline-none text-xs sm:text-sm font-medium bg-[#050505] flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 cursor-pointer hover:border-[#c9a45c]/55 hover:shadow-[0_8px_24px_rgba(201,164,92,0.16)] focus:shadow-[0_0_24px_rgba(201,164,92,0.26)] ${
                                ratingFilterOpen
                                    ? "border-[#c9a45c] ring-2 ring-[#c9a45c]/20"
                                    : "border-[#3a3328]"
                            }`}
                        >
                            <span className="text-[#c9a45c]">
                                {ratingFilter === ""
                                    ? "All Ratings"
                                    : `${ratingFilter} Stars`}
                            </span>

                            <span
                                className={`text-[#c9a45c] text-lg leading-none transition-transform duration-200 ${
                                    ratingFilterOpen
                                        ? "rotate-180"
                                        : ""
                                }`}
                            >
                                ⌄
                            </span>
                        </button>

                        {ratingFilterOpen && (
                            <div className="absolute z-50 w-full mt-1.5 sm:mt-2 bg-[#050505] border border-[#3a3328] rounded-lg sm:rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.75)]">

                                {[
                                    {
                                        value: "",
                                        label: "All Ratings",
                                    },
                                    {
                                        value: "5",
                                        label: "5 Stars",
                                    },
                                    {
                                        value: "4",
                                        label: "4 Stars",
                                    },
                                    {
                                        value: "3",
                                        label: "3 Stars",
                                    },
                                    {
                                        value: "2",
                                        label: "2 Stars",
                                    },
                                    {
                                        value: "1",
                                        label: "1 Star",
                                    },
                                ].map((option) => (
                                    <button
                                        key={option.value || "all"}
                                        type="button"
                                        onClick={() => {
                                            setRatingFilter(
                                                option.value
                                            );
                                            setRatingFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                                            ratingFilter ===
                                            option.value
                                                ? "bg-[#c9a45c] text-[#171717]"
                                                : "text-[#f5efe3] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c]"
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

            {reviews.length === 0 ? (
                <div
                    className={`${cardBase} flex flex-col items-center justify-center py-16 sm:py-20 px-5 text-center`}
                >
                    <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
                        <FaStar className="text-[#c9a45c] text-2xl" />
                    </div>

                    <h3 className="font-extrabold text-[#f5efe3] mt-4 text-lg">
                        No Reviews Yet
                    </h3>

                    <p className="text-sm text-[#9f988d] mt-2 max-w-sm leading-relaxed font-medium">
                        Once tenants complete their stay, their reviews and
                        ratings will appear here.
                    </p>
                </div>
            ) : filteredReviews.length === 0 ? (
                <div
                    className={`${cardBase} flex flex-col items-center justify-center py-16 sm:py-20 px-5 text-center`}
                >
                    <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
                        <FaStar className="text-[#c9a45c] text-2xl" />
                    </div>

                    <h3 className="font-extrabold text-[#f5efe3] mt-4 text-lg">
                        No Reviews Match This Filter
                    </h3>

                    <p className="text-sm text-[#9f988d] mt-2 max-w-sm font-medium">
                        Try selecting a different rating filter.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 sm:space-y-5">

                    {filteredReviews.map((item, index) => {
                        const reviewId = getReviewId(item, index);
                        const rating = Number(item.rating || 0);

                        return (
                            <div
                                key={reviewId}
                                className={`${cardBase} p-5 sm:p-6 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(201,164,92,0.18)] hover:border-[#c9a45c]/40 hover:bg-[#050505]`}
                            >

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                                        <div className="w-12 h-12 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/30 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(201,164,92,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#c9a45c]/15 hover:shadow-[0_0_28px_rgba(201,164,92,0.38)]">
                                            <FaUserCircle className="text-3xl text-[#c9a45c] drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300" />
                                        </div>

                                        <div className="min-w-0">

                                            <h3 className="font-bold text-[#f5efe3] truncate text-base">
                                                {getTenantName(item)}
                                            </h3>

                                            <p className="text-sm text-[#9f988d] truncate mt-0.5 font-medium">
                                                {getPropertyName(item)}
                                            </p>

                                        </div>
                                    </div>

                                    <span className="text-xs text-[#9f988d] sm:shrink-0 font-semibold bg-[#050505] px-3 py-1.5 rounded-lg border border-[#3a3328] shadow-[0_5px_16px_rgba(0,0,0,0.45)]">
                                        {getReviewDate(item)}
                                    </span>

                                </div>

                                <div className="flex items-center gap-1 mt-4 bg-[#c9a45c]/10 w-fit px-3 py-1.5 rounded-lg border border-[#c9a45c]/20">

                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={`text-lg drop-shadow-[0_0_5px_rgba(201,164,92,0.30)] ${
                                                star <= rating
                                                    ? "text-[#c9a45c]"
                                                    : "text-[#4a453d]"
                                            }`}
                                        />
                                    ))}

                                    <span className="text-xs font-bold text-[#c9a45c] ml-1">
                                        {rating}.0
                                    </span>

                                </div>

                                <div className="bg-[#050505] border border-[#3a3328] rounded-xl p-4 mt-4 transition-all duration-300 hover:border-[#c9a45c]/50 hover:bg-[#050505] hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]">
                                    <p className="text-sm sm:text-base text-[#bdb6aa] leading-relaxed font-medium">
                                        "{item.text ||
                                            item.comment ||
                                            "No review text available."}"
                                    </p>
                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default POReviews;