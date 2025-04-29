import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const BillForm = () => {
  const [clients, setClients] = useState([]);
  const [works, setWorks] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedWork, setSelectedWork] = useState('');
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [total, setTotal] = useState('');
  const [message, setMessage] = useState('');
  const BASE_URL = 'https://work-tracker-backend-1.onrender.com';

  useEffect(() => {
    axios.get(`${BASE_URL}/clients`)
      .then(res => setClients(res.data));
  }, []);

  useEffect(() => {
    if (selectedClient) {
      axios.get(`${BASE_URL}/unpaid-works/${selectedClient}`)
        .then(res => setWorks(res.data));
    }
  }, [selectedClient]);

  useEffect(() => {
    if (amount && discount !== '') {
      const discountAmount = (amount * discount) / 100;
      setTotal(amount - discountAmount);
    }
  }, [amount, discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${BASE_URL}/submit-bill`, {
      workId: selectedWork,
      amount: Number(amount),
      discount: Number(discount)
    });
    setMessage("Bill submitted successfully!");
    setSelectedClient(null)
    setAmount('')
    setDiscount('')
    setTotal('')
    setSelectedWork(null)

  };

  return (
    <Container className="mt-4">
      <h2>Generate Bill / Invoice</h2>
      {message && <Alert variant="success">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Select Client</Form.Label>
          <Form.Select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} required>
            <option value="">-- Select --</option>
            {clients.map(client => (
              <option key={client._id} value={client._id}>{client.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Work</Form.Label>
          <Form.Select value={selectedWork} onChange={e => setSelectedWork(e.target.value)} required>
            <option value="">-- Select --</option>
            {works.map(work => (
              <option key={work._id} value={work._id}>{work.work_description}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control type="number" value={discount} onChange={e => setDiscount(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Total Bill</Form.Label>
              <Form.Control type="number" value={total} readOnly />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary">Submit Bill</Button>
      </Form>
    </Container>
  );
};

export default BillForm;
