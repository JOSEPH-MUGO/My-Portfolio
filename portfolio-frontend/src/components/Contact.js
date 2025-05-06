import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Contact.css';
import API from "./api";

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Message sent! Thank you.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus(data.error || 'Failed to send.');
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <section className="container py-5" id="contact">
      <h2 className="text-center mb-5">Contact Me</h2>

      <div className="row">
        
        <div className="col-md-4 mb-4">
          <div className="card contact-card h-100">
            <div className="card-body">
              <h5 className="card-title">Get in Touch</h5>
              <p className="card-text">
                <FaEnvelope className="icon" /> 
                <a href="mailto:josephithanwa@gmail.com">josephithanwa@gmail.com</a>
              </p>
              <p className="card-text">
                <FaPhoneAlt className="icon" /> 
                <a href="tel:+254740381240">+254 740 381 240</a>
              </p>
              <p className="card-text">
                <FaMapMarkerAlt className="icon" /> 
                <strong>Marimanti, Tharaka Nithi, Kenya</strong>
              </p>
            </div>
          </div>
        </div>

        
        <div className="col-md-8">
          <div className="card contact-form-card h-100">
            <div className="card-body">
              <form className="contact-form" onSubmit={handleSubmit}>
                {status && <div className="alert alert-info">{status}</div>}

                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="form-control"
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    rows="5"
                    placeholder="Your Message"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
