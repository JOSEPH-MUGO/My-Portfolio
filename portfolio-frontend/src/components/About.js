import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/About.css";

function About() {
  // State of data
  const API = process.env.REACT_APP_API_URL || "";
  const [about, setAbout] = useState({ bio: "", photo: "" });
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCerts] = useState([]);

  
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });

    //  fetch JSON
    const fetchJSON = async (url, setter) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setter(data);
      } catch (err) {
        console.error(`Error fetching ${url}:`, err);
      }
    };

    fetchJSON(`${API}/api/about`, setAbout);
    fetchJSON(`${API}/api/skills`, setSkills);
    fetchJSON(`${API}/api/experience`, setExperience);
    fetchJSON(`${API}/api/education`, setEducation);
    fetchJSON(`${API}/api/certifications`, setCerts);
  }, [API]);

  return (
    <section className="container py-5" id="about" data-aos="fade-up">
      <h2 className="text-center mb-5">About Me</h2>

      {/* About Me & Personal Info */}
      <div className="row align-items-start mb-5">
        <div className="col-md-4 text-center mb-4 mb-md-0" data-aos="flip-left">
          <img
            src={about.photo ? `${API}/uploads/${about.photo}` : "/assets/jose.jpeg"}
            alt="Profile"
            className="img-fluid rounded-circle about-photo"
          />
        </div>
        <div className="col-md-8" data-aos="fade-up">
          <p className="text-justify">{about.bio}</p>

          <div className="card personal-info-card mt-4" data-aos="fade-left">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <strong>Name:</strong> Joseph Mugo Ithanwa
                </div>
                <div className="col-sm-6">
                  <strong>Age:</strong> 23
                </div>
                <div className="col-sm-6">
                  <strong>Email:</strong> josephithanwa@gmail.com
                </div>
                <div className="col-sm-6">
                  <strong>Phone:</strong> +254 740 381 240
                </div>
                <div className="col-sm-6">
                  <strong>Location:</strong> Kenya, Tharaka Nithi, Marimanti
                </div>
                <div className="col-sm-6">
                  <strong>Freelance:</strong> Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2x2 Grid: Skills, Experience, Education, Certifications */}
      <div className="row gy-4">
        {/* Skills */}
        <div className="col-md-6" data-aos="zoom-in">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="mb-4 text-center">Skills</h3>
              <div className="row">
                {skills.map((skill, index) => (
                  <div className="col-md-6 mb-3" key={skill.id || index}>
                    <div className="d-flex justify-content-between">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="col-md-6" data-aos="zoom-out">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="mb-4 text-center">Experience</h3>
              <div className="timeline">
                {experience.map((expe) => (
                  <div className="timeline-item" key={expe.id}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <h5>{expe.role}</h5>
                      <small className="text-muted">
                        {expe.company} • {expe.period}
                      </small>
                      <p>{expe.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div
          className="col-md-6"
          data-aos="flip-left"
          data-aos-easing="ease-out-cubic"
        >
          <div className="card h-100">
            <div className="card-body">
              <h3 className="mb-4">Education</h3>
              <ul className="list-unstyled">
                {education.map((edu) => (
                  <li key={edu.id} className="mb-3">
                    <h5>{edu.degree}</h5>
                    <small className="text-muted">
                      {edu.institution} • {edu.period}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div
          className="col-md-6"
          data-aos="fade-right"
          data-aos-easing="ease-in-cubic"
        >
          <div className="card h-100">
            <div className="card-body">
              <h3 className="mb-4">Certifications</h3>
              <ul className="list-unstyled">
                {certifications.map((cert) => (
                  <li key={cert.id} className="mb-3">
                    <div className="d-flex align-items-center">
                      {cert.photo && (
                        <img
                          src={`${API}/uploads/${cert.photo}`}
                          alt={cert.title}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            marginRight: 10,
                          }}
                        />
                      )}
                      <div>
                        <h5 className="mb-1">{cert.title}</h5>
                        <small className="text-muted">
                          {cert.issuer} •{" "}
                          {new Date(cert.dateAward || cert.year).getFullYear()}
                        </small>
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block mt-1 btn btn-primary btn-sm"
                        >
                          View Certificate
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
