import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { createPropertyListing } from "../../api/PropertyApi.js";
import {
  FaCloudArrowUp,
  FaVideo,
  FaPlus,
  FaTrashCan,
  FaTriangleExclamation,
  FaChevronDown,
} from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import LocationPicker from "../../components/LocationPicker";

const SUGGESTED_FACILITIES = [
  "Wifi",
  "Attached Bathroom",
  "Laundry",
  "Kitchen Access",
  "24/7 Security",
  "Parking",
  "Furnished",
  "Meals Included",
  "Water Cooler",
  "Generator/UPS Backup",
  "Geyser / Hot Water",
];

const ROOM_TYPE_COMBOS = [
  { key: "Single-Non-AC", category: "Single", acType: "Non-AC", label: "Single • Non-AC" },
  { key: "Single-AC", category: "Single", acType: "AC", label: "Single • AC" },
  { key: "Shared-Non-AC", category: "Shared", acType: "Non-AC", label: "Shared • Non-AC" },
  { key: "Shared-AC", category: "Shared", acType: "AC", label: "Shared • AC" },
];

function CreateListing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    street: "",
    city: "",
    area: "",
    monthlyRent: "",
    dailyRent: "",
    acMonthlyCharge: "",
    acDailyCharge: "",
    propertyType: "Hostel",
  });

  const [coordinates, setCoordinates] = useState(null);
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const propertyTypeDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const dropdown = propertyTypeDropdownRef.current;
      if (propertyTypeOpen && dropdown && !dropdown.contains(event.target)) {
        setPropertyTypeOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [propertyTypeOpen]);

  const emptyRoomSelection = (enabled, guests) => ({
    enabled,
    totalRooms: 1,
    availableRooms: 1,
    maxGuestsPerRoom: guests,
  });

  const [roomTypeSelections, setRoomTypeSelections] = useState({
    "Single-Non-AC": emptyRoomSelection(true, 1),
    "Single-AC": emptyRoomSelection(false, 1),
    "Shared-Non-AC": emptyRoomSelection(false, 2),
    "Shared-AC": emptyRoomSelection(false, 2),
  });

  function toggleRoomTypeCombo(key) {
    setRoomTypeSelections((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  }

  function updateRoomTypeCombo(key, field, value) {
    setRoomTypeSelections((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  const [facilities, setFacilities] = useState([]);

  const activeRoomTypeConfigs = ROOM_TYPE_COMBOS.filter(
    (combo) => roomTypeSelections[combo.key].enabled,
  ).map((combo) => ({
    category: combo.category,
    acType: combo.acType,
    totalRooms: roomTypeSelections[combo.key].totalRooms,
    availableRooms: roomTypeSelections[combo.key].availableRooms,
    maxGuestsPerRoom: roomTypeSelections[combo.key].maxGuestsPerRoom,
  }));

  const hasACRooms = activeRoomTypeConfigs.some((cfg) => cfg.acType === "AC");

  const buildRoomsArray = () => {
    const rooms = [];
    let roomNumber = 1;

    activeRoomTypeConfigs.forEach((cfg) => {
      const total = Number(cfg.totalRooms) || 0;
      const available = Number(cfg.availableRooms) || 0;
      const booked = Math.max(0, total - available);

      for (let i = 0; i < total; i++) {
        rooms.push({
          roomNumber: roomNumber++,
          category: cfg.category,
          acType: cfg.acType,
          maxGuestsPerRoom: Number(cfg.maxGuestsPerRoom) || 1,
          status: i < booked ? "booked" : "available",
        });
      }
    });

    return rooms;
  };

  const totalRoomCapacity = activeRoomTypeConfigs.reduce(
    (sum, cfg) => sum + Number(cfg.totalRooms || 0) * Number(cfg.maxGuestsPerRoom || 0),
    0,
  );

  const [customFacility, setCustomFacility] = useState("");
  const [houseRules, setHouseRules] = useState([]);
  const [currentRuleInput, setCurrentRuleInput] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState([]);
  const [electricityBill, setElectricityBill] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const hasBankDetails =
    user?.bankName && user?.accountTitle && user?.bankAccountNumber;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function toggleFacility(label) {
    setFacilities((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label],
    );
  }

  function addCustomFacility() {
    const trimmed = customFacility.trim();
    if (trimmed && !facilities.includes(trimmed)) {
      setFacilities((prev) => [...prev, trimmed]);
    }
    setCustomFacility("");
  }

  function handleAddRule() {
    const trimmed = currentRuleInput.trim();
    if (trimmed && !houseRules.includes(trimmed)) {
      setHouseRules((prev) => [...prev, trimmed]);
      setCurrentRuleInput("");
    }
  }

  function handleRemoveRule(indexToRemove) {
    setHouseRules((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    setImages((prev) => [
      ...prev,
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
    setErrors((prev) => ({ ...prev, images: "" }));
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleVideoUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    if (video.length + files.length > 1) {
      alert("You can upload only 1 video tour of the property.");
      return;
    }
    setVideo((prev) => [
      ...prev,
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
    setErrors((prev) => ({ ...prev, video: "" }));
  }

  function removeVideo(index) {
    setVideo((prev) => prev.filter((_, i) => i !== index));
  }

  function handleElectricityBillUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    setElectricityBill({
      file,
      name: file.name,
      url,
      isPdf: file.type === "application/pdf",
    });
    setErrors((prev) => ({ ...prev, electricityBill: "" }));
  }

  function validate() {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (formData.title.length > 120) newErrors.title = "Title must be under 120 characters";
    if (!formData.street.trim()) newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.area.trim()) newErrors.area = "Area is required";
    if (!formData.monthlyRent || Number(formData.monthlyRent) <= 0)
      newErrors.monthlyRent = "Enter a valid monthly rent";
    if (!formData.dailyRent || Number(formData.dailyRent) <= 0)
      newErrors.dailyRent = "Enter a valid daily rent";

    if (hasACRooms) {
      if (!formData.acMonthlyCharge || Number(formData.acMonthlyCharge) <= 0)
        newErrors.acMonthlyCharge = "Enter the extra monthly charge for AC rooms";
      if (!formData.acDailyCharge || Number(formData.acDailyCharge) <= 0)
        newErrors.acDailyCharge = "Enter the extra daily charge for AC rooms";
    }

    const invalidRoomTypeRow = activeRoomTypeConfigs.some(
      (cfg) =>
        !cfg.totalRooms ||
        Number(cfg.totalRooms) < 1 ||
        cfg.availableRooms === "" ||
        Number(cfg.availableRooms) < 0 ||
        Number(cfg.availableRooms) > Number(cfg.totalRooms) ||
        !cfg.maxGuestsPerRoom ||
        Number(cfg.maxGuestsPerRoom) < 1,
    );

    if (activeRoomTypeConfigs.length === 0) {
      newErrors.roomTypes = "Select at least one room type";
    } else if (invalidRoomTypeRow) {
      newErrors.roomTypes = "Check each room type's total/available rooms and guests per room";
    }

    if (!electricityBill) newErrors.electricityBill = "Electricity bill is required for address verification";
    if (!coordinates || coordinates.length !== 2) newErrors.coordinates = "Please pin your property location on the map";
    if (images.length === 0) newErrors.images = "Upload at least one property photo";
    if (video.length === 0) newErrors.video = "Property video tour is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("");
    setServerSuccess("");

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();

      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("street", formData.street.trim());
      payload.append("city", formData.city.trim());
      payload.append("area", formData.area.trim());
      payload.append("monthlyRent", formData.monthlyRent);
      payload.append("dailyRent", formData.dailyRent);

      if (hasACRooms) {
        payload.append("acMonthlyCharge", formData.acMonthlyCharge);
        payload.append("acDailyCharge", formData.acDailyCharge);
      }

      payload.append("propertyType", formData.propertyType);

      const roomsArray = buildRoomsArray();
      payload.append("rooms", JSON.stringify(roomsArray));

      if (coordinates && coordinates.length === 2) {
        payload.append("longitude", coordinates[0]);
        payload.append("latitude", coordinates[1]);
      }

      payload.append("facilities", JSON.stringify(facilities));
      payload.append("houseRules", JSON.stringify(houseRules));

      images.forEach((img) => {
        payload.append("images", img.file);
      });
      payload.append("video", video[0].file);

      if (electricityBill?.file) {
        payload.append("electricityBill", electricityBill.file);
      }

      await createPropertyListing(payload);

      window.location.assign("/owner/dashboard");
      return;
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Failed to create property listing. Please try again.",
      );
      setSubmitting(false);
    }
  }

  // ============================================================
  // ✅ STYLING CONSTANTS (Dark Theme + Off-white Cards)
  // ============================================================
  const labelBase =
    "block text-xs sm:text-sm font-bold text-[#bdb6aa] mb-2";

  const inputBase =
    "w-full min-w-0 border border-[#3a3328] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none text-xs sm:text-sm bg-[#050505] text-[#f5efe3] placeholder:text-[#777066] font-medium transition-all duration-300 focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/20 hover:border-[#c9a45c]/55 shadow-[0_4px_14px_rgba(0,0,0,0.45)]";

  const inputError =
    "border-[#c9a45c]/70 bg-[#c9a45c]/5";

  const inputNormal = "border-[#3a3328]";

  const cardBase =
    "w-full bg-[#050505] rounded-2xl shadow-[0_10px_32px_rgba(0,0,0,0.72)] border border-[#c9a45c]/25 p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:border-[#c9a45c]/45 hover:shadow-[0_14px_38px_rgba(201,164,92,0.14)]";

  const sectionHeader = "border-b border-[#3a3328] pb-4 sm:pb-5 mb-5 sm:mb-6";

  const sectionTitle =
    "text-base sm:text-xl font-extrabold text-[#f5efe3] tracking-tight";

  const sectionSubtitle =
    "text-xs sm:text-sm text-[#9f988d] mt-1 font-medium";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] flex font-sans" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      <main className="w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="max-w-5xl mx-auto w-full">

          {/* Bank warning */}
          {!hasBankDetails && (
            <div className="bg-[#c9a45c]/8 border border-[#c9a45c]/30 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-7 -[0_10px_28px_rgba(0,0,0,0.55)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#c9a45c]/15 border border-[#c9a45c]/30 flex items-center justify-center shrink-0">
                  <FaTriangleExclamation className="text-[#c9a45c] text-lg" />
                </div>

                <div className="flex-1">
                  <h3 className="text-[#dfbf7b] font-extrabold text-sm sm:text-base">
                    Bank Details Missing
                  </h3>
                  <p className="text-[#bdb6aa] text-xs sm:text-sm mt-1 font-medium leading-relaxed">
                    Please add your bank account details to receive payments
                    from tenants. You can still list your property without them.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/poprofile")}
                  className="bg-[#c9a45c] text-[#171717] px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm -[0_8px_24px_rgba(201,164,92,0.30)] hover:bg-[#dfbf7b] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <FaPlus className="text-xs" />
                  Add Bank Details
                </button>
              </div>
            </div>
          )}

          {/* Page header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#f5efe3] tracking-tight">
              List Your <span className="text-[#c9a45c]">Property</span>
            </h1>
            <p className="text-[#9f988d] mt-2 text-sm sm:text-base leading-relaxed font-medium">
              Submit your accommodation details for verification.
              Once approved by our team, it will appear to tenants.
            </p>
          </div>

          {/* Server messages */}
          {serverError && (
            <div className="bg-[#c9a45c]/10 border border-[#c9a45c]/30 text-[#dfbf7b] px-4 py-3 rounded-xl mb-5 sm:mb-6 text-xs sm:text-sm font-medium">
              {serverError}
            </div>
          )}

          {serverSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-5 sm:mb-6 text-xs sm:text-sm font-bold">
              ✓ {serverSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-5 sm:space-y-6">

            {/* ============ BASIC INFORMATION ============ */}
            <div className={cardBase}>
              <div className={sectionHeader}>
                <h2 className={sectionTitle}>Basic Information</h2>
                <p className={sectionSubtitle}>
                  Provide accurate information about your property.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="min-w-0 md:col-span-2">
                  <label className={labelBase}>Property Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={120}
                    placeholder="e.g. Al-Madina Hostel"
                    className={`${inputBase} ${errors.title ? inputError : inputNormal}`}
                  />
                  {errors.title && (
                    <p className="text-[#dfbf7b] text-xs mt-2 font-semibold">{errors.title}</p>
                  )}
                </div>

                <div className="min-w-0 md:col-span-2">
                  <label className={labelBase}>Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={2000}
                    rows={4}
                    placeholder="Describe your property..."
                    className={`${inputBase} ${inputNormal} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* ============ ADDRESS DETAILS ============ */}
            <div className={cardBase}>
              <div className={sectionHeader}>
                <h2 className={sectionTitle}>Address Details</h2>
                <p className={sectionSubtitle}>
                  Add the complete address and property area details.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="min-w-0 md:col-span-2">
                  <label className={labelBase}>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street address"
                    className={`${inputBase} ${errors.street ? inputError : inputNormal}`}
                  />
                  {errors.street && (
                    <p className="text-[#dfbf7b] text-xs mt-2 font-semibold">{errors.street}</p>
                  )}
                </div>

                <div className="min-w-0">
                  <label className={labelBase}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`${inputBase} ${errors.city ? inputError : inputNormal}`}
                  />
                  {errors.city && (
                    <p className="text-[#dfbf7b] text-xs mt-2 font-semibold">{errors.city}</p>
                  )}
                </div>

                <div className="min-w-0">
                  <label className={labelBase}>Area</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter area / sector"
                    className={`${inputBase} ${errors.area ? inputError : inputNormal}`}
                  />
                  {errors.area && (
                    <p className="text-[#dfbf7b] text-xs mt-2 font-semibold">{errors.area}</p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-[#3a3328]">
                <label className={labelBase}>Geo Location (Pin on Map)</label>
                <p className="text-xs text-[#9f988d] mb-3 font-medium">
                  Apni property ki exact location map par click karke pin karein.
                </p>

                <LocationPicker
                  onLocationChange={(coords) => {
                    setCoordinates([coords.longitude, coords.latitude]);
                  }}
                />

                {errors.coordinates && (
                  <p className="text-[#dfbf7b] text-xs mt-2 font-semibold">{errors.coordinates}</p>
                )}

                {coordinates && (
                  <div className="mt-4 bg-[#c9a45c]/10 border border-[#c9a45c]/30 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-[#c9a45c] font-semibold">
                    📍 Location Selected: Longitude {coordinates[0]?.toFixed(4)}, Latitude{" "}
                    {coordinates[1]?.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            {/* ============ PRICING & ROOM SPECS ============ */}
            <div className={cardBase}>
              <div className={sectionHeader}>
                <h2 className={sectionTitle}>Pricing & Room Specs</h2>
                <p className={sectionSubtitle}>
                  Add rent (for the whole property) and room capacity information.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="min-w-0">
                  <label className={labelBase}>Monthly Rent (PKR)</label>
                  <input
                    type="number"
                    name="monthlyRent"
                    min="0"
                    value={formData.monthlyRent}
                    onChange={handleChange}
                    placeholder="e.g. 25000"
                    className={`${inputBase} ${errors.monthlyRent ? inputError : inputNormal}`}
                  />
                  {errors.monthlyRent && (
                    <p className="text-[#dfbf7b] text-xs mt-2 font-semibold">{errors.monthlyRent}</p>
                  )}
                </div>

                <div className="min-w-0">
                  <label className={labelBase}>Daily Rent (PKR)</label>
                  <input
                    type="number"
                    name="dailyRent"
                    min="0"
                    value={formData.dailyRent}
                    onChange={handleChange}
                    placeholder="e.g. 1500"
                    className={`${inputBase} ${errors.dailyRent ? inputError : inputNormal}`}
                  />
                  {errors.dailyRent && (
                    <p className="text-[#dfbf7b] text-xs mt-2 font-semibold">{errors.dailyRent}</p>
                  )}
                </div>

                {/* Property Type Dropdown */}
                <div ref={propertyTypeDropdownRef} className="min-w-0 relative md:col-span-2">
                  <label className={labelBase}>Property Type</label>
                  <button
                    type="button"
                    onClick={() => setPropertyTypeOpen((prev) => !prev)}
                    className={`w-full min-w-0 border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none text-xs sm:text-sm bg-[#050505] font-medium flex items-center justify-between transition-all duration-300 -[0_4px_14px_rgba(0,0,0,0.45)] ${
                      propertyTypeOpen
                        ? "border-[#c9a45c] ring-2 ring-[#c9a45c]/20"
                        : "border-[#3a3328] hover:border-[#c9a45c]/55"
                    }`}
                  >
                    <span className={formData.propertyType ? "text-[#f5efe3]" : "text-[#777066]"}>
                      {formData.propertyType || "Select Property Type"}
                    </span>
                    <span className={`text-[#c9a45c] text-sm leading-none transition-transform duration-200 ${propertyTypeOpen ? "rotate-180" : ""}`}>
                      <FaChevronDown />
                    </span>
                  </button>

                  {propertyTypeOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#c9a45c]/40 rounded-xl overflow-hidden -[0_12px_32px_rgba(0,0,0,0.72)]">
                      {["Hostel", "Apartment", "House"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, propertyType: option }));
                            setPropertyTypeOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                            formData.propertyType === option
                              ? "bg-[#c9a45c] text-[#171717]"
                              : "text-[#f5efe3] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {totalRoomCapacity > 0 && (
                  <div className="min-w-0 md:col-span-2 bg-[#c9a45c]/8 border border-[#c9a45c]/25 rounded-xl p-4">
                    <p className="text-xs sm:text-sm font-bold text-[#dfbf7b]">
                      👥 Total Capacity: {totalRoomCapacity} guests
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#9f988d] mt-1 font-medium">
                      Automatically calculated from room types below.
                    </p>
                  </div>
                )}
              </div>

              {/* Room Types */}
              <div className="mt-6 border-t border-[#3a3328] pt-6">
                <label className={labelBase}>Room Types</label>
                <p className="text-xs text-[#9f988d] mb-4 font-medium">
                  Select the room types available in your property.
                </p>

                {errors.roomTypes && (
                  <p className="text-[#dfbf7b] text-xs mb-3 font-semibold">{errors.roomTypes}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROOM_TYPE_COMBOS.map((combo) => {
                    const sel = roomTypeSelections[combo.key];
                    return (
                      <div
                        key={combo.key}
                        className={`border rounded-xl p-4 transition-all duration-300 ${
                          sel.enabled
                            ? "border-[#c9a45c]/60 bg-[#c9a45c]/5 -[0_6px_20px_rgba(201,164,92,0.10)]"
                            : "border-[#3a3328] bg-[#050505] hover:border-[#c9a45c]/40"
                        }`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sel.enabled}
                            onChange={() => toggleRoomTypeCombo(combo.key)}
                            className="w-4 h-4 accent-[#c9a45c] shrink-0 cursor-pointer"
                          />
                          <span className={`text-xs sm:text-sm font-bold ${sel.enabled ? "text-[#c9a45c]" : "text-[#f5efe3]"}`}>
                            {combo.label}
                          </span>
                        </label>

                        {sel.enabled && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <div>
                              <label className="block text-[10px] font-bold text-[#9f988d] mb-1 uppercase tracking-wider">
                                Total
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={sel.totalRooms}
                                onChange={(e) =>
                                  updateRoomTypeCombo(combo.key, "totalRooms", e.target.value)
                                }
                                className="w-full border border-[#3a3328] rounded-lg px-2 py-2 text-xs bg-[#050505] text-[#f5efe3] focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/20 outline-none font-semibold transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-[#9f988d] mb-1 uppercase tracking-wider">
                                Available
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={sel.availableRooms}
                                onChange={(e) =>
                                  updateRoomTypeCombo(combo.key, "availableRooms", e.target.value)
                                }
                                className="w-full border border-[#3a3328] rounded-lg px-2 py-2 text-xs bg-[#050505] text-[#f5efe3] focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/20 outline-none font-semibold transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-[#9f988d] mb-1 uppercase tracking-wider">
                                Guests
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={sel.maxGuestsPerRoom}
                                onChange={(e) =>
                                  updateRoomTypeCombo(combo.key, "maxGuestsPerRoom", e.target.value)
                                }
                                className="w-full border border-[#3a3328] rounded-lg px-2 py-2 text-xs bg-[#050505] text-[#f5efe3] focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/20 outline-none font-semibold transition-all"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* AC Extra Charges */}
                {hasACRooms && (
                  <div className="mt-5 border border-[#c9a45c]/40 bg-[#c9a45c]/5 rounded-xl p-4 sm:p-5">
                    <p className="text-sm font-bold text-[#dfbf7b]">❄️ AC Extra Charges</p>
                    <p className="text-[11px] sm:text-xs text-[#9f988d] mt-1 mb-4 font-medium">
                      AC rooms pay the base rent plus these extra charges.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#9f988d] mb-2">
                          Extra Monthly (PKR)
                        </label>
                        <input
                          type="number"
                          name="acMonthlyCharge"
                          min="0"
                          value={formData.acMonthlyCharge}
                          onChange={handleChange}
                          placeholder="e.g. 2000"
                          className={`${inputBase} ${errors.acMonthlyCharge ? inputError : inputNormal}`}
                        />
                        {errors.acMonthlyCharge && (
                          <p className="text-[#dfbf7b] text-xs mt-2 font-semibold">{errors.acMonthlyCharge}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#9f988d] mb-2">
                          Extra Daily (PKR)
                        </label>
                        <input
                          type="number"
                          name="acDailyCharge"
                          min="0"
                          value={formData.acDailyCharge}
                          onChange={handleChange}
                          placeholder="e.g. 200"
                          className={`${inputBase} ${errors.acDailyCharge ? inputError : inputNormal}`}
                        />
                        {errors.acDailyCharge && (
                          <p className="text-[#dfbf7b] text-xs mt-2 font-semibold">{errors.acDailyCharge}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ============ FACILITIES ============ */}
            <div className={cardBase}>
              <div className={sectionHeader}>
                <h2 className={sectionTitle}>Facilities & Amenities</h2>
                <p className={sectionSubtitle}>
                  Select facilities available for the whole property.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {SUGGESTED_FACILITIES.map((facility) => (
                  <label
                    key={facility}
                    className={`flex items-center gap-2.5 border rounded-xl p-3 cursor-pointer transition-all duration-300 ${
                      facilities.includes(facility)
                        ? "border-[#c9a45c] bg-[#c9a45c]/10 text-[#dfbf7b]"
                        : "border-[#3a3328] bg-[#050505] text-[#bdb6aa] hover:border-[#c9a45c]/40 hover:bg-[#c9a45c]/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={facilities.includes(facility)}
                      onChange={() => toggleFacility(facility)}
                      className="w-4 h-4 accent-[#c9a45c] shrink-0 cursor-pointer"
                    />
                    <span className="text-[11px] sm:text-sm font-medium leading-tight">
                      {facility}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2 mt-5">
                <input
                  type="text"
                  value={customFacility}
                  onChange={(e) => setCustomFacility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomFacility();
                    }
                  }}
                  placeholder="Add custom facility"
                  className={`${inputBase} ${inputNormal} flex-1`}
                />
                <button
                  type="button"
                  onClick={addCustomFacility}
                  className="bg-[#c9a45c] text-[#171717] px-5 py-3 rounded-xl font-bold text-xs sm:text-sm -[0_8px_24px_rgba(201,164,92,0.28)] hover:bg-[#dfbf7b] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Add
                </button>
              </div>

              {facilities.filter((f) => !SUGGESTED_FACILITIES.includes(f)).length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#3a3328]">
                  <p className="text-xs font-bold text-[#c9a45c] mb-3 uppercase tracking-wider">
                    Your Custom Facilities:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {facilities
                      .filter((f) => !SUGGESTED_FACILITIES.includes(f))
                      .map((facility, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-[#c9a45c]/10 border border-[#c9a45c]/40 text-[#dfbf7b] px-3 py-1.5 rounded-lg text-sm font-semibold"
                        >
                          <span>{facility}</span>
                          <button
                            type="button"
                            onClick={() => toggleFacility(facility)}
                            className="hover:text-[#c9a45c] transition-colors cursor-pointer"
                          >
                            <RxCross1 className="text-xs" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* ============ HOUSE RULES ============ */}
            <div className={cardBase}>
              <div className={sectionHeader}>
                <h2 className={sectionTitle}>House Rules</h2>
                <p className={sectionSubtitle}>
                  Optional — add any custom rules for your tenants.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentRuleInput}
                  onChange={(e) => setCurrentRuleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRule();
                    }
                  }}
                  placeholder="e.g. No smoking inside rooms"
                  className={`${inputBase} ${inputNormal} flex-1`}
                />
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="bg-[#c9a45c] text-[#171717] font-bold px-5 py-3 rounded-xl -[0_8px_24px_rgba(201,164,92,0.28)] hover:bg-[#dfbf7b] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer"
                >
                  <FaPlus className="text-xs" />
                  Add
                </button>
              </div>

              {houseRules.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {houseRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-[#c9a45c]/8 border border-[#c9a45c]/25 px-4 py-3 rounded-xl text-sm font-semibold text-[#f5efe3]"
                    >
                      <span>• {rule}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-[#c9a45c] hover:text-[#dfbf7b] p-1.5 rounded-lg cursor-pointer transition-colors"
                        title="Delete rule"
                      >
                        <FaTrashCan className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#777066] italic mt-4 font-medium">
                  No custom house rules added. This is optional.
                </p>
              )}
            </div>

            {/* ============ PHOTOS & DOCUMENTS ============ */}
            <div className={cardBase}>
              <div className={sectionHeader}>
                <h2 className={sectionTitle}>Photos & Verification Documents</h2>
                <p className={sectionSubtitle}>
                  Upload clear photos of rooms, a property video, and the current electricity bill.
                </p>
              </div>

              {/* Photos */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-bold text-[#f5efe3] text-sm">
                    Property Photos
                  </label>
                  <span className="text-xs text-[#c9a45c] font-bold bg-[#c9a45c]/10 px-3 py-1 rounded-lg border border-[#c9a45c]/25">
                    {images.length} added
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#c9a45c]/40 -[0_6px_20px_rgba(0,0,0,0.55)]"
                    >
                      <img src={img.url} alt="upload" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-[#050505] border border-[#c9a45c]/40 text-[#c9a45c] rounded-full w-7 h-7 flex items-center justify-center text-xs cursor-pointer hover:bg-[#c9a45c] hover:text-[#171717] transition-all"
                      >
                        ✕
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-[#c9a45c] text-[#171717] text-[10px] font-bold px-2 py-1 rounded-md">
                          COVER
                        </span>
                      )}
                    </div>
                  ))}

                  <label className="aspect-[4/3] border-2 border-dashed border-[#c9a45c]/40 bg-[#050505] rounded-xl flex flex-col items-center justify-center text-[#9f988d] hover:bg-[#c9a45c]/5 hover:border-[#c9a45c]/70 transition-all duration-300 cursor-pointer p-3 text-center">
                    <FaCloudArrowUp className="text-3xl text-[#c9a45c] mb-2" />
                    <span className="text-xs font-bold text-[#f5efe3]">+ Add Photos</span>
                    <span className="text-[10px] text-[#777066] mt-1 font-medium">
                      Multiple allowed
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {errors.images && (
                  <p className="text-[#dfbf7b] text-xs mt-3 font-semibold">{errors.images}</p>
                )}
              </div>

              {/* Video */}
              <div className="mb-6 pt-5 border-t border-[#3a3328]">
                <label className="font-bold text-[#f5efe3] text-sm block mb-3">
                  Property Video Tour
                </label>

                {video.length > 0 ? (
                  <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-[#c9a45c]/40 bg-[#050505] -[0_6px_20px_rgba(0,0,0,0.55)]">
                    <video src={video[0].url} className="w-full h-full object-cover" controls />
                    <button
                      type="button"
                      onClick={() => removeVideo(0)}
                      className="absolute top-2 right-2 bg-[#050505] border border-[#c9a45c]/40 text-[#c9a45c] rounded-full w-8 h-8 flex items-center justify-center text-xs cursor-pointer hover:bg-[#c9a45c] hover:text-[#171717] transition-all"
                    >
                      <RxCross1 className="text-xs" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full border-2 border-dashed border-[#c9a45c]/40 bg-[#050505] rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#c9a45c]/5 hover:border-[#c9a45c]/70 transition-all duration-300 text-center">
                    <FaVideo className="text-3xl sm:text-4xl text-[#c9a45c]" />
                    <p className="text-sm text-[#f5efe3] font-bold mt-3">
                      Click to upload property video
                    </p>
                    <p className="text-xs text-[#777066] mt-1 font-medium">
                      MP4, WebM (Max 1 file)
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {errors.video && (
                  <p className="text-[#dfbf7b] text-xs mt-3 font-semibold">{errors.video}</p>
                )}
              </div>

              {/* Electricity Bill */}
              <div className="pt-5 border-t border-[#3a3328]">
                <label className="font-bold text-[#f5efe3] text-sm block mb-2">
                  Electricity Bill
                </label>
                <p className="text-xs text-[#9f988d] mb-3 font-medium">
                  Upload a recent electricity bill for property verification.
                </p>

                {electricityBill ? (
                  <div className="relative w-full max-w-lg rounded-xl overflow-hidden border border-[#c9a45c]/40 bg-[#050505] -[0_6px_20px_rgba(0,0,0,0.55)]">
                    {electricityBill.url ? (
                      <img
                        src={electricityBill.url}
                        alt="Electricity Bill"
                        className="w-full max-h-[500px] object-contain bg-[#050505]"
                      />
                    ) : (
                      <div className="min-h-[220px] flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/30 flex items-center justify-center mb-3">
                          <span className="text-3xl">📄</span>
                        </div>
                        <p className="text-sm text-[#f5efe3] font-bold break-all">
                          {electricityBill.name}
                        </p>
                        <p className="text-xs text-[#9f988d] mt-1">
                          PDF document selected
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (electricityBill.url) {
                          URL.revokeObjectURL(electricityBill.url);
                        }
                        setElectricityBill(null);
                      }}
                      className="absolute top-2 right-2 bg-[#050505] border border-[#c9a45c]/40 text-[#c9a45c] rounded-full w-8 h-8 flex items-center justify-center text-xs cursor-pointer hover:bg-[#c9a45c] hover:text-[#171717] transition-all"
                      title="Remove electricity bill"
                    >
                      <RxCross1 className="text-xs" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full border-2 border-dashed border-[#c9a45c]/40 bg-[#050505] rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#c9a45c]/5 hover:border-[#c9a45c]/70 transition-all duration-300 text-center">
                    <FaCloudArrowUp className="text-3xl sm:text-4xl text-[#c9a45c]" />
                    <p className="text-sm text-[#f5efe3] font-bold mt-3">
                      Click to upload electricity bill
                    </p>
                    <p className="text-xs text-[#777066] mt-1 font-medium">
                      Image or PDF
                    </p>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleElectricityBillUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {errors.electricityBill && (
                  <p className="text-[#dfbf7b] text-xs mt-3 font-semibold">
                    {errors.electricityBill}
                  </p>
                )}
              </div>
            </div>

            {/* ============ SUBMIT BUTTONS ============ */}
            <div className="w-full flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-2 pb-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-48 border border-[#3a3328] bg-[#050505] text-[#bdb6aa] py-3 sm:py-3.5 rounded-xl font-bold hover:border-[#c9a45c]/60 hover:text-[#c9a45c] hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] py-3 sm:py-3.5 rounded-xl font-bold shadow-[0_10px_30px_rgba(201,164,92,0.32)] hover:-[0_14px_38px_rgba(201,164,92,0.45)] hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? "Submitting..." : "Submit Listing for Verification"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateListing;