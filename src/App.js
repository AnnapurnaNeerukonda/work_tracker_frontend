import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AddClient from './components/Add_client';
import ClientList from './components/ClientList';
import AppNavbar from './components/navabar';
import EmployeeList from './components/employees'; 
import EmployeeWorkDetails from './components/EmployeeWorkDetails'; 
import Reports from './components/reports';
import AddEmployeeForm from './components/Add_employee';
import AddWorkForm from './components/Add_work_toclient';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // ⬅️ import it at the top
import Informed from './components/InformedPayment';

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <AppNavbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/add-client" element={<AddClient />} />
        <Route path="/view-clients" element={<ClientList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-employees" element={<EmployeeList />} />
        <Route path="/employee/:id/work" element={<EmployeeWorkDetails />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/addEmployee" element={<AddEmployeeForm />} />
        <Route path="/add-work" element={<AddWorkForm />} />
        <Route path='/informed-payments' element={<Informed/>}/>
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
