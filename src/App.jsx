import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import NavigationTabs from "./components/NavigationTabs/NavigationTabs";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import News from "./pages/News/News";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const location = useLocation();

  const getHeroTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Mitsubishi FUSO Truck and Bus Corporation";
      case "/news":
        return "MFTBC News";
      case "/hr":
        return "HR";
      case "/it":
        return "IT";
      case "/cross-functions":
        return "Cross Functions";
      case "/activity":
        return "Activity";
      case "/content":
        return "Content";
      case "/people":
        return "People";
      case "/spaces":
        return "Spaces";
      case "/calendar":
        return "Calendar";
      case "/ceo-message":
        return "CEO Message";
      default:
        return "Mitsubishi FUSO Truck and Bus Corporation";
    }
  };

  const heroTitle = getHeroTitle();
  const heroSubtitle = "Official corporate social network for FUSO employees";

  return (
    <main className="app-container">
      <Header />
      <HeroSection title={heroTitle} subtitle={heroSubtitle} />
      <NavigationTabs />
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
