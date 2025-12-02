import React from "react";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import NavigationTabs from "./components/NavigationTabs/NavigationTabs";
import NewsSection from "./components/NewsSection/NewsSection";
import InfoCards from "./components/InfoCards/InfoCards";
import QuickAccess from "./components/QuickAccess/QuickAccess";
import SocialFeed from "./components/SocialFeed/SocialFeed";
import CorporateAnnouncements from "./components/CorporateAnnouncements/CorporateAnnouncements";
import Footer from "./components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  return (
    <main className="app-container">
      <Header />
      <HeroSection />
      <NavigationTabs />
      <NewsSection />
      <InfoCards />
      <QuickAccess />
      <SocialFeed />
      <CorporateAnnouncements />
      <Footer />
    </main>
  );
};

export default App;
