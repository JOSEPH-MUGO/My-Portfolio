// src/Admin/AdminSkills.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import API from "../components/api";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', level: '' });

  // Fetch all skills
  const fetchSkills = async () => {
    const res = await axios.get(`${API}/api/skills`);
    setSkills(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Filter as search changes
  useEffect(() => {
    setFiltered(
      skills.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, skills]);

  // Open modal for add/edit
  const openModal = skill => {
    if (skill) setForm(skill);
    else setForm({ id: null, name: '', level: '' });
    setShow(true);
  };
  const closeModal = () => setShow(false);

  // Handle form submit
  const submitForm = async e => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`${API}/api/skills/${form.id}`, form);
        Swal.fire('Updated!', 'Skill has been updated.', 'success');
      } else {
        await axios.post(`${API}/api/skills`, form);
        Swal.fire('Added!', 'Skill has been added.', 'success');
      }
      closeModal();
      fetchSkills();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  // Delete with confirmation
  const deleteSkill = async id => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the skill permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/skills/${id}`);
      Swal.fire('Deleted!', 'Skill has been deleted.', 'success');
      fetchSkills();
    }
  };

  return (
    <div className="container py-4">
      <h3>Manage Skills</h3>

      {/* Search & Add */}
      <div className="d-flex mb-3">
        <InputGroup style={{ maxWidth: '300px' }}>
          <FormControl
            placeholder="Search skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button className="ms-auto" onClick={() => openModal(null)}>
          + Add Skill
        </Button>
      </div>

      {/* Skills Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Level (%)</th>
            <th style={{ width: '150px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.level}</td>
              <td>
                <Button size="sm" onClick={() => openModal(s)} className="me-2">
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => deleteSkill(s.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">No skills found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal Form */}
      <Modal show={show} onHide={closeModal}>
        <Form onSubmit={submitForm}>
          <Modal.Header closeButton>
            <Modal.Title>{form.id ? 'Edit Skill' : 'Add Skill'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Skill Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Level (%)</Form.Label>
              <Form.Control
                name="level"
                type="number"
                min="0" max="100"
                value={form.level}
                onChange={e => setForm({ ...form, level: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{form.id ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
