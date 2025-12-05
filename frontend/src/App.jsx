import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import NavigationTabs from "./components/NavigationTabs/NavigationTabs";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import News from "./pages/News/News";
import NewsDetail from "./pages/NewsDetail/NewsDetail";
import HR from "./pages/HR/HR";
import Content from "./pages/Content/Content";
import CreateBlog from "./pages/CreateBlog/CreateBlog";
import CreateDocument from "./pages/CreateDocument/CreateDocument";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import CreatePoll from "./pages/CreatePoll/CreatePoll";
import CreateDiscussion from "./pages/CreateDiscussion/CreateDiscussion";
import CreateSubSpace from "./pages/CreateSubSpace/CreateSubSpace";
import CreateVideo from "./pages/CreateVideo/CreateVideo";
import CreateCategory from "./pages/CreateCategory/CreateCategory";
import CreateSpaceWizard from "./pages/CreateSpace/CreateSpaceWizard";
import MySpaces from "./pages/MySpaces/MySpaces";
import MyContent from "./pages/MyContent/MyContent";
import Spaces from "./pages/Spaces/Spaces";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const location = useLocation();

  const isCreatePage = location.pathname.startsWith("/create");
  const isDetailPage = location.pathname.match(/^\/news\/\d+$/);
  const isMyPage = location.pathname === "/my-spaces" || location.pathname === "/my-content";
  const hideHeaderFooter = isCreatePage || isDetailPage;

  const getHeroConfig = () => {
    switch (location.pathname) {
      case "/":
        return {
          title: "Mitsubishi FUSO Truck and Bus Corporation",
          subtitle: null,
          image: "/div-34.png"
        };
      case "/news":
        return {
          title: "MFTBC News",
          subtitle: null,
          image: "/div-34.png"
        };
      case "/hr":
        return {
          title: "Human Resources",
          subtitle: "Find everything related to your work, well-being, and HR support at FUSO.",
          image: "/hr.png"
        };
      case "/it":
        return {
          title: "IT",
          subtitle: null,
          image: "/div-34.png"
        };
      case "/cross-functions":
        return {
          title: "Cross Functions",
          subtitle: null,
          image: "/div-34.png"
        };
      case "/activity":
        return {
          title: "Activity",
          subtitle: null,
          image: "/div-34.png"
        };
      case "/content":
        return {
          title: "Content",
          subtitle: "Discover and share knowledge across the organization",
          image: "/Content.png"
        };
      case "/people":
        return {
          title: "People",
          subtitle: null,
          image: "/div-34.png"
        };
      case "/spaces":
        return {
          title: "Spaces",
          subtitle: null,
          image: "/div-34.png"
        };
      case "/calendar":
        return {
          title: "Calendar",
          subtitle: null,
          image: "/div-34.png"
        };
      case "/ceo-message":
        return {
          title: "CEO Message",
          subtitle: null,
          image: "/div-34.png"
        };
      default:
        return {
          title: "Mitsubishi FUSO Truck and Bus Corporation",
          subtitle: null,
          image: "/div-34.png"
        };
    }
  };

  const heroConfig = getHeroConfig();

  return (
    <main className="app-container">
      {!hideHeaderFooter && (
        <>
          <Header />
          <HeroSection
            title={heroConfig.title}
            subtitle={heroConfig.subtitle}
            image={heroConfig.image}
          />
          <NavigationTabs />
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/hr" element={<HR />} />
        <Route path="/it" element={<div className="container py-5"><h2>IT Page - Coming Soon</h2></div>} />
        <Route path="/cross-functions" element={<div className="container py-5"><h2>Cross Functions Page - Coming Soon</h2></div>} />
        <Route path="/activity" element={<div className="container py-5"><h2>Activity Page - Coming Soon</h2></div>} />
        <Route path="/content" element={<Content />} />
        <Route path="/people" element={<div className="container py-5"><h2>People Page - Coming Soon</h2></div>} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/calendar" element={<div className="container py-5"><h2>Calendar Page - Coming Soon</h2></div>} />
        <Route path="/ceo-message" element={<div className="container py-5"><h2>CEO Message Page - Coming Soon</h2></div>} />
        <Route path="/create/blog" element={<CreateBlog />} />
        <Route path="/create/blog/:id" element={<CreateBlog />} />
        <Route path="/create/document" element={<CreateDocument />} />
        <Route path="/create/event" element={<CreateEvent />} />
        <Route path="/create/poll" element={<CreatePoll />} />
        <Route path="/create/discussion" element={<CreateDiscussion />} />
        <Route path="/create/subspace" element={<CreateSubSpace />} />
        <Route path="/create/video" element={<CreateVideo />} />
        <Route path="/create/category" element={<CreateCategory />} />
        <Route path="/create/space" element={<CreateSpaceWizard />} />
        <Route path="/create/space/:id" element={<CreateSpaceWizard />} />
        <Route path="/my-spaces" element={<MySpaces />} />
        <Route path="/my-content" element={<MyContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </main>
  );
};

export default App;
