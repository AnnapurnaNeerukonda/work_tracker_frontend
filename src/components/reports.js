import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Login from "./Login";
const Reports = () => {
  const [filteredWorkList, setFilteredWorkList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();
  const [statusOptions] = useState([
    "all",
    "completed",
    "in progress",
    "pending documents",
  ]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);
  const filterData = async () => {
    try {
      const BASE_URL = 'https://work-tracker-backend-1.onrender.com';
      // const BASE_URL = "http://localhost:5000";
      const res = await axios.get(`${BASE_URL}/reports`, {
        params: {
          status: statusFilter,
          fromDate,
          toDate,
        },
      });
      console.log(res.data);
      setFilteredWorkList(res.data);
    } catch (err) {
      console.error("Error fetching filtered work:", err);
    }
  };

  useEffect(() => {
    // Initial fetch on component load
    filterData();
  }, []);

  const downloadExcel = () => {
    if (filteredWorkList.length === 0) {
      alert("No data to download");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      filteredWorkList.map((work) => ({
        "Client Name": work.client_name,
        "Employee Name": work.employee_name,
        "Assigned Date": new Date(work.work_assigned_date).toLocaleDateString(),
        Status: work.status,
        Description: work.description,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Work Report");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      bookType: "xlsx",
      type: "application/octet-stream",
    });
    saveAs(blob, "work_report.xlsx");
  };

  return (
    <div className="container mt-4">
      <h3 className='text-primary mb-4 '>Work Assigned to Employee</h3>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-2">
          <label htmlFor="statusFilter">Filter by Status</label>
          <select
            id="statusFilter"
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label htmlFor="fromDate">From Date</label>
          <input
            type="date"
            id="fromDate"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label htmlFor="toDate">To Date</label>
          <input
            type="date"
            id="toDate"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="col-md-2 mt-4">
          <button className="btn btn-primary" onClick={filterData}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Download Excel Button */}
      <div className="mt-3">
        <button
          className="btn btn-success"
          onClick={downloadExcel}
          disabled={filteredWorkList.length === 0}
        >
          Download as Excel
        </button>
      </div>

      {/* Table */}
      {filteredWorkList.length === 0 ? (
        <p>No work assigned based on the filters.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Employee Name</th>
                <th>Assigned Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkList.map((work, index) => (
                <tr key={index}>
                  <td>{work.client_name}</td>
                  <td>{work.employee_name}</td>
                  <td>
                    {work.work_assigned_date}
                  </td>
                  <td>{work.status}</td>
                  <td>{work.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
