import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('https://work-tracker-backend-1.onrender.com/employees');
        console.log(res.data);  // Log the full response to check the structure
        setAllEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
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
  const filteredEmployees = allEmployees.filter(emp =>
    emp.name && emp.name.toLowerCase().includes(search.toLowerCase())
  );

  // Debugging: log the filteredEmployees to check if filtering works
  useEffect(() => {
    console.log(filteredEmployees); // See if it correctly filters based on search input
  }, [filteredEmployees]);

  return (
    <div className="container mt-4">
      <h3 className='text-primary'>Employees</h3>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search employees by name..."
          value={search}
          onChange={(e) => {
            console.log('Search input:', e.target.value);  // Log search input
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* Employee Cards */}
      <div className="row">
        {filteredEmployees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          filteredEmployees.map(emp => (
            <div className="col-md-4" key={emp._id}>
              <div className="card m-2 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{emp.name}</h5>
                  <p className="card-text">{emp.email}</p>
                  <Link to={`/employee/${emp._id}/work`} className="btn btn-primary">
                    View Work Assigned
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
