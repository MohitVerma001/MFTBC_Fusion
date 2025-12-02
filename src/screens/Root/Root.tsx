import React from "react";
import { CorporateAnnouncementsSection } from "./sections/CorporateAnnouncementsSection";
import { FooterSection } from "./sections/FooterSection";
import { LatestNewsSection } from "./sections/LatestNewsSection";
import { QuickAccessSection } from "./sections/QuickAccessSection";
import { SocialActivityHighlightsSection } from "./sections/SocialActivityHighlightsSection";

export const Root = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full items-start relative">
      <div className="flex-col w-full items-start bg-[#f9fafa] flex relative">
        <LatestNewsSection />
        <QuickAccessSection />
        <CorporateAnnouncementsSection />
        <SocialActivityHighlightsSection />
        <FooterSection />
      </div>
    </main>
  );
};
