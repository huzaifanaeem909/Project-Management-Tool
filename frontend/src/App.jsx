import React from "react";

import PublicRoute from "@/routes/PublicRoute";
import PrivateRoute from "@/routes/PrivateRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Dashboard from "@/pages/dashboard";
import ProjectDetail from "@/pages/ProjectDetail";
import AdminPanel from "@/pages/AdminPanel";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          {/* <Route path="/" element={<Index />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
