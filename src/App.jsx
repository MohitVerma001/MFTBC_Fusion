import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import NavigationTabs from "./components/NavigationTabs/NavigationTabs";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import News from "./pages/News/News";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const location = useLocation();
  const showNavigationTabs = location.pathname !== "/";

  return (
    <main className="app-container">
      <Header />
      {showNavigationTabs && <NavigationTabs />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/hr" element={<div className="container py-5"><h2>HR Page - Coming Soon</h2></div>} />
        <Route path="/it" element={<div className="container py-5"><h2>IT Page - Coming Soon</h2></div>} />
        <Route path="/cross-functions" element={<div className="container py-5"><h2>Cross Functions Page - Coming Soon</h2></div>} />
        <Route path="/activity" element={<div className="container py-5"><h2>Activity Page - Coming Soon</h2></div>} />
        <Route path="/content" element={<div className="container py-5"><h2>Content Page - Coming Soon</h2></div>} />
        <Route path="/people" element={<div className="container py-5"><h2>People Page - Coming Soon</h2></div>} />
        <Route path="/spaces" element={<div className="container py-5"><h2>Spaces Page - Coming Soon</h2></div>} />
        <Route path="/calendar" element={<div className="container py-5"><h2>Calendar Page - Coming Soon</h2></div>} />
        <Route path="/ceo-message" element={<div className="container py-5"><h2>CEO Message Page - Coming Soon</h2></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </main>
  );
};

export default App;
