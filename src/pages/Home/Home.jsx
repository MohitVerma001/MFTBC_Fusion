import React from "react";
import NewsSection from "../../components/NewsSection/NewsSection";
import InfoCards from "../../components/InfoCards/InfoCards";
import QuickAccess from "../../components/QuickAccess/QuickAccess";
import SocialFeed from "../../components/SocialFeed/SocialFeed";
import CorporateAnnouncements from "../../components/CorporateAnnouncements/CorporateAnnouncements";

const Home = () => {
  return (
    <>
      <NewsSection />
      <InfoCards />
      <QuickAccess />
      <SocialFeed />
      <CorporateAnnouncements />
    </>
  );
};

export default Home;
