import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  getPropertyById,
  updatePropertyById,
} from "../../api/PropertyApi";
import {
  FaArrowLeft,
  FaHome,
  FaBuilding,
  FaUsers,
  FaMoneyBillWave,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

function ManageProperty() {
  const { user, deleteOwnerProperty } = useAuth();
  const { theme } = useTheme();
  const { id } = useParams();

  const normalizedTheme = String(theme || "")
    .toLowerCase()
    .replace(/[\\s_-]/g, "");

  const isOffWhiteTheme =
    normalizedTheme === "offwhite" || normalizedTheme === "light";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [showUpdateSuccessPopup, setShowUpdateSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    city: "",
    area: "",
    street: "",
    monthlyRent: "",
    dailyRent: "",
    acMonthlyCharge: "",
    acDailyCharge: "",
  });

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

        const ownerId =
          fetchedProperty.owner?._id || fetchedProperty.owner;

        if (
          user?._id &&
          ownerId &&
          String(ownerId) !== String(user._id)
        ) {
          setProperty(null);
          setError("You are not allowed to edit this property.");
          return;
        }

        setProperty(fetchedProperty);

        // ✅ Ab roomTypes nahi, sirf property-level fields
        setFormData({
          title: fetchedProperty.title || "",
          description: fetchedProperty.description || "",
          propertyType: fetchedProperty.propertyType || "",
          city: fetchedProperty.address?.city || "",
          area: fetchedProperty.address?.area || "",
          street: fetchedProperty.address?.street || "",
          monthlyRent: fetchedProperty.pricing?.monthlyRent ?? "",
          dailyRent: fetchedProperty.pricing?.dailyRent ?? "",
          acMonthlyCharge: fetchedProperty.pricing?.acMonthlyCharge ?? "",
          acDailyCharge: fetchedProperty.pricing?.acDailyCharge ?? "",
        });
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

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!property) return;

    setFormError("");
    setFormSuccess("");

    try {
      setSaving(true);

      // ✅ Sirf property-level fields update — rooms nahi
      const { data } = await updatePropertyById(id, {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        city: formData.city,
        area: formData.area,
        street: formData.street,
        monthlyRent: Number(formData.monthlyRent) || 0,
        dailyRent: Number(formData.dailyRent) || 0,
        acMonthlyCharge: Number(formData.acMonthlyCharge) || 0,
        acDailyCharge: Number(formData.acDailyCharge) || 0,
      });

      setFormSuccess("");

      if (data?.property) {
        setProperty(data.property);
      }

      setShowUpdateSuccessPopup(true);

      setTimeout(() => {
        window.location.href = "/owner/dashboard";
      }, 1500);
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Unable to update property. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!property) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this property? All its rooms will also be deleted."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteOwnerProperty(id);

      navigate("/myproperties");
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Unable to delete property. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  }

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
        <div className={`bg-[#050505] rounded-2xl border border-[#c9a45c]/25 p-8 transition-all duration-300 hover:border-[#c9a45c]/50 text-center max-w-md w-full ${
              isOffWhiteTheme
                ? "shadow-none hover:shadow-none"
                : "shadow-[0_14px_42px_rgba(0,0,0,0.80)] hover:shadow-[0_16px_44px_rgba(201,164,92,0.18)]"
            }`}>
          <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center mx-auto">
            <FaTimes className="text-[#c9a45c] text-2xl" />
          </div>

          <h2 className="text-xl font-extrabold text-[#f5efe3] mt-3 sm:mt-4 tracking-tight">
            Property Not Found
          </h2>

          <p className="text-xs sm:text-sm text-[#9f988d] mt-1.5 sm:mt-2 font-medium">
            {error}
          </p>

          <Link
            to={`/propertyownerdetails/${id}`}
            className="inline-flex items-center gap-2 text-[#c9a45c] text-sm font-bold hover:text-[#dfbf7b] hover:underline transition-colors mt-4"
          >
            <FaArrowLeft />
            Back to My Property
          </Link>
        </div>
      </div>
    );
  }

  const inputBase = `w-full border border-[#3a3328] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-3 sm:pr-4 outline-none text-xs sm:text-sm text-[#f5efe3] bg-[#050505] font-medium transition-all duration-300 placeholder:text-[#777066] ${
    isOffWhiteTheme
      ? "shadow-none hover:shadow-none focus:shadow-none"
      : "shadow-[0_6px_20px_rgba(0,0,0,0.60)] hover:shadow-[0_8px_26px_rgba(201,164,92,0.16)] focus:shadow-[0_0_26px_rgba(201,164,92,0.30)]"
  } hover:border-[#c9a45c]/55 focus:border-[#c9a45c] focus:bg-[#050505] focus:ring-2 focus:ring-[#c9a45c]/20`;

  const labelBase =
    "block text-xs sm:text-sm font-bold text-[#bdb6aa] mb-1.5 sm:mb-2";

  const cardBase = `bg-[#050505] rounded-xl sm:rounded-2xl ${
    isOffWhiteTheme
      ? "shadow-none hover:shadow-none"
      : "shadow-[0_12px_38px_rgba(0,0,0,0.78)] hover:shadow-[0_16px_44px_rgba(201,164,92,0.24)]"
  } border border-[#c9a45c]/25 p-3 sm:p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c]/60 hover:bg-[#050505]`;

  // ✅ Room count aur capacity display
  const totalRooms = property.totalRooms || 0;
  const availableRooms = property.availableRooms || 0;
  const maxGuests = property.maxGuests || 0;
  const roomsList = Array.isArray(property.rooms) ? property.rooms : [];

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans text-[#f5efe3]">
      <main className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-5xl mx-auto">

          <div className="mb-4 sm:mb-6">
            <Link
              to={`/propertyownerdetails/${id}`}
              className="inline-flex items-center gap-2 text-[#c9a45c] text-sm font-bold hover:text-[#dfbf7b] hover:underline transition-colors"
            >
              <FaArrowLeft />
              Back to Property Detail
            </Link>

            <h1 className="text-xl sm:text-3xl font-extrabold text-[#f5efe3] mt-3 sm:mt-4 tracking-tight">
              Manage <span className="text-[#c9a45c]">Property</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#9f988d] mt-1.5 sm:mt-2 font-medium">
              Update or remove your property listing.
            </p>
          </div>

          {/* ✅ INFO CARD — Rooms summary (read-only) */}
          <div className={`${cardBase} mb-4 sm:mb-6`}>
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-[#3a3328]">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#050505] flex items-center justify-center border border-[#c9a45c]/30">
                <FaBuilding className="text-[#c9a45c] text-base sm:text-lg" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#f5efe3]">
                  Rooms Summary
                </h2>
                <p className="text-[10px] sm:text-xs text-[#9f988d] font-medium">
                  Auto-calculated from your rooms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-[#050505] border border-[#c9a45c]/20 rounded-xl p-3 text-center">
                <p className="text-[10px] sm:text-xs text-[#9f988d] font-bold uppercase tracking-wider">
                  Total Rooms
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-[#c9a45c] mt-1">
                  {totalRooms}
                </p>
              </div>

              <div className="bg-[#050505] border border-[#c9a45c]/20 rounded-xl p-3 text-center">
                <p className="text-[10px] sm:text-xs text-[#9f988d] font-bold uppercase tracking-wider">
                  Available
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-[#c9a45c] mt-1">
                  {availableRooms}
                </p>
              </div>

              <div className="bg-[#050505] border border-[#c9a45c]/20 rounded-xl p-3 text-center">
                <p className="text-[10px] sm:text-xs text-[#9f988d] font-bold uppercase tracking-wider">
                  Max Guests
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-[#c9a45c] mt-1">
                  {maxGuests}
                </p>
              </div>
            </div>

            {roomsList.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] sm:text-xs text-[#9f988d] font-bold uppercase tracking-wider mb-2">
                  Room List
                </p>
                <div className="flex flex-wrap gap-2">
                  {roomsList.map((room) => (
                    <span
                      key={room._id || room.roomNumber}
                      className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        room.status === "available"
                          ? "bg-[#c9a45c]/15 text-[#c9a45c] border-[#c9a45c]/30"
                          : room.status === "booked"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-[#3a3328]/30 text-[#9f988d] border-[#3a3328]"
                      }`}
                    >
                      #{room.roomNumber} • {room.category} • {room.acType}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={cardBase}>

              <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-5 border-b border-[#3a3328]">
                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#050505] flex items-center justify-center border border-[#c9a45c]/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-[#c9a45c]/65 hover:bg-[#050505] ${
                      isOffWhiteTheme
                        ? "shadow-none hover:shadow-none"
                        : "shadow-[0_0_18px_rgba(201,164,92,0.18)] hover:shadow-[0_0_28px_rgba(201,164,92,0.38)]"
                    }`}>
                  <FaHome className={`text-[#c9a45c] text-base sm:text-xl transition-all duration-300 hover:scale-110 ${
                    isOffWhiteTheme
                      ? ""
                      : "drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] hover:drop-shadow-[0_0_14px_rgba(201,164,92,0.70)]"
                  }`} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base sm:text-xl font-extrabold text-[#f5efe3] truncate tracking-tight">
                    {formData.title}
                  </h2>

                  <p className="text-[11px] sm:text-sm text-[#9f988d] font-medium">
                    Edit Property Information
                  </p>
                </div>
              </div>

              {formError && (
                <div className="mt-4 sm:mt-5 bg-[#c9a45c]/10 border border-[#c9a45c]/20 text-[#dfbf7b] text-xs sm:text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-medium">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="mt-4 sm:mt-5 bg-[#c9a45c]/10 border border-[#c9a45c]/20 text-[#c9a45c] text-xs sm:text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold">
                  ✓ {formSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 mt-4 sm:mt-6">

                <FormInput
                  label="Property Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  isOffWhiteTheme={isOffWhiteTheme}
                />

                <FormInput
                  label="Property Type"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  isOffWhiteTheme={isOffWhiteTheme}
                />

                <FormInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  isOffWhiteTheme={isOffWhiteTheme}
                />

                <FormInput
                  label="Area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  isOffWhiteTheme={isOffWhiteTheme}
                />

                <div className="md:col-span-2">
                  <FormInput
                    label="Street Address"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    isOffWhiteTheme={isOffWhiteTheme}
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">

                  <div className="relative">
                    <label className={labelBase}>
                      Monthly Rent
                    </label>

                    <div className="relative">
                      <FaMoneyBillWave className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#c9a45c] transition-all duration-300 ${
                        isOffWhiteTheme
                          ? ""
                          : "drop-shadow-[0_0_7px_rgba(201,164,92,0.45)]"
                      }`} />

                      <input
                        type="number"
                        name="monthlyRent"
                        value={formData.monthlyRent}
                        onChange={handleChange}
                        min="0"
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className={labelBase}>
                      Daily Rent
                    </label>

                    <div className="relative">
                      <FaMoneyBillWave className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#c9a45c] transition-all duration-300 ${
                        isOffWhiteTheme
                          ? ""
                          : "drop-shadow-[0_0_7px_rgba(201,164,92,0.45)]"
                      }`} />

                      <input
                        type="number"
                        name="dailyRent"
                        value={formData.dailyRent}
                        onChange={handleChange}
                        min="0"
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className={labelBase}>
                      AC Monthly Extra
                    </label>

                    <div className="relative">
                      <FaMoneyBillWave className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#c9a45c] transition-all duration-300 ${
                        isOffWhiteTheme
                          ? ""
                          : "drop-shadow-[0_0_7px_rgba(201,164,92,0.45)]"
                      }`} />

                      <input
                        type="number"
                        name="acMonthlyCharge"
                        value={formData.acMonthlyCharge}
                        onChange={handleChange}
                        min="0"
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className={labelBase}>
                      AC Daily Extra
                    </label>

                    <div className="relative">
                      <FaMoneyBillWave className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#c9a45c] transition-all duration-300 ${
                        isOffWhiteTheme
                          ? ""
                          : "drop-shadow-[0_0_7px_rgba(201,164,92,0.45)]"
                      }`} />

                      <input
                        type="number"
                        name="acDailyCharge"
                        value={formData.acDailyCharge}
                        onChange={handleChange}
                        min="0"
                        className={inputBase}
                      />
                    </div>
                  </div>

                </div>

                <div className="md:col-span-2">
                  <label className={labelBase}>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full border border-[#3a3328] rounded-xl px-4 py-3 outline-none resize-none text-xs sm:text-sm text-[#f5efe3] bg-[#050505] font-medium transition-all duration-300 placeholder:text-[#777066] hover:border-[#c9a45c]/55 focus:border-[#c9a45c] focus:bg-[#050505] focus:ring-2 focus:ring-[#c9a45c]/20"
                  />
                </div>

              </div>

              <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row gap-2.5 sm:gap-3">

                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 inline-flex items-center justify-center gap-2 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl font-bold hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                    isOffWhiteTheme
                      ? "shadow-none hover:shadow-none"
                      : "shadow-[0_10px_28px_rgba(201,164,92,0.30)] hover:shadow-[0_14px_36px_rgba(201,164,92,0.44)]"
                  }`}
                >
                  <FaSave />
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`sm:w-48 inline-flex items-center justify-center gap-2 border border-[#3a3328] bg-[#050505] text-[#bdb6aa] px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl font-bold hover:border-[#c9a45c]/60 hover:bg-[#050505] hover:text-[#c9a45c] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                    isOffWhiteTheme
                      ? "shadow-none hover:shadow-none"
                      : "shadow-[0_7px_20px_rgba(0,0,0,0.55)] hover:shadow-[0_10px_28px_rgba(201,164,92,0.18)]"
                  }`}
                >
                  <FaTrash />
                  {deleting ? "Deleting..." : "Delete Property"}
                </button>

              </div>

            </div>
          </form>

          {showUpdateSuccessPopup && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
              <div
                className={`w-full max-w-sm rounded-2xl border border-[#c9a45c]/50 px-6 py-7 text-center ${
                  isOffWhiteTheme
                    ? "bg-[#f5efe3] shadow-none"
                    : "bg-[#050505] shadow-[0_14px_42px_rgba(0,0,0,0.80)]"
                }`}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c9a45c]/15">
                  <span className="text-2xl font-black text-[#c9a45c]">✓</span>
                </div>

                <h2
                  className={`text-xl font-extrabold ${
                    isOffWhiteTheme ? "text-[#5a3518]" : "text-[#f5efe3]"
                  }`}
                >
                  Property Updated Successfully
                </h2>

                <p
                  className={`mt-2 text-sm font-medium ${
                    isOffWhiteTheme ? "text-[#8a7968]" : "text-[#9f988d]"
                  }`}
                >
                  Redirecting to Dashboard...
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  isOffWhiteTheme,
}) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-bold text-[#bdb6aa] mb-1.5 sm:mb-2">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border border-[#3a3328] rounded-xl px-4 py-3 outline-none text-xs sm:text-sm text-[#f5efe3] bg-[#050505] font-medium transition-all duration-300 placeholder:text-[#777066] hover:border-[#c9a45c]/55 focus:border-[#c9a45c] focus:bg-[#050505] focus:ring-2 focus:ring-[#c9a45c]/20 ${
          isOffWhiteTheme
            ? "shadow-none hover:shadow-none focus:shadow-none"
            : "shadow-[0_6px_20px_rgba(0,0,0,0.60)] hover:shadow-[0_8px_26px_rgba(201,164,92,0.16)] focus:shadow-[0_0_26px_rgba(201,164,92,0.30)]"
        }`}
      />
    </div>
  );
}

export default ManageProperty;