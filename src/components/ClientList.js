import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Table,
  Form,
  Alert,
} from 'react-bootstrap';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [workDetails, setWorkDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [editWork, setEditWork] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/clients`);
      setClients(response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      fetchClients();
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/search/${searchTerm}`);
      setClients(response.data);
    } catch (err) {
      console.error('Error searching clients:', err);
      setError('Search failed.');
    }
  };

  const handleClientClick = async (client) => {
    try {
      const response = await axios.get(`${BASE_URL}/work/${client._id}`);
      setSelectedClient(client);
      setWorkDetails(response.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching work details:', err);
      setError('Failed to fetch work details.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN');
  };

  const handleCheckboxChange = (workId) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [workId]: { ...prev[workId], status: 'in progress' },
    }));
  };

  const handleDateChange = (workId, date) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [workId]: {
        ...prev[workId],
        work_completed_date: date,
        status: date ? 'completed' : 'in progress',
      },
    }));
  };

  const handleSaveStatus = async (workId) => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Only admin users can update work details.');
      setError('Only admin users can update work details.');
      return;
    }

    const update = statusUpdates[workId];
    try {
      const res = await axios.put(`${BASE_URL}/work/${workId}`, update);
      const updated = res.data;
      setWorkDetails((prev) =>
        prev.map((w) => (w._id === updated._id ? updated : w))
      );
      setStatusUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[workId];
        return newUpdates;
      });
      setEditWork(null);
    } catch (err) {
      console.error('Error updating work:', err);
      setError('Failed to update work.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-primary">Client List</h2>

      <Form className="mb-4 d-flex gap-2 justify-content-center" onSubmit={handleSearch}>
        <Form.Control
          type="text"
          placeholder="Search by client name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" type="submit">Search</Button>
        <Button variant="secondary" onClick={() => {
          setSearchTerm('');
          fetchClients();
        }}>
          Reset
        </Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {clients.map((client) => (
          <Col md={4} key={client._id} className="mb-4">
            <Card
              onClick={() => handleClientClick(client)}
              style={{
                cursor: 'pointer',
                boxShadow: '0 12px 30px rgba(0, 0, 255, 0.3)',
                backgroundColor: 'white',
                borderRadius: '8px',
                transition: 'transform 0.3s ease',
              }}
              className="client-card"
            >
              <Card.Body>
                <Card.Title>{client.name}</Card.Title>
                <Card.Text>
                  <strong>PAN:</strong> {client.pan_number}<br />
                  <strong>Phone:</strong> {client.phone_number}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Work Details - {selectedClient?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {workDetails.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th>Completed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workDetails.map((work, index) => {
                  const statusStyle =
                    work.status === 'pending documents'
                      ? 'text-danger'
                      : work.status === 'in progress'
                      ? 'text-warning'
                      : 'text-success';

                  return (
                    <tr key={index}>
                      <td>{work.work_description}</td>
                      <td className={statusStyle}>{work.status}</td>
                      <td>{formatDate(work.work_assigned_date)}</td>
                      <td>
                        {work.status === 'in progress' ? (
                          <Form.Control
                            type="date"
                            value={
                              statusUpdates[work._id]?.work_completed_date ||
                              work.work_completed_date?.split('T')[0] ||
                              ''
                            }
                            onChange={(e) =>
                              handleDateChange(work._id, e.target.value)
                            }
                          />
                        ) : work.work_completed_date ? (
                          formatDate(work.work_completed_date)
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        {work.status === 'pending documents' && (
                          <>
                            {!editWork || editWork !== work._id ? (
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => setEditWork(work._id)}
                              >
                                Edit
                              </Button>
                            ) : (
                              <>
                                <Form.Check
                                  type="checkbox"
                                  label="Mark In Progress"
                                  checked={statusUpdates[work._id]?.status === 'in progress'}
                                  onChange={() => handleCheckboxChange(work._id)}
                                />
                                {statusUpdates[work._id]?.status === 'in progress' && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleSaveStatus(work._id)}
                                    className="mt-2"
                                  >
                                    Save
                                  </Button>
                                )}
                              </>
                            )}
                          </>
                        )}

                        {work.status === 'in progress' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSaveStatus(work._id)}
                          >
                            Save Date
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No work records found for this client.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClientList;
