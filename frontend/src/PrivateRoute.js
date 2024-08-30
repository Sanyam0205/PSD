import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PrivateRoute({ children, isAuthenticated, role, allowedRoles }) {
  const [showNotAuthorized, setShowNotAuthorized] = useState(false);
  const navigate = useNavigate();

  // Check if the user is authenticated and has the correct role
  const isAuthorized = isAuthenticated && allowedRoles.includes(role);

  // Handle closing of the "Not Authorized" popup
  const handleClosePopup = () => {
    setShowNotAuthorized(false);
    navigate('/'); // Redirect to home or another safe route
  };


  // If not authorized, show the popup and don't render the children
  if (!isAuthorized) {
    if (!showNotAuthorized) {
      setShowNotAuthorized(true);
    }

    return (
      <>
        {showNotAuthorized && (
          <div className="not-authorized-overlay">
            <div className="not-authorized-popup">
              <p>You are not authorized to view this page.</p>
              <button onClick={handleClosePopup}>Close</button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Render the children if the user is authorized
  return <>{children}</>;
}

export default PrivateRoute;
