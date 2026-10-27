import React, { useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext.jsx";

function CnicUpload({ onFrontChange, onBackChange }) {
  const { theme } = useTheme();

  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFrontSelect = (e) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setFrontFile(file);

      if (frontPreview) {
        URL.revokeObjectURL(frontPreview);
      }

      setFrontPreview(URL.createObjectURL(file));

      if (onFrontChange) {
        onFrontChange(file);
      }
    }
  };

  const handleBackSelect = (e) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setBackFile(file);

      if (backPreview) {
        URL.revokeObjectURL(backPreview);
      }

      setBackPreview(URL.createObjectURL(file));

      if (onBackChange) {
        onBackChange(file);
      }
    }
  };

  const openPreview = (url) => {
    if (url) {
      setPreviewImage(url);
    }
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const overlayColor =
    theme === "offwhite"
      ? "rgba(255, 253, 248, 0.90)"
      : "rgba(5, 5, 5, 0.90)";

  return (
    <>
      <div
        className="space-y-3 text-left w-full p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          boxShadow:
            theme === "offwhite"
              ? "0 8px 25px rgba(43,33,24,0.10)"
              : "0 8px 25px rgba(0,0,0,0.40)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor =
            "var(--theme-accent)";
          e.currentTarget.style.boxShadow =
            theme === "offwhite"
              ? "0 12px 32px rgba(43,33,24,0.16)"
              : "0 12px 32px rgba(0,0,0,0.55)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor =
            "var(--theme-border)";
          e.currentTarget.style.boxShadow =
            theme === "offwhite"
              ? "0 8px 25px rgba(43,33,24,0.10)"
              : "0 8px 25px rgba(0,0,0,0.40)";
        }}
      >
        <label
          className="block text-xs font-bold mb-2"
          style={{
            color: "var(--theme-text)",
          }}
        >
          CNIC Upload
        </label>

        <div
          className="flex items-center justify-between py-2 border-b gap-3 transition-all duration-300"
          style={{
            borderColor: "var(--theme-border)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {frontFile ? (
              <FaCheckCircle
                className="w-4 h-4 shrink-0"
                style={{
                  color: "var(--theme-accent)",
                }}
              />
            ) : (
              <div
                className="w-4 h-4 rounded-full border-2 shrink-0"
                style={{
                  borderColor:
                    "var(--theme-muted-dark)",
                }}
              />
            )}

            <span
              className="text-xs font-medium"
              style={{
                color:
                  "var(--theme-muted-light)",
              }}
            >
              CNIC (Front):
            </span>
          </div>

          <div className="shrink-0">
            {frontFile ? (
              <button
                type="button"
                onClick={() => openPreview(frontPreview)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  border:
                    "1px solid var(--theme-border)",
                  color:
                    "var(--theme-accent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--theme-accent)";
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    theme === "offwhite"
                      ? "0 6px 16px rgba(139,90,43,0.16)"
                      : "0 6px 16px rgba(201,164,92,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--theme-border)";
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "none";
                }}
              >
                <span>View</span>

                <FiExternalLink
                  className="w-3 h-3"
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                />
              </button>
            ) : (
              <label
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-block"
                style={{
                  border:
                    "1px solid var(--theme-accent)",
                  color:
                    "var(--theme-accent)",
                  backgroundColor:
                    "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--theme-accent)";
                  e.currentTarget.style.color =
                    "var(--theme-button-text)";
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    theme === "offwhite"
                      ? "0 6px 18px rgba(139,90,43,0.18)"
                      : "0 6px 18px rgba(201,164,92,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "transparent";
                  e.currentTarget.style.color =
                    "var(--theme-accent)";
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "none";
                }}
              >
                Upload

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFrontSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-2 gap-3 transition-all duration-300">
          <div className="flex items-center gap-2 min-w-0">
            {backFile ? (
              <FaCheckCircle
                className="w-4 h-4 shrink-0"
                style={{
                  color:
                    "var(--theme-accent)",
                }}
              />
            ) : (
              <div
                className="w-4 h-4 rounded-full border-2 shrink-0"
                style={{
                  borderColor:
                    "var(--theme-muted-dark)",
                }}
              />
            )}

            <span
              className="text-xs font-medium"
              style={{
                color:
                  "var(--theme-muted-light)",
              }}
            >
              CNIC (Back):
            </span>
          </div>

          <div className="shrink-0">
            {backFile ? (
              <button
                type="button"
                onClick={() => openPreview(backPreview)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor:
                    "var(--theme-card)",
                  border:
                    "1px solid var(--theme-border)",
                  color:
                    "var(--theme-accent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--theme-accent)";
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    theme === "offwhite"
                      ? "0 6px 16px rgba(139,90,43,0.16)"
                      : "0 6px 16px rgba(201,164,92,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--theme-border)";
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "none";
                }}
              >
                <span>View</span>

                <FiExternalLink
                  className="w-3 h-3"
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                />
              </button>
            ) : (
              <label
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-block"
                style={{
                  border:
                    "1px solid var(--theme-accent)",
                  color:
                    "var(--theme-accent)",
                  backgroundColor:
                    "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--theme-accent)";
                  e.currentTarget.style.color =
                    "var(--theme-button-text)";
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    theme === "offwhite"
                      ? "0 6px 18px rgba(139,90,43,0.18)"
                      : "0 6px 18px rgba(201,164,92,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "transparent";
                  e.currentTarget.style.color =
                    "var(--theme-accent)";
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "none";
                }}
              >
                Upload

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-[999] backdrop-blur-sm flex items-center justify-center p-4"
          style={{
            backgroundColor: overlayColor,
          }}
          onClick={closePreview}
        >
          <div
            className="relative rounded-xl p-3 max-w-sm w-full transition-all duration-300"
            style={{
              backgroundColor:
                "var(--theme-surface)",
              border:
                "1px solid var(--theme-accent)",
              boxShadow:
                theme === "offwhite"
                  ? "0 0 40px rgba(139,90,43,0.22)"
                  : "0 0 40px rgba(201,164,92,0.28)",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={closePreview}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor:
                  "var(--theme-accent)",
                color:
                  "var(--theme-button-text)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 5px 18px rgba(139,90,43,0.20)"
                    : "0 5px 18px rgba(201,164,92,0.30)",
              }}
            >
              <FaTimes className="text-sm" />
            </button>

            <img
              src={previewImage}
              alt="CNIC Preview"
              className="w-full max-h-[300px] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default CnicUpload;