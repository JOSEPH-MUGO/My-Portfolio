import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import React, { useEffect, useState } from "react";
import API from "./api";


function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      
      .catch((err) => console.error("Error fetching projects:", err));
    AOS.init({ duration: 1000, once: false });
  }, []);
  return (
    <section className="container py-5" id="projects" data-aos="fade-up">
      <h2 className="text-center mb-4">Projects</h2>
      <div className="row">
        {projects.map((project) => (
          <div className="col-md-6 mb-4" key={project.id}>
            <div className="card h-100 shadow-sm">
              {project.image && (
                <img
                  src={project.image}
                  className="card-img-top"
                  alt={project.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text">{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View Project
                </a>
              </div>
            </div>
          </div>
        ))}
        {/*
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <img src={projectsPhoto} className="card-img-top" alt="Project 1" />
            <div className="card-body">
              <h5 className="card-title">Event Tracker Management System</h5>
              <p className="card-text">A Django-based system for tracking corporate events, reports, and assignments.</p>
              <a href="#projects" className="btn btn-primary">View Project</a>
            </div>
          </div>
        </div>
        
         More projects can be added the same way */}
      </div>
    </section>
  );
}

export default Projects;
