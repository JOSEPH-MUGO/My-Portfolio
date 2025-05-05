import React from 'react';

import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import { useEffect} from 'react';

export default function PublicPage() {
  useEffect(() => {
    const startTime = Date.now();
    const actions = new Set();

    // Record clicks
    const clickHandler = e => {
      const btn = e.target.closest('button, a');
      if (btn) actions.add(btn.textContent.trim());
    };
    document.addEventListener('click', clickHandler);

    // Before unload: send data via sendBeacon
    const handleBeforeUnload = () => {
      const timeSpentMs = Date.now() - startTime;
      const payload = JSON.stringify({
        path: window.location.pathname,
        timeSpentMs,
        actions: Array.from(actions),
      });
      // Use sendBeacon so browser sends even on unload
      navigator.sendBeacon(`${process.env.REACT_APP_API_URL}/api/visit`, payload);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('click', clickHandler);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  return (
    <>
      
      <About />
      <Services />
      <Projects />
      <Testimonials />
      <Contact />
    </>
  );
}
