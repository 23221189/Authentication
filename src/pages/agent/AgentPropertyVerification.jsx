import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getPropertyById,
  submitAgentVerification,
  getAgentProperties,
} from "../../api/PropertyApi";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  FaCheck,
  FaCamera,
  FaVideo,
  FaUpload,
  FaArrowRight,
  FaPaperPlane,
  FaHome,
  FaMapMarkerAlt,
  FaTimes,
  FaBuilding,
  FaCalendarAlt,
  FaClipboardCheck,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";

const getPropertyCoordinates = (property) => {
  return (
    property?.address?.location?.coordinates ||
    property?.address?.coordinates ||
    null
  );
};

const STATUS_META = {
  pending: {
    label: "Pending",
    classes:
      "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25",
  },
  assigned: {
    label: "Pending",
    classes:
      "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25",
  },
  verified: {
    label: "Verified",
    classes:
      "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25",
  },
};

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const cardBase =
  "bg-[#050505] rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.55)] border border-[#c9a45c]/35 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(201,164,92,0.28)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)]";

function AgentPropertyVerification() {
  const { id } = useParams();

  const [checkedItems, setCheckedItems] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoPreview, setVideoPreview] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationAlreadySubmitted, setVerificationAlreadySubmitted] =
    useState(false);

  const [property, setProperty] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [listItems, setListItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const verificationStorageKey = id
    ? `pgstay_verification_submitted_${id}`
    : "";

  const hasVerificationBeenSubmitted = (propertyData) => {
    if (!propertyData) return false;

    const localSubmitted = verificationStorageKey
      ? localStorage.getItem(verificationStorageKey) === "true"
      : false;

    const status = String(propertyData.status || "").toLowerCase();

    const verificationStatus = String(
      propertyData.verificationStatus ||
        propertyData.verification?.status ||
        propertyData.agentVerificationStatus ||
        ""
    ).toLowerCase();

    return (
      localSubmitted ||
      status === "verified" ||
      [
        "submitted",
        "pending_review",
        "under_review",
        "verified",
      ].includes(verificationStatus)
    );
  };

  async function fetchVerificationList() {
    try {
      setListLoading(true);
      setListError("");

      const { data } = await getAgentProperties();
      const properties = data?.properties || [];

      const mapped = properties
        .filter((p) =>
          ["pending", "assigned", "verified"].includes(p.status)
        )
        .map((p) => {
          const meta = STATUS_META[p.status] || {
            label: p.status || "Other",
            classes:
              "bg-[#050505] text-[#9f988d] border border-[#3a3328]",
          };

          const itemStorageKey =
            `pgstay_verification_submitted_${p._id}`;

          const localSubmitted =
            localStorage.getItem(itemStorageKey) === "true";

          const verificationStatus = String(
            p.verificationStatus ||
              p.verification?.status ||
              p.agentVerificationStatus ||
              ""
          ).toLowerCase();

          const alreadySubmitted =
            localSubmitted ||
            String(p.status || "").toLowerCase() === "verified" ||
            [
              "submitted",
              "pending_review",
              "under_review",
              "verified",
            ].includes(verificationStatus);

          return {
            _id: p._id,
            rawStatus: p.status,
            alreadySubmitted,
            statusLabel: alreadySubmitted
              ? "Verification Already Submitted"
              : meta.label,
            statusClasses: alreadySubmitted
              ? "bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/25"
              : meta.classes,
            title: p.title,
            requestedAt: p.createdAt,
            location: [
              p.address?.street,
              p.address?.area,
              p.address?.city,
            ]
              .filter(Boolean)
              .join(", "),
          };
        });

      setListItems(mapped);
    } catch (error) {
      console.error(
        "Failed to load verification requests:",
        error
      );

      setListError(
        error.response?.data?.message ||
          "Failed to load your verification requests."
      );
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      fetchVerificationList();
    }
  }, [id]);

  const formatListDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (!id) return;

    async function fetchProperty() {
      try {
        setLoadingProperty(true);
        setLoadError("");

        const { data } = await getPropertyById(id);

        const fetchedProperty = data?.property || null;

        setProperty(fetchedProperty);

        setVerificationAlreadySubmitted(
          hasVerificationBeenSubmitted(fetchedProperty)
        );
      } catch (error) {
        console.error("Failed to load property:", error);

        setLoadError(
          error.response?.data?.message ||
            "Failed to load this property."
        );
      } finally {
        setLoadingProperty(false);
      }
    }

    fetchProperty();
  }, [id]);

  const checklist = [
    "Location Verified",
    "Rooms",
    "Kitchen",
    "Washrooms",
    "Amenities",
    "Documents",
  ];

  const isChecklistComplete =
    checkedItems.length === checklist.length;

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  function handleChecklistChange(item) {
    setCheckedItems((prev) =>
      prev.includes(item)
        ? prev.filter((check) => check !== item)
        : [...prev, item]
    );
  }

  function handlePhotos(event) {
    const files = Array.from(event.target.files);

    setPhotos((prev) => [...prev, ...files]);

    event.target.value = "";
  }

  function removePhoto(index) {
    setPhotos((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  async function startRecording() {
    if (!isChecklistComplete) {
      alert(
        "Please complete the verification checklist first."
      );
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });

        const file = new File(
          [blob],
          "property-verification-video.webm",
          {
            type: "video/webm",
          }
        );

        const previewUrl =
          URL.createObjectURL(blob);

        setVideo(file);
        setVideoPreview(previewUrl);
      };

      recorder.start();

      setRecording(true);
    } catch (error) {
      console.log(error);

      alert(
        "Camera and microphone permission is required."
      );
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setRecording(false);
  }

  function recordAgain() {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideo(null);
    setVideoPreview("");
  }

  async function handleSubmit() {
    if (
      verificationAlreadySubmitted ||
      submitted ||
      hasVerificationBeenSubmitted(property)
    ) {
      setVerificationAlreadySubmitted(true);
      setSubmitError("Verification Already Submitted");
      return;
    }

    if (!isChecklistComplete) {
      alert(
        "Please complete the verification checklist first."
      );
      return;
    }

    if (photos.length === 0) {
      alert("Please upload property photos first.");
      return;
    }

    if (!video) {
      alert(
        "Please record a live property video first."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();

      formData.append("remarks", notes);

      formData.append(
        "checklist",
        JSON.stringify(checkedItems)
      );

      formData.append("video", video);

      photos.forEach((photo) => {
        formData.append("images", photo);
      });

      await submitAgentVerification(
        property._id,
        formData
      );

      if (verificationStorageKey) {
        localStorage.setItem(
          verificationStorageKey,
          "true"
        );
      }

      setVerificationAlreadySubmitted(true);
      setSubmitted(true);

      setPhotos([]);
      setVideo(null);
      setVideoPreview("");
      setNotes("");
      setCheckedItems([]);
    } catch (error) {
      console.error(
        "Failed to submit verification:",
        error
      );

      setSubmitError(
        error.response?.data?.message ||
          "Upload failed due to a network issue. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!id) {
    return (
      <div className="w-full text-[#f5efe3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#c9a45c] tracking-tight">
              Property{" "}
              <span className="text-[#c9a45c] drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300">
                Verification
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#9f988d] mt-2 font-medium">
              Select a property to start or review
              verification.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchVerificationList}
            disabled={listLoading}
            className="self-start inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] text-sm font-extrabold shadow-lg shadow-[#c9a45c]/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaSyncAlt
              className={
                listLoading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>

        {listError && (
          <div className="mb-6 rounded-xl border border-[#3a3328] bg-[#050505] text-[#c9a45c] text-sm px-4 py-3 font-medium">
            {listError}
          </div>
        )}

        {listLoading ? (
          <div
            className={`${cardBase} min-h-[380px] flex flex-col items-center justify-center`}
          >
            <div className="animate-spin w-10 h-10 border-4 border-[#c9a45c] border-t-transparent rounded-full mb-4"></div>

            <p className="text-[#bdb6aa] font-bold mt-2">
              Loading verification requests...
            </p>
          </div>
        ) : listItems.length === 0 ? (
          <div
            className={`${cardBase} min-h-[380px] flex flex-col items-center justify-center px-5`}
          >
            <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
              <FaExclamationCircle className="text-[#c9a45c] text-2xl drop-shadow-[0_0_10px_rgba(201,164,92,0.5)] transition-transform duration-300 hover:scale-110" />
            </div>

            <h3 className="text-lg font-extrabold text-[#f5efe3] mt-4">
              No Verification Requests Found
            </h3>

            <p className="text-sm text-[#9f988d] mt-2 text-center font-medium max-w-sm">
              No pending or verified properties are
              currently assigned to you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {listItems.map((item) => (
              <div
                key={item._id}
                className={`${cardBase} p-5 hover:border-[#c9a45c]/30 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#c9a45c]/10 flex items-center justify-center shrink-0 border border-[#c9a45c]/35 shadow-[0_0_16px_rgba(201,164,92,0.22)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#c9a45c]/15 hover:shadow-[0_0_24px_rgba(201,164,92,0.42)]">
                      <FaBuilding className="text-[#c9a45c] drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-[#777066] font-bold">
                        Verification Request
                      </p>

                      <h3 className="text-base font-bold text-[#f5efe3] mt-0.5 truncate">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${item.statusClasses}`}
                  >
                    {item.statusLabel}
                  </span>
                </div>

                <div className="flex items-start gap-2 mt-4">
                  <FaMapMarkerAlt className="text-[#c9a45c] mt-0.5 text-sm shrink-0" />

                  <p className="text-sm text-[#9f988d] leading-5 font-medium">
                    {item.location ||
                      "Location not available"}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <FaCalendarAlt className="text-[#777066] text-sm" />

                  <p className="text-xs text-[#9f988d] font-medium">
                    Assigned on{" "}
                    {formatListDate(item.requestedAt)}
                  </p>
                </div>

                {item.alreadySubmitted ? (
                  <button
                    type="button"
                    disabled
                    className="block w-full text-center mt-5 py-3 rounded-xl bg-[#c9a45c]/15 border border-[#c9a45c]/25 text-[#c9a45c] text-sm font-extrabold cursor-not-allowed opacity-80"
                  >
                    Verification Already Submitted
                  </button>
                ) : (
                  <Link
                    to={`/agentpropertyverification/${item._id}`}
                    className="block w-full text-center mt-5 py-3 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] text-sm font-extrabold shadow-lg shadow-[#c9a45c]/20 hover:scale-[1.02] transition-all active:scale-95 cursor-pointer"
                  >
                    Start Verification
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full text-[#f5efe3]">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#f5efe3] tracking-tight">
          Property{" "}
          <span className="text-[#c9a45c] drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300">
            Verification
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#9f988d] mt-2 font-medium">
          Verify property details and submit evidence
          for admin review.
        </p>
      </div>

      {loadingProperty ? (
        <div
          className={`${cardBase} p-12 text-center flex flex-col items-center justify-center min-h-[380px]`}
        >
          <div className="animate-spin w-10 h-10 border-4 border-[#c9a45c] border-t-transparent rounded-full mb-4"></div>

          <p className="text-[#9f988d] font-medium">
            Loading property...
          </p>
        </div>
      ) : loadError || !property ? (
        <div
          className={`${cardBase} p-12 text-center flex flex-col items-center justify-center min-h-[380px]`}
        >
          <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center mb-4">
            <FaTimes className="text-[#c9a45c] text-2xl drop-shadow-[0_0_10px_rgba(201,164,92,0.5)] transition-transform duration-300 hover:scale-110" />
          </div>

          <p className="text-[#c9a45c] font-bold">
            {loadError || "Property not found."}
          </p>
        </div>
      ) : verificationAlreadySubmitted || submitted ? (
        <div
          className={`${cardBase} p-8 sm:p-12 text-center max-w-2xl mx-auto`}
        >
          <div className="w-20 h-20 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/25 flex items-center justify-center mx-auto">
            <FaCheck className="text-3xl text-[#c9a45c]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f5efe3] mt-6 tracking-tight">
            Verification Already Submitted
          </h2>

          <p className="text-base text-[#9f988d] mt-3 leading-7 font-medium">
            This property's verification has already
            been submitted. You cannot submit the
            verification again. Admin will review the
            submitted photos, video and verification
            details.
          </p>

          <div className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/25 text-[#c9a45c] font-extrabold text-sm">
            Verification Already Submitted
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          <div className="lg:col-span-4 xl:col-span-3 space-y-5 sm:space-y-6">
            <div
              className={`${cardBase} p-5 sm:p-6`}
            >
              <div className="flex items-center gap-2">
                <FaHome className="text-[#c9a45c] drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300" />

                <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
                  Property Details
                </h2>
              </div>

              <div className="mt-5 rounded-2xl bg-[#050505] border border-[#3a3328] p-4">
                <div className="w-full h-48 rounded-xl bg-[#050505] flex items-center justify-center overflow-hidden border border-[#3a3328]">
                  {property.images?.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={
                        property.title || "Property"
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaHome className="text-6xl text-[#c9a45c]" />
                  )}
                </div>

                <h3 className="text-base font-bold text-[#f5efe3] mt-4">
                  {property.title}
                </h3>

                <p className="text-sm text-[#9f988d] mt-2 leading-6 font-medium">
                  {[
                    property.address?.street,
                    property.address?.area,
                    property.address?.city,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                {getPropertyCoordinates(property)?.length ===
                2 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setShowLocationModal(true)
                    }
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#c9a45c] hover:text-[#dfbf7b] hover:underline cursor-pointer"
                  >
                    <FaMapMarkerAlt />
                    View Owner's Live Location
                  </button>
                ) : (
                  <p className="mt-3 text-xs text-[#c9a45c] bg-[#c9a45c]/10 p-2.5 rounded-lg border border-[#c9a45c]/20 font-medium">
                    Owner did not share a live location
                    pin for this property.
                  </p>
                )}

                <div className="mt-5 text-sm space-y-3 pt-4 border-t border-[#3a3328]">
                  <p>
                    <span className="text-[#777066] font-medium">
                      Property Owner:{" "}
                    </span>

                    <span className="font-bold text-[#f5efe3]">
                      {property.owner?.fullname || "N/A"}
                    </span>
                  </p>

                  <p>
                    <span className="text-[#777066] font-medium">
                      Submitted:{" "}
                    </span>

                    <span className="font-bold text-[#f5efe3]">
                      {property.createdAt
                        ? new Date(
                            property.createdAt
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`${cardBase} p-5 sm:p-6`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
                  Verification Checklist
                </h2>

                {checkedItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setCheckedItems([])
                    }
                    className="text-xs font-bold text-[#c9a45c] hover:text-[#dfbf7b] hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-2">
                {checklist.map((item) => (
                  <label
                    key={item}
                    className={`flex items-center gap-3 text-sm cursor-pointer p-2.5 rounded-lg transition-colors ${
                      checkedItems.includes(item)
                        ? "bg-[#c9a45c]/10"
                        : "hover:bg-[#050505]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(
                        item
                      )}
                      onChange={() =>
                        handleChecklistChange(item)
                      }
                      className="w-5 h-5 accent-[#c9a45c] cursor-pointer"
                    />

                    <span
                      className={
                        checkedItems.includes(item)
                          ? "text-[#f5efe3] font-bold"
                          : "text-[#bdb6aa] font-medium"
                      }
                    >
                      {item}
                    </span>

                    {checkedItems.includes(item) && (
                      <FaCheck className="ml-auto text-[#c9a45c] text-xs" />
                    )}
                  </label>
                ))}
              </div>

              {!isChecklistComplete ? (
                <p className="text-xs text-[#c9a45c] mt-4 leading-5 font-medium bg-[#c9a45c]/10 border border-[#c9a45c]/20 rounded-lg p-3">
                  Complete all checklist items before
                  recording or submitting.
                </p>
              ) : (
                <p className="text-xs text-[#c9a45c] font-bold mt-4 bg-[#c9a45c]/10 border border-[#c9a45c]/20 rounded-lg p-3">
                  ✓ Verification checklist completed.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9 space-y-5 sm:space-y-6">
            <div
              className={`${cardBase} p-5 sm:p-6`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
                    Capture Property Photos
                  </h2>

                  <p className="text-sm text-[#9f988d] mt-1 font-medium">
                    Upload clear photos of all important
                    areas.
                  </p>
                </div>

                <label className="cursor-pointer shrink-0">
                  <span className="px-5 py-2.5 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#c9a45c]/20 transition-all active:scale-95 cursor-pointer">
                    <FaCamera />
                    Add Photos
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotos}
                    className="hidden"
                  />
                </label>
              </div>

              {photos.length === 0 ? (
                <div className="mt-5 border-2 border-dashed border-[#3a3328] rounded-2xl p-10 text-center bg-[#050505] transition-all duration-300 hover:border-[#c9a45c]/40 hover:bg-[#050505] hover:shadow-[0_8px_24px_rgba(201,164,92,0.10)]">
                  <FaUpload className="text-4xl text-[#c9a45c] mx-auto" />

                  <p className="text-sm font-bold text-[#f5efe3] mt-3">
                    No photos uploaded
                  </p>

                  <p className="text-xs text-[#777066] mt-1.5 font-medium">
                    Upload photos of rooms, kitchen,
                    washrooms and common areas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-5">
                  {photos.map((photo, index) => {
                    const imageUrl =
                      URL.createObjectURL(photo);

                    return (
                      <div
                        key={index}
                        className="relative group"
                      >
                        <img
                          src={imageUrl}
                          alt={`Property ${
                            index + 1
                          }`}
                          className="w-full h-28 object-cover rounded-xl border border-[#3a3328] transition-all duration-300 group-hover:border-[#c9a45c]/40 group-hover:shadow-[0_8px_20px_rgba(201,164,92,0.14)]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removePhoto(index)
                          }
                          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-[#050505]/90 text-[#c9a45c] border border-[#3a3328] shadow-md hover:bg-[#c9a45c] hover:text-[#171717] transition-colors cursor-pointer text-sm font-bold"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              className={`${cardBase} p-5 sm:p-6`}
            >
              <div>
                <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
                  Record Live Property Video
                </h2>

                <p className="text-sm text-[#9f988d] mt-1 font-medium">
                  Record a live video showing the current
                  condition of the property.
                </p>
              </div>

              <div className="mt-5 bg-[#050505] border border-[#3a3328] rounded-2xl overflow-hidden h-60 sm:h-85 lg:h-125 relative">
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}

                {!recording && !videoPreview && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#f5efe3]">
                    <div className="w-16 h-16 rounded-full bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
                      <FaVideo className="text-3xl text-[#c9a45c]" />
                    </div>

                    <p className="mt-3 text-sm text-[#9f988d] font-medium">
                      Camera preview will appear here
                    </p>
                  </div>
                )}

                {recording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#c9a45c] text-[#171717] px-3 py-2 rounded-lg text-xs font-extrabold backdrop-blur-sm shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#050505] animate-pulse"></span>
                    REC
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-5">
                {!recording && !videoPreview && (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={!isChecklistComplete}
                    className="px-6 py-3 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] font-extrabold flex items-center gap-2 shadow-lg shadow-[#c9a45c]/20 transition-all active:scale-95 disabled:bg-[#050505] disabled:text-[#777066] disabled:shadow-none disabled:cursor-not-allowed cursor-pointer text-sm"
                  >
                    <FaVideo />
                    Start Recording
                  </button>
                )}

                {recording && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-xl border border-[#c9a45c]/40 text-[#c9a45c] bg-[#c9a45c]/10 font-extrabold hover:bg-[#c9a45c] hover:text-[#171717] transition-all cursor-pointer text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <FaCheck />
                      Finish Recording
                    </span>
                  </button>
                )}

                {videoPreview && (
                  <button
                    type="button"
                    onClick={recordAgain}
                    className="px-6 py-3 rounded-xl border border-[#3a3328] text-[#bdb6aa] bg-[#050505] font-bold hover:border-[#c9a45c] hover:text-[#c9a45c] transition-colors cursor-pointer text-sm"
                  >
                    Record Again
                  </button>
                )}
              </div>

              <p className="text-xs text-[#777066] text-center mt-4 font-medium">
                Please show all rooms, kitchen, washrooms,
                entrance and surrounding areas.
              </p>
            </div>

            <div
              className={`${cardBase} p-5 sm:p-6`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
                  <FaUpload className="text-lg text-[#c9a45c]" />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
                    Verification Submission
                  </h2>

                  <p className="text-sm text-[#9f988d] mt-1 font-medium">
                    Add optional notes before sending to
                    admin.
                  </p>
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={4}
                maxLength={500}
                placeholder="Write any additional notes about the property..."
                className="w-full mt-5 border border-[#3a3328] rounded-xl p-4 text-sm bg-[#050505] text-[#f5efe3] font-medium outline-none resize-none focus:border-[#c9a45c] focus:bg-[#050505] focus:ring-2 focus:ring-[#c9a45c]/10 transition-all placeholder:text-[#777066]"
              />

              {submitError && (
                <p className="text-sm text-[#c9a45c] mt-4 font-medium bg-[#c9a45c]/10 border border-[#c9a45c]/20 rounded-lg p-3">
                  {submitError}
                </p>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6">
                <div className="flex flex-wrap gap-5 text-sm text-[#9f988d] font-medium">
                  <p>
                    Photos:{" "}
                    <span className="font-bold text-[#f5efe3]">
                      {photos.length}
                    </span>
                  </p>

                  <p>
                    Live Video:{" "}
                    <span className="font-bold text-[#c9a45c]">
                      {video ? "✓ Recorded" : "Required"}
                    </span>
                  </p>

                  <p>
                    Checklist:{" "}
                    <span className="font-bold text-[#c9a45c]">
                      {checkedItems.length}/
                      {checklist.length}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    verificationAlreadySubmitted
                  }
                  className="w-full lg:w-auto px-8 py-3.5 rounded-xl bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#c9a45c]/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                  <FaPaperPlane />

                  {isSubmitting
                    ? "Submitting..."
                    : verificationAlreadySubmitted
                    ? "Verification Already Submitted"
                    : "Submit for Admin Review"}

                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLocationModal &&
        getPropertyCoordinates(property)?.length ===
          2 && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#050505] rounded-3xl w-full max-w-2xl shadow-2xl shadow-black/50 overflow-hidden border border-[#3a3328]">
              <div className="flex justify-between items-center p-5 border-b border-[#3a3328] bg-[#050505]">
                <h3 className="text-lg font-extrabold text-[#f5efe3] tracking-tight flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#c9a45c]/10 border border-[#c9a45c]/20 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-[#c9a45c] drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300" />
                  </div>

                  Owner's Live Location
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setShowLocationModal(false)
                  }
                  className="w-9 h-9 rounded-lg bg-[#050505] border border-[#3a3328] text-[#777066] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="h-80 w-full">
                <MapContainer
                  center={[
                    getPropertyCoordinates(property)[1],
                    getPropertyCoordinates(property)[0],
                  ]}
                  zoom={16}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker
                    position={[
                      getPropertyCoordinates(property)[1],
                      getPropertyCoordinates(property)[0],
                    ]}
                    icon={markerIcon}
                  >
                    <Popup>
                      {property.title ||
                        "Property location"}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-t border-[#3a3328] bg-[#050505]">
                <p className="text-xs text-[#9f988d] font-medium">
                  {[
                    property.address?.street,
                    property.address?.area,
                    property.address?.city,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${getPropertyCoordinates(property)[1]},${getPropertyCoordinates(property)[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#c9a45c] hover:text-[#dfbf7b] hover:underline whitespace-nowrap transition-colors"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default AgentPropertyVerification;