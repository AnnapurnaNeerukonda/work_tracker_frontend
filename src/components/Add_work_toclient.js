import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const AddWorkForm = () => {
  const [clientName, setClientName] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [workDescription, setWorkDescription] = useState('');
  const [pendingDocuments, setPendingDocuments] = useState(false);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'danger'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('https://work-tracker-backend-1.onrender.com/clients');
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
        const res = await axios.get('https://work-tracker-backend-1.onrender.com/employees');
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
    };

    try {
      await axios.post('https://work-tracker-backend-1.onrender.com/add-work', workData);
      setMessage('Work added successfully!');
      setMessageType('success');

      // Reset form
      setClientName(null);
      setEmployeeName(null);
      setWorkDescription('');
      setPendingDocuments(false);
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
