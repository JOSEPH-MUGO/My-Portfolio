import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Education() {
  const [items, setItems]       = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm] = useState({
    id: null,
    degree: '',
    institution: '',
    period: ''
  });

  // Fetch experience records
  const fetchItems = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/education`);
    setItems(res.data);
    setFiltered(res.data);
  };

  useEffect(() => { fetchItems(); }, []);

  // Filter on search
  useEffect(() => {
    setFiltered(
      items.filter(i =>
        i.degree.toLowerCase().includes(search.toLowerCase()) ||
        i.institution.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, items]);

  // Open/close modal
  const openModal = item => {
    if (item) setForm({ id: item.id, degree: item.degree, institution: item.institution, period: item.period });
    else setForm({ id: null, degree: '', institution: '', period: '' });
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
        await axios.put(`${process.env.REACT_APP_API_URL}/api/education/${form.id}`, form);
        Swal.fire('Updated', 'Education updated.', 'success');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/education`, form,{
            headers: { 'Content-Type': 'application/json' }
        });
        Swal.fire('Added', 'Education added.', 'success');
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Could not save education.', 'error');
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/education/${id}`);
      Swal.fire('Deleted', 'Education removed.', 'success');
      fetchItems();
    }
  };

  return (
    <div className="container py-4">
      <h3>Manage Education</h3>

      {/* Search & Add */}
      <div className="d-flex mb-3">
        <InputGroup style={{ maxWidth: 300 }}>
          <FormControl
            placeholder="Search by company/role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button className="ms-auto" onClick={() => openModal(null)}>+ Add Education</Button>
      </div>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Degree</th>
            <th>Institution</th>
            <th>Period</th>
           
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
              <td>{item.degree}</td>
              <td>{item.institution}</td>
              <td>{item.period}</td>
              
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
            <Modal.Title>{form.id ? 'Edit Education' : 'Add Education'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Degree</Form.Label>
              <Form.Control
                name="degree" value={form.degree}
                onChange={handleChange} required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>institution</Form.Label>
              <Form.Control
                name="institution" value={form.institution}
                onChange={handleChange} required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Period</Form.Label>
              <Form.Control
                name="period"  value={form.period}
                onChange={handleChange} placeholder="e.g. Jan 2023 – May 2023" required
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
