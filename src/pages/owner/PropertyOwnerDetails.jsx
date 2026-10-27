import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPropertyById } from "../../api/PropertyApi";
import {
  FaArrowLeft,
  FaHome,
  FaMapMarkerAlt,
  FaBuilding,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaVideo,
} from "react-icons/fa";

function PropertyOwnerDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [activeMedia, setActiveMedia] = useState("image");

  useEffect(() => {
    let isMounted = true;

    const fetchProperty = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await getPropertyById(id);
        const fetchedProperty = data?.property;

        if (!isMounted) return;

        if (!fetchedProperty) {
          setProperty(null);
          setError("Property not found.");
          return;
        }

        const ownerId = fetchedProperty.owner?._id || fetchedProperty.owner;
        if (user?._id && ownerId && String(ownerId) !== String(user._id)) {
          setProperty(null);
          setError("You are not allowed to view this property.");
          return;
        }

        setProperty(fetchedProperty);
        setActiveImage(0);
      } catch (err) {
        if (!isMounted) return;
        setProperty(null);
        setError(
          err.response?.data?.message ||
            "Failed to load property. Please try again."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    } else {
      setError("Property not found.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id, user?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3a3328] border-t-[#c9a45c] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#9f988d] mt-4 font-medium">
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-5 font-sans">
        <div className="bg-[#050505] rounded-2xl shadow-[0_12px_38px_rgba(0,0,0,0.78)] border border-[#3a3328] p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center mx-auto">
            <FaTimesCircle className="drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] text-[#c9a45c] text-2xl" />
          </div>
          <h2 className="text-xl font-extrabold text-[#f5efe3] mt-4 tracking-tight">
            Property Not Found
          </h2>
          <p className="text-[#9f988d] mt-2 font-medium">
            {error || "This property could not be found."}
          </p>
          <Link
            to="/myproperties"
            className="inline-flex items-center gap-2 mt-6 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-5 py-3 rounded-xl font-bold shadow-lg shadow-[#c9a45c]/20 hover:scale-[1.02] transition-all active:scale-95"
          >
            <FaArrowLeft />
            Back to My Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(property.images) ? property.images : [];
  const title = property.title || "Unnamed Property";
  const description = property.description || "No description available.";
  const city = property.address?.city || "-";
  const area = property.address?.area || "-";
  const street = property.address?.street || "-";
  const monthlyRent = Number(property.pricing?.monthlyRent) || 0;
  const dailyRent = Number(property.pricing?.dailyRent) || 0;
  const acMonthlyCharge = Number(property.pricing?.acMonthlyCharge) || 0;
  const acDailyCharge = Number(property.pricing?.acDailyCharge) || 0;
  const totalRooms = Number(property.totalRooms) || 0;
  const availableRooms = property.availableRooms ?? 0;
  const maxGuests = Number(property.maxGuests) || 0;

  const status =
    property.status === "published"
      ? "Active"
      : property.status === "pending"
      ? "Pending Approval"
      : property.status || "Unknown";

  const facilities = Array.isArray(property.facilities)
    ? property.facilities
    : [];
  const videos = Array.isArray(property.video)
    ? property.video
    : property.video
    ? [property.video]
    : [];

  // ✅ Rooms list (Room collection se populate hui)
  const rooms = Array.isArray(property.rooms) ? property.rooms : [];

  const getStatusStyle = (status) => {
    if (status === "Active") {
      return "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20";
    }
    if (status === "Pending Approval") {
      return "bg-[#c9a45c]/10 text-[#dfbf7b] border border-[#c9a45c]/25";
    }
    if (status === "rejected") {
      return "bg-red-500/10 text-[#c9a45c] border border-red-500/20";
    }
    return "bg-[#050505] text-[#9f988d] border border-[#3a3328]";
  };

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans text-[#f5efe3]">
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <Link
                to="/myproperties"
                className="inline-flex items-center gap-1.5 text-[#c9a45c] text-[11px] sm:text-sm font-bold hover:text-[#dfbf7b] hover:underline transition-colors"
              >
                <FaArrowLeft />
                Back to My Properties
              </Link>
              <h1 className="text-lg sm:text-3xl font-extrabold text-[#f5efe3] mt-2 sm:mt-3 tracking-tight">
                Property{" "}
                <span className="drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] text-[#c9a45c]">
                  Details
                </span>
              </h1>

              <p className="text-[#9f988d] text-[11px] sm:text-base mt-1 sm:mt-2 font-medium leading-tight">
                View complete information about your property.
              </p>
            </div>

            <Link
              to={`/manageproperty/${property._id}`}
              className="inline-flex items-center justify-center gap-2 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-bold shadow-lg shadow-[#c9a45c]/20 hover:scale-[1.02] transition-all active:scale-95"
            >
              Manage Property
            </Link>
          </div>

          <div className="bg-[#050505] rounded-2xl shadow-[0_12px_38px_rgba(0,0,0,0.78)] border border-[#c9a45c]/30 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/70 hover:bg-[#050505] hover:shadow-[0_16px_44px_rgba(201,164,92,0.24)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="bg-[#050505] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#3a3328]">
                <div className="h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#050505] flex items-center justify-center border border-[#c9a45c]/30 shadow-[0_8px_28px_rgba(0,0,0,0.65)] transition-all duration-300 hover:border-[#c9a45c]/65 hover:shadow-[0_12px_32px_rgba(201,164,92,0.22)]">
                  {activeMedia === "video" && videos.length > 0 ? (
                    <video
                      src={videos[0]}
                      controls
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : images.length > 0 ? (
                    <img
                      src={images[activeImage]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaHome className="drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] text-[#c9a45c] text-7xl" />
                  )}
                </div>

                {(images.length > 1 || videos.length > 0) && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#050505] [&::-webkit-scrollbar-thumb]:bg-[#3a3328] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#c9a45c]">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setActiveImage(index);
                          setActiveMedia("image");
                        }}
                        className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activeMedia === "image" && activeImage === index
                            ? "border-[#c9a45c] shadow-lg shadow-[#c9a45c]/20"
                            : "border-[#3a3328] hover:border-[#c9a45c]/70 hover:shadow-[0_0_18px_rgba(201,164,92,0.20)]"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}

                    {videos.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveMedia("video")}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-[#0b0b0b] flex items-center justify-center ${
                          activeMedia === "video"
                            ? "border-[#c9a45c] shadow-lg shadow-[#c9a45c]/20"
                            : "border-[#3a3328] hover:border-[#c9a45c]/70 hover:shadow-[0_0_18px_rgba(201,164,92,0.20)]"
                        }`}
                      >
                        <FaVideo className="text-[#c9a45c] text-xl drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]" />
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#f5efe3]">
                          VIDEO
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-7">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-3xl font-extrabold text-[#f5efe3] tracking-tight">
                      {title}
                    </h2>

                    <div className="flex items-start gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-[#9f988d] text-[11px] sm:text-base">
                      <FaMapMarkerAlt className="drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] text-[#c9a45c] mt-1 shrink-0" />
                      <span className="font-medium">
                        {area !== "-" ? `${area}, ` : ""}
                        {city}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${getStatusStyle(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="mt-4 sm:mt-6">
                  <p className="text-[9px] sm:text-sm text-[#777066] font-bold uppercase tracking-wider">
                    Monthly Rent
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#c9a45c] mt-1">
                    PKR {monthlyRent.toLocaleString()}
                    <span className="text-[10px] sm:text-sm text-[#777066] font-medium">
                      {" "}
                      / month
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mt-4 sm:mt-7">
                  <div className="bg-[#050505] border border-[#c9a45c]/30 rounded-lg sm:rounded-xl p-2 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#050505] hover:border-[#c9a45c]/60 hover:shadow-[0_8px_24px_rgba(201,164,92,0.20)]">
                    <FaBuilding className="text-[#c9a45c] text-xs sm:text-base drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]" />
                    <p className="text-[8px] sm:text-xs text-[#777066] mt-1 sm:mt-2 font-bold uppercase tracking-wide leading-tight">
                      Total Rooms
                    </p>
                    <p className="font-extrabold text-[#f5efe3] text-xs sm:text-base mt-0.5 sm:mt-1">
                      {totalRooms}
                    </p>
                  </div>

                  <div className="bg-[#050505] border border-[#c9a45c]/30 rounded-lg sm:rounded-xl p-2 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#050505] hover:border-[#c9a45c]/60 hover:shadow-[0_8px_24px_rgba(201,164,92,0.20)]">
                    <FaUsers className="text-[#c9a45c] text-xs sm:text-base drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]" />
                    <p className="text-[8px] sm:text-xs text-[#777066] mt-1 sm:mt-2 font-bold uppercase tracking-wide leading-tight">
                      Available
                    </p>
                    <p className="font-extrabold text-[#f5efe3] text-xs sm:text-base mt-0.5 sm:mt-1">
                      {availableRooms}
                    </p>
                  </div>

                  <div className="bg-[#050505] border border-[#c9a45c]/30 rounded-lg sm:rounded-xl p-2 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#050505] hover:border-[#c9a45c]/60 hover:shadow-[0_8px_24px_rgba(201,164,92,0.20)]">
                    <FaCheckCircle className="text-[#c9a45c] text-xs sm:text-base drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]" />
                    <p className="text-[8px] sm:text-xs text-[#777066] mt-1 sm:mt-2 font-bold uppercase tracking-wide leading-tight">
                      Max Guests
                    </p>
                    <p className="font-extrabold text-[#f5efe3] text-xs sm:text-base mt-0.5 sm:mt-1">
                      {maxGuests}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-7 border-t border-[#3a3328]">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#050505] flex items-center justify-center border border-[#c9a45c]/30 shadow-[0_0_16px_rgba(201,164,92,0.18)]">
                  <FaHome className="drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] text-[#c9a45c]" />
                </div>
                <h3 className="text-base sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                  Description
                </h3>
              </div>

              <p className="text-[#bdb6aa] text-[11px] sm:text-base leading-5 sm:leading-7 font-medium">
                {description}
              </p>
            </div>

            {/* ✅ ROOMS LIST */}
            {rooms.length > 0 && (
              <div className="p-5 sm:p-7 border-t border-[#3a3328]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#050505] flex items-center justify-center border border-[#c9a45c]/30 shadow-[0_0_16px_rgba(201,164,92,0.18)]">
                    <FaBuilding className="drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] text-[#c9a45c]" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                    Rooms ({rooms.length})
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {rooms.map((room) => {
                    const isAC = room.acType === "AC";
                    const roomMonthly =
                      monthlyRent + (isAC ? acMonthlyCharge : 0);

                    return (
                      <div
                        key={room._id || room.roomNumber}
                        className="bg-[#050505] border border-[#c9a45c]/30 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-center transition-all hover:border-[#c9a45c]/60 hover:shadow-[0_8px_24px_rgba(201,164,92,0.18)]"
                      >
                        <p className="text-[9px] sm:text-xs text-[#777066] font-bold uppercase">
                          Room #{room.roomNumber}
                        </p>
                        <p className="text-[11px] sm:text-sm font-extrabold text-[#c9a45c] mt-1">
                          {room.category} • {room.acType}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[#9f988d] font-medium mt-0.5">
                          PKR {roomMonthly.toLocaleString()}/mo
                        </p>
                        <p
                          className={`text-[9px] sm:text-[10px] font-bold mt-1 ${
                            room.status === "available"
                              ? "text-green-500"
                              : room.status === "booked"
                              ? "text-red-400"
                              : "text-[#9f988d]"
                          }`}
                        >
                          {room.status?.toUpperCase()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-5 sm:p-7 border-t border-[#3a3328]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#050505] flex items-center justify-center border border-[#c9a45c]/30 shadow-[0_0_16px_rgba(201,164,92,0.18)]">
                  <FaBuilding className="drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] text-[#c9a45c]" />
                </div>
                <h3 className="text-sm sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                  Property Information
                </h3>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                <InfoItem
                  label="Property Type"
                  value={property.propertyType || "-"}
                />
                <InfoItem label="Max Guests" value={maxGuests} />
                <InfoItem
                  label="Gender Preference"
                  value={property.genderPreference || "-"}
                />
                <InfoItem
                  label="Furnishing"
                  value={property.furnishing || "-"}
                />
                <InfoItem label="Total Rooms" value={totalRooms} />
                <InfoItem label="Available Rooms" value={availableRooms} />
                <InfoItem label="Street Address" value={street} />
                <InfoItem label="Area" value={area} />
                <InfoItem label="City" value={city} />
                <InfoItem
                  label="Monthly Rent"
                  value={`PKR ${monthlyRent.toLocaleString()}`}
                />
                <InfoItem
                  label="Daily Rent"
                  value={dailyRent ? `PKR ${dailyRent.toLocaleString()}` : "-"}
                />
                <InfoItem
                  label="Availability"
                  value={property.availability || "-"}
                />
              </div>
            </div>

            <div className="p-5 sm:p-7 border-t border-[#3a3328]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#050505] flex items-center justify-center border border-[#c9a45c]/30 shadow-[0_0_16px_rgba(201,164,92,0.18)]">
                  <FaCheckCircle className="drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] text-[#c9a45c]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#f5efe3] tracking-tight">
                  Facilities
                </h3>
              </div>

              {facilities.length > 0 ? (
                <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-3">
                  {facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/20 px-1.5 sm:px-4 py-2 rounded-md sm:rounded-lg text-[9px] sm:text-sm font-bold text-center leading-tight min-w-0"
                    >
                      <FaCheckCircle />
                      {facility}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[#9f988d] text-sm font-medium">
                  No facilities added.
                </p>
              )}
            </div>

            <div className="p-5 sm:p-7 border-t border-[#3a3328]">
              <div className="rounded-lg sm:rounded-2xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 p-2 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#050505] hover:border-[#c9a45c]/60 hover:shadow-[0_10px_28px_rgba(201,164,92,0.22)]">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#050505] flex items-center justify-center border border-[#c9a45c]/30 shadow-[0_0_16px_rgba(201,164,92,0.16)]">
                    <FaImage className="drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] text-[#c9a45c] text-xl" />
                  </div>
                  <div>
                    <p className="font-extrabold text-[#f5efe3] text-[10px] sm:text-base leading-tight">
                      Property Photos
                    </p>
                    <p className="text-[8px] sm:text-sm text-[#9f988d] mt-0.5 sm:mt-1 font-medium leading-tight">
                      {images.length} photo{images.length !== 1 ? "s" : ""}{" "}
                      uploaded
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-[#050505] border border-[#3a3328] rounded-lg sm:rounded-xl p-2 sm:p-4 min-w-0 transition-all duration-200 hover:border-[#c9a45c]/30 hover:bg-[#050505]">
      <p className="text-[8px] sm:text-xs text-[#777066] font-bold uppercase tracking-tight sm:tracking-wider leading-tight">
        {label}
      </p>
      <p className="font-bold text-[#f5efe3] text-[10px] sm:text-base mt-1 sm:mt-1.5 break-words leading-tight">
        {value}
      </p>
    </div>
  );
}

export default PropertyOwnerDetails;