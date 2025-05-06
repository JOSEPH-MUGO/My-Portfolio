import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import API from "../components/api";

export default function About() {
  
  const [bio, setBio] = useState('');
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch existing About record
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/api/about`);
        if (res.data) {
          setBio(res.data.bio || '');
          if (res.data.photo) {
            setCurrentPhoto(res.data.photo);
          }
        }
      } catch (err) {
        console.error('Error loading About data', err);
      }
    })();
  }, []);

  // 2. Handle new photo selection
  const handlePhotoChange = e => {
    const file = e.target.files[0];
    setNewPhotoFile(file);
    // Show client-side preview
    if (file) {
      setCurrentPhoto(URL.createObjectURL(file));
    }
  };

  // 3. Submit (create or update via POST upsert)
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('bio', bio);
    if (newPhotoFile) {
      formData.append('photo', newPhotoFile);
    }

    try {
      const res = await axios.post(`${API}/api/about`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire('Success', 'About section updated!', 'success');
      // Update preview if new photo returned
      if (res.data.photo) {
        setCurrentPhoto(`${API}/uploads/${res.data.photo}`);
        setNewPhotoFile(null);
      }
    } catch (err) {
      console.error('Error saving About', err);
      Swal.fire('Error', 'Could not save. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h3>About Me</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Write your bio here..."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Photo</Form.Label>
          <div className="mb-2">
            {currentPhoto && (
              <Image
                src={currentPhoto}
                roundedCircle
                style={{ width: 120, height: 120, objectFit: 'cover' }}
              />
            )}
          </div>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          <Form.Text className="text-muted">
            Upload to replace existing photo.
          </Form.Text>
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save About'}
        </Button>
      </Form>
    </Container>
  );
}
