// src/Admin/AdminCertifications.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import API from "../components/api";

export default function Certifications() {
  const [items, setItems]       = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm] = useState({
    id: null,
    title: '',
    issuer: '',
    dateAward: '',
    link: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch all certs
  const fetchItems = async () => {
    const res = await axios.get(`${API}/api/certifications`);
    setItems(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter as search changes
  useEffect(() => {
    setFiltered(
      items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.issuer.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, items]);

  // Open modal to add/edit
  const openModal = item => {
    if (item) {
      setForm({ 
        id: item.id, 
        title: item.title, 
        issuer: item.issuer,
        dateAward: item.dateAward,
        link: item.link || ''
      });
      setPreviewUrl(item.photo ? `${API}/uploads/${item.photo}` : null);
    } else {
      setForm({ id: null, title: '', issuer: '', dateAward: '', link: '' });
      setPreviewUrl(null);
    }
    setPhotoFile(null);
    setShow(true);
  };
  const closeModal = () => setShow(false);

  // Handle form change
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePhotoChange = e => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  // Submit add/edit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', form.title);
    data.append('issuer', form.issuer);
    data.append('dateAward', form.dateAward);
    data.append('link', form.link);
    if (photoFile) data.append('photo', photoFile);

    try {
      if (form.id) {
        await axios.put(`${API}/api/certifications/${form.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Updated', 'Certification updated successfully', 'success');
      } else {
        await axios.post(`${API}/api/certifications`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Added', 'Certification added successfully', 'success');
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save certification', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete with confirmation
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Delete this certification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/certifications/${id}`);
      Swal.fire('Deleted', 'Certification removed', 'success');
      fetchItems();
    }
  };

  return (
    <div className="container py-4">
      <h3>Manage Certifications</h3>

      {/* Search & Add */}
      <div className="d-flex mb-3">
        <InputGroup style={{ maxWidth: 300 }}>
          <FormControl
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button className="ms-auto" onClick={() => openModal(null)}>+ Add Certification</Button>
      </div>

      {/* Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Issuer</th>
            <th>Date Awarded</th>
            <th>Link</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">No certifications found.</td>
            </tr>
          )}
          {filtered.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.issuer}</td>
              <td>{item.dateAward}</td>
              <td>
                {item.link && <a href={item.link} target="_blank" rel="noreferrer">View</a>}
              </td>
              <td>
                {item.photo && (
                  <Image
                    src={item.photo}
                    rounded
                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                  />
                )}
              </td>
              <td>
                <Button size="sm" onClick={() => openModal(item)} className="me-2">Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Form */}
      <Modal show={show} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{form.id ? 'Edit Certification' : 'Add Certification'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title" value={form.title}
                onChange={handleChange} required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Issuer</Form.Label>
              <Form.Control
                name="issuer" value={form.issuer}
                onChange={handleChange} required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date Awarded</Form.Label>
              <Form.Control
                name="dateAward" type="date"
                value={form.dateAward}
                onChange={handleChange} required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link (optional)</Form.Label>
              <Form.Control
                name="link" value={form.link}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Certificate Photo</Form.Label>
              {previewUrl && (
                <div className="mb-2">
                  <Image
                    src={previewUrl}
                    rounded
                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                  />
                </div>
              )}
              <Form.Control
                type="file" accept="image/*"
                onChange={handlePhotoChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : (form.id ? 'Update' : 'Add')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
