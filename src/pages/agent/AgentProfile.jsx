import React, { useState, useRef, useEffect } from "react";
import {
  FaUserCircle,
  FaLock,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaCamera,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../api/authApi";
import { updateProfile } from "../../api/profileApi";

function AgentProfile() {
  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [saving, setSaving] = useState(false);

  const [savedProfile, setSavedProfile] = useState({
    fullName: "",
    email: "",
    cnic: "",
    address: "",
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cnic, setCNIC] = useState("");
  const [address, setAddress] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const fileInputRef = useRef(null);
  const photoMenuRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    const profileData = {
      fullName:
        user.fullname ||
        user.fullName ||
        user.name ||
        "",
      email: user.email || "",
      cnic: user.cnic || "",
      address: user.address || "",
    };

    setSavedProfile(profileData);
    setFullName(profileData.fullName);
    setEmail(profileData.email);
    setCNIC(profileData.cnic);
    setAddress(profileData.address);

    setProfileImage(user.profileImage || null);
    setProfileImageFile(null);
    setRemoveProfileImage(false);
    setShowPhotoMenu(false);
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
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showPhotoMenu]);

  function handleFullName(event) {
    setFullName(event.target.value);
  }

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handleCNIC(event) {
    setCNIC(event.target.value);
  }

  function handleAddress(event) {
    setAddress(event.target.value);
  }

  function handleImageClick() {
    if (!isEditing || saving) return;

    setShowPhotoMenu((prev) => !prev);
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    reader.onerror = () => {
      alert("Failed to read the image.");
    };

    reader.readAsDataURL(file);

    setProfileImageFile(file);
    setRemoveProfileImage(false);
    setShowPhotoMenu(false);

    event.target.value = "";
  }

  function handleRemovePhoto() {
    if (!isEditing || saving) return;

    setProfileImage(null);
    setProfileImageFile(null);
    setRemoveProfileImage(true);
    setShowPhotoMenu(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleEditClick() {
    setIsEditing(true);
    setRemoveProfileImage(false);
    setShowPhotoMenu(false);
  }

  function handleCancel() {
    setFullName(savedProfile.fullName);
    setEmail(savedProfile.email);
    setCNIC(savedProfile.cnic);
    setAddress(savedProfile.address);

    setProfileImage(user?.profileImage || null);
    setProfileImageFile(null);
    setRemoveProfileImage(false);
    setShowPhotoMenu(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsEditing(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!fullName || !email || !address) {
      alert("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    const formData = new FormData();

    formData.append("fullname", fullName);
    formData.append("email", email);
    formData.append("address", address);

    if (profileImageFile) {
      formData.append("profileImage", profileImageFile);
    }

    if (removeProfileImage) {
      formData.append("deleteProfileImage", "true");
    }

    setSaving(true);

    try {
      const { data } = await updateProfile(formData);

      if (data?.user) {
        setSavedProfile({
          fullName: data.user.fullname,
          email: data.user.email,
          cnic: data.user.cnic,
          address: data.user.address,
        });

        setProfileImage(data.user.profileImage || null);

        if (setUser) {
          setUser(data.user);
        }
      }

      alert(
        data?.message ||
          "Profile updated successfully!"
      );

      setIsEditing(false);
      setProfileImageFile(null);
      setRemoveProfileImage(false);
      setShowPhotoMenu(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(event) {
    event.preventDefault();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert("Please fill all password fields");
      return;
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 16
    ) {
      alert(
        "New password must be between 8 and 16 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(
        "New password and confirm password do not match"
      );
      return;
    }

    try {
      const response = await changePassword(
        currentPassword,
        newPassword
      );

      alert(
        response.data?.message ||
          "Password changed successfully!"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowPasswordChange(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error(
        "Password change error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Password could not be changed. Please try again."
      );
    }
  }

  const inputBase =
    "w-full mt-2 border rounded-xl p-3.5 outline-none text-sm font-medium transition-all placeholder:text-[#777066]";

  const inputEditable =
    "border-[#3a3328] bg-[#050505] text-[#f5efe3] focus:border-[#c9a45c] focus:bg-[#050505] focus:ring-2 focus:ring-[#c9a45c]/10";

  const inputDisabled =
    "border-[#3a3328] bg-[#050505] text-[#777066] cursor-not-allowed";

  const labelBase =
    "font-bold text-[#f5efe3] text-sm flex items-center gap-2";

  const cardBase =
    "bg-[#050505] rounded-2xl border border-[#c9a45c]/35 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#050505] hover:shadow-[0_12px_35px_rgba(201,164,92,0.28)] active:translate-y-0 active:shadow-[0_0_32px_rgba(201,164,92,0.38)]";

  return (
    <div className="w-full text-[#f5efe3]">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">

        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#c9a45c] tracking-tight">
            My{" "}
            <span className="text-[#c9a45c]">
              Profile
            </span>
          </h1>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="self-start border-2 border-[#c9a45c] text-[#c9a45c] px-6 py-2.5 rounded-xl font-bold hover:bg-[#c9a45c]/10 hover:shadow-[0_0_22px_rgba(201,164,92,0.22)] transition-all cursor-pointer"
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <button
            type="button"
            disabled={saving}
            className="self-start border-2 border-[#c9a45c] text-[#c9a45c] px-6 py-2.5 rounded-xl font-bold bg-[#c9a45c]/10 cursor-default disabled:opacity-70"
          >
            ✏️ Editing...
          </button>
        )}

      </div>

      <div
        className={`${cardBase} p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left`}
      >

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        <div
          ref={photoMenuRef}
          className="relative group shrink-0"
        >

          <div className="relative">

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#c9a45c]/10 flex items-center justify-center border-2 border-[#c9a45c]/20">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-7xl sm:text-8xl text-[#c9a45c]" />
              )}

            </div>

            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={saving}
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#F5B301] hover:bg-[#D99A00] flex items-center justify-center text-[#171717] shadow-lg shadow-[#c9a45c]/20 transition-all cursor-pointer border-2 border-[#211f1b] disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Profile picture options"
                >
                  <FaCamera className="text-sm" />
                </button>

                {showPhotoMenu && (
                  <div className="absolute top-[105%] left-1/2 -translate-x-1/2 z-50 w-48 bg-[#0b0b0b] border border-[#3a3328] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-2">

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={saving}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-[#f5efe3] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCamera className="text-[#c9a45c]" />

                      {profileImage
                        ? "Change Picture"
                        : "Add Picture"}
                    </button>

                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={saving}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-[#f5efe3] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTrash className="text-[#c9a45c]" />
                        Remove Picture
                      </button>
                    )}

                  </div>
                )}
              </>
            )}

          </div>

        </div>

        <div className="min-w-0">

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#f5efe3]">
            {savedProfile.fullName || "Agent"}
          </h2>

          <p className="text-[#9f988d] mt-2 text-sm font-medium flex items-center gap-2 justify-center sm:justify-start truncate">
            <FaEnvelope className="text-[#c9a45c] shrink-0" />
            {savedProfile.email ||
              "No email added yet"}
          </p>

          <p className="text-xs text-[#777066] mt-2 font-medium">
            {isEditing
              ? "Click the camera icon to manage your profile picture"
              : "Click Edit Profile to change your picture"}
          </p>

          {isEditing && removeProfileImage && (
            <p className="text-xs text-[#c9a45c] mt-2 font-medium">
              Profile picture will be removed when you save changes.
            </p>
          )}

        </div>

      </div>

      <div
        className={`${cardBase} p-5 sm:p-6 mt-6`}
      >

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-[#c9a45c]/10 flex items-center justify-center">
            <FaUser className="text-[#c9a45c]" />
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
            Personal Information
          </h2>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div>
              <label className={labelBase}>
                <FaUser className="text-[#c9a45c] text-xs" />
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={handleFullName}
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
                <FaEnvelope className="text-[#c9a45c] text-xs" />
                Email
              </label>

              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={handleEmail}
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
                <FaIdCard className="text-[#c9a45c] text-xs" />
                CNIC
              </label>

              <input
                type="text"
                placeholder="35403-8452167-0"
                value={cnic}
                onChange={handleCNIC}
                disabled
                className={`${inputBase} ${inputDisabled}`}
              />
            </div>

            <div>
              <label className={labelBase}>
                <FaMapMarkerAlt className="text-[#c9a45c] text-xs" />
                Address
              </label>

              <input
                type="text"
                placeholder="City, Pakistan"
                value={address}
                onChange={handleAddress}
                disabled={!isEditing}
                className={`${inputBase} ${
                  isEditing
                    ? inputEditable
                    : inputDisabled
                }`}
              />
            </div>

          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="border-2 border-[#3a3328] text-[#bdb6aa] px-8 py-3 rounded-xl font-bold hover:bg-[#050505] transition-colors w-full sm:w-fit cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-8 py-3 rounded-xl font-bold shadow-lg shadow-black/30 hover:shadow-[0_0_24px_rgba(201,164,92,0.3)] hover:scale-[1.02] transition-all active:scale-95 w-full sm:w-fit cursor-pointer disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          )}

        </form>

      </div>

      <div
        className={`${cardBase} p-5 sm:p-6 mt-6`}
      >

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-[#c9a45c]/10 flex items-center justify-center">
              <FaLock className="text-[#c9a45c] text-lg" />
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                Password & Security
              </h2>

              <p className="text-sm text-[#9f988d] mt-1 font-medium">
                Keep your agent account secure.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setShowPasswordChange(
                !showPasswordChange
              )
            }
            className="border-2 border-[#c9a45c] text-[#c9a45c] px-6 py-2.5 rounded-xl hover:bg-[#c9a45c]/10 transition-colors font-bold w-full sm:w-fit cursor-pointer"
          >
            {showPasswordChange
              ? "Cancel"
              : "Change Password"}
          </button>

        </div>

        {showPasswordChange && (
          <form
            onSubmit={handlePasswordChange}
            className="mt-6 border-t border-[#c9a45c]/20 pt-6"
          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <div>
                <label className="font-bold text-[#f5efe3] text-sm">
                  Current Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    className={`${inputBase} ${inputEditable} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a45c] hover:text-[#dfbf7b] cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>
              </div>

              <div>
                <label className="font-bold text-[#f5efe3] text-sm">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Min 8 characters"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    className={`${inputBase} ${inputEditable} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a45c] hover:text-[#dfbf7b] cursor-pointer"
                  >
                    {showNewPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>
              </div>

              <div>
                <label className="font-bold text-[#f5efe3] text-sm">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className={`${inputBase} ${inputEditable} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a45c] hover:text-[#dfbf7b] cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>
              </div>

            </div>

            <div className="flex justify-end mt-6">

              <button
                type="submit"
                className="bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-7 py-3 rounded-xl font-bold shadow-lg shadow-black/30 hover:shadow-[0_0_24px_rgba(201,164,92,0.3)] hover:scale-[1.02] transition-all active:scale-95 cursor-pointer"
              >
                Update Password
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
}

export default AgentProfile;