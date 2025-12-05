import React from "react";
import NewsSection from "../../components/NewsSection/NewsSection";
import InfoCards from "../../components/InfoCards/InfoCards";
import QuickAccess from "../../components/QuickAccess/QuickAccess";
import MySpacesSection from "../../components/MySpacesSection/MySpacesSection";
import SocialFeed from "../../components/SocialFeed/SocialFeed";
import CorporateAnnouncements from "../../components/CorporateAnnouncements/CorporateAnnouncements";

const Home = () => {
  return (
    <>
      <NewsSection />
      <InfoCards />
      <QuickAccess />
      <MySpacesSection />
      <SocialFeed />
      <CorporateAnnouncements />
    </>
  );
};

export default Home;
