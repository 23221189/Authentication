import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitComplaint } from "../../api/complaintApi";
import { useAuth } from "../../context/AuthContext";
import { SITE_CONTACT_EMAIL } from "../../config/siteConfig";
import { FaHeadset, FaEnvelope, FaClock, FaSpinner, FaPaperPlane, FaChevronDown, FaArrowLeft } from "react-icons/fa";

function Contact() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    message: "",
  });

  const categories = [
    { value: "Property Verification", label: "Property Verification Issue" },
    { value: "Payment", label: "Payment Issue" },
    { value: "Account", label: "Account Issue" },
    { value: "Technical", label: "Technical Issue" },
    { value: "Other", label: "Other" },
  ];

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleCategorySelect(value) {
    setFormData((previous) => ({
      ...previous,
      category: value,
    }));
    setCategoryOpen(false);
  }

  function handleBack() {
    navigate("/agent/dashboard");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.category ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setIsSending(true);

      await submitComplaint({
        fullname: user?.fullname || "Agent",
        email: user?.email || "",
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setFormData({
        category: "",
        subject: "",
        message: "",
      });

      alert("Your message has been sent to Admin successfully.");
    } catch (error) {
      console.log(error);
      alert("Unable to send your message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  const inputBase = "w-full rounded-xl border border-[#3a3328] bg-[#050505] p-3.5 mt-2 outline-none text-sm text-[#f5efe3] font-medium transition-all placeholder:text-[#777066]";
  const inputNormal = "focus:border-[#c9a45c] focus:bg-[#050505] focus:ring-2 focus:ring-[#c9a45c]/20 focus:shadow-[0_0_18px_rgba(201,164,92,0.16)]";
  const inputDisabled = "disabled:opacity-50 disabled:cursor-not-allowed";
  const labelBase = "block font-bold text-[#bdb6aa] text-sm";

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#f5efe3] font-sans">
     <main className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 pt-1 pb-5 sm:pt-3 sm:pb-7 lg:pt-4 lg:pb-8">

        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#c9a45c]/40 bg-[#c9a45c]/10 text-[#c9a45c] drop-shadow-[0_0_7px_rgba(201,164,92,0.35)] shadow-[0_0_18px_rgba(201,164,92,0.20)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_26px_rgba(201,164,92,0.40)]">
              <FaHeadset className="text-xl" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#f5efe3] sm:text-3xl">
                Contact <span className="text-[#c9a45c]">Admin</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-[#9f988d] sm:text-base">
                Have a question or need help with a verification? Send Admin a message.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2 rounded-2xl border border-[#c9a45c]/30 bg-[#050505] p-5 shadow-[0_14px_45px_rgba(0,0,0,0.78)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/60 hover:shadow-[0_16px_45px_rgba(201,164,92,0.22)] sm:p-6 lg:p-7">

            <div className="mb-6 border-b border-[#3a3328] pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a45c]/10 text-[#c9a45c] drop-shadow-[0_0_7px_rgba(201,164,92,0.35)]">
                  <FaPaperPlane />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-[#f5efe3] sm:text-xl">
                    Send a Message
                  </h2>

                  <p className="mt-1 text-xs font-medium text-[#777066] sm:text-sm">
                    Provide clear information so Admin can resolve your issue quickly.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <div className="relative">
                <label className={labelBase}>Category</label>

                <button type="button" disabled={isSending} onClick={() => setCategoryOpen((previous) => !previous)} className={`${inputBase} ${inputDisabled} flex items-center justify-between text-left cursor-pointer`}>
                  <span className={formData.category ? "text-[#f5efe3]" : "text-[#777066]"}>
                    {categories.find((item) => item.value === formData.category)?.label || "Select a category"}
                  </span>

                  <FaChevronDown className={`text-xs text-[#c9a45c] transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
                </button>

                {categoryOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#c9a45c]/35 bg-[#050505] shadow-[0_18px_42px_rgba(0,0,0,0.85)]">
                    {categories.map((item) => (
                      <button key={item.value} type="button" onClick={() => handleCategorySelect(item.value)} className={`flex w-full items-center px-4 py-3.5 text-left text-sm font-semibold transition-colors cursor-pointer ${formData.category === item.value ? "bg-[#c9a45c] text-[#171717]" : "text-[#bdb6aa] hover:bg-[#c9a45c]/10 hover:text-[#c9a45c]"}`}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={labelBase}>Subject</label>

                <input
                  type="text"
                  name="subject"
                  placeholder="Briefly describe your issue"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSending}
                  maxLength={100}
                  className={`${inputBase} ${inputNormal} ${inputDisabled}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelBase}>Message</label>

                  <span className="text-[11px] font-semibold text-[#777066]">
                    {formData.message.length}/1000
                  </span>
                </div>

                <textarea
                  name="message"
                  rows="7"
                  placeholder="Explain your issue in detail..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSending}
                  maxLength={1000}
                  className={`${inputBase} ${inputNormal} ${inputDisabled} resize-none leading-relaxed`}
                />
              </div>

              <button type="submit" disabled={isSending} className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#c9a45c] py-3.5 font-extrabold text-[#171717] shadow-[0_8px_24px_rgba(201,164,92,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#dfbf7b] hover:shadow-[0_10px_30px_rgba(201,164,92,0.38)] hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                {isSending ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" />
                    Send Message
                  </>
                )}
              </button>

            </form>
          </div>

          <div className="space-y-6">

            <div className="rounded-2xl border border-[#c9a45c]/30 bg-[#050505] p-5 shadow-[0_14px_45px_rgba(0,0,0,0.78)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/60 hover:shadow-[0_16px_45px_rgba(201,164,92,0.22)] sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a45c]/10 text-[#c9a45c] drop-shadow-[0_0_7px_rgba(201,164,92,0.35)]">
                  <FaHeadset />
                </div>

                <h2 className="text-lg font-extrabold tracking-tight text-[#f5efe3]">
                  Contact Details
                </h2>
              </div>

              <div className="space-y-5">

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3a3328] bg-[#050505] text-[#c9a45c]">
                    <FaEnvelope />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[#f5efe3]">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-[#9f988d]">
                      {SITE_CONTACT_EMAIL}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3a3328] bg-[#050505] text-[#c9a45c]">
                    <FaClock />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-[#f5efe3]">
                      Support Hours
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#9f988d]">
                      Mon - Sat, 9 AM - 6 PM
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-[#c9a45c]/40 bg-gradient-to-br from-[#c9a45c]/10 via-[#171717] to-[#11100e] p-5 shadow-[0_14px_45px_rgba(0,0,0,0.78)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/70 hover:shadow-[0_14px_42px_rgba(201,164,92,0.22)] sm:p-6">

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c9a45c]/20 bg-[#c9a45c]/10 text-[#c9a45c] drop-shadow-[0_0_7px_rgba(201,164,92,0.35)]">
                  <FaHeadset className="text-lg" />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-[#c9a45c]">
                    Quick Response
                  </h2>

                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-[#777066]">
                    Admin Support
                  </p>
                </div>
              </div>

              <p className="text-sm font-medium leading-relaxed text-[#bdb6aa]">
                Most queries are answered within 24 hours. For urgent verification issues, mention the property and issue clearly in your message.
              </p>

            </div>

            <div className="rounded-2xl border border-[#c9a45c]/30 bg-[#050505] p-5 shadow-[0_14px_45px_rgba(0,0,0,0.78)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/60 hover:shadow-[0_16px_45px_rgba(201,164,92,0.22)]">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[#c9a45c] shadow-md shadow-[#c9a45c]/40" />

                <p className="text-sm font-bold text-[#bdb6aa]">
                  Admin support is available during working hours.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;