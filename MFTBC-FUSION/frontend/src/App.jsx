import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CreateBlog from './forms/CreateBlog';

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/create/blog" element={<CreateBlog />} />
        <Route path="/" element={<Navigate to="/create/blog" replace />} />
      </Routes>
    </div>
  );
};

export default App;
