import React from "react";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";

export const LatestNewsSection = (): JSX.Element => {
  const languages = [
    { label: "English", active: true },
    { label: "日本語", active: false },
  ];

  return (
    <header className="w-full bg-white border-b border-[#e4e7eb] shadow-[0px_1px_2px_#0000000d]">
      <div className="flex items-center justify-between h-16 px-20 max-w-screen-xl mx-auto">
        <div className="flex items-center">
          <img className="w-[118px] h-7" alt="Logo" src="/div-6.svg" />
        </div>

        <div className="flex items-center gap-3">
          <img className="w-10 h-10" alt="Notification" src="/div-23.svg" />

          <div className="flex items-center gap-[5.9px] p-[2.95px] bg-[#f2f4f5] rounded-[7377.04px]">
            {languages.map((lang, index) => (
              <div
                key={index}
                className={`flex items-center justify-center px-[11.8px] py-[5.9px] rounded-[7377.04px] ${
                  lang.active
                    ? "bg-white shadow-[0px_0.74px_1.48px_#0000000d]"
                    : ""
                }`}
              >
                <div
                  className={`[font-family:'Roboto',Helvetica] font-medium text-[10.3px] text-center tracking-[0] leading-[14.8px] whitespace-nowrap ${
                    lang.active
                      ? "text-[#111726] [text-shadow:0px_0.74px_1.48px_#0000000d]"
                      : "text-gray-600"
                  }`}
                >
                  {lang.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-0.5">
            <img className="w-10 h-10" alt="Menu" src="/div-11.svg" />

            <img className="w-10 h-10" alt="Button" src="/button-20.svg" />

            <Avatar className="w-10 h-10 shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a] bg-[linear-gradient(135deg,rgba(239,68,68,1)_0%,rgba(220,38,38,1)_100%)]">
              <AvatarFallback className="bg-transparent [text-shadow:0px_4px_6px_#0000001a] [font-family:'Roboto',Helvetica] font-semibold text-white text-base">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
