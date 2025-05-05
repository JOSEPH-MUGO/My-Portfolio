import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <>
      <h3>Admin Panel</h3>
      <NavLink
        to="/admin/about"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        About
      </NavLink>
      <NavLink
        to="/admin/skills"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        {" "}
        Skills
      </NavLink>
      <NavLink
        to="/admin/education"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        {" "}
        Education
      </NavLink>
      <NavLink
        to="/admin/experience"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        {" "}
        Experience
      </NavLink>
      <NavLink
        to="/admin/certifications"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        {" "}
        Certifications
      </NavLink>
      <NavLink
        to="/admin/services"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Services
      </NavLink>

      <NavLink
        to="/admin/projects"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Projects
      </NavLink>

      <NavLink
        to="/admin/testimonials"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Testimonials
      </NavLink>
    </>
  );
}
