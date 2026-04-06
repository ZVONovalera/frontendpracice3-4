import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GoodsPage from "./pages/GoodsPage/GoodsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./index.css";
import AdminPage from "./pages/AdminPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<GoodsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;