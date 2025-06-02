// src/components/Testimonials.js
import React, { useEffect, useState, useRef } from 'react';
import '../styles/Testimonials.css';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import API from "./api";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [show, setShow]       = useState(false);
  const [form, setForm]       = useState({ name: '', role: '', quote: '' });
  const [photoFile, setPhotoFile] = useState(null);

  const carouselRef     = useRef(null);
  const initCarouselRef = useRef(false);

  // 1) Fetch testimonials once
  useEffect(() => {
    fetch(`${API}/api/testimonials`)
      .then(r => r.json())
      .then(setTestimonials)
      .catch(console.error);
  }, []);

  // 2) Initialize Bootstrap Carousel
  useEffect(() => {
    if (testimonials.length > 1 && window.bootstrap && !initCarouselRef.current) {
      const el = document.getElementById('testimonialCarousel');
      const carousel = new window.bootstrap.Carousel(el, {
        interval: 5000,    // auto-advance every 5 seconds
        ride:     'carousel',
        touch:    true,
        wrap:     true,
        pause:    false    // don’t pause on hover
      });
      carouselRef.current = carousel;
      initCarouselRef.current = true;
    }
  }, [testimonials]);

  // Modal handlers (unchanged)...
  const open      = () => setShow(true);
  const close     = () => {
    setShow(false);
    setForm({ name: '', role: '', quote: '' });
    setPhotoFile(null);
  };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePhoto  = e => setPhotoFile(e.target.files[0]);
  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k, v));
    if (photoFile) fd.append('photo', photoFile);

    try {
      const res = await fetch(`${API}/api/testimonials`, { method: 'POST', body: fd });
      const data = await res.json();
      close();
      Swal.fire('Thank you!', data.message, 'success');
    } catch {
      Swal.fire('Error', 'Submission failed. Try again.', 'error');
    }
  };

  return (
    <section className="container py-5" id="testimonials">
      <h2 className="text-center mb-4">Testimonials</h2>

      <div
        id="testimonialCarousel"
        className="carousel slide"
        data-bs-ride="carousel"     // <-- enable auto-ride in markup
        data-bs-interval="5000"     // <-- optional shortcut for interval
      >
        <div className="carousel-inner">
          {testimonials.map((t, idx) => (
            <div key={idx} className={`carousel-item${idx === 0 ? ' active' : ''}`}>
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
