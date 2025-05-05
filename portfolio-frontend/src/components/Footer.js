import React from "react";
import "../styles/Footer.css";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer bg-dark text-light py-3 mt-5">
      <div className="container">
        <div className="row justify-content-between align-items-start text-center text-md-start">
          {/* Quick Links */}
          <div className="col-12 col-md-6 mb-3">
            <h6 className="text-uppercase fw-bold">Quick Links</h6>
            <ul className="list-unstyled small">
              <li>
                <a href="#about" className="footer-link">
                  About
                </a>
              </li>
              <li>
                <a href="#projects" className="footer-link">
                  Projects
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="col-12 col-md-5 mb-3">
            <h6 className="text-uppercase fw-bold">Connect With Me</h6>
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
              <a
                href="https://github.com/JOSEPH-MUGO"
                className="btn btn-sm btn-outline-light"
              >
                <FaGithub className="me-1" /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/josephmugoithanwa"
                className="btn btn-sm btn-outline-light"
              >
                <FaLinkedin className="me-1" /> LinkedIn
              </a>
              <a
                href="https://wa.me/254740381240"
                className="btn btn-sm btn-outline-light"
              >
                <FaWhatsapp className="me-1" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary mt-3 mb-2" />

        <div className="text-center small text-light">
          © {new Date().getFullYear()} <strong> Designed & Developed with passion By JOSEPH MUGO</strong>. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
