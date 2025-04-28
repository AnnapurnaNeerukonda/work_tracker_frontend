import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Col, Row, Form } from 'react-bootstrap';

const EmployeeWorkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workList, setWorkList] = useState([]);
  const [filteredWorkList, setFilteredWorkList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusOptions, setStatusOptions] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);
  useEffect(() => {
    const fetchWork = async () => {
      try {
        console.log(id);
        const res = await axios.get(`https://work-tracker-backend-1.onrender.com/employee/${id}/work`);
        console.log(res.data);
        setWorkList(res.data);
        setFilteredWorkList(res.data);
        setStatusOptions(['all', 'completed', 'in progress', 'pending documents']);
      } catch (err) {
        console.error('Error fetching work:', err);
      }
    };
    fetchWork();
  }, [id]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  useEffect(() => {
    let filteredData = [...workList];

    // Filter by status
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter(work => work.status === statusFilter);
    }

    // Filter by date range
    if (fromDate || toDate) {
      filteredData = filteredData.filter(work => {
        const workDate = new Date(work.work_assigned_date);

        // If fromDate is selected, only filter by that
        if (fromDate && !toDate) {
          return workDate >= new Date(fromDate);
        }

        // If both fromDate and toDate are selected, filter by range
        if (fromDate && toDate) {
          return workDate >= new Date(fromDate) && workDate <= new Date(toDate);
        }

        return true;
      });
    }

    setFilteredWorkList(filteredData);
  }, [statusFilter, fromDate, toDate, workList]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';  // Green
      case 'in progress':
        return 'warning';  // Yellow
      case 'pending documents':
        return 'danger';  // Red
      default:
        return ''; // No color
    }
  };

  return (
    <div className="container mt-4">
      <h3 className='text-primary'>Work Assigned to Employee</h3>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-4">
          <Form.Group controlId="statusFilter">
            <Form.Label>Filter by Status</Form.Label>
            <Form.Control
              as="select"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>

        <div className="col-md-4">
          <Form.Group controlId="fromDate">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
            />
          </Form.Group>
        </div>

        <div className="col-md-4">
          <Form.Group controlId="toDate">
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              onChange={handleToDateChange}
            />
          </Form.Group>
        </div>
      </div>

      {/* Displaying filtered work */}
      {filteredWorkList.length === 0 ? (
        <p>No work assigned.</p>
      ) : (
        <Row>
          {filteredWorkList.map((work, index) => (
            <Col md={4} key={index} className="mb-3">
              <Card bg={getStatusColor(work.status)} text={work.status === 'in progress' ? 'dark' : 'white'}>
                <Card.Body>
                  <Card.Title>Client: {work.clientId.name}</Card.Title>
                  <Card.Text>
                    <strong>Description:</strong> {work.work_description} <br />
                    <strong>Assigned Date:</strong> {new Date(work.work_assigned_date).toLocaleDateString()} <br />
                    <strong>Status:</strong> {work.status}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default EmployeeWorkDetails;
