import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import API from "../components/api";
export default function AdminService() {
  const [items, setItems]       = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm] = useState({
    id: null,
    icon: '',
    title: '',
    description: ''
  });

  // Fetch services
  const fetchItems = async () => {
    const res = await axios.get(`${API}/api/services`);
    setItems(res.data);
    setFiltered(res.data);
  };

  useEffect(() => { fetchItems(); }, []);

  // Filter on search
  useEffect(() => {
    setFiltered(
      items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, items]);

  // Modal handlers
  const openModal = item => {
    if (item) setForm({ id: item.id, icon: item.icon, title: item.title, description: item.description });
    else setForm({ id: null, icon: '', title: '', description: '' });
    setShow(true);
  };
  const closeModal = () => setShow(false);

  // Form changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.id) {
        await axios.put(`${API}/api/services/${form.id}`, form);
        Swal.fire('Updated', 'Service updated.', 'success');
      } else {
        await axios.post(`${API}/api/services`, form);
        Swal.fire('Added', 'Service added.', 'success');
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save service.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async id => {
    const res = await Swal.fire({
      title: 'Delete this service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    });
    if (res.isConfirmed) {
      await axios.delete(`${API}/api/services/${id}`);
      Swal.fire('Deleted', 'Service removed.', 'success');
      fetchItems();
    }
  };

  return (
    <div className="container py-4">
      <h3>Manage Services</h3>

      {/* Search & Add */}
      <div className="d-flex mb-3">
        <InputGroup style={{ maxWidth: 300 }}>
          <FormControl
            placeholder="Search by title/desc..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button className="ms-auto" onClick={() => openModal(null)}>+ Add Service</Button>
      </div>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Icon</th>
            <th>Title</th>
            <th>Description</th>
            <th style={{ width: 150 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No services found.</td>
            </tr>
          )}
          {filtered.map(item => (
            <tr key={item.id}>
              <td>{item.icon}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>
                <Button size="sm" onClick={() => openModal(item)} className="me-2">Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={show} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{form.id ? 'Edit Service' : 'Add Service'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Icon</Form.Label>
              <Form.Control
                name="icon" value={form.icon}
                onChange={handleChange} placeholder="e.g. code, database" required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title" value={form.title}
                onChange={handleChange} required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea" rows={3}
                name="description" value={form.description}
                onChange={handleChange} required
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
