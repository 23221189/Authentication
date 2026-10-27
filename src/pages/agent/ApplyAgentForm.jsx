import React, { useState } from "react";
import { FaArrowLeft, FaUserPlus, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CnicUpload from "../../components/CnicUpload";
import { applyForAgent } from "../../api/authApi";
import cozyHomeBg from "../../assets/images/cozy-home-bg.jpeg";

const ApplyAgentForm = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [cnicFrontFile, setCnicFrontFile] = useState(null);
  const [cnicBackFile, setCnicBackFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [genderDropdown, setGenderDropdown] = useState(false);
  const [paymentDropdown, setPaymentDropdown] = useState(false);
  const [cnic, setCnic] = useState("");

  const formatCNIC = (value) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 5) return digits;

    if (digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }

    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  };

  const navigate = useNavigate();

  const isFormValid =
    fullname.trim() !== "" &&
    email.trim() !== "" &&
    cnic.trim() !== "" &&
    gender !== "" &&
    city.trim() !== "" &&
    fullAddress.trim() !== "" &&
    !!cnicFrontFile &&
    !!cnicBackFile &&
    paymentMethod !== "" &&
    accountNumber.trim() !== "";

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!fullname || !email || !cnic || !fullAddress || !city || !gender) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (cnic.length !== 15) {
      alert("Please enter a complete CNIC number");
      return;
    }

    console.log("CNIC:", cnic);

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!cnicFrontFile || !cnicBackFile) {
      setErrorMessage("Please upload both CNIC Front and Back images.");
      return;
    }

    if (!paymentMethod || !accountNumber) {
      setErrorMessage("Please enter your payout details.");
      return;
    }

    const formData = new FormData();

    formData.append("fullname", fullname.trim());
    formData.append("email", email.trim().toLowerCase());
    formData.append("cnic", cnic.trim());
    formData.append("gender", gender.toLowerCase());
    formData.append("city", city.trim());
    formData.append("address", fullAddress.trim());
    formData.append("cnicFront", cnicFrontFile);
    formData.append("cnicBack", cnicBackFile);
    formData.append("paymentMethod", paymentMethod);
    formData.append("accountNumber", accountNumber.trim());

    setIsSubmitting(true);

    try {
      const res = await applyForAgent(formData);

      alert(res.data.message || "Application submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);

      setErrorMessage(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-[#c9a45c]/30 bg-[#050505] outline-none focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/20 focus:shadow-[0_0_24px_rgba(201,164,92,0.28)] text-sm text-[#f5efe3] shadow-[0_6px_20px_rgba(0,0,0,0.60)] transition-all duration-300 hover:border-[#c9a45c]/60 hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)] placeholder:text-[#8f897f] font-medium";

  const labelClasses = "block text-sm font-bold text-[#f5efe3] mb-2";

  return (
    <main className="relative min-h-screen w-full px-4 sm:px-5 lg:px-6 py-8 sm:py-12 font-sans overflow-x-hidden bg-[#050505]">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${cozyHomeBg})` }}></div>
      <div className="fixed inset-0 bg-black/[0.92]"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 text-[#c9a45c] font-bold text-sm sm:text-base mb-3 bg-[#050505]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#c9a45c]/30 shadow-[0_0_22px_rgba(201,164,92,0.12)]">
          <FaUserPlus />
          <span>Become an Agent</span>
        </div>

        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#f5efe3] tracking-tight">
          Agent <span className="text-[#c9a45c]">Registration</span>
        </h1>

        <p className="text-[#bdb6aa] mt-3 px-2 sm:px-0 max-w-xl mx-auto leading-relaxed text-sm sm:text-base font-medium">
          Join our network of trusted agents and help verify properties physically for safety & comfort.
        </p>
      </div>

      <div className="relative z-10 w-[850px] max-w-full mx-auto bg-[#050505]/98 rounded-2xl sm:rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.80)] border border-[#c9a45c]/30 hover:border-[#c9a45c]/45 hover:shadow-[0_18px_55px_rgba(201,164,92,0.16)] transition-all duration-300 overflow-hidden backdrop-blur-md">
        <div className="px-5 sm:px-8 md:px-10 py-6 sm:py-7 border-b border-[#c9a45c]/20 bg-[#050505]/95">
          <h2 className="font-extrabold text-xl sm:text-2xl text-[#f5efe3] tracking-tight">
            Personal Information
          </h2>

          <p className="text-[#8f897f] text-sm sm:text-base mt-1 font-medium">
            Please enter your personal details and residential address.
          </p>
        </div>

        {errorMessage && (
          <div className="mx-5 sm:mx-8 md:mx-10 mt-5 p-4 bg-[#c9a45c]/10 text-[#dfbf7b] rounded-xl text-sm text-center border border-[#c9a45c]/20 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-5 sm:px-8 md:px-10 py-7 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
            <div>
              <label className={labelClasses}>Full Name</label>

              <input type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullName(e.target.value)} className={inputClasses} required />
            </div>

            <div>
              <label className={labelClasses}>Email Address</label>

              <input type="email" placeholder="Email address" autoComplete="new-password" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} required />
            </div>

            <div>
              <label className={labelClasses}>CNIC Number</label>

              <input type="text" placeholder="xxxxx-xxxxxxx-x" name="cnic" value={cnic} onChange={(e) => setCnic(formatCNIC(e.target.value))} maxLength={15} className={inputClasses} required />
            </div>

            <div className="relative">
              <label className={labelClasses}>Gender</label>

              <div onClick={() => { setGenderDropdown(!genderDropdown); setPaymentDropdown(false); }} className={`w-full px-4 py-3.5 rounded-xl border ${genderDropdown ? "border-[#c9a45c]" : "border-[#3a3328]"} bg-[#050505] text-sm text-[#f5efe3] font-medium cursor-pointer flex items-center justify-between transition-all duration-300 shadow-[0_6px_20px_rgba(0,0,0,0.60)] hover:border-[#c9a45c]/60 hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]`}>
                <span className={gender ? "text-[#f5efe3]" : "text-[#8f897f]"}>
                  {gender === "male" ? "Male" : gender === "female" ? "Female" : gender === "other" ? "Other" : "Select Gender"}
                </span>

                <FaChevronDown className={`text-[#c9a45c] text-xs drop-shadow-[0_0_7px_rgba(201,164,92,0.45)] transition-all duration-300 ${genderDropdown ? "rotate-180" : ""}`} />
              </div>

              {genderDropdown && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-[#c9a45c]/35 bg-[#050505] shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
                  {[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ].map((option) => (
                    <div key={option.value} onClick={() => { setGender(option.value); setGenderDropdown(false); }} className="px-4 py-3 text-sm cursor-pointer bg-[#050505] text-[#f5efe3] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c] hover:shadow-[inset_0_0_16px_rgba(201,164,92,0.10)] transition-all duration-200">
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={labelClasses}>City</label>

              <input
                type="text"
                placeholder="e.g. Lahore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClasses}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>Your Residential Address</label>

              <input
                type="text"
                placeholder="Enter your complete address"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="mt-9 pt-7 border-t border-[#3a3328]">
            <h2 className="font-extrabold text-xl sm:text-2xl text-[#f5efe3] mb-4 tracking-tight">
              CNIC Document Proof
            </h2>

            <div className="w-full">
              <CnicUpload onFrontChange={setCnicFrontFile} onBackChange={setCnicBackFile} />
            </div>
          </div>

          <div className="mt-9 pt-7 border-t border-[#3a3328]">
            <h2 className="font-extrabold text-xl sm:text-2xl text-[#f5efe3] mb-4 tracking-tight">
              Payment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
              <div className="relative">
                <label className={labelClasses}>Payment Method</label>

                <div onClick={() => { setPaymentDropdown(!paymentDropdown); setGenderDropdown(false); }} className={`w-full px-4 py-3.5 rounded-xl border ${paymentDropdown ? "border-[#c9a45c]" : "border-[#3a3328]"} bg-[#050505] text-sm text-[#f5efe3] font-medium cursor-pointer flex items-center justify-between transition-all duration-300 shadow-[0_6px_20px_rgba(0,0,0,0.60)] hover:border-[#c9a45c]/60 hover:shadow-[0_8px_24px_rgba(201,164,92,0.14)]`}>
                  <span className={paymentMethod ? "text-[#f5efe3]" : "text-[#8f897f]"}>
                    {paymentMethod || "Select Payment Method"}
                  </span>

                  <FaChevronDown className={`text-[#c9a45c] text-xs drop-shadow-[0_0_7px_rgba(201,164,92,0.45)] transition-all duration-300 ${paymentDropdown ? "rotate-180" : ""}`} />
                </div>

                {paymentDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-[#c9a45c]/35 bg-[#050505] shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
                    <div onClick={() => { setPaymentMethod("SafePay"); setPaymentDropdown(false); }} className="px-4 py-3 text-sm cursor-pointer bg-[#050505] text-[#f5efe3] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c] hover:shadow-[inset_0_0_16px_rgba(201,164,92,0.10)] transition-all duration-200">
                      SafePay
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClasses}>Account Number / Mobile</label>

                <input type="text" placeholder="e.g. 03001234567" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className={inputClasses} required />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-10 pt-7 border-t border-[#3a3328]">
            <Link to="/" className="flex items-center gap-2 text-[#bdb6aa] hover:text-[#c9a45c] font-bold transition-colors text-sm">
              <FaArrowLeft />
              Back to Home
            </Link>

            <button type="submit" disabled={isSubmitting || !isFormValid} className="w-full sm:w-auto bg-[#c9a45c] hover:bg-[#dfbf7b] disabled:bg-[#c9a45c]/40 disabled:text-[#171717]/60 disabled:cursor-not-allowed text-[#171717] font-bold px-10 h-14 rounded-xl transition-all shadow-[0_10px_30px_rgba(201,164,92,0.28)] hover:shadow-[0_12px_35px_rgba(201,164,92,0.42)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer">
              {isSubmitting ? "Submitting..." : "Submit Agent Request"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ApplyAgentForm;