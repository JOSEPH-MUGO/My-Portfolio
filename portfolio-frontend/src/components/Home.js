import React from 'react';
import { ReactTyped } from 'react-typed';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import heroImage from '../assets/jose1.jpeg';
import '../styles/Home.css';

function Home() {
  const sectionStyle = {
    backgroundImage: `url(${heroImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center top',
    backgroundSize: 'cover',     
    marginTop: '56px',                 

    height: 'calc(100vh - 56px)',      
  };
    
    return (
      <section id="home" 
      className="home-hero d-flex align-items-center justify-content-center text-center"
  style={sectionStyle}>
        <div className="overlay"></div>
        
      <div className="hero-content">
        <h1 className="display-3 text-white">Hello, I’m Joseph Mugo </h1>
        <h2 className="h4 text-light mb-4">A  <ReactTyped
        
          strings={[ "Software Developer", "Web Enthusiast", "Tech Lover"," Full Stack Developer"]}
          typeSpeed={50}
          backSpeed={40}
          loop
          className="h4 text-light mb-4"
        /></h2>
        <div>
          <a href="https://github.com/JOSEPH-MUGO" className="btn btn-outline-light mx-2"><FaGithub /> GitHub</a>
          <a href="https://www.linkedin.com/in/josephmugoithanwa" className="btn btn-primary mx-2"><FaLinkedin /> LinkedIn</a>
        </div>
      </div>
      </section>
    );
  }
  
  export default Home;