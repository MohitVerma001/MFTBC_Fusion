import React from "react";

export const QuickAccessSection = (): JSX.Element => {
  return (
    <section
      className="relative w-full h-[252px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(../div-34.png)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

      <div className="relative flex items-start px-20 py-8 h-full">
        <div className="flex flex-col max-w-screen-xl w-full items-start px-4">
          <div className="flex flex-col items-start py-8 rounded-2xl overflow-hidden">
            <div className="flex items-center">
              <div className="flex flex-col items-start justify-center">
                <div className="pb-4">
                  <h1 className="font-['Roboto',Helvetica] font-bold text-white text-3xl leading-9 whitespace-nowrap">
                    Mitsubishi FUSO Truck and Bus Corporation
                  </h1>
                </div>

                <div className="flex items-center">
                  <p className="font-['Roboto',Helvetica] font-normal text-white text-sm leading-5 whitespace-nowrap">
                    Official corporate social network for FUSO employees
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
