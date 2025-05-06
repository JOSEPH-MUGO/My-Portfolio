// src/components/Testimonials.js
import React, { useEffect, useState, useRef } from 'react';
import '../styles/Testimonials.css';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import API from "./api";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  // Modal & form state
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', quote: '' });
  const [photoFile, setPhotoFile] = useState(null);

  // Refs to ensure we init only once
  const carouselRef = useRef(null);
  const initialized = useRef(false);

  // Fetch testimonials
  useEffect(() => {
    fetch(`${API}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(console.error);
  }, []);

  // Initialize carousel only if more than 1 slide
  useEffect(() => {
    if (
      testimonials.length > 1 &&        // need at least 2 items
      window.bootstrap &&
      !initialized.current
    ) {
      const el = document.getElementById('testimonialCarousel');
      const carousel = new window.bootstrap.Carousel(el, {
        ride: 'carousel',    // start automatically
        interval: 5000,      // 5s per slide
        pause: false,        // don't pause on hover/touch
        wrap: true,          // loop back to start
        touch: true,         // enable swipe
        keyboard: true       // enable arrow keys
      });
      carousel.cycle();      // ensure auto-cycling on mobile
      carouselRef.current = carousel;
      initialized.current = true;
    }
  }, [testimonials]);

  // Modal handlers
  const open = () => setShow(true);
  const close = () => {
    setShow(false);
    setForm({ name: '', role: '', quote: '' });
    setPhotoFile(null);
  };

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePhoto  = e => setPhotoFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('role', form.role);
    fd.append('quote', form.quote);
    if (photoFile) fd.append('photo', photoFile);

    try {
      const res = await fetch(`${API}/api/testimonials`, { method: 'POST', body: fd });
      const data = await res.json();
      close();
      Swal.fire('Thank you!', data.message, 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Submission failed. Please try again.', 'error');
    }
  };

  return (
    <section className="container py-5" id="testimonials">
      <h2 className="text-center mb-4">Testimonials</h2>

      <div
        id="testimonialCarousel"
        className="carousel slide"
        data-bs-ride="carousel"       // automatic start
        data-bs-interval="5000"        // 5s
        data-bs-pause="false"          // no pause on hover
        data-bs-touch="true"           // allow swipe
        data-bs-wrap="true"            // loop slides
      >
        {testimonials.length > 1 && (
          <div className="carousel-indicators">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide-to={idx}
                className={idx === 0 ? 'active' : ''}
                aria-current={idx === 0 ? 'true' : undefined}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <div className="carousel-inner">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className={`carousel-item${idx === 0 ? ' active' : ''}`}
            >
              <div className="testimonial text-center">
                <img
                  src={t.photo || '/assets/mypic.png'}
                  alt={t.name}
                  className="rounded-circle mb-3"
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/assets/mypic.png';
                  }}
                />
                <p className="mb-1">"{t.quote}"</p>
                <small className="text-muted">— {t.name}, {t.role}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <Button variant="outline-primary" onClick={open}>
          Share Your Testimony
        </Button>
      </div>

      <Modal show={show} onHide={close}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton><Modal.Title>Submit Testimony</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control name="role" value={form.role} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quote</Form.Label>
              <Form.Control as="textarea" rows={3} name="quote" value={form.quote} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Photo (optional)</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handlePhoto}/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </section>
  );
}

export default Testimonials;
