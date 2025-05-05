// src/components/Testimonials.js
import React, { useEffect, useState, useRef } from 'react';
import '../styles/Testimonials.css';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Testimonials() {
  
  const [testimonials, setTestimonials] = useState([]);

  // Modal, form state
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', quote: '' });
  const [photoFile, setPhotoFile] = useState(null);

  
  const carouselRef = useRef(null);
  const carouselInitialized = useRef(false);

  // Fetch testimonials
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
        setTimeout(() => {
          if (data.length && window.bootstrap && !carouselInitialized.current) {
            const el = document.getElementById('testimonialCarousel');
            if (el && !carouselRef.current) {
              carouselRef.current = new window.bootstrap.Carousel(el, {
                interval: 5000,
                pause: false,
              });
              carouselInitialized.current = true;
            }
          }
        }, 300); 
      })
      .catch(console.error);
  }, []);

  // Modal handlers
  const open = () => setShow(true);
  const close = () => {
    setShow(false);
    setForm({ name: '', role: '', quote: '' });
    setPhotoFile(null);
  };

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handlePhoto = e => setPhotoFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('role', form.role);
    fd.append('quote', form.quote);
    if (photoFile) fd.append('photo', photoFile);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/testimonials`, {
        method: 'POST',
        body: fd
      });
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
        data-bs-ride="carousel"
        data-bs-interval="5000"
        data-bs-pause="false"
      >
        {/* Indicators */}
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

        {/* Slides */}
        <div className="carousel-inner">
          {testimonials.map((t, idx) => (
            <div
              className={`carousel-item${idx === 0 ? ' active' : ''}`}
              key={idx}
            >
              <div className="testimonial text-center">
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${t.photo}`}
                  alt={t.name}
                  className="rounded-circle mb-3"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  onError={e => { e.target.src = '/assets/jose.jpeg'; }}
                />
                <p className="mb-1">"{t.quote}"</p>
                <small className="text-muted">— {t.name}, {t.role}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Testimonial Button */}
      <div className="text-center mt-4">
        <Button variant="outline-primary" onClick={open}>
          Share Your Testimony
        </Button>
      </div>

      {/* Modal Form */}
      <Modal show={show} onHide={close}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> Share Your Testimony About Joseph</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quote</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="quote"
                value={form.quote}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Photo (optional)</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handlePhoto} />
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
