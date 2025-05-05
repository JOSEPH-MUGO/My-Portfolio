// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public
import PublicPage from "./PublicPages/Pages";

// Admin
import AdminLoginPage from "./Admin/Login";
import RequireAuth from "./components/RequireAuth";

import About from "./Admin/About";
import Skills from "./Admin/Skills";
import Education from "./Admin/Education";
import Experience from "./Admin/Experience";
import AdminProjects from "./Admin/AdminProjects";
import Service from "./Admin/Service";
import AdminTestimonials from "./Admin/AdminTestimonials";
import Certifications from "./Admin/Certifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public one-page site */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <PublicPage />
            </PublicLayout>
          }
        />

        {/* Admin login (unprotected) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* All other /admin/* routes require auth */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminLayout>
                <Routes>
                  <Route index element={<Navigate to="projects" replace />} />
                  <Route path="about" element={<About />} />
                  <Route path="skills" element={<Skills />} />
                  <Route path="education" element={<Education />} />
                  <Route path="certifications" element={<Certifications />} />
                  <Route path="experience" element={<Experience />} />
                  <Route path="services" element={<Service />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                </Routes>
              </AdminLayout>
            </RequireAuth>
          }
        />

        {/* Redirect any unknown URL to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
