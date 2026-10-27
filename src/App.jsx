import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import React, { useState } from "react";
import RootLayout from "./layouts/RootLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import POLayout from "./layouts/POLayout.jsx";
import AgentLayout from "./layouts/AgentLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import RoleBasedHome from "./pages/RolebasedHome.jsx";
import Logout from "./components/Logout.jsx";
import Login from "./pages/Login.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Tenantsignup from "./pages/tenant/Tenantsignup.jsx";
import Mybooking from "./pages/tenant/MyBooking.jsx";
import Payment from "./pages/tenant/Payment.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import PropertyDetails from "./pages/tenant/PropertyDetails.jsx";
import OwnerSignup from "./pages/owner/OwnerSignup.jsx";
import PropertyListing from "./pages/tenant/PropertyListing.jsx";
import PODashboard from "./pages/owner/PODashboard.jsx";
import CreateListing from "./pages/owner/CreateListing.jsx";
import ListYourProperty from "./pages/owner/ListYourProperty.jsx";
import POPayments from "./pages/owner/POPayments.jsx";
import MyProperties from "./pages/owner/MyProperties.jsx";
import PropertyOwnerDetails from "./pages/owner/PropertyOwnerDetails.jsx";
import ManageProperty from "./pages/owner/ManageProperty.jsx";
import POBooking from "./pages/owner/POBooking.jsx";
import POReviews from "./pages/owner/POReviews.jsx";
import POProfile from "./pages/owner/POProfile.jsx";
import POTenants from "./pages/owner/POTenants.jsx";
import AgentDashboard from "./pages/agent/AgentDashboard.jsx";
import AgentGuidelines from "./pages/agent/AgentGuidelines.jsx";
import AgentPropertyVerification from "./pages/agent/AgentPropertyVerification.jsx";
import ApplyAgentForm from "./pages/agent/ApplyAgentForm.jsx";
import AgentHistory from "./pages/agent/AgentHistory.jsx";
import AgentProperties from "./pages/agent/AgentProperties.jsx";
import Contact from "./pages/agent/Contact.jsx";
import ContactUs from "./pages/tenant/ContactUs.jsx";
import AgentPayemnts from "./pages/agent/AgentPayments.jsx";
import AgentProfile from "./pages/agent/AgentProfile.jsx";
import Adminlogin from "./pages/admin/Adminlogin.jsx";
import VerifyProperties from "./pages/admin/VerifyProperties.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import AdminComplaints from "./pages/admin/AdminComplaints.jsx";
import AdminPayments from "./pages/admin/AdminPayments.jsx";
import AdminProperties from "./pages/admin/AdminProperties.jsx";
import AdminPropertyOwners from "./pages/admin/AdminPropertyOwners.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminTenants from "./pages/admin/AdminTenants.jsx";
import AdminAgents from "./pages/admin/AdminAgents.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import Payemntcallback from "./components/Paymentcallback.jsx";
import NotificationListener from "./components/NotificationListener.jsx";
import Navbar from "./components/Navbar.jsx";
import PODashboardNavbar from "./components/PODashboardNavbar.jsx";
import AgentNavbar from "./components/AgentNavbar.jsx";
import AdminNavbar from "./components/AdminNavbar.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const RoleNotificationLayout = () => {
  const { user, activeRole } = useAuth();
  const role = activeRole || user?.role || "tenant";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderNavbar = () => {
    if (role === "admin") {
      return (
        <AdminNavbar
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />
      );
    }

    if (role === "owner") {
      return <PODashboardNavbar onMenuClick={() => {}} />;
    }

    if (role === "agent") {
      return <AgentNavbar onMenuClick={() => {}} />;
    }

    return <Navbar />;
  };

  return (
    <>
      <style>{`
        header.fixed {
          z-index: 20 !important;
        }

        [class*="fixed"][class*="inset-0"] {
          z-index: 9999 !important;
        }

        [class*="fixed"][class*="inset-0"] [class*="z-"] {
          z-index: 10000 !important;
        }

        [role="dialog"] {
          z-index: 9999 !important;
        }

        [role="dialog"] [class*="fixed"],
        [role="dialog"] [class*="absolute"] {
          z-index: 10000 !important;
        }
      `}</style>

      <div
        className="min-h-screen w-full"
        style={{
          backgroundColor: "var(--theme-bg)",
          color: "var(--theme-text)",
        }}
      >
        {renderNavbar()}

        <main
          className="min-h-screen pt-[82px] sm:pt-[94px]"
          style={{
            backgroundColor: "var(--theme-bg)",
            color: "var(--theme-text)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

const App = () => {
  return (
    <>
      <NotificationListener />

      <Routes>
        <Route path="/admin/login" element={<Adminlogin />} />

        <Route element={<RoleNotificationLayout />}>
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        <Route path="/" element={<RootLayout />}>
          <Route index element={<RoleBasedHome />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route
            path="list-your-property"
            element={<ListYourProperty />}
          />
          <Route path="properties" element={<PropertyListing />} />
          <Route
            path="property/:id"
            element={<PropertyDetails />}
          />
          <Route
            path="properties/:id"
            element={<PropertyDetails />}
          />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route
            path="verify-email/:token"
            element={<VerifyEmail />}
          />
          <Route
            path="unauthorized"
            element={<Unauthorized />}
          />
          <Route
            path="payment/callback"
            element={<Payemntcallback />}
          />

          <Route element={<ProtectedRoute roles={["tenant"]} />}>
            <Route
              path="mybooking"
              element={<Mybooking />}
            />

            <Route
              path="tenant/dashboard"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

            <Route
              path="payment/:bookingId"
              element={<Payment />}
            />

            <Route
              path="profile"
              element={<UpdateProfile />}
            />

            <Route
              path="logout"
              element={<Logout />}
            />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Tenantsignup />}
          />

          <Route
            path="/ownersignup"
            element={<OwnerSignup />}
          />

          <Route
            path="/apply-agent-form"
            element={<ApplyAgentForm />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              roles={["owner"]}
            />
          }
        >
          <Route element={<POLayout />}>
            <Route
              path="owner/dashboard"
              element={<PODashboard />}
            />

            <Route
              path="podashboard"
              element={<PODashboard />}
            />

            <Route
              path="createlisting"
              element={<CreateListing />}
            />

            <Route
              path="myproperties"
              element={<MyProperties />}
            />

            <Route
              path="propertyownerdetails/:id"
              element={<PropertyOwnerDetails />}
            />

            <Route
              path="manageproperty/:id"
              element={<ManageProperty />}
            />

            <Route
              path="pobookings"
              element={<POBooking />}
            />

            <Route
              path="popayments"
              element={<POPayments />}
            />

            <Route
              path="poreviews"
              element={<POReviews />}
            />

            <Route
              path="poprofile"
              element={<POProfile />}
            />

            <Route
              path="potenants"
              element={<POTenants />}
            />

            <Route
              path="pologout"
              element={<Logout />}
            />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              roles={["agent"]}
            />
          }
        >
          <Route element={<AgentLayout />}>
            <Route
              path="agent/dashboard"
              element={<AgentDashboard />}
            />

            <Route
              path="agentguidelines"
              element={<AgentGuidelines />}
            />

            <Route
              path="agentpropertyverification/:id?"
              element={
                <AgentPropertyVerification />
              }
            />

            <Route
              path="agenthistory"
              element={<AgentHistory />}
            />

            <Route
              path="agentproperties"
              element={<AgentProperties />}
            />

            <Route
              path="contact"
              element={<Contact />}
            />

            <Route
              path="agentpayments"
              element={<AgentPayemnts />}
            />

            <Route
              path="agentprofile"
              element={<AgentProfile />}
            />

            <Route
              path="agentlogout"
              element={<Logout />}
            />
          </Route>
        </Route>

        <Route
          path="admin"
          element={
            <ProtectedRoute
              roles={["admin"]}
              redirectTo="/admin/login"
            />
          }
        >
          <Route
            path="logout"
            element={<Logout />}
          />

          <Route element={<AdminLayout />}>
            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="support"
              element={<AdminComplaints />}
            />

            <Route
              path="bookings"
              element={<AdminBookings />}
            />

            <Route
              path="payments"
              element={<AdminPayments />}
            />

            <Route
              path="properties"
              element={<AdminProperties />}
            />

            <Route
              path="propertyowners"
              element={<AdminPropertyOwners />}
            />

            <Route
              path="settings"
              element={<AdminSettings />}
            />

            <Route
              path="tenants"
              element={<AdminTenants />}
            />

            <Route
              path="agents"
              element={<AdminAgents />}
            />

            <Route
              path="verify-properties/:id?"
              element={<VerifyProperties />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;