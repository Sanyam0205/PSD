import React, { useState } from 'react';



function Creator() {


  return (
    <div className="form-container">

      <div className="main-content">
        <h1>Creator Dashboard</h1>
        <p>Welcome to the Creator Dashboard. Here you can manage content creation tasks.</p>

        {/* Add Creator-specific content and functionality here */}
        <div>
          <h2>Create New Project</h2>
          <button>Create Project</button>
          {/* Add form or other elements as needed */}
        </div>

        <div>
          <h2>Manage Your Projects</h2>
          {/* List or manage existing projects here */}
        </div>
      </div>
    </div>
  );
}

export default Creator;
