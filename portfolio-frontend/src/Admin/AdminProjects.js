import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Modal, Button } from 'react-bootstrap';

function AdminProjects() {
  
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', link: '', id: null });
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Fetch Failed',
        text: 'Could not load projects.'
      });
    }
  };

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return projects.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.link.toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('link', form.link);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (form.id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/projects/${form.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Project updated successfully.'
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/projects`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'New project added.'
        });
      }
      setForm({ title: '', description: '', link: '', id: null });
      setImageFile(null);
      fetchProjects();
      handleCloseModal();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was a problem saving your project.'
      });
    }
  };

  const handleEdit = project => {
    setForm({
      id: project.id,
      title: project.title,
      description: project.description,
      link: project.link,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the project.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/projects/${id}`);
          fetchProjects();
          Swal.fire('Deleted!', 'Project has been deleted.', 'success');
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete project.', 'error');
        }
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ title: '', description: '', link: '', id: null });
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Projects</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button onClick={() => setShowModal(true)}>Add New Project</Button>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Link</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length ? (
              filteredProjects.map(project => (
                <tr key={project.id}>
                  <td>
                    {project.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${project.image}`}
                        alt={project.title}
                        style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="text-muted">No image</span>
                    )}
                  </td>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                  <td>
                    <a href={project.link} target="_blank" rel="noreferrer">
                      {project.link}
                    </a>
                  </td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="me-2"
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? 'Edit Project' : 'Add New Project'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-2"
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <textarea
              className="form-control mb-2"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="link"
              placeholder="Project Link"
              value={form.link}
              onChange={handleChange}
            />
            <input
              type="file"
              className="form-control mb-2"
              onChange={handleImageChange}
            />
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                {form.id ? 'Update Project' : 'Add Project'}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminProjects;
