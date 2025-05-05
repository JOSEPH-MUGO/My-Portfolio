// src/layouts/PublicLayout.js
import React from 'react';
import Navbar from '../components/Navbar';
import Home from '../components/Home'; // if you have one
import Footer from '../components/Footer'; // if you have one

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <Home /> 
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default PublicLayout;
