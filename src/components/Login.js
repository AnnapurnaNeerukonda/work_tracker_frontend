import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log(res);
      console.log(res.data);
      // ✅ Store token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      console.log(res.data.role);
      localStorage.setItem("email", res.data.email);

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <img
        src="/images/company.jpg"
        alt="Company background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
          filter: "brightness(0.7)", // to make white text pop
        }}
      />
      {/* <div className="text-center text-white pt-4">
        <h2>CA SAI SUNEEL & Co CHARTED ACCOUNTS</h2>
      </div> */}
      <div className="container d-flex justify-content-center align-items-center h-100">
        <div
          className="card shadow p-4"
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <h2 className="mb-4 text-center text-primary">
            Login to Work Tracker
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>

    // <div>
    // <h2 className="mb-1 mt-4 text-center">CA SAI SUNEEL & Co CHARTED ACCOUNTS </h2>
    // <img
    //         className="d-block w-100"
    //         src="/images/company.jpg"
    //         alt="First slide"
    //       />
    // <div className="container d-flex justify-content-center align-items-center vh-100">
    //   <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
    //     <h2 className="mb-4 text-center">Login to Work Tracker </h2>
    //     <form onSubmit={handleLogin}>
    //       <div className="mb-3">
    //         <label className="form-label">Email address</label>
    //         <input
    //           type="email"
    //           className="form-control"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           placeholder="Enter your email"
    //           required
    //         />
    //       </div>
    //       <div className="mb-4">
    //         <label className="form-label">Password</label>
    //         <input
    //           type="password"
    //           className="form-control"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           placeholder="Enter your password"
    //           required
    //         />
    //       </div>
    //       <button type="submit" className="btn btn-primary w-100">
    //         Login
    //       </button>
    //     </form>
    //   </div>
    // </div>
    // </div>
  );
};

export default Login;
