import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddClient = () => {
  const [clientDetails, setClientDetails] = useState({
    name: "",
    business_name: "",
    pan_number: "",
    gstin_no: "",
    address: "",
    phone_number: "",
    reference_name: "",
    email_id: "",
    aadhar_number: "",
    client_pic: "",
    employee_id: "",
    employee_name: "",
  });

  const navigate = useNavigate();
  // const BASE_URL = "http://localhost:5000";
      const BASE_URL = 'https://work-tracker-backend-1.onrender.com';

  const [employees, setEmployees] = useState([]);
  const [works, setWorks] = useState([
    {
      work_description: "",
      work_assigned_date: "",
      due_date: "",
      pending_documents: false,
      fee_estimation: "",
    },
  ]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/employees`);
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        alert("There was an error fetching employees");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "employee_id") {
      const selectedEmployee = employees.find((emp) => emp._id === value);
      setClientDetails({
        ...clientDetails,
        employee_id: value,
        employee_name: selectedEmployee ? selectedEmployee.name : "",
      });
    } else if (type === "file") {
      setClientDetails({
        ...clientDetails,
        [name]: files[0],
      });
    } else {
      setClientDetails({
        ...clientDetails,
        [name]: value,
      });
    }
  };

  const handleWorkChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedWorks = [...works];
    updatedWorks[index][name] = type === "checkbox" ? checked : value;
    setWorks(updatedWorks);
  };

  const addWorkField = () => {
    setWorks([
      ...works,
      {
        work_description: "",
        work_assigned_date: "",
        due_date: "",
        pending_documents: false,
        fee_estimation: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in clientDetails) {
      formData.append(key, clientDetails[key]);
    }
    formData.append("works", JSON.stringify(works));

    try {
      await axios.post(
        `${BASE_URL}/clients`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Client added successfully");
      setClientDetails({
        name: "",
        business_name: "",
        pan_number: "",
        gstin_no: "",
        address: "",
        phone_number: "",
        reference_name: "",
        email_id: "",
        aadhar_number: "",
        client_pic: "",
        employee_id: "",
        employee_name: "",
      });
      setWorks([
        {
          work_description: "",
          work_assigned_date: "",
          due_date: "",
          pending_documents: false,
          fee_estimation: "",
        },
      ]);
    } catch (err) {
      console.error("Error adding client:", err);
      alert("There was an error adding the client");
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Add New Client</h2>
      <form onSubmit={handleSubmit}>
        {/* Client Details */}
        {[
          { label: "Name", name: "name" },
          { label: "Business Name", name: "business_name" },
          { label: "PAN Number", name: "pan_number" },
          { label: "GSTIN No", name: "gstin_no" },
          { label: "Address", name: "address" },
          { label: "Phone Number", name: "phone_number" },
          { label: "Reference Name", name: "reference_name" },
          { label: "Email ID", name: "email_id", type: "email" },
          { label: "Aadhar Number", name: "aadhar_number" },
        ].map(({ label, name, type = "text" }) => (
          <div className="mb-3" key={name}>
            <label className="form-label">{label}</label>
            <input
              type={type}
              name={name}
              value={clientDetails[name]}
              onChange={handleChange}
              className="form-control"
              required={["name", "reference_name", "phone_number"].includes(name)}
            />
          </div>
        ))}

        {/* Upload Picture */}
        <div className="mb-3">
          <label className="form-label">Upload Client Picture</label>
          <input
            type="file"
            name="client_pic"
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Select Employee */}
        <div className="mb-3">
          <label className="form-label">Assign to Employee</label>
          <select
            name="employee_id"
            value={clientDetails.employee_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select an Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        {/* Work Assignments */}
        <h5 className="mt-4 text-primary">Work Assignments</h5>
        {works.map((work, index) => (
          <div key={index} className="border p-3 rounded mb-3">
            <div className="mb-2">
              <label className="form-label">Work Description</label>
              <input
                type="text"
                name="work_description"
                value={work.work_description}
                onChange={(e) => handleWorkChange(index, e)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Work Assigned Date</label>
              <input
                type="date"
                name="work_assigned_date"
                value={work.work_assigned_date}
                onChange={(e) => handleWorkChange(index, e)}
                className="form-control"
                required
              />
            </div>

            {/* Due Date Field (only future dates allowed) */}
            <div className="mb-2">
              <label className="form-label">Due Date (Target)</label>
              <input
                type="date"
                name="due_date"
                min={getTomorrowDate()}
                value={work.due_date}
                onChange={(e) => handleWorkChange(index, e)}
                className="form-control"
                required
              />
            </div>

            {/* Fee Estimation Field */}
            <div className="mb-2">
              <label className="form-label">Fee Estimation (Amount)</label>
              <input
                type="number"
                name="fee_estimation"
                value={work.fee_estimation}
                onChange={(e) => handleWorkChange(index, e)}
                className="form-control"
                placeholder="Enter amount in ₹"
                min="0"
              />
            </div>

            {/* Pending Documents Checkbox */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                name="pending_documents"
                checked={work.pending_documents}
                onChange={(e) => handleWorkChange(index, e)}
                id={`pendingDocs${index}`}
              />
              <label
                className="form-check-label"
                htmlFor={`pendingDocs${index}`}
              >
                Pending Documents
              </label>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={addWorkField}
        >
          + Add Another Work
        </button>
        <br />
        <button type="submit" className="btn btn-primary mt-4 mb-5">
          Add Client
        </button>
      </form>
    </div>
  );
};

export default AddClient;
