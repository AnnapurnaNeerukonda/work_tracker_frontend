import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log('Before clearing:', localStorage);
    localStorage.clear(); 
    console.log('After clearing:', localStorage); 
    console.log(localStorage.getItem("role"))
    console.log(localStorage.getItem('email'))
    navigate('/');        
  };
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand className="ms-auto fw-bold text-primary">
          Sai Suneel & Co
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Clients" id="clients-dropdown">
              <NavDropdown.Item href="/add-client">Add Client</NavDropdown.Item>
              <NavDropdown.Item href="/view-clients">View Clients</NavDropdown.Item>
              <NavDropdown.Item href="/add-work">Add Work</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Employees" id="employees-dropdown">
              <NavDropdown.Item href="/view-employees">View Employees</NavDropdown.Item>
              <NavDropdown.Item href="/addEmployee">Add Employees</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/reports">Reports</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
