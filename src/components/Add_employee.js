import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    employee_code: '',
    designation: '',
    bank_name: '',
    ifsc_code: '',
    account_number: '',
    phone_number: '',
    email: '',
    address: '',
    photo: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if(role != 'admin'){
      alert("Only admin users can add an employee.");
      navigate("/dashboard")
      return;
    }
    if (!token) {
      navigate("/");
    }
  }, [navigate]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.post('http://localhost:5000/add-employee', data);
      alert('Employee added successfully');
      console.log(res.data);

      // Clear the form fields after success
      setFormData({
        name: '',
        employee_code: '',
        designation: '',
        bank_name: '',
        ifsc_code: '',
        account_number: '',
        phone_number: '',
        email: '',
        address: '',
        photo: null,
      });

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // Show backend message
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="mb-4 text-center text-primary">Add New Employee</h3>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Row>
          <Col md={6}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter employee name"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </Form.Group>
            <Form.Group controlId="employee_code">
              <Form.Label>Employee Code</Form.Label>
              <Form.Control
                type="text"
                name="employee_code"
                placeholder="Enter employee code"
                onChange={handleChange}
                value={formData.employee_code}
                required
              />
            </Form.Group>
            <Form.Group controlId="designation">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                placeholder="Enter designation"
                onChange={handleChange}
                value={formData.designation}
                required
              />
            </Form.Group>
            <Form.Group controlId="bank_name">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                type="text"
                name="bank_name"
                placeholder="Enter bank name"
                onChange={handleChange}
                value={formData.bank_name}
                required
              />
            </Form.Group>
            <Form.Group controlId="ifsc_code">
              <Form.Label>IFSC Code</Form.Label>
              <Form.Control
                type="text"
                name="ifsc_code"
                placeholder="Enter IFSC code"
                onChange={handleChange}
                value={formData.ifsc_code}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="account_number">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                name="account_number"
                placeholder="Enter account number"
                onChange={handleChange}
                value={formData.account_number}
                required
              />
            </Form.Group>
            <Form.Group controlId="phone_number">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                placeholder="Enter phone number"
                onChange={handleChange}
                value={formData.phone_number}
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </Form.Group>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Enter address"
                onChange={handleChange}
                value={formData.address}
                required
              />
            </Form.Group>
            <Form.Group controlId="photo">
              <Form.Label>Employee Photo</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center mt-4">
          <Button variant="primary" type="submit">
            Add Employee
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddEmployeeForm;
