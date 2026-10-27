import React, { useState } from "react";
import {
  FaXmark,
  FaCalendarCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext.jsx";

const ReserveNowButton = ({ onReserve, className = "" }) => {
  const { theme } = useTheme();

  const isOffWhite = theme === "offwhite";

  const buttonShadow = isOffWhite
    ? "0 0 16px rgba(139,90,43,0.18)"
    : "0 0 16px rgba(201,164,92,0.30)";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onReserve();
      }}
      className={`absolute bottom-2 right-2 z-10 flex items-center gap-1.5 font-extrabold text-[10px] sm:text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${className}`}
      style={{
        backgroundColor: "var(--theme-accent)",
        color: "var(--theme-button-text)",
        border: "1px solid var(--theme-accent)",
        boxShadow: buttonShadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor =
          "var(--theme-accent-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor =
          "var(--theme-accent)";
      }}
    >
      <FaCalendarCheck className="text-[10px] sm:text-xs" />
      Reserve Now
    </button>
  );
};

const PropertyGallery = ({
  images = [],
  propertyTitle,
  onReserve,
  selectedFacilities = [],
  roomTypeOptions = [],
  propertyRooms = [],
}) => {
  const { theme } = useTheme();

  const isOffWhite = theme === "offwhite";

  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalImages = images.length;

  const getRoomForImage = (imageIndex) => {
    const lookupMaxGuests = (acType, category) => {
      const match = roomTypeOptions.find(
        (rt) =>
          rt.acType === acType &&
          rt.category === category &&
          rt.available > 0
      );

      if (match) {
        return Number(match.maxGuestsPerRoom || 1);
      }

      const fallback = roomTypeOptions.find(
        (rt) => rt.acType === acType
      );

      return Number(fallback?.maxGuestsPerRoom || 1);
    };

    if (
      Array.isArray(propertyRooms) &&
      propertyRooms.length > 0 &&
      imageIndex < propertyRooms.length
    ) {
      const r = propertyRooms[imageIndex];

      if (r && r.acType && r.category) {
        return {
          acType: r.acType,
          category: r.category,
          maxGuestsPerRoom: Number(
            r.maxGuestsPerRoom ||
              lookupMaxGuests(r.acType, r.category)
          ),
        };
      }
    }

    const availableTypes = roomTypeOptions.filter(
      (rt) => rt.available > 0
    );

    if (availableTypes.length > 0) {
      const rt =
        availableTypes[imageIndex % availableTypes.length];

      return {
        acType: rt.acType || "Non-AC",
        category: rt.category || "Single",
        maxGuestsPerRoom: Number(
          rt.maxGuestsPerRoom || 1
        ),
      };
    }

    if (roomTypeOptions.length > 0) {
      const rt =
        roomTypeOptions[imageIndex % roomTypeOptions.length];

      return {
        acType: rt.acType || "Non-AC",
        category: rt.category || "Single",
        maxGuestsPerRoom: Number(
          rt.maxGuestsPerRoom || 1
        ),
      };
    }

    return null;
  };

  const handleReserveClick = (imageUrl, imageIndex) => {
    if (onReserve) {
      const room = getRoomForImage(imageIndex);

      onReserve(
        imageUrl,
        selectedFacilities,
        room
      );
    }
  };

  const openAllPhotos = (startIndex = 0) => {
    setCurrentIndex(startIndex);
    setShowAllPhotos(true);
  };

  const closeAllPhotos = () => {
    setShowAllPhotos(false);
    setCurrentIndex(0);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();

    setCurrentIndex(
      (prev) => (prev + 1) % images.length
    );
  };

  const prevPhoto = (e) => {
    e.stopPropagation();

    setCurrentIndex(
      (prev) =>
        (prev - 1 + images.length) % images.length
    );
  };

  const cardShadow = isOffWhite
    ? "0 0 18px rgba(43,33,24,0.08)"
    : "0 0 18px rgba(0,0,0,0.25)";

  const hoverShadow = isOffWhite
    ? "0 0 28px rgba(139,90,43,0.14)"
    : "0 0 28px rgba(0,0,0,0.35)";

  const hoverBorder = isOffWhite
    ? "rgba(139,90,43,0.60)"
    : "rgba(201,164,92,0.60)";

  const modalSurface = isOffWhite
    ? "rgba(255,253,248,0.94)"
    : "rgba(5,5,5,0.94)";

  const modalBorder = isOffWhite
    ? "rgba(139,90,43,0.40)"
    : "rgba(201,164,92,0.40)";

  const modalButtonShadow = isOffWhite
    ? "0 0 20px rgba(139,90,43,0.22)"
    : "0 0 20px rgba(201,164,92,0.30)";

  if (!images.length) {
    return null;
  }

  const getGalleryClass = () => {
    if (totalImages === 1) {
      return "grid grid-cols-1";
    }

    if (totalImages === 2) {
      return "grid grid-cols-1 sm:grid-cols-2";
    }

    if (totalImages === 3) {
      return "grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2";
    }

    if (totalImages === 4) {
      return "grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2";
    }

    if (totalImages === 5) {
      return "grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2";
    }

    if (totalImages === 6) {
      return "grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2";
    }

    return "grid grid-cols-1 sm:grid-cols-4";
  };

  const getImageClass = (index) => {
    if (totalImages === 3 && index === 0) {
      return "sm:col-span-2 sm:row-span-2";
    }

    if (totalImages === 4 && index === 0) {
      return "sm:col-span-2 sm:row-span-2";
    }

    if (totalImages === 5 && index === 0) {
      return "sm:col-span-2 sm:row-span-2";
    }

    if (totalImages === 6 && index === 0) {
      return "sm:col-span-2 sm:row-span-2";
    }

    return "";
  };

  const getGalleryStyle = () => {
    if (totalImages === 1) {
      return {
        minHeight: "320px",
      };
    }

    if (totalImages === 2) {
      return {
        height: "420px",
      };
    }

    if (totalImages === 3) {
      return {
        height: "420px",
      };
    }

    if (totalImages === 4) {
      return {
        height: "500px",
      };
    }

    if (totalImages === 5) {
      return {
        height: "520px",
      };
    }

    if (totalImages === 6) {
      return {
        height: "520px",
      };
    }

    return {
      height: "520px",
    };
  };

  return (
    <>
      <div
        id="photos"
        className={`${getGalleryClass()} gap-0 mb-8 rounded-xl overflow-hidden`}
        style={{
          ...getGalleryStyle(),
          border: "1px solid var(--theme-border)",
          backgroundColor: "var(--theme-surface)",
          boxShadow: cardShadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = hoverBorder;
          e.currentTarget.style.boxShadow = hoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor =
            "var(--theme-border)";
          e.currentTarget.style.boxShadow = cardShadow;
        }}
      >
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`
              relative overflow-hidden group cursor-pointer
              min-h-[220px]
              sm:min-h-0
              ${getImageClass(index)}
            `}
            style={{
              backgroundColor: "var(--theme-surface)",
            }}
            onClick={() => openAllPhotos(index)}
          >
            <img
              src={image}
              alt={`${propertyTitle} - ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />

            <ReserveNowButton
              onReserve={() =>
                handleReserveClick(
                  image,
                  index
                )
              }
            />
          </div>
        ))}
      </div>

      {showAllPhotos && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-3 sm:p-4"
          style={{
            backgroundColor: isOffWhite
              ? "rgba(43,33,24,0.94)"
              : "rgba(0,0,0,0.95)",
          }}
          onClick={closeAllPhotos}
        >
          <button
            onClick={closeAllPhotos}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 rounded-full p-2 sm:p-3 transition-all cursor-pointer z-10"
            style={{
              color: "var(--theme-text)",
              backgroundColor: isOffWhite
                ? "rgba(255,253,248,0.16)"
                : "rgba(0,0,0,0.50)",
              border: `1px solid ${modalBorder}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                "var(--theme-accent)";
              e.currentTarget.style.backgroundColor =
                isOffWhite
                  ? "rgba(255,253,248,0.24)"
                  : "rgba(0,0,0,0.80)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                "var(--theme-text)";
              e.currentTarget.style.backgroundColor =
                isOffWhite
                  ? "rgba(255,253,248,0.16)"
                  : "rgba(0,0,0,0.50)";
            }}
            aria-label="Close"
          >
            <FaXmark className="text-xl sm:text-2xl" />
          </button>

          <div
            className="absolute top-3 left-3 sm:top-6 sm:left-6 font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg"
            style={{
              backgroundColor: modalSurface,
              color: "var(--theme-accent)",
              border: `1px solid ${modalBorder}`,
            }}
          >
            {currentIndex + 1} / {totalImages}
          </div>

          {totalImages > 1 && (
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 rounded-full p-2.5 sm:p-4 transition-all cursor-pointer z-10"
              style={{
                backgroundColor: isOffWhite
                  ? "rgba(255,253,248,0.16)"
                  : "rgba(0,0,0,0.80)",
                color: "var(--theme-accent)",
                border: `1px solid ${modalBorder}`,
              }}
              aria-label="Previous"
            >
              <FaChevronLeft className="text-base sm:text-xl" />
            </button>
          )}

          {totalImages > 1 && (
            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 rounded-full p-2.5 sm:p-4 transition-all cursor-pointer z-10"
              style={{
                backgroundColor: isOffWhite
                  ? "rgba(255,253,248,0.16)"
                  : "rgba(0,0,0,0.80)",
                color: "var(--theme-accent)",
                border: `1px solid ${modalBorder}`,
              }}
              aria-label="Next"
            >
              <FaChevronRight className="text-base sm:text-xl" />
            </button>
          )}

          <div
            className="relative w-full max-w-6xl flex flex-col items-center px-2 sm:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${propertyTitle} - ${
                currentIndex + 1
              }`}
              className="max-w-full max-h-[65vh] sm:max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />

            <button
              type="button"
              onClick={() => {
                handleReserveClick(
                  images[currentIndex],
                  currentIndex
                );

                closeAllPhotos();
              }}
              className="mt-4 sm:mt-6 flex items-center gap-2 font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              style={{
                backgroundColor:
                  "var(--theme-accent)",
                color:
                  "var(--theme-button-text)",
                boxShadow:
                  modalButtonShadow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--theme-accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--theme-accent)";
              }}
            >
              <FaCalendarCheck />
              Reserve This Room
            </button>
          </div>

          {totalImages > 1 && (
            <div
              className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg max-w-[90vw] overflow-x-auto"
              style={{
                backgroundColor: modalSurface,
                border:
                  "1px solid var(--theme-border)",
              }}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(i);
                  }}
                  className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-md overflow-hidden border-2 cursor-pointer"
                  style={{
                    borderColor:
                      i === currentIndex
                        ? "var(--theme-accent)"
                        : "transparent",
                    opacity:
                      i === currentIndex
                        ? 1
                        : 0.6,
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumb ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PropertyGallery;