import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaCamera, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/profileApi";
import { changePassword as changePasswordApi } from "../../api/authApi";

function POProfile() {
    const { user, ownerSession, setUser, setOwnerSession } = useAuth();
    const session = ownerSession || user || {};

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingBank, setIsEditingBank] = useState(false);

    const [savingProfile, setSavingProfile] = useState(false);
    const [savingBank, setSavingBank] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [name, setName] = useState(session?.fullname || "");
    const [email, setEmail] = useState(session?.email || "");
    const [cnic, setCNIC] = useState(session?.cnic || "");
    const [address, setAddress] = useState(session?.address || "");

    const [bankName, setBankName] = useState(session?.bankName || "");
    const [accountTitle, setAccountTitle] = useState(
        session?.accountTitle || ""
    );
    const [accountNumber, setAccountNumber] = useState(
        session?.bankAccountNumber || ""
    );
    const [iban, setIban] = useState(session?.iban || "");

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [profileImage, setProfileImage] = useState(
        session?.profileImage || null
    );

    const [profileImageFile, setProfileImageFile] = useState(null);
    const [deleteProfileImage, setDeleteProfileImage] = useState(false);
    const [showPhotoMenu, setShowPhotoMenu] = useState(false);

    const fileInputRef = useRef(null);
    const photoMenuRef = useRef(null);

    useEffect(() => {
        if (!session) return;

        setName(session?.fullname || "");
        setEmail(session?.email || "");
        setCNIC(session?.cnic || "");
        setAddress(session?.address || "");

        setBankName(session?.bankName || "");
        setAccountTitle(session?.accountTitle || "");
        setAccountNumber(session?.bankAccountNumber || "");
        setIban(session?.iban || "");

        setProfileImage(session?.profileImage || null);
        setProfileImageFile(null);
        setDeleteProfileImage(false);
        setShowPhotoMenu(false);
    }, [session]);

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

    function handleName(event) {
        setName(event.target.value);
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

    function handleBankName(event) {
        setBankName(event.target.value);
    }

    function handleAccountTitle(event) {
        setAccountTitle(event.target.value);
    }

    function handleAccountNumber(event) {
        setAccountNumber(event.target.value);
    }

    function handleIban(event) {
        setIban(event.target.value);
    }

    function handlePassword(event) {
        setPassword(event.target.value);
    }

    function handleNewPassword(event) {
        setNewPassword(event.target.value);
    }

    function handleConfirmPassword(event) {
        setConfirmPassword(event.target.value);
    }

    function handleEditClick() {
        setIsEditing(true);
        setShowPhotoMenu(false);
        setDeleteProfileImage(false);
    }

    function handleEditBankClick() {
        setIsEditingBank(true);
    }

    function handleImageClick() {
        if (!isEditing || savingProfile) return;

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
            alert("Failed to read the image. Please try another file.");
        };

        reader.readAsDataURL(file);

        setProfileImageFile(file);
        setDeleteProfileImage(false);
        setShowPhotoMenu(false);

        event.target.value = "";
    }

    function handleDeletePhoto() {
        if (!isEditing || savingProfile) return;

        setProfileImage(null);
        setProfileImageFile(null);
        setDeleteProfileImage(true);
        setShowPhotoMenu(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!name || !email || !address) {
            alert("Please fill all fields");
            return;
        }

        if (!email.includes("@")) {
            alert("Please enter a valid email");
            return;
        }

        const formData = new FormData();

        formData.append("fullname", name);
        formData.append("email", email);
        formData.append("address", address);

        if (profileImageFile) {
            formData.append("profileImage", profileImageFile);
        }

        if (deleteProfileImage) {
            formData.append("deleteProfileImage", "true");
        }

        setSavingProfile(true);

        try {
            const { data } = await updateProfile(formData);

            if (data?.user) {
                if (setUser) {
                    setUser(data.user);
                }

                if (setOwnerSession) {
                    setOwnerSession(data.user);
                }

                setProfileImage(data.user.profileImage || null);
                setName(data.user.fullname || name);
                setEmail(data.user.email || email);
                setAddress(data.user.address || address);
            }

            alert(data?.message || "Profile updated successfully!");

            setIsEditing(false);
            setProfileImageFile(null);
            setDeleteProfileImage(false);
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
            setSavingProfile(false);
        }
    }

    async function handleBankSubmit(event) {
        event.preventDefault();

        if (!bankName || !accountTitle || !accountNumber) {
            alert("Please fill all bank details");
            return;
        }

        if (!/^\d{5,20}$/.test(accountNumber)) {
            alert("Please enter a valid account number");
            return;
        }

        const formData = new FormData();

        formData.append("bankName", bankName);
        formData.append("accountTitle", accountTitle);
        formData.append("accountNumber", accountNumber);
        formData.append("iban", iban);

        setSavingBank(true);

        try {
            const { data } = await updateProfile(formData);

            if (data?.user) {
                if (setUser) {
                    setUser(data.user);
                }

                if (setOwnerSession) {
                    setOwnerSession(data.user);
                }
            }

            alert(
                data?.message ||
                    "Bank account details updated successfully!"
            );

            setIsEditingBank(false);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                    "Failed to update bank details. Please try again."
            );
        } finally {
            setSavingBank(false);
        }
    }

    async function handlePasswordSubmit(event) {
        event.preventDefault();

        if (!password || !newPassword || !confirmPassword) {
            alert("Please fill all password fields");
            return;
        }

        if (newPassword.length < 8) {
            alert("New password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }

        setSavingPassword(true);

        try {
            const { data } = await changePasswordApi(
                password,
                newPassword
            );

            alert(data?.message || "Password updated successfully!");

            setPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                    "Current password is incorrect."
            );
        } finally {
            setSavingPassword(false);
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
        setProfileImageFile(null);
        setDeleteProfileImage(false);
        setShowPhotoMenu(false);

        setProfileImage(session?.profileImage || null);

        setName(session?.fullname || "");
        setEmail(session?.email || "");
        setAddress(session?.address || "");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const inputBase =
        "w-full mt-2 border rounded-xl p-3 outline-none text-sm font-medium bg-[#050505] placeholder:text-[#777066] text-[#f5efe3] ";

    const inputEditable =
        "border-[#c9a45c]/30 focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/20";

    const inputDisabled =
        "border-[#3a3328] bg-[#050505] text-[#777066] cursor-not-allowed ";

    const labelBase =
        "font-bold text-[#f5efe3] text-sm";

    const cardBase =
        "bg-[#050505] rounded-2xl border border-[#c9a45c]/30 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/70 hover:bg-[#050505] hover:shadow-[0_14px_38px_rgba(201,164,92,0.26)]";

    return (
        <div className="min-h-screen bg-[#050505] flex font-sans text-[#f5efe3]">
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#f5efe3] tracking-tight">
                        My Profile
                    </h1>

                    <button
                        type="button"
                        onClick={handleEditClick}
                        disabled={isEditing}
                        className="w-full sm:w-auto border-2 border-[#c9a45c] text-[#c9a45c] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c9a45c]/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isEditing ? "Editing..." : "✎ Edit Profile"}
                    </button>
                </div>

                <div className={cardBase}>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            className="hidden"
                            disabled={savingProfile}
                        />

                        <div
                            ref={photoMenuRef}
                            className="relative shrink-0"
                        >
                            <div className="relative">

                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#050505] flex items-center justify-center shadow-[0_0_24px_rgba(201,164,92,0.20)] border-2 border-[#c9a45c]/40">

                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-7xl sm:text-8xl text-[#c9a45c] drop-shadow-[0_0_8px_rgba(201,164,92,0.45)]" />
                                    )}

                                </div>

                                {isEditing && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleImageClick}
                                            disabled={savingProfile}
                                            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#c9a45c] hover:bg-[#dfbf7b] flex items-center justify-center text-[#171717] shadow-[0_0_22px_rgba(201,164,92,0.42)] transition-all cursor-pointer border-2 border-[#211f1b] disabled:opacity-40 disabled:cursor-not-allowed"
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
                                                    disabled={savingProfile}
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
                                                        onClick={handleDeletePhoto}
                                                        disabled={savingProfile}
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

                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                <h2 className="text-xl sm:text-2xl font-extrabold text-[#f5efe3]">
                                    {session?.fullname || "Property Owner"}
                                </h2>
                            </div>

                            <p className="text-brown mt-2 text-sm font-medium">
                                Manage your properties, bookings and payments from one place.
                            </p>

                            <p className="text-xs text-[#777066] mt-2 font-medium">
                                {isEditing
                                    ? "Click the camera icon to manage your profile picture"
                                    : "Click Edit to change your profile picture"}
                            </p>

                            {isEditing && deleteProfileImage && (
                                <p className="text-xs text-[#c9a45c] mt-2 font-medium">
                                    Profile picture will be removed when you save changes.
                                </p>
                            )}

                        </div>

                    </div>
                </div>

                <div className={`${cardBase} mt-5 sm:mt-6`}>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

                        <div>
                            <h2 className="text-lg sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                                Personal Information
                            </h2>

                            <p className="text-sm text-[#9f988d] mt-1 font-medium">
                                Update your basic account details.
                            </p>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                            <div>
                                <label className={labelBase}>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={handleName}
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
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="example12@gmail.com"
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
                                    CNIC{" "}
                                    <span className="text-[#777066] font-normal text-xs">
                                        (cannot be changed)
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="xxxxx-xxxxxxx-x"
                                    value={cnic}
                                    onChange={handleCNIC}
                                    disabled
                                    title="CNIC cannot be changed"
                                    className={`${inputBase} ${inputDisabled}`}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelBase}>
                                    Address
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your complete address"
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
                            <div className="flex justify-end mt-5 gap-3">

                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={savingProfile}
                                    className="w-full sm:w-auto border-2 border-[#3a3328] text-[#bdb6aa] px-6 py-3 rounded-xl font-bold hover:bg-[#c9a45c]/10 hover:border-[#c9a45c]/40 hover:text-[#c9a45c] transition-colors disabled:opacity-60 cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="w-full sm:w-auto bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-8 py-3 rounded-xl font-bold shadow-[0_8px_24px_rgba(201,164,92,0.30)] hover:shadow-[0_10px_30px_rgba(201,164,92,0.42)] hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {savingProfile
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>
                        )}

                    </form>
                </div>

                <div className={`${cardBase} mt-5 sm:mt-6`}>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">

                        <div>
                            <h2 className="text-lg sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                                Bank Account Details
                            </h2>

                            <p className="text-sm text-[#9f988d] mt-1 font-medium">
                                Your earnings will be transferred to this account.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleEditBankClick}
                            disabled={isEditingBank}
                            className="w-full sm:w-auto border-2 border-[#c9a45c] text-[#c9a45c] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c9a45c]/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isEditingBank
                                ? "Editing..."
                                : "Change Account"}
                        </button>

                    </div>

                    <form onSubmit={handleBankSubmit} className="mt-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                            <div>
                                <label className={labelBase}>
                                    Bank Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Bank name"
                                    value={bankName}
                                    onChange={handleBankName}
                                    disabled={!isEditingBank}
                                    className={`${inputBase} ${
                                        isEditingBank
                                            ? inputEditable
                                            : inputDisabled
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={labelBase}>
                                    Account Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="Holder name"
                                    value={accountTitle}
                                    onChange={handleAccountTitle}
                                    disabled={!isEditingBank}
                                    className={`${inputBase} ${
                                        isEditingBank
                                            ? inputEditable
                                            : inputDisabled
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={labelBase}>
                                    Account Number
                                </label>

                                <input
                                    type="text"
                                    placeholder="Account number"
                                    value={accountNumber}
                                    onChange={handleAccountNumber}
                                    disabled={!isEditingBank}
                                    className={`${inputBase} ${
                                        isEditingBank
                                            ? inputEditable
                                            : inputDisabled
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={labelBase}>
                                    IBAN{" "}
                                    <span className="text-[#777066] font-normal text-xs">
                                        (Optional)
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="PKXX XXXX XXXX XXXX XXXX XXXX"
                                    value={iban}
                                    onChange={handleIban}
                                    disabled={!isEditingBank}
                                    className={`${inputBase} ${
                                        isEditingBank
                                            ? inputEditable
                                            : inputDisabled
                                    }`}
                                />
                            </div>

                        </div>

                        {isEditingBank && (
                            <div className="flex justify-end mt-5 gap-3">

                                <button
                                    type="button"
                                    onClick={() => setIsEditingBank(false)}
                                    disabled={savingBank}
                                    className="w-full sm:w-auto border-2 border-[#3a3328] text-[#bdb6aa] px-6 py-3 rounded-xl font-bold hover:bg-[#c9a45c]/10 hover:border-[#c9a45c]/40 hover:text-[#c9a45c] transition-colors disabled:opacity-60 cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={savingBank}
                                    className="w-full sm:w-auto bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-8 py-3 rounded-xl font-bold shadow-[0_8px_24px_rgba(201,164,92,0.30)] hover:shadow-[0_10px_30px_rgba(201,164,92,0.42)] hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {savingBank
                                        ? "Saving..."
                                        : "Save Account Details"}
                                </button>

                            </div>
                        )}

                    </form>
                </div>

                <div className={`${cardBase} mt-5 sm:mt-6`}>

                    <div className="mb-5">
                        <h2 className="text-lg sm:text-xl font-extrabold text-[#f5efe3] tracking-tight">
                            Change Password
                        </h2>

                        <p className="text-sm text-[#9f988d] mt-1 font-medium">
                            Keep your account secure by using a strong password.
                        </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">

                            <div>
                                <label className={labelBase}>
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Current password"
                                    value={password}
                                    onChange={handlePassword}
                                    className={`${inputBase} ${inputEditable}`}
                                />
                            </div>

                            <div>
                                <label className={labelBase}>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={handleNewPassword}
                                    className={`${inputBase} ${inputEditable}`}
                                />
                            </div>

                            <div>
                                <label className={labelBase}>
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPassword}
                                    className={`${inputBase} ${inputEditable}`}
                                />
                            </div>

                        </div>

                        <div className="flex justify-end mt-5">

                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="w-full sm:w-auto bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-8 py-3 rounded-xl font-bold shadow-[0_8px_24px_rgba(201,164,92,0.30)] hover:shadow-[0_10px_30px_rgba(201,164,92,0.42)] hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {savingPassword
                                    ? "Updating..."
                                    : "Update Password"}
                            </button>

                        </div>

                    </form>
                </div>

            </main>
        </div>
    );
}

export default POProfile;