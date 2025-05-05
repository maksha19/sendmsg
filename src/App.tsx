// src/WhatsApp.tsx
import React from "react";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import { UserProvider } from "./context/userState";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkBench from "./pages/WorkBench";



const WhatsApp: React.FC = () => {
  return (
    <UserProvider>
      <Content />
    </UserProvider>
  );
};

const Content: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/sendmsg" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default WhatsApp;
