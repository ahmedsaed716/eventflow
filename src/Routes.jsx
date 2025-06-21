// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import AdminSidebar from "components/ui/AdminSidebar";
import UserProgressIndicator from "components/ui/UserProgressIndicator";
import UsherStatusPanel from "components/ui/UsherStatusPanel";

// Page imports
import LoginRegister from "pages/login-register";
import EventDetailsRegistration from "pages/event-details-registration";
import AdminEventManagementDashboard from "pages/admin-event-management-dashboard";
import EventCreationManagement from "pages/event-creation-management";
import AttendeeManagementAnalytics from "pages/attendee-management-analytics";
import UsherCheckInInterface from "pages/usher-check-in-interface";
import UserManagement from "pages/user-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RoleBasedHeader />
        <AdminSidebar />
        <UserProgressIndicator />
        <div className="min-h-screen bg-background">
          <RouterRoutes>
            <Route path="/" element={<LoginRegister />} />
            <Route path="/login-register" element={<LoginRegister />} />
            <Route path="/event-details-registration" element={<EventDetailsRegistration />} />
            <Route path="/admin-event-management-dashboard" element={<AdminEventManagementDashboard />} />
            <Route path="/event-creation-management" element={<EventCreationManagement />} />
            <Route path="/attendee-management-analytics" element={<AttendeeManagementAnalytics />} />
            <Route path="/usher-check-in-interface" element={<UsherCheckInInterface />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </div>
        <UsherStatusPanel />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;