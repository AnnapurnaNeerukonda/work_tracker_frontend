import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const AddWorkForm = () => {
  const [clientName, setClientName] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [workDescription, setWorkDescription] = useState('');
  const [pendingDocuments, setPendingDocuments] = useState(false);
  const [workAssignedDate, setWorkAssignedDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [feeEstimation, setFeeEstimation] = useState('');
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  // const BASE_URL = "http://localhost:5000";
      const BASE_URL = 'https://work-tracker-backend-1.onrender.com';

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/clients`);
        const clientOptions = res.data.map(client => ({
          label: client.name,
          value: client._id,
        }));
        setClients(clientOptions);
      } catch (err) {
        console.error('Error fetching clients', err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/employees`);
        const employeeOptions = res.data.map(employee => ({
          label: employee.name,
          value: employee._id,
        }));
        setEmployees(employeeOptions);
      } catch (err) {
        console.error('Error fetching employees', err);
      }
    };

    fetchClients();
    fetchEmployees();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workData = {
      client_id: clientName?.value,
      employee_id: employeeName?.value,
      work_description: workDescription,
      pending_documents: pendingDocuments,
      work_assigned_date: workAssignedDate,
      due_date: dueDate,
      fee_estimation: feeEstimation,
    };

    try {
      await axios.post(`${BASE_URL}/add-work`, workData);
      setMessage('Work added successfully!');
      setMessageType('success');

      // Reset form
      setClientName(null);
      setEmployeeName(null);
      setWorkDescription('');
      setPendingDocuments(false);
      setWorkAssignedDate('');
      setDueDate('');
      setFeeEstimation('');
    } catch (err) {
      console.error(err);
      setMessage('Error adding work.');
      setMessageType('danger');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-4">Add Work to Client</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Client Name</label>
              <Select
                options={clients}
                value={clientName}
                onChange={setClientName}
                placeholder="Select Client"
                isSearchable
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Employee Name</label>
              <Select
                options={employees}
                value={employeeName}
                onChange={setEmployeeName}
                placeholder="Select Employee"
                isSearchable
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Work Description</label>
              <textarea
                className="form-control"
                placeholder="Enter work details"
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Work Assigned Date</label>
              <input
                type="date"
                className="form-control"
                value={workAssignedDate}
                onChange={(e) => {
                  setWorkAssignedDate(e.target.value);
                  // Optional: if workAssignedDate changes, clear dueDate if it's before new assigned date
                  if (dueDate && e.target.value > dueDate) {
                    setDueDate('');
                  }
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                min={workAssignedDate || undefined}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Fee Estimation (Amount)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={feeEstimation}
                onChange={(e) => setFeeEstimation(e.target.value)}
                required
              />
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={pendingDocuments}
                onChange={() => setPendingDocuments(!pendingDocuments)}
                id="pendingDocs"
              />
              <label className="form-check-label" htmlFor="pendingDocs">
                Pending Documents
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Add Work
            </button>

            {message && (
              <div className={`alert alert-${messageType} mt-4`} role="alert">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorkForm;
