import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { createBooking } from "../../api/bookingApi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  FaWifi,
  FaTv,
  FaSquareParking,
  FaSnowflake,
  FaDoorClosed,
  FaKitchenSet,
  FaUtensils,
  FaUsers,
  FaShieldHalved,
} from "react-icons/fa6";
import { LuRefrigerator } from "react-icons/lu";
import { MdBalcony, MdOutlineSmokeFree } from "react-icons/md";

import PropertyHeader from "../../components/PropertyHeader";
import PropertyGallery from "../../components/PropertyGallery";
import ReservationCard from "../../components/ReservationCard";
import HostInfo from "../../components/HostInfo";
import HouseRules from "../../components/HouseRules";
import PropertyReview from "../../components/PropertyReview";
import BookingCard from "../../components/BookingCard";

const SERVER_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const resolveImageUrl = (img) => {
  if (!img)
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
  if (img.startsWith("http")) return img;
  return `${SERVER_ORIGIN}${img}`;
};

const getFacilityIcon = (facility) => {
  const name = String(facility || "").toLowerCase();
  const iconClass = "text-xl text-[var(--theme-accent)]";

  if (name.includes("wifi")) return <FaWifi className={iconClass} />;
  if (name.includes("meal")) return <FaUtensils className={iconClass} />;
  if (name.includes("security")) return <FaShieldHalved className={iconClass} />;
  if (name.includes("tv")) return <FaTv className={iconClass} />;
  if (name.includes("parking")) return <FaSquareParking className={iconClass} />;
  if (name.includes("ac")) return <FaSnowflake className={iconClass} />;
  if (name.includes("kitchen")) return <FaKitchenSet className={iconClass} />;
  if (name.includes("fridge")) return <LuRefrigerator className={iconClass} />;
  if (name.includes("balcony")) return <MdBalcony className={iconClass} />;
  return <FaDoorClosed className={iconClass} />;
};

function PropertyDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const scrollToDestination = () => {
      const hash = window.location.hash;

      if (hash) {
        const target = document.getElementById(hash.replace("#", ""));

        if (target) {
          window.scrollTo(
            0,
            target.getBoundingClientRect().top + window.scrollY
          );
          return;
        }
      }

      window.scrollTo(0, 0);
    };

    scrollToDestination();

    const frame = requestAnimationFrame(() => {
      scrollToDestination();
      setTimeout(scrollToDestination, 100);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [id]);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBookingCard, setShowBookingCard] = useState(false);

  const [checkInDate, setCheckInDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });

  const [guestsCount, setGuestsCount] = useState("1");

  const [selectedRooms, setSelectedRooms] = useState([]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [highlightReservation, setHighlightReservation] = useState(false);
  const reservationRef = useRef(null);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const roomFilterParam = searchParams.get("room") || "";
  const acFilterParam = searchParams.get("ac") || "";

  const roomFilterList = roomFilterParam
    ? roomFilterParam.split(",").filter(Boolean)
    : [];

  const acFilterList = acFilterParam
    ? acFilterParam.split(",").filter(Boolean)
    : [];

  const hasFilter = roomFilterList.length > 0 || acFilterList.length > 0;

  useEffect(() => {
    let cancelled = false;

    async function fetchProperty() {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/properties/${id}`);
        if (!cancelled) {
          setProperty(res.data?.property || res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || "Could not load property."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) fetchProperty();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      setReviewsLoading(true);
      try {
        const res = await axiosClient.get(`/reviews/${id}`);
        if (!cancelled) setReviews(res.data?.reviews || []);
      } catch (err) {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    }

    if (id) fetchReviews();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const monthlyRent = Number(
    property?.pricing?.monthlyRent ?? property?.price ?? 0
  );

  const dailyRent = Number(
    property?.pricing?.dailyRent ?? Math.round(monthlyRent / 30)
  );

  const maxGuests = useMemo(() => {
    if (!selectedRooms || selectedRooms.length === 0) {
      return property?.maxGuests || 1;
    }

    const totalCapacity = selectedRooms.reduce((sum, room) => {
      return sum + Number(room.maxGuestsPerRoom || 1);
    }, 0);

    return totalCapacity > 0 ? totalCapacity : property?.maxGuests || 1;
  }, [selectedRooms, property?.maxGuests]);

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    const diff =
      new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [checkInDate, checkOutDate]);
  const grandTotal = useMemo(() => {
    const safeGuests = Number(guestsCount) || 1;
    if (!property) return 0;

    if (selectedRooms.length > 0) {
      const acDailyCharge = Number(property?.pricing?.acDailyCharge || 0);

      const perRoomSum = selectedRooms.reduce((sum, room) => {
        const roomRate =
          dailyRent + (room.acType === "AC" ? acDailyCharge : 0);
        return sum + roomRate * nights;
      }, 0);

      return perRoomSum;
    }

    return dailyRent * nights * safeGuests;
  }, [property, nights, guestsCount, dailyRent, selectedRooms]);

  const roomTypeOptions = useMemo(() => {
    if (!property) return [];
    let options = [];

    if (Array.isArray(property.rooms) && property.rooms.length > 0) {
      const map = new Map();

      property.rooms.forEach((r) => {
        const key = `${r.acType}|${r.category}`;
        if (!map.has(key)) {
          map.set(key, {
            acType: r.acType,
            category: r.category,
            maxGuestsPerRoom: r.maxGuestsPerRoom || 1,
            available: 0,
            total: 0,
          });
        }
        const entry = map.get(key);
        entry.total += 1;
        if (r.status === "available") entry.available += 1;
      });

      options = Array.from(map.values());
    } else if (
      Array.isArray(property.roomTypes) &&
      property.roomTypes.length > 0
    ) {
      options = property.roomTypes.map((rt) => ({
        acType: rt.acType,
        category: rt.category,
        maxGuestsPerRoom: rt.maxGuestsPerRoom || 1,
        available: rt.availableRooms || 0,
        total: rt.totalRooms || 0,
      }));
    }

    if (hasFilter) {
      options = options.filter((o) => {
        const roomMatch =
          roomFilterList.length === 0 || roomFilterList.includes(o.category);
        const acMatch =
          acFilterList.length === 0 || acFilterList.includes(o.acType);
        return roomMatch && acMatch;
      });
    }

    return options;
  }, [property, hasFilter, roomFilterList, acFilterList]);

  function toggleRoomFilter(type) {
    const newList = roomFilterList.includes(type)
      ? roomFilterList.filter((t) => t !== type)
      : [...roomFilterList, type];

    const newParams = new URLSearchParams(searchParams);
    if (newList.length > 0) {
      newParams.set("room", newList.join(","));
    } else {
      newParams.delete("room");
    }
    setSearchParams(newParams);
  }

  function toggleAcFilter(type) {
    const newList = acFilterList.includes(type)
      ? acFilterList.filter((t) => t !== type)
      : [...acFilterList, type];

    const newParams = new URLSearchParams(searchParams);
    if (newList.length > 0) {
      newParams.set("ac", newList.join(","));
    } else {
      newParams.delete("ac");
    }
    setSearchParams(newParams);
  }

  function clearFilters() {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("room");
    newParams.delete("ac");
    setSearchParams(newParams);
  }

  function handleReserveFromGallery(imageUrl, facilities, room) {
    if (!selectedImages.includes(imageUrl)) {
      setSelectedImages((prev) => [...prev, imageUrl]);

      if (room) {
        setSelectedRooms((prev) => [
          ...prev,
          { ...room, imageUrl },
        ]);
      }
    }

    setSelectedFacilities((prev) => {
      const merged = [...prev];
      (facilities || []).forEach((f) => {
        if (!merged.includes(f)) merged.push(f);
      });
      return merged;
    });

    if (reservationRef.current) {
      reservationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setHighlightReservation(true);
      setTimeout(() => setHighlightReservation(false), 2500);
    }
  }

  function removeSelectedImage(imageUrl) {
    setSelectedImages((prev) => prev.filter((url) => url !== imageUrl));
    setSelectedRooms((prev) =>
      prev.filter((room) => room.imageUrl !== imageUrl)
    );
  }

  function handleCancelSelection() {
    setSelectedRooms([]);
    setSelectedImages([]);
    setSelectedFacilities([]);
    setGuestsCount("1");   
  }

  async function handleSubmitReview(e) {
    e.preventDefault();

    if (!user) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/property/${id}`,
            hash: "#reviews",
          },
        },
      });
      return;
    }

    setReviewSubmitting(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      await axiosClient.post(`/reviews/${id}`, {
        rating: myRating,
        comment: myComment,
      });

      setReviewSuccess("Review submitted successfully!");
      setMyComment("");

      const reviewsRes = await axiosClient.get(`/reviews/${id}`);
      setReviews(reviewsRes.data?.reviews || []);
    } catch (err) {
      setReviewError(
        err?.response?.data?.message || "Failed to submit review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Admin Action: Remove this review?")) return;

    try {
      await axiosClient.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      alert("Failed to delete review.");
    }
  }

  function handleBookNow() {
    if (!user) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/property/${id}`,
            hash: "#reserve",
          },
        },
      });
      return;
    }

    if (selectedImages.length === 0) {
      alert("Please select at least one room from the gallery first.");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if(!checkInDate || checkOutDate <today){
      alert("Please choose a valid check-in date (today or future).");
      return;
    }
    if(!checkOutDate || checkOutDate <= checkInDate){
      alert("check-out date must be after check-in date.");
      return;
    }
    setShowBookingCard(true);
  }
  async function handleConfirmBooking() {
    setBookingLoading(true);
    setBookingError("");

    try {
      const today = new Date().toISOString().split("T")[0];
      if(checkInDate < today){
        setBookingError("check-in date cannot be in the past.");
        setBookingLoading(false);
        return;
      }
      if(checkOutDate <= checkInDate){
        setBookingError("check-out date must be after check-in date.");
        setBookingLoading(false);
        return;
      }
      await createBooking({
        propertyId: property._id,
        checkInDate,
        checkOutDate,
        guests: Number(guestsCount) || 1,
        facilities: selectedFacilities,
        rooms: selectedRooms.map((r) => ({
          acType: r.acType,
          category: r.category,
          maxGuestsPerRoom: Number(r.maxGuestsPerRoom || 1),
        })),
      });

      setBookingSuccess("Booking request placed!");

      setTimeout(() => {
        setShowBookingCard(false);
        navigate("/mybooking");
      }, 1200);
    } catch (err) {
      setBookingError(err?.response?.data?.message || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans transition-colors duration-300 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[var(--theme-border)] border-t-[var(--theme-accent)] rounded-full mx-auto mb-4"></div>
          <p className="text-[var(--theme-muted-dark)] font-medium text-sm">
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="w-full min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans transition-colors duration-300 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="border border-[var(--theme-border)] rounded-xl p-8 bg-[var(--theme-surface)] shadow-[0_0_18px_rgba(0,0,0,0.10)]">
            <p className="text-[var(--theme-accent-hover)] font-bold mb-3 text-sm">
              {error || "Property not found."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="text-xs text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] hover:underline font-bold cursor-pointer"
            >
              ← Back to search
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = (property.images?.length ? property.images : [property.image])
    .filter(Boolean)
    .map(resolveImageUrl);

  const address = property.address || {};
  const city = address.city || property.city || "";

  const locationLabel = [address.street, address.area, city, "Pakistan"]
    .filter(Boolean)
    .join(", ");

  const ratingScore = Number(
    property.averageRating ||
      (reviews.length > 0
        ? (
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0)
  );

  return (
    <div className="w-full min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans transition-colors duration-300 pb-16">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        <PropertyHeader
          property={property}
          city={city}
          locationLabel={locationLabel}
          ratingScore={ratingScore}
          reviewsCount={reviews.length}
        />

        <PropertyGallery
          images={images}
          propertyTitle={property.title}
          ratingScore={ratingScore}
          reviewsCount={reviews.length}
          firstReview={reviews[0]}
          mapQuery={encodeURIComponent(locationLabel)}
          onReserve={handleReserveFromGallery}
          selectedFacilities={property.facilities || []}
          roomTypeOptions={roomTypeOptions}
          propertyRooms={property.rooms || []}
        />

        {hasFilter && (
          <div className="mt-6 p-4 bg-[var(--theme-accent)]/5 border border-[var(--theme-accent)]/30 rounded-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-[var(--theme-accent)]">
                Showing rooms matching your filter:
              </span>

              {["Single", "Shared"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleRoomFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    roomFilterList.includes(type)
                      ? "bg-[var(--theme-accent)] text-[var(--theme-bg)]"
                      : "bg-[var(--theme-surface)] text-[var(--theme-muted-light)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)]/60"
                  }`}
                >
                  {roomFilterList.includes(type) ? "✓ " : ""}
                  {type}
                </button>
              ))}

              {["AC", "Non-AC"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleAcFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    acFilterList.includes(type)
                      ? "bg-[var(--theme-accent)] text-[var(--theme-bg)]"
                      : "bg-[var(--theme-surface)] text-[var(--theme-muted-light)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)]/60"
                  }`}
                >
                  {acFilterList.includes(type) ? "✓ " : ""}
                  {type}
                </button>
              ))}

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] hover:underline font-bold ml-auto cursor-pointer"
              >
                Clear filter
              </button>
            </div>

            {roomTypeOptions.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {roomTypeOptions.map((rt, i) => (
                  <div
                    key={i}
                    className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg px-3 py-2"
                  >
                    <p className="text-[10px] text-[var(--theme-muted-dark)] font-bold uppercase tracking-wider">
                      {rt.acType} {rt.category}
                    </p>
                    <p className="text-sm font-extrabold text-[var(--theme-accent)]">
                      {rt.available} available
                    </p>
                    <p className="text-[10px] text-[var(--theme-muted-light)]">
                      out of {rt.total}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--theme-accent-hover)] font-medium">
                No rooms match your current filter. Try clearing the filter.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-12 mb-16 pt-6 border-t border-[var(--theme-border)]">
          <div>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--theme-text)] mb-4 tracking-tight">
                About this place
              </h2>

              <p className="text-sm text-[var(--theme-muted-light)] leading-relaxed whitespace-pre-line font-medium">
                {property.description}
              </p>
            </div>

            {property.facilities?.length > 0 && (
              <section
                id="amenities"
                className="py-8 border-t border-[var(--theme-border)] scroll-mt-24"
              >
                <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--theme-text)] mb-6 tracking-tight">
                  What this place offers
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.facilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 text-sm text-[var(--theme-muted-light)] bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-xl px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/40 hover:shadow-[0_0_24px_rgba(0,0,0,0.16)]"
                    >
                      <span className="w-8 h-8 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-accent)]/20 flex items-center justify-center shrink-0">
                        {getFacilityIcon(fac)}
                      </span>

                      <span className="font-medium">{fac}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div
            id="reserve"
            ref={reservationRef}
            className={`transition-all duration-500 ${
              highlightReservation
                ? "ring-4 ring-[var(--theme-accent)]/60 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.18)] scale-[1.01]"
                : ""
            }`}
          >
            <ReservationCard
              monthlyRent={monthlyRent}
              dailyRent={dailyRent}
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              guestsCount={guestsCount}
              setGuestsCount={setGuestsCount}
              maxGuests={maxGuests}
              nights={nights}
              grandTotal={grandTotal}
              onBookNow={handleBookNow}
              selectedImages={selectedImages}
              selectedFacilities={selectedFacilities}
              onRemoveImage={removeSelectedImage}
              onCancelSelection={handleCancelSelection}
            />
          </div>
        </div>

        <HostInfo
          owner={property.owner}
          reviewsCount={reviews.length}
          ratingScore={ratingScore}
        />

        <HouseRules genderPreference={property.genderPreference} />

        <PropertyReview
          reviews={reviews}
          reviewsLoading={reviewsLoading}
          user={user}
          onDeleteReview={handleDeleteReview}
          myRating={myRating}
          setMyRating={setMyRating}
          myComment={myComment}
          setMyComment={setMyComment}
          onSubmitReview={handleSubmitReview}
          reviewSubmitting={reviewSubmitting}
          reviewError={reviewError}
          reviewSuccess={reviewSuccess}
        />

        <div
          id="location-section"
          className="pt-6 border-t border-[var(--theme-border)] scroll-mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--theme-text)] mb-2 tracking-tight">
            Property Location
          </h2>

          <p className="text-sm text-[var(--theme-muted-dark)] mb-5 flex items-center gap-2 font-medium">
            {locationLabel}
          </p>

          <div className="h-80 w-full rounded-xl overflow-hidden border border-[var(--theme-border)] shadow-[0_0_18px_rgba(0,0,0,0.10)] bg-[var(--theme-surface)]">
            <iframe
              title="Location Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                locationLabel
              )}&output=embed`}
              className="w-full h-full border-none"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {showBookingCard && (
        <BookingCard
          propertyTitle={property.title}
          selectedImages={selectedImages}
          selectedFacilities={selectedFacilities}
          selectedRooms={selectedRooms}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guestsCount={guestsCount}
          nights={nights}
          grandTotal={grandTotal}
          bookingLoading={bookingLoading}
          bookingError={bookingError}
          bookingSuccess={bookingSuccess}
          onConfirm={handleConfirmBooking}
          onClose={() => setShowBookingCard(false)}
        />
      )}
    </div>
  );
}

export default PropertyDetails;