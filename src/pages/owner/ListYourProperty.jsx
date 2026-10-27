import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaHome,
  FaUsers,
  FaShieldAlt,
  FaWallet,
  FaClock,
  FaChartLine,
  FaChevronDown,
} from "react-icons/fa";

const ListYourProperty = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const previousHtmlBackground = document.documentElement.style.backgroundColor;
    const previousBodyBackground = document.body.style.backgroundColor;

    document.documentElement.style.backgroundColor = "#0d0d0d";
    document.body.style.backgroundColor = "#0d0d0d";

    return () => {
      document.documentElement.style.backgroundColor = previousHtmlBackground;
      document.body.style.backgroundColor = previousBodyBackground;
    };
  }, []);

  // Yeh function sirf popup open karega, direct navigate nahi karega
  function handleGetStarted() {
    setShowPopup(true);
  }

  function handleFaqToggle(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  const faqs = [
    {
      question: "Where can I list my property?",
      answer:
        "PG Stay is open to property owners anywhere in Pakistan. Wherever your property is located, you can list it on the platform.",
    },
    {
      question: "Is there a fee to list my property?",
      answer:
        "Listing your property on PG Stay is completely free. We only apply a small service charge once a booking is confirmed.",
    },
    {
      question: "Can I decide who stays in my property?",
      answer:
        "Yes. Every booking request needs your approval, and you can view verified tenant details before accepting or rejecting it.",
    },
    {
      question: "How do I get paid?",
      answer:
        "Tenants can pay online or in cash on arrival. Online payments are settled directly to the bank account you provide in your profile.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans text-[#f5efe3]">

      <section className="bg-[#0d0d0d] text-[#f5efe3] relative overflow-hidden border-b border-[#c9a45c]/20 shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#c9a45c]/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#c9a45c]/10 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-6 pb-12 md:pt-8 md:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-[#f5efe3]">
              Manage your property and grow your rental business
            </h1>
            <p className="text-[#bdb6aa] mt-4 text-base md:text-lg max-w-xl leading-relaxed font-medium">
              PG Stay connects property owners across Pakistan with students,
              job seekers, tourists and travellers looking for a safe place to
              stay. List once, manage everything from your dashboard.
            </p>
            {/* Yahan click karne par popup open hoga */}
            <button
              onClick={handleGetStarted}
              className="mt-6 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] font-bold px-8 py-3.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_9px_26px_rgba(201,164,92,0.28)] hover:shadow-[0_12px_32px_rgba(201,164,92,0.42)] hover:-translate-y-0.5 cursor-pointer"
            >
              List My Property
            </button>
          </div>

          <div className="bg-[#11100e] text-[#f5efe3] rounded-3xl shadow-[0_14px_40px_rgba(0,0,0,0.75)] p-6 md:p-8 w-full max-w-md ml-auto border border-[#c9a45c]/30 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/60 hover:shadow-[0_16px_42px_rgba(201,164,92,0.20)]">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#f5efe3] tracking-tight">
              Getting started is free
            </h2>
            <div className="space-y-3 mt-5">
              <p className="flex items-center gap-3 text-sm md:text-base text-[#bdb6aa] font-medium">
                <FaCheckCircle className="text-[#c9a45c] shrink-0" />
                No listing fee, ever
              </p>
              <p className="flex items-center gap-3 text-sm md:text-base text-[#bdb6aa] font-medium">
                <FaCheckCircle className="text-[#c9a45c] shrink-0" />
                You list. We verify. You earn.
              </p>
              <p className="flex items-center gap-3 text-sm md:text-base text-[#bdb6aa] font-medium">
                <FaCheckCircle className="text-[#c9a45c] shrink-0" />
                Get paid securely through our platform.
              </p>
            </div>
            <button
              onClick={handleGetStarted}
              className="w-full mt-6 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] py-3.5 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 shadow-[0_9px_26px_rgba(201,164,92,0.28)] hover:shadow-[0_12px_32px_rgba(201,164,92,0.42)] hover:-translate-y-0.5 cursor-pointer"
            >
              Ready to List Your Property?
            </button>
          </div>
        </div>
      </section>

      {/* Baaki ka content same rahega... */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <h2 className="text-2xl md:text-4xl font-extrabold text-[#f5efe3] text-center tracking-tight">
          You stay in control, always
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          <div>
            <h3 className="font-extrabold text-lg text-[#f5efe3] mb-4">Set your own terms</h3>
            <p className="flex items-start gap-3 text-[#bdb6aa] text-sm md:text-base mb-3 font-medium">
              <FaCheckCircle className="text-[#c9a45c] mt-1 shrink-0" />
              Approve or reject any booking request
            </p>
            <p className="flex items-start gap-3 text-[#bdb6aa] text-sm md:text-base font-medium">
              <FaCheckCircle className="text-[#c9a45c] mt-1 shrink-0" />
              Decide your own rent and house rules
            </p>
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#f5efe3] mb-4">Know who's moving in</h3>
            <p className="flex items-start gap-3 text-[#bdb6aa] text-sm md:text-base mb-3 font-medium">
              <FaCheckCircle className="text-[#c9a45c] mt-1 shrink-0" />
              Every tenant's CNIC is verified before booking
            </p>
            <p className="flex items-start gap-3 text-[#bdb6aa] text-sm md:text-base font-medium">
              <FaCheckCircle className="text-[#c9a45c] mt-1 shrink-0" />
              Full booking details available before you confirm
            </p>
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#f5efe3] mb-4">Here to help you along the way.</h3>
            <p className="flex items-start gap-3 text-[#bdb6aa] text-sm md:text-base mb-3 font-medium">
              <FaCheckCircle className="text-[#c9a45c] mt-1 shrink-0" />
              Manage listings, bookings & more in one place.
            </p>
            <p className="flex items-start gap-3 text-[#bdb6aa] text-sm md:text-base font-medium">
              <FaCheckCircle className="text-[#c9a45c] mt-1 shrink-0" />
              Manage your listings and bookings with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#090909] w-full max-w-md rounded-3xl shadow-[0_20px_55px_rgba(0,0,0,0.85)] p-8 text-center relative border border-[#c9a45c]/35 transition-all duration-300 hover:border-[#c9a45c]/55 hover:shadow-[0_20px_60px_rgba(201,164,92,0.18)]">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-5 text-[#8f897f] text-2xl hover:text-[#c9a45c] transition-all duration-300 cursor-pointer"
            >
              ×
            </button>
            <div className="w-16 h-16 mx-auto rounded-full border border-[#c9a45c]/35 bg-[#090909] flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(201,164,92,0.22)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_32px_rgba(201,164,92,0.38)]">
              <FaHome className="text-[#c9a45c] text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#f5efe3] tracking-tight">
              Welcome to PG Stay
            </h2>
            <p className="text-[#8f897f] mt-3 text-sm leading-relaxed font-medium">
              If you are already registered, please log in to access your
              dashboard. If not, create an account to list your property.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-7 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] py-3.5 rounded-xl font-bold transition-all shadow-[0_9px_26px_rgba(201,164,92,0.28)] hover:shadow-[0_12px_32px_rgba(201,164,92,0.42)] hover:-translate-y-0.5 cursor-pointer"
            >
              LOG IN
            </button>
            <button
              onClick={() => navigate("/OwnerSignup")}
              className="w-full mt-4 border border-[#c9a45c] text-[#c9a45c] py-3.5 rounded-xl font-bold hover:bg-[#c9a45c]/10 transition-colors duration-300 cursor-pointer"
            >
              CREATE AN ACCOUNT
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListYourProperty;