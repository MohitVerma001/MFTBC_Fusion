import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

const navigationItems = [
  { label: "News" },
  { label: "HR" },
  { label: "IT" },
  { label: "Cross Functions" },
  { label: "Activity" },
  { label: "Content" },
  { label: "People" },
  { label: "Spaces" },
  { label: "Calendar" },
  { label: "CEO Message" },
  { label: "More", hasDropdown: true },
];

export const CorporateAnnouncementsSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <nav className="w-full bg-white border-b border-[#e4e7eb]">
      <div className="flex justify-center px-20">
        <div className="w-full max-w-screen-xl px-4">
          <div className="flex items-center justify-center gap-1">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center justify-center gap-3 h-[54px] px-6 pt-4 pb-[18px] border-b-2 transition-colors ${
                  activeTab === item.label
                    ? "border-primary"
                    : "border-transparent"
                } hover:border-gray-300`}
              >
                <span className="font-medium text-gray-600 text-sm text-center tracking-[0] leading-5 whitespace-nowrap [font-family:'Roboto',Helvetica]">
                  {item.label}
                </span>
                {item.hasDropdown && (
                  <ChevronDownIcon className="w-2.5 h-1.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
