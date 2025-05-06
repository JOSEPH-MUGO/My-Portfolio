// src/Admin/AdminTestimonials.js
import React, { useEffect, useState } from 'react';
import { Table, Button, InputGroup, FormControl, Tab, Nav } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import API from "../components/api";

export default function AdminTestimonials() {
            // all testimonials
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch both pending and approved
  const fetchData = async () => {
    const p = await axios.get(`${API}/api/testimonials/pending`);
    const a = await axios.get(`${API}/api/testimonials`);
    setPending(p.data);
    setApproved(a.data);
    
  };

  useEffect(() => { fetchData(); }, []);

  // Filter function
  const filterList = list =>
    list.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.role.toLowerCase().includes(search.toLowerCase()) ||
      t.quote.toLowerCase().includes(search.toLowerCase())
    );

  // Approve one
  const handleApprove = async id => {
    const res = await Swal.fire({
      title: 'Approve this testimonial?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve'
    });
    if (res.isConfirmed) {
      await axios.put(`${API}/api/testimonials/${id}/approve`);
      Swal.fire('Approved!', '', 'success');
      fetchData();
    }
  };

  // Delete one
  const handleDelete = async id => {
    const res = await Swal.fire({
      title: 'Delete this testimonial?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    });
    if (res.isConfirmed) {
      await axios.delete(`${API}/api/testimonials/${id}`);
      Swal.fire('Deleted!', '', 'success');
      fetchData();
    }
  };

  return (
    <div className="container py-4">
      <h3>Manage Testimonials</h3>

      {/* Search */}
      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
        <FormControl
          placeholder="Search testimonials..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </InputGroup>

      <Tab.Container defaultActiveKey="pending">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="pending">Pending ({pending.length})</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="approved">Approved ({approved.length})</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="mt-3">
          {/* Pending */}
          <Tab.Pane eventKey="pending">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Quote</th>
                  <th>Photo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterList(pending).map(t => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.role}</td>
                    <td>{t.quote}</td>
                    <td>
                      {t.photo && (
                        <img
                          src={`${API}/uploads/${t.photo}`}
                          alt={t.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
                        />
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        className="me-2"
                        onClick={() => handleApprove(t.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {filterList(pending).length === 0 && (
                  <tr><td colSpan="5" className="text-center">No pending testimonials.</td></tr>
                )}
              </tbody>
            </Table>
          </Tab.Pane>

          {/* Approved */}
          <Tab.Pane eventKey="approved">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Quote</th>
                  <th>Photo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterList(approved).map(t => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.role}</td>
                    <td>{t.quote}</td>
                    <td>
                      {t.photo && (
                        <img
                          src={t.photo ? t.photo : '/assets/mypic.png'}
                          alt={t.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
                        />
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {filterList(approved).length === 0 && (
                  <tr><td colSpan="5" className="text-center">No approved testimonials.</td></tr>
                )}
              </tbody>
            </Table>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
