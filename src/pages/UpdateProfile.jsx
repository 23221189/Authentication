import React, { useState, useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaCamera,
  FaTrash,
  FaLock,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaVenusMars,
  FaStore,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { updateProfile } from "../api/profileApi.js";
import { changePassword } from "../api/authApi.js";
import { Link } from "react-router-dom";

const SERVER_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const resolvePhoto = (path) =>
  path
    ? path.startsWith("http")
      ? path
      : `${SERVER_ORIGIN}${path}`
    : null;

function UpdateProfile() {
  const { user, setUser } = useAuth();
  const { theme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cnic] = useState(user?.cnic || "");
  const [gender, setGender] = useState(user?.gender || "other");
  const [merchantId, setMerchantId] = useState(
    user?.merchantId || ""
  );

  const [photoFile, setPhotoFile] = useState(null);

  const [photoPreview, setPhotoPreview] = useState(
    resolvePhoto(user?.profileImage)
  );

  const [removeProfileImage, setRemoveProfileImage] =
    useState(false);

  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const [profileSubmitting, setProfileSubmitting] =
    useState(false);

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordSubmitting, setPasswordSubmitting] =
    useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const photoMenuRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.fullname || "");
      setEmail(user.email || "");
      setGender(user.gender || "other");
      setMerchantId(user.merchantId || "");
      setPhotoPreview(resolvePhoto(user.profileImage));

      setPhotoFile(null);
      setRemoveProfileImage(false);
      setShowPhotoMenu(false);
    }
  }, [user]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        photoMenuRef.current &&
        !photoMenuRef.current.contains(event.target)
      ) {
        setShowPhotoMenu(false);
      }
    }

    if (showPhotoMenu) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [showPhotoMenu]);

  function handlePhoto(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileError("");
    setProfileSuccess("");

    if (!file.type.startsWith("image/")) {
      setProfileError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError(
        "Profile picture must be less than 5MB."
      );
      event.target.value = "";
      return;
    }

    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setPhotoFile(file);
    setPhotoPreview(previewUrl);
    setRemoveProfileImage(false);
    setShowPhotoMenu(false);

    event.target.value = "";
  }

  function handleRemovePhoto() {
    if (!isEditing || profileSubmitting) return;

    setProfileError("");
    setProfileSuccess("");

    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(null);
    setPhotoPreview(null);
    setRemoveProfileImage(true);
    setShowPhotoMenu(false);
  }

  function handleCancelEdit() {
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setName(user?.fullname || "");
    setEmail(user?.email || "");
    setGender(user?.gender || "other");
    setMerchantId(user?.merchantId || "");

    setPhotoPreview(resolvePhoto(user?.profileImage));
    setPhotoFile(null);
    setRemoveProfileImage(false);
    setShowPhotoMenu(false);

    setProfileError("");
    setProfileSuccess("");

    setIsEditing(false);
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    setProfileError("");
    setProfileSuccess("");

    if (!name || !email) {
      setProfileError("Name and email are required.");
      return;
    }

    const formData = new FormData();

    formData.append("fullname", name);
    formData.append("email", email);

    if (gender) {
      formData.append("gender", gender);
    }

    if (user?.role === "owner" && merchantId) {
      formData.append("merchantId", merchantId);
    }

    if (photoFile) {
      formData.append("profileImage", photoFile);
    }

    if (removeProfileImage) {
      formData.append("deleteProfileImage", "true");
    }

    setProfileSubmitting(true);

    try {
      const { data } = await updateProfile(formData);

      if (data?.user) {
        setUser(data.user);

        if (removeProfileImage) {
          setPhotoPreview(null);
        } else {
          setPhotoPreview(
            resolvePhoto(data.user?.profileImage)
          );
        }
      }

      setPhotoFile(null);
      setRemoveProfileImage(false);
      setShowPhotoMenu(false);

      setProfileSuccess(
        data?.message || "Profile updated successfully!"
      );

      setIsEditing(false);
    } catch (err) {
      setProfileError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!password || !newPassword || !confirmPassword) {
      setPasswordError(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    setPasswordSubmitting(true);

    try {
      const { data } = await changePassword(
        password,
        newPassword
      );

      setPasswordSuccess(
        data.message || "Password updated successfully!"
      );

      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
          "Failed to update password."
      );
    } finally {
      setPasswordSubmitting(false);
    }
  }

  const inputBase =
    "w-full border rounded-lg p-3 sm:p-3.5 text-sm outline-none font-medium transition-all duration-300 placeholder:text-[var(--theme-muted)]";

  const inputEditable =
    "border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text)] hover:border-[var(--theme-accent)]/70 hover:shadow-sm focus:border-[var(--theme-accent)] focus:bg-[var(--theme-card)] focus:ring-2 focus:ring-[var(--theme-accent)]/20";

  const inputDisabled =
    "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-muted)] cursor-not-allowed";

  const labelBase =
    "block text-xs font-bold text-[var(--theme-muted-light)] mb-1.5 uppercase tracking-wider";

  const cardBase =
    "bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-4 sm:p-6 transition-all duration-500 ease-out shadow-sm hover:border-[var(--theme-accent)]/70 hover:-translate-y-1";

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] font-sans text-[var(--theme-text)] py-5 px-3 sm:py-8 sm:px-4 transition-colors duration-500">

      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px var(--theme-card) inset !important;
          box-shadow: 0 0 0 1000px var(--theme-card) inset !important;
          -webkit-text-fill-color: var(--theme-text) !important;
          caret-color: var(--theme-text) !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        input::selection {
          background: var(--theme-accent);
          color: var(--theme-button-text);
        }

        select option {
          background: var(--theme-card);
          color: var(--theme-accent);
        }
      `}</style>

      <div className="max-w-4xl mx-auto">

        <div className="mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] text-xs sm:text-sm font-bold transition-colors cursor-pointer hover:underline underline-offset-4"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-5 sm:mb-6">

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--theme-text)] tracking-tight">
              My{" "}
              <span className="text-[var(--theme-accent)]">
                Profile
              </span>
            </h1>

            <p className="text-[var(--theme-muted)] text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium leading-5">
              Manage your personal details and security
              settings.
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setProfileError("");
                setProfileSuccess("");
              }}
              className="w-full sm:w-auto border border-[var(--theme-accent)] text-[var(--theme-accent)] px-4 sm:px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[var(--theme-accent)]/10 hover:border-[var(--theme-accent-hover)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer self-start"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto border border-[var(--theme-accent)] text-[var(--theme-accent)] px-4 sm:px-5 py-2.5 rounded-lg text-xs font-bold opacity-80 cursor-not-allowed self-start"
            >
              Editing...
            </button>
          )}
        </div>

        <div
          className={`${cardBase} mb-4 sm:mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6`}
        >

          <div
            ref={photoMenuRef}
            className="relative shrink-0"
          >
            <div className="relative">

              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[var(--theme-accent)]/30"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--theme-card)] border-4 border-[var(--theme-accent)]/30 flex items-center justify-center">
                  <FaUserCircle className="text-5xl sm:text-6xl text-[var(--theme-accent)]" />
                </div>
              )}

              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setShowPhotoMenu((prev) => !prev)
                    }
                    disabled={profileSubmitting}
                    className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--theme-accent)] text-[var(--theme-button-text)] border-2 border-[var(--theme-surface)] flex items-center justify-center hover:bg-[var(--theme-accent-hover)] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Profile picture options"
                  >
                    <FaCamera className="text-sm" />
                  </button>

                  {showPhotoMenu && (
                    <div className="absolute top-[105%] left-1/2 -translate-x-1/2 z-50 w-44 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl shadow-xl p-2">

                      <label className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] cursor-pointer transition-all">
                        <FaCamera className="text-[var(--theme-accent)]" />

                        {photoPreview
                          ? "Change Picture"
                          : "Add Picture"}

                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="hidden"
                          onChange={handlePhoto}
                          disabled={profileSubmitting}
                        />
                      </label>

                      {photoPreview && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          disabled={profileSubmitting}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaTrash className="text-[var(--theme-accent)]" />
                          Remove Picture
                        </button>
                      )}

                    </div>
                  )}
                </>
              )}

            </div>
          </div>

          <div className="text-center sm:text-left min-w-0 flex-1">

            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">

              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--theme-text)] truncate tracking-tight">
                {name || user?.fullname || "User"}
              </h2>

              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                  user?.isVerified
                    ? "bg-[var(--theme-card)] text-[var(--theme-accent)] border border-[var(--theme-accent)]/40"
                    : "bg-[var(--theme-card)] text-[var(--theme-muted-light)] border border-[var(--theme-border)]"
                }`}
              >
                {user?.isVerified
                  ? "✓ Verified"
                  : "⏳ Email Unverified"}
              </span>

            </div>

            <p className="text-[var(--theme-muted-light)] text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium break-all">
              {email || user?.email}
            </p>

            <p className="text-xs font-bold text-[var(--theme-accent)] uppercase mt-2 tracking-wider bg-[var(--theme-card)] border border-[var(--theme-accent)]/20 px-2.5 py-1 rounded-md inline-block">
              {user?.role}
            </p>

            {isEditing && removeProfileImage && (
              <p className="mt-3 text-xs font-medium text-[var(--theme-accent)]">
                Profile picture will be removed when you
                save changes.
              </p>
            )}

          </div>
        </div>

        <div className={`${cardBase} mb-6`}>

          <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--theme-card)] border border-[var(--theme-accent)]/30 flex items-center justify-center">
              <FaUser className="text-[var(--theme-accent)]" />
            </div>

            <h2 className="text-base sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
              Personal Information
            </h2>

          </div>

          {profileError && (
            <p className="text-xs text-[var(--theme-danger-text)] bg-[var(--theme-card)] border border-[var(--theme-danger)]/30 rounded-lg px-4 py-3 mb-4 font-medium">
              ⚠️ {profileError}
            </p>
          )}

          {profileSuccess && (
            <p className="text-xs text-[var(--theme-success-text)] bg-[var(--theme-card)] border border-[var(--theme-success)]/30 rounded-lg px-4 py-3 mb-4 font-bold">
              ✓ {profileSuccess}
            </p>
          )}

          <form onSubmit={handleProfileSubmit}>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">

              <div>
                <label className={labelBase}>
                  <FaUser className="inline mr-1.5 text-[var(--theme-accent)] text-[10px]" />
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  disabled={!isEditing}
                  className={`${inputBase} ${
                    isEditing
                      ? inputEditable
                      : inputDisabled
                  }`}
                />
              </div>

              <div>
                <label className={labelBase}>
                  <FaEnvelope className="inline mr-1.5 text-[var(--theme-accent)] text-[10px]" />
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={!isEditing}
                  className={`${inputBase} ${
                    isEditing
                      ? inputEditable
                      : inputDisabled
                  }`}
                />
              </div>

              <div>
                <label className={labelBase}>
                  <FaIdCard className="inline mr-1.5 text-[var(--theme-accent)] text-[10px]" />
                  CNIC{" "}
                  <span className="text-[var(--theme-muted)] font-medium">
                    (Verified)
                  </span>
                </label>

                <input
                  type="text"
                  value={cnic}
                  disabled
                  className={`${inputBase} ${inputDisabled}`}
                />
              </div>

              <div>
                <label className={labelBase}>
                  <FaVenusMars className="inline mr-1.5 text-[var(--theme-accent)] text-[10px]" />
                  Gender
                </label>

                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value)
                  }
                  disabled={!isEditing}
                  className={`${inputBase} ${
                    isEditing
                      ? inputEditable
                      : inputDisabled
                  } cursor-pointer capitalize`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {user?.role === "owner" && (
                <div className="sm:col-span-2">

                  <label className={labelBase}>
                    <FaStore className="inline mr-1.5 text-[var(--theme-accent)] text-[10px]" />
                    Safepay Merchant ID
                  </label>

                  <input
                    type="text"
                    value={merchantId}
                    onChange={(e) =>
                      setMerchantId(e.target.value)
                    }
                    disabled={!isEditing}
                    className={`${inputBase} ${
                      isEditing
                        ? inputEditable
                        : inputDisabled
                    }`}
                  />

                </div>
              )}

            </div>

            {isEditing && (
              <div className="flex flex-row justify-end gap-2.5 sm:gap-3 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[var(--theme-border)]">

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={profileSubmitting}
                  className="flex-1 sm:flex-none border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-muted-light)] px-4 sm:px-6 py-2.5 rounded-lg text-xs font-bold hover:border-[var(--theme-accent)] hover:text-[var(--theme-text)] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="flex-1 sm:flex-none bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] text-xs font-bold px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {profileSubmitting
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>
            )}

          </form>

        </div>

        <div className={cardBase}>

          <div className="flex items-center gap-3 mb-1">

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--theme-card)] border border-[var(--theme-accent)]/30 flex items-center justify-center">
              <FaLock className="text-[var(--theme-accent)]" />
            </div>

            <h2 className="text-base sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
              Change Password
            </h2>

          </div>

          <p className="text-xs text-[var(--theme-muted)] mb-4 sm:mb-5 ml-0 sm:ml-13 leading-5 font-medium">
            Ensure your account uses a strong password
            (minimum 8 characters).
          </p>

          {passwordError && (
            <p className="text-xs text-[var(--theme-danger-text)] bg-[var(--theme-card)] border border-[var(--theme-danger)]/30 rounded-lg px-4 py-3 mb-4 font-medium">
              ⚠️ {passwordError}
            </p>
          )}

          {passwordSuccess && (
            <p className="text-xs text-[var(--theme-success-text)] bg-[var(--theme-card)] border border-[var(--theme-success)]/30 rounded-lg px-4 py-3 mb-4 font-bold">
              ✓ {passwordSuccess}
            </p>
          )}

          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-4"
          >

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">

              <div>
                <label className={labelBase}>
                  Current Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className={`${inputBase} ${inputEditable}`}
                />
              </div>

              <div>
                <label className={labelBase}>
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className={`${inputBase} ${inputEditable}`}
                />
              </div>

              <div>
                <label className={labelBase}>
                  Confirm New Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className={`${inputBase} ${inputEditable}`}
                />
              </div>

            </div>

            <div className="flex justify-end pt-3 border-t border-[var(--theme-border)]">

              <button
                type="submit"
                disabled={passwordSubmitting}
                className="flex-1 sm:flex-none bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] text-xs font-bold px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {passwordSubmitting
                  ? "Updating..."
                  : "🔒 Update Password"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default UpdateProfile;