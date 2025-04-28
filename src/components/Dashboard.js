// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Carousel } from "react-bootstrap";

// const Dashboard = () => {
//     const navigate = useNavigate();
//     useEffect(() => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/");
//       }
//     }, [navigate]);
//   return (
//     <div className="text-center mt-5">
//       <h2 className='text-primary' >Suneel & Co Work Tracker</h2>

//       <Carousel className="mt-4 mx-auto" style={{ maxWidth: "800px" }}>
//         <Carousel.Item>
//           <img
//             className="d-block w-100"
//             src="/images/suneel.jpg"
//             alt="First slide"
//           />
//           <Carousel.Caption>
//           <h5 style={{ color: '#87CEEB' }}>Strategic Planning</h5>
//           <p style={{ color: '#ffffff' }}>Aligning goals and tasks for client success.</p>
//           </Carousel.Caption>
//         </Carousel.Item>

//         <Carousel.Item>
//           <img
//             className="d-block w-100"
//             src="/images/team_grp.jpg"
//             alt="Second slide"
//           />
//           <Carousel.Caption>
//             <h5>Team Collaboration</h5>
//             <p>Working together efficiently and effectively.</p>
//           </Carousel.Caption>
//         </Carousel.Item>

//         <Carousel.Item>
//           <img
//             className="d-block w-100"
//             src="/images/company.jpg"
//             alt="Third slide"
//           />
//           <Carousel.Caption>
//             <h5>Achieving Results</h5>
//             <p>Delivering excellent outcomes on time.</p>
//           </Carousel.Caption>
//         </Carousel.Item>
//       </Carousel>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }}>
      <Carousel
        fade
        controls
        indicators
        interval={4000}
        style={{ height: '100vh' }}
      >
        <Carousel.Item style={{ height: '100vh' }}>
          <img
            className="d-block w-100"
            src="/images/suneel.jpg"
            alt="First slide"
            style={{ objectFit: 'cover', height: '100vh', width: '100%' }}
          />
          <Carousel.Caption>
            <h5 style={{ color: '#FFD700', textShadow: '2px 2px 4px #000' }}>
              Strategic Planning
            </h5>
            <p style={{ color: '#FFFACD', textShadow: '1px 1px 3px #000' }}>
              Aligning goals and tasks for client success.
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item style={{ height: '100vh' }}>
          <img
            className="d-block w-100"
            src="/images/team_grp.jpg"
            alt="Second slide"
            style={{ objectFit: 'cover', height: '100vh', width: '100%' }}
          />
          <Carousel.Caption>
            <h5 style={{ color: '#00FFFF', textShadow: '2px 2px 4px #000' }}>
              Team Collaboration
            </h5>
            <p style={{ color: '#f0f8ff', textShadow: '1px 1px 3px #000' }}>
              Working together efficiently and effectively.
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item style={{ height: '100vh' }}>
          <img
            className="d-block w-100"
            src="/images/company.jpg"
            alt="Third slide"
            style={{ objectFit: 'cover', height: '100vh', width: '100%' }}
          />
          <Carousel.Caption>
            <h5 style={{ color: '#00FF7F', textShadow: '2px 2px 4px #000' }}>
              Achieving Results
            </h5>
            <p style={{ color: '#ffffff', textShadow: '1px 1px 3px #000' }}>
              Delivering excellent outcomes on time.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Dashboard;
