import React from "react";
import { Link } from "react-router-dom";
import {
  FaIdCard,
  FaFileInvoice,
  FaMapMarkerAlt,
  FaCamera,
  FaVideo,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaHeadset,
} from "react-icons/fa";

function AgentGuidelines() {
  const cardBase = "bg-[#050505] rounded-2xl shadow-lg shadow-black/30 border border-[#c9a45c]/35 p-5 sm:p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#050505] hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-[0_0_28px_rgba(0,0,0,0.65)]";

  const checkRow = "flex items-start gap-3 text-sm text-[#bdb6aa] font-medium leading-relaxed";
  const rejectRow = "flex items-start gap-3 text-sm text-[#bdb6aa] font-medium leading-relaxed";

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#f5efe3] font-sans min-w-0">
      <main className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full">
        <div className="mt-1">
          <div className="inline-flex items-center gap-2 text-[#c9a45c] font-bold text-xs sm:text-sm mb-3 bg-[#c9a45c]/10 px-3 py-1.5 rounded-full border border-[#c9a45c]/20">
            <FaCheckCircle />
            <span>Verification Guidelines</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#f5efe3] tracking-tight">
            Verification <span className="text-[#c9a45c]">Guidelines</span>
          </h1>

          <p className="text-[#9f988d] mt-2 text-sm sm:text-base font-medium">
            Follow this checklist before approving or rejecting any property.
          </p>
        </div>

        <div className="bg-[#050505] border border-[#c9a45c]/35 rounded-2xl p-4 sm:p-5 mt-6 flex items-start gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a45c] hover:shadow-[0_10px_28px_rgba(0,0,0,0.6)] active:shadow-[0_0_26px_rgba(0,0,0,0.65)]">
          <div className="w-10 h-10 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/10 flex items-center justify-center shrink-0">
            <FaExclamationTriangle className="text-[#c9a45c] text-lg" />
          </div>
          <p className="text-sm text-[#bdb6aa] font-medium leading-relaxed pt-1">
            Every property listed on PG Stay must be verified before it goes live. Your careful review protects tenants and keeps the platform trustworthy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mt-6">

          <div className={cardBase}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
                <FaIdCard className="text-[#c9a45c] text-xl" />
              </div>
              <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
                CNIC Verification
              </h2>
            </div>

            <div className="space-y-3">
              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Front and back images are clear and readable
              </p>

              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                CNIC number on the card matches the number entered in the form
              </p>

              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Name on CNIC matches the owner's full name
              </p>

              <p className={rejectRow}>
                <FaTimesCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Reject if the CNIC is expired, blurry or edited
              </p>
            </div>
          </div>

          <div className={cardBase}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
                <FaFileInvoice className="text-[#c9a45c] text-xl" />
              </div>
              <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
                Electricity Bill Check
              </h2>
            </div>

            <div className="space-y-3">
              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Bill is from a recent month, not outdated
              </p>

              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Address on the bill matches the property address
              </p>

              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Name on the bill matches the owner, or ownership can be reasonably confirmed
              </p>

              <p className={rejectRow}>
                <FaTimesCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Reject if the document looks tampered or unreadable
              </p>
            </div>
          </div>

          <div className={cardBase}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
                <FaMapMarkerAlt className="text-[#c9a45c] text-xl" />
              </div>
              <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
                Location Verification
              </h2>
            </div>

            <div className="space-y-3">
              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Coordinates shared match the written address
              </p>

              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Location is confirmed with a site visit where possible
              </p>

              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Nearby landmarks in photos match the claimed area
              </p>

              <p className={rejectRow}>
                <FaTimesCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Reject if the address cannot be confirmed at all
              </p>
            </div>
          </div>

          <div className={cardBase}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
                <FaCamera className="text-[#c9a45c] text-xl" />
              </div>
              <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
                Photos & Video Check
              </h2>
            </div>

            <div className="space-y-3">
              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Images clearly show the rooms, entrance and shared spaces
              </p>

              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Listed facilities are visible in the photos or video
              </p>

              <p className={checkRow}>
                <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Video walkthrough matches the property described
              </p>

              <p className={rejectRow}>
                <FaTimesCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
                Reject if images appear to be taken from another listing online
              </p>
            </div>
          </div>
        </div>

        <div className={`${cardBase} mt-5 sm:mt-6`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
              <FaVideo className="text-[#c9a45c] text-xl" />
            </div>

            <h2 className="text-lg font-extrabold text-[#f5efe3] tracking-tight">
              On-Site Inspection Checklist
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className={checkRow}>
              <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
              Room type matches what was listed (Single, Shared, Entire Place)
            </p>

            <p className={checkRow}>
              <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
              Number of rooms and capacity match the listing
            </p>

            <p className={checkRow}>
              <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
              Facilities marked (WiFi, AC, Furnished, etc.) are actually present
            </p>

            <p className={checkRow}>
              <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
              Property is in a safe and liveable condition
            </p>

            <p className={checkRow}>
              <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
              Owner can be reached at the given contact details
            </p>

            <p className={checkRow}>
              <FaCheckCircle className="text-[#c9a45c] mt-0.5 shrink-0" />
              No signs of illegal occupancy or ownership disputes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-5 sm:mt-6">

          <div className="bg-[#050505] border border-[#c9a45c]/35 rounded-2xl p-5 sm:p-6 shadow-[0_8px_26px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] active:shadow-[0_0_28px_rgba(0,0,0,0.65)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
                <FaCheckCircle className="text-[#c9a45c] text-lg" />
              </div>

              <h2 className="text-lg font-extrabold text-[#c9a45c] tracking-tight">
                When to Approve
              </h2>
            </div>

            <p className="text-sm text-[#bdb6aa] leading-relaxed font-medium">
              Approve a listing once all documents check out, the location and photos match the property, and there are no red flags in ownership or condition.
            </p>
          </div>

          <div className="bg-[#050505] border border-[#c9a45c]/35 rounded-2xl p-5 sm:p-6 shadow-[0_8px_26px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] active:shadow-[0_0_28px_rgba(0,0,0,0.65)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#050505] border border-[#3a3328] flex items-center justify-center shrink-0">
                <FaTimesCircle className="text-[#c9a45c] text-lg" />
              </div>

              <h2 className="text-lg font-extrabold text-[#c9a45c] tracking-tight">
                When to Reject
              </h2>
            </div>

            <p className="text-sm text-[#bdb6aa] leading-relaxed font-medium">
              Reject a listing if documents are missing, unclear or don't match, the location can't be confirmed, or the property doesn't match what was described.
            </p>
          </div>
        </div>

        <div className={`${cardBase} mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9a45c]/10 border border-[#c9a45c]/15 flex items-center justify-center shrink-0">
              <FaHeadset className="text-[#c9a45c] text-lg" />
            </div>

            <p className="text-sm text-[#bdb6aa] font-medium leading-relaxed pt-1">
              Not sure about a property? Don't guess — reach out to Admin before making a decision.
            </p>
          </div>

          <Link
            to="/contact"
            className="bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] px-6 py-3 rounded-xl text-sm font-extrabold shadow-lg shadow-[#c9a45c]/20 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,164,92,0.22)] transition-all duration-300 active:scale-95 w-fit shrink-0"
          >
            Contact Admin
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AgentGuidelines;