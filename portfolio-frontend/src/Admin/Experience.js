import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function AdminExperience() {
  const [items, setItems]       = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm] = useState({
    id: null,
    company: '',
    role: '',
    period: '',
    description: ''
  });

  // Fetch experience records
  const fetchItems = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/experience`);
    setItems(res.data);
    setFiltered(res.data);
  };

  useEffect(() => { fetchItems(); }, []);

  // Filter on search
  useEffect(() => {
    setFiltered(
      items.filter(i =>
        i.company.toLowerCase().includes(search.toLowerCase()) ||
        i.role.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, items]);

  // Open/close modal
  const openModal = item => {
    if (item) setForm({ id: item.id, company: item.company, role: item.role, period: item.period, description: item.description });
    else setForm({ id: null, company: '', role: '', period: '' });
    setShow(true);
  };
  const closeModal = () => setShow(false);

  // Handle field change
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit add/edit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/experience/${form.id}`, form);
        Swal.fire('Updated', 'Experience updated.', 'success');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/experience`, form);
        Swal.fire('Added', 'Experience added.', 'success');
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Could not save experience.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete with confirmation
  const handleDelete = async id => {
    const res = await Swal.fire({
      title: 'Delete this entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it'
    });
    if (res.isConfirmed) {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/experience/${id}`);
      Swal.fire('Deleted', 'Experience removed.', 'success');
      fetchItems();
    }
  };

  return (
    <div className="container py-4">
      <h3>Manage Experience</h3>

      {/* Search & Add */}
      <div className="d-flex mb-3">
        <InputGroup style={{ maxWidth: 300 }}>
          <FormControl
            placeholder="Search by company/role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button className="ms-auto" onClick={() => openModal(null)}>+ Add Experience</Button>
      </div>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Period</th>
            <th>Description</th>
            <th style={{ width: 150 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No entries found.</td>
            </tr>
          )}
          {filtered.map(item => (
            <tr key={item.id}>
              <td>{item.company}</td>
              <td>{item.role}</td>
              <td>{item.period}</td>
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
            <Modal.Title>{form.id ? 'Edit Experience' : 'Add Experience'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                name="company" value={form.company}
                onChange={handleChange} required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                name="role" value={form.role}
                onChange={handleChange} required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Period</Form.Label>
              <Form.Control
                name="period" value={form.period}
                onChange={handleChange} placeholder="e.g. Jan 2023 – May 2023" required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description" value={form.description}
                as="textarea" rows={3}
                onChange={handleChange}  required
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
