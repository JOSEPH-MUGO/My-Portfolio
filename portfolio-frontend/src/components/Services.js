import AOS from 'aos';
import 'aos/dist/aos.css'; 
import React, { useEffect, useState } from 'react';
import { FaCode, FaDatabase, FaMobileAlt, FaEnvelope } from 'react-icons/fa';
import '../styles/Services.css';
import API from "./api";

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // For now, fetch static data from backend
    fetch(`${API}/api/services`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(console.error);
      AOS.init({ duration: 1500, once: false }); 

  }, []);

  return (
    <section className="container py-5" id="services" data-aos="fade-up">
      <h2 className="text-center mb-4">Services I Offer</h2>
      <div className="row">
        {services.map((service, idx) => (
          <div className="col-md-4 mb-4" key={idx}>
            <div className="card h-100 text-center service-card">
              <div className="card-body">
                {/* Use icon name from data or pick default */}
                <div className="icon mb-3">
                  {service.icon === 'code' && <FaCode size={36} />}
                  {service.icon === 'database' && <FaDatabase size={36} />}
                  {service.icon === 'mobile' && <FaMobileAlt size={36} />}
                  {service.icon === 'mobile' && <FaEnvelope size={36} />}
                </div>
                <h5 className="card-title">{service.title}</h5>
                <p className="card-text">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
