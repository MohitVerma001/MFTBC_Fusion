import React from "react";
import { Separator } from "../../../../components/ui/separator";

const footerColumns = [
  {
    title: "Legal & Compliance",
    links: [
      { text: "Privacy" },
      { text: "Provider" },
      { text: "Posting content, rules on commenting and netiquette" },
    ],
  },
  {
    title: "More MFTBC Media",
    links: [{ text: "MFTBC Official Website" }],
  },
  {
    title: "Support & Help",
    links: [
      { text: "IT" },
      { text: "Digital Workplace" },
      { text: "Corporate User Helpdesk (CUHD)" },
    ],
  },
  {
    title: "Audit, Compliance & Legal",
    links: [
      { text: "Whistleblowing System SpeakUp" },
      { text: "Trusty Truck - Legal & Compliance Chatbot" },
      { text: "Daimler Truck Code of Conduct" },
      { text: "Report a personal data breack" },
      { text: "Report a Cyber Security Incident" },
    ],
  },
];

export const FooterSection = (): JSX.Element => {
  return (
    <footer className="w-full bg-[#111726] pt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {footerColumns.map((column, index) => (
            <div key={index} className="flex flex-col">
              <h3 className="[font-family:'Roboto',Helvetica] font-semibold text-white text-base leading-6 mb-4">
                {column.title}
              </h3>
              <nav className="flex flex-col gap-2">
                {column.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href="#"
                    className="[font-family:'Roboto',Helvetica] font-normal text-[#d0d5da] text-sm leading-5 hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <Separator className="bg-gray-800 my-8" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img className="h-7" alt="Company Logo" src="/div-6.svg" />
            <div className="w-px h-6 bg-[#374050]" />
            <span className="[font-family:'Roboto',Helvetica] font-bold text-white text-lg leading-7 whitespace-nowrap">
              Mitsubishi FUSO Truck and Bus Corporation
            </span>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-1">
            <p className="[font-family:'Roboto',Helvetica] font-normal text-[#9ca2af] text-sm leading-5 text-right">
              © 2025 Mitsubishi FUSO Truck and Bus Corporation. All rights
              reserved.
            </p>
            <p className="[font-family:'Roboto',Helvetica] font-normal text-[#9ca2af] text-sm leading-5 text-right">
              Internal use only - Authorized employees only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
