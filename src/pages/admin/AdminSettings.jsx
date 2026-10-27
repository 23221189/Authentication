import { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaGlobe,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaEdit,
  FaCamera,
  FaTrash,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext.jsx";
import { updateProfile } from "../../api/profileApi";
import { changePassword } from "../../api/authApi";

function AdminSettings() {
  const { user, setUser } = useAuth();
  const { theme } = useTheme();
  const isOffWhite = theme === "offwhite";

  const [activeTab, setActiveTab] = useState("profile");
  const [tabDropdownOpen, setTabDropdownOpen] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [websiteEditing, setWebsiteEditing] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const fileInputRef = useRef(null);
  const photoMenuRef = useRef(null);

  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "Administrator",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    newUsers: true,
    newProperties: true,
    newBookings: true,
    payments: true,
    complaints: true,
    agentApplications: true,
  });

  const [website, setWebsite] = useState({
    siteName: "PG Stay",
    email: "support@pgstay.com",
  });

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.fullname || user.name || "Admin",
      email: user.email || "",
      role:
        user.role === "admin"
          ? "Administrator"
          : user.role || "Admin",
    });

    setProfileImage(user.profileImage || null);
    setRemoveProfileImage(false);
    setShowPhotoMenu(false);
  }, [user]);

  useEffect(() => {
    const handleTabDropdownOutsideClick = (event) => {
      if (!event.target.closest("[data-settings-tab-dropdown]")) {
        setTabDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleTabDropdownOutsideClick);
    document.addEventListener("touchstart", handleTabDropdownOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleTabDropdownOutsideClick);
      document.removeEventListener("touchstart", handleTabDropdownOutsideClick);
    };
  }, []);

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

  function handleImageClick() {
    if (!profileEditing || saving) return;
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
      alert(
        "Failed to read the image. Please try another file."
      );
    };

    reader.readAsDataURL(file);

    setProfileImageFile(file);
    setRemoveProfileImage(false);
    setShowPhotoMenu(false);
  }

  function handleRemovePhoto() {
    if (!profileEditing || saving) return;

    setProfileImage(null);
    setProfileImageFile(null);
    setRemoveProfileImage(true);
    setShowPhotoMenu(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWebsiteChange = (e) => {
    const { name, value } = e.target;

    setWebsite((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (type = "profile") => {
    setSaving(true);

    try {
      if (type === "profile" || type === "website") {
        const formData = new FormData();

        formData.append("fullname", profile.name);
        formData.append("email", profile.email);

        if (profileImageFile) {
          formData.append("profileImage", profileImageFile);
        }

        if (removeProfileImage) {
          formData.append("deleteProfileImage", "true");
        }

        const { data } = await updateProfile(formData);

        if (data?.user && setUser) {
          setUser(data.user);
        }

        setProfileImage(data?.user?.profileImage || null);
        setProfileImageFile(null);
        setRemoveProfileImage(false);
        setShowPhotoMenu(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }

      if (type === "password") {
        if (
          !password.current ||
          !password.newPassword ||
          !password.confirm
        ) {
          alert("Please fill all password fields");
          setSaving(false);
          return;
        }

        if (
          password.newPassword.length < 8 ||
          password.newPassword.length > 16
        ) {
          alert(
            "Password must be between 8 and 16 characters"
          );
          setSaving(false);
          return;
        }

        if (
          password.newPassword !== password.confirm
        ) {
          alert(
            "New password and confirm password do not match"
          );
          setSaving(false);
          return;
        }

        await changePassword(
          password.current,
          password.newPassword
        );

        setPassword({
          current: "",
          newPassword: "",
          confirm: "",
        });
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to save settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfile = () => {
    setProfileEditing(false);
    setProfileImageFile(null);
    setRemoveProfileImage(false);
    setShowPhotoMenu(false);

    if (user) {
      setProfile({
        name: user.fullname || user.name || "Admin",
        email: user.email || "",
        role:
          user.role === "admin"
            ? "Administrator"
            : user.role || "Admin",
      });

      setProfileImage(user.profileImage || null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const tabs = [
    {
      id: "profile",
      label: "Admin Profile",
      icon: <FaUser />,
    },
    {
      id: "password",
      label: "Change Password",
      icon: <FaLock />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell />,
    },
    {
      id: "website",
      label: "Web App Settings",
      icon: <FaGlobe />,
    },
  ];

  const notificationItems = [
    {
      key: "newUsers",
      title: "New User Registration",
      description:
        "Receive notifications when a new user registers.",
    },
    {
      key: "newProperties",
      title: "New Property Listings",
      description:
        "Receive notifications when a property is submitted.",
    },
    {
      key: "newBookings",
      title: "New Bookings",
      description:
        "Receive notifications about new room bookings.",
    },
    {
      key: "payments",
      title: "Payment Updates",
      description:
        "Receive notifications about payment activities.",
    },
    {
      key: "complaints",
      title: "Complaints & Support",
      description:
        "Receive notifications about new complaints.",
    },
    {
      key: "agentApplications",
      title: "Agent Applications",
      description:
        "Receive notifications when an agent applies.",
    },
  ];

  const renderPasswordField = (
    label,
    name,
    value,
    showPassword,
    setShowPassword,
    placeholder
  ) => (
    <div>
      <label className="mb-1.5 block text-[11px] sm:text-sm font-bold text-[var(--theme-text)]">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={handlePasswordChange}
          placeholder={placeholder}
          className="h-9 sm:h-12 w-full rounded-lg sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 sm:px-4 pr-10 sm:pr-12 text-[11px] sm:text-sm font-medium text-[var(--theme-text)] outline-none transition-all placeholder:text-[var(--theme-muted-dark)] focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword((prev) => !prev)
          }
          className="absolute right-0 top-0 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center text-[var(--theme-muted-dark)] transition-colors hover:text-[var(--theme-accent)] cursor-pointer"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      <main className="p-2 sm:p-6 lg:p-8">

        <div className="mb-4 sm:mb-7">
          <h1 className="text-xl font-extrabold text-[var(--theme-text)] sm:text-3xl tracking-tight">
            Settings
          </h1>

          <p className="mt-1 text-[11px] sm:text-sm text-[var(--theme-muted-dark)] font-medium">
            Manage your admin profile, security, notifications and web app
            settings.
          </p>
        </div>

        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 px-5 py-4 text-sm font-bold text-[var(--theme-accent)]">
            <FaCheckCircle className="text-lg" />
            Settings saved successfully.
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <div className="overflow-visible rounded-xl sm:rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/40" style={{ boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}>

              <div className="border-b border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-5">
                <h2 className="text-sm sm:text-base font-extrabold text-[var(--theme-text)]">
                  Settings
                </h2>

                <p className="mt-0.5 text-[9px] sm:text-xs text-[var(--theme-muted-dark)] font-medium">
                  Manage your preferences
                </p>
              </div>

              <div className="relative p-2 sm:hidden" data-settings-tab-dropdown>
                <button
                  type="button"
                  onClick={() => setTabDropdownOpen((prev) => !prev)}
                  className={`flex h-9 w-full items-center justify-between rounded-lg border bg-[var(--theme-bg)] px-3 text-[10px] font-bold text-[var(--theme-accent)] outline-none transition-all ${
                    tabDropdownOpen
                      ? "border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]/30"
                      : "border-[var(--theme-accent)]/40"
                  }`}
                >
                  <span>
                    {tabs.find((tab) => tab.id === activeTab)?.label || "Admin Profile"}
                  </span>
                  <span
                    className={`text-base leading-none transition-transform duration-200 ${
                      tabDropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    ⌄
                  </span>
                </button>

                {tabDropdownOpen && (
                  <div className="absolute left-2 right-2 top-full z-[100] mt-1 overflow-hidden rounded-lg border border-[var(--theme-accent)]/50 bg-[var(--theme-bg)] shadow-[0_10px_28px_rgba(0,0,0,0.65)]">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setTabDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 border-b border-[var(--theme-border)] px-3 py-2.5 text-left text-[10px] font-bold last:border-b-0 transition-colors ${
                          activeTab === tab.id
                            ? "bg-[var(--theme-accent)] text-[var(--theme-bg)]"
                            : "bg-[var(--theme-bg)] text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)]"
                        }`}
                      >
                        <span className="text-xs">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden sm:block p-3 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover: cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-[var(--theme-accent)] text-[var(--theme-bg)] "
                        : "text-[var(--theme-muted-light)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)]"
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">

            {activeTab === "profile" && (
              <div className="rounded-xl sm:rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/40" style={{ boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}>

                <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-6">

                  <div>
                    <h2 className="text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                      Admin Profile
                    </h2>

                    <p className="mt-1 text-sm text-[var(--theme-muted-dark)] font-medium">
                      Update your administrator account information.
                    </p>
                  </div>

                  {!profileEditing ? (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileEditing(true);
                        setShowPhotoMenu(false);
                      }}
                      className="inline-flex h-8 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-[var(--theme-accent)] text-[var(--theme-accent)] px-2.5 sm:px-4 text-[10px] sm:text-sm font-bold transition-colors hover:bg-[var(--theme-accent)] hover:text-[var(--theme-bg)] cursor-pointer"
                    >
                      <FaEdit />
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={saving}
                      className="inline-flex h-8 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-[var(--theme-accent)] bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] px-2.5 sm:px-4 text-[10px] sm:text-sm font-bold cursor-default disabled:opacity-70"
                    >
                      <FaEdit />
                      Editing...
                    </button>
                  )}
                </div>

                <div className="p-3 sm:p-6">

                  <div className="mb-4 sm:mb-7 flex flex-col items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] p-3 sm:p-5 sm:flex-row transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:">

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="relative shrink-0">

                      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[var(--theme-accent)] text-2xl font-extrabold text-[var(--theme-bg)]  overflow-hidden border-2 border-[var(--theme-accent)]/40">

                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {profile.name
                              ?.charAt(0)
                              ?.toUpperCase() || "A"}
                          </span>
                        )}

                      </div>

                      <button
                        type="button"
                        onClick={handleImageClick}
                        disabled={!profileEditing || saving}
                        className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] flex items-center justify-center text-[var(--theme-bg)]  transition-all cursor-pointer border-2 border-[var(--theme-border)] disabled:opacity-40 disabled:cursor-not-allowed"
                        title={
                          profileEditing
                            ? "Change profile picture"
                            : "Click Edit first"
                        }
                      >
                        <FaCamera className="text-xs" />
                      </button>

                      {showPhotoMenu && profileEditing && (
                        <div
                          ref={photoMenuRef}
                          className="absolute left-1/2 top-full z-50 mt-2 w-44 sm:w-52 -translate-x-1/2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-2 shadow-[0_12px_35px_rgba(0,0,0,0.5)]"
                        >
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[10px] sm:text-sm font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] cursor-pointer"
                          >
                            <FaCamera />
                            <span>
                              {profileImage ? "Change Picture" : "Add Picture"}
                            </span>
                          </button>

                          {profileImage && (
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[10px] sm:text-sm font-bold text-red-400 hover:bg-red-500/10 cursor-pointer"
                            >
                              <FaTrash />
                              <span>Remove Picture</span>
                            </button>
                          )}
                        </div>
                      )}

                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[var(--theme-text)]">
                        {profile.name}
                      </h3>

                      <p className="text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-medium">
                        {profile.email}
                      </p>

                      <span className="mt-1.5 inline-flex rounded-md sm:rounded-lg bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 px-2 sm:px-3 py-1 text-[9px] sm:text-xs font-bold">
                        {profile.role}
                      </span>

                      <p className="mt-2 text-xs text-[var(--theme-muted-dark)]">
                        {profileEditing
                          ? "Click the camera icon to change your picture"
                          : "Click Edit to change your picture"}
                      </p>

                      {profileEditing && removeProfileImage && (
                        <p className="mt-2 text-xs font-semibold text-red-400">
                          Profile picture will be removed when you save changes.
                        </p>
                      )}
                    </div>

                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">

                    <div>
                      <label className="mb-1.5 block text-[11px] sm:text-sm font-bold text-[var(--theme-text)]">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        disabled={!profileEditing}
                        className={`h-9 sm:h-12 w-full rounded-lg sm:rounded-xl border px-3 sm:px-4 text-[11px] sm:text-sm font-medium outline-none transition-all ${
                          profileEditing
                            ? "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20"
                            : "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-muted-dark)] cursor-not-allowed"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] sm:text-sm font-bold text-[var(--theme-text)]">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        disabled={!profileEditing}
                        className={`h-9 sm:h-12 w-full rounded-lg sm:rounded-xl border px-3 sm:px-4 text-[11px] sm:text-sm font-medium outline-none transition-all ${
                          profileEditing
                            ? "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20"
                            : "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-muted-dark)] cursor-not-allowed"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] sm:text-sm font-bold text-[var(--theme-text)]">
                        Role
                      </label>

                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="h-12 w-full cursor-not-allowed rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 text-sm font-bold text-[var(--theme-muted-dark)] outline-none"
                      />
                    </div>

                  </div>

                  {profileEditing && (
                    <div className="mt-4 sm:mt-7 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">

                      <button
                        type="button"
                        onClick={handleCancelProfile}
                        disabled={saving}
                        className="inline-flex h-9 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-[var(--theme-border)] px-4 sm:px-5 text-[11px] sm:text-sm font-bold text-[var(--theme-muted-light)] transition-colors hover:bg-[var(--theme-surface)] hover:text-[var(--theme-text)] cursor-pointer disabled:opacity-60"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          await handleSave("profile");
                          setProfileEditing(false);
                        }}
                        disabled={saving}
                        className="inline-flex h-9 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-4 sm:px-6 text-[11px] sm:text-sm font-bold  transition-all duration-300 hover:-translate-y-0.5 hover: active:scale-95 cursor-pointer disabled:opacity-60"
                      >
                        <FaSave />
                        {saving
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                    </div>
                  )}

                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className="rounded-xl sm:rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/40" style={{ boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}>

                <div className="border-b border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-6">

                  <h2 className="text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                    Change Password
                  </h2>

                  <p className="mt-1 text-sm text-[var(--theme-muted-dark)] font-medium">
                    Keep your administrator account secure with a strong
                    password.
                  </p>

                </div>

                <div className="p-3 sm:p-6">

                  <div className="max-w-2xl space-y-5">

                    {renderPasswordField(
                      "Current Password",
                      "current",
                      password.current,
                      showCurrentPassword,
                      setShowCurrentPassword,
                      "Enter current password"
                    )}

                    {renderPasswordField(
                      "New Password",
                      "newPassword",
                      password.newPassword,
                      showNewPassword,
                      setShowNewPassword,
                      "Enter new password"
                    )}

                    {renderPasswordField(
                      "Confirm New Password",
                      "confirm",
                      password.confirm,
                      showConfirmPassword,
                      setShowConfirmPassword,
                      "Confirm new password"
                    )}

                  </div>

                  <div className="mt-6 rounded-xl border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/5 p-4 transition-all duration-300 hover:border-[var(--theme-accent)]/35 hover:">

                    <p className="text-sm font-extrabold text-[var(--theme-accent)]">
                      Password Security
                    </p>

                    <ul className="mt-2 space-y-1 text-xs text-[var(--theme-muted-light)] font-medium">
                      <li>• Use at least 8 characters.</li>
                      <li>
                        • Include uppercase and lowercase letters.
                      </li>
                      <li>
                        • Include numbers and special characters.
                      </li>
                    </ul>

                  </div>

                  <div className="mt-7 flex justify-end">

                    <button
                      type="button"
                      onClick={() =>
                        handleSave("password")
                      }
                      disabled={saving}
                      className="inline-flex h-9 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-4 sm:px-6 text-[11px] sm:text-sm font-bold  transition-all duration-300 hover:-translate-y-0.5 hover: active:scale-95 cursor-pointer disabled:opacity-60"
                    >
                      <FaSave />
                      {saving
                        ? "Updating..."
                        : "Update Password"}
                    </button>

                  </div>

                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="rounded-xl sm:rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/40" style={{ boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}>

                <div className="border-b border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-6">

                  <h2 className="text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                    Notification Settings
                  </h2>

                  <p className="mt-1 text-sm text-[var(--theme-muted-dark)] font-medium">
                    Choose which activities you want to receive notifications
                    for.
                  </p>

                </div>

                <div className="divide-y divide-[var(--theme-border)]">

                  {notificationItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-2 p-3 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--theme-surface)] hover:shadow-[0_4px_18px_rgba(201,164,92,0.08)]"
                    >

                      <div>
                        <h3 className="text-[11px] sm:text-sm font-bold text-[var(--theme-text)]">
                          {item.title}
                        </h3>

                        <p className="mt-0.5 text-[9px] sm:text-xs leading-4 sm:leading-5 text-[var(--theme-muted-dark)] font-medium">
                          {item.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleNotification(item.key)
                        }
                        className={`relative h-6 w-10 sm:h-7 sm:w-12 shrink-0 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover: cursor-pointer ${
                          notifications[item.key]
                            ? "bg-[var(--theme-accent)] "
                            : "bg-[var(--theme-border)]"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-[var(--theme-text)] shadow transition-all ${
                            notifications[item.key]
                              ? "left-6"
                              : "left-1"
                          }`}
                        />
                      </button>

                    </div>
                  ))}

                </div>

                <div className="flex justify-end border-t border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-6">

                  <button
                    type="button"
                    onClick={() =>
                      handleSave("notifications")
                    }
                    disabled={saving}
                    className="inline-flex h-9 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-4 sm:px-6 text-[11px] sm:text-sm font-bold  transition-all duration-300 hover:-translate-y-0.5 hover: active:scale-95 cursor-pointer disabled:opacity-60"
                  >
                    <FaSave />
                    {saving
                      ? "Saving..."
                      : "Save Notifications"}
                  </button>

                </div>
              </div>
            )}

            {activeTab === "website" && (
              <div className="rounded-xl sm:rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/40" style={{ boxShadow: isOffWhite ? "0 0 28px rgba(43,33,24,0.08)" : "0 0 28px rgba(0,0,0,0.25)" }}>

                <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-6">

                  <div>
                    <h2 className="text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                      Web App Settings
                    </h2>

                    <p className="mt-1 text-sm text-[var(--theme-muted-dark)] font-medium">
                      Manage basic PG Stay web app configuration.
                    </p>
                  </div>

                  {!websiteEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        setWebsiteEditing(true)
                      }
                      className="inline-flex h-8 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-[var(--theme-accent)] text-[var(--theme-accent)] px-2.5 sm:px-4 text-[10px] sm:text-sm font-bold transition-colors hover:bg-[var(--theme-accent)] hover:text-[var(--theme-bg)] cursor-pointer"
                    >
                      <FaEdit />
                      Edit
                    </button>
                  )}

                </div>

                <div className="p-3 sm:p-6">

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">

                    <div>
                      <label className="mb-1.5 block text-[11px] sm:text-sm font-bold text-[var(--theme-text)]">
                        Web App Name
                      </label>

                      <input
                        type="text"
                        name="siteName"
                        value={website.siteName}
                        onChange={handleWebsiteChange}
                        disabled={!websiteEditing}
                        className={`h-9 sm:h-12 w-full rounded-lg sm:rounded-xl border px-3 sm:px-4 text-[11px] sm:text-sm font-medium outline-none transition-all ${
                          websiteEditing
                            ? "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20"
                            : "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-muted-dark)] cursor-not-allowed"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] sm:text-sm font-bold text-[var(--theme-text)]">
                        Support Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={website.email}
                        onChange={handleWebsiteChange}
                        disabled={!websiteEditing}
                        className={`h-9 sm:h-12 w-full rounded-lg sm:rounded-xl border px-3 sm:px-4 text-[11px] sm:text-sm font-medium outline-none transition-all ${
                          websiteEditing
                            ? "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20"
                            : "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-muted-dark)] cursor-not-allowed"
                        }`}
                      />
                    </div>

                  </div>

                  {websiteEditing && (
                    <div className="mt-4 sm:mt-7 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          setWebsiteEditing(false)
                        }
                        disabled={saving}
                        className="inline-flex h-9 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-[var(--theme-border)] px-4 sm:px-5 text-[11px] sm:text-sm font-bold text-[var(--theme-muted-light)] transition-colors hover:bg-[var(--theme-surface)] hover:text-[var(--theme-text)] cursor-pointer disabled:opacity-60"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setWebsiteEditing(false);
                          handleSave("website");
                        }}
                        disabled={saving}
                        className="inline-flex h-9 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-4 sm:px-6 text-[11px] sm:text-sm font-bold  transition-all duration-300 hover:-translate-y-0.5 hover: active:scale-95 cursor-pointer disabled:opacity-60"
                      >
                        <FaSave />
                        {saving
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminSettings;