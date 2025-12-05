import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const newsData = [
  {
    image: "/img-119.png",
    title: "FUSO Announces New Sustainability Initiative",
    description:
      "Leading the way in green transportation with innovative electric vehicle technology and carbon-neutral manufacturing processes.",
    time: "2 hours ago",
  },
  {
    image: "/img-132.png",
    title: "Q4 Town Hall Meeting Highlights and Key Takeaways",
    description:
      "CEO shares vision for 2024 growth strategy and celebrates team achievements across all departments and regions.",
    time: "5 hours ago",
  },
  {
    image: "/img-145.png",
    title: "New Manufacturing Facility Opens in Southeast Asia",
    description:
      "State-of-the-art production plant brings cutting-edge technology and creates hundreds of new employment opportunities.",
    time: "1 day ago",
  },
];

const hrQuickLinks = [
  { icon: "/div-163.svg", label: "HR Policies" },
  { icon: "/div-170.svg", label: "Recruitment" },
  { icon: "/div-177.svg", label: "Compensation" },
  { icon: "/div-184.svg", label: "Time & Absence" },
];

const itDigitalization = [
  {
    icon: "/div-196.svg",
    title: "Microsoft Teams",
    description: "Collaboration platform",
  },
  {
    icon: "/div-207.svg",
    title: "Power BI",
    description: "Business analytics",
  },
  {
    icon: "/div-218.svg",
    title: "eSignatures",
    description: "Digital signing",
  },
];

const peopleConnect = [
  {
    initials: "SC",
    name: "Sarah Chen",
    role: "HR Director",
    followers: "12 mutual followers",
  },
  {
    initials: "MS",
    name: "Michael Schmidt",
    role: "IT Manager",
    followers: "8 mutual followers",
  },
  {
    initials: "YT",
    name: "Yuki Tanaka",
    role: "Operations Lead",
    followers: "15 mutual followers",
  },
];

const quickAccessData = [
  {
    icon: "/margin-wrap.svg",
    title: "Bus Schedule",
    description: "Find and connect with colleagues across the organization",
    bgColor: "bg-[#eff5ff]",
  },
  {
    icon: "/margin-wrap-6.svg",
    title: "Canteen Menu",
    description: "View events, meetings, and important company dates",
    bgColor: "bg-green-50",
  },
  {
    icon: "/margin-wrap-2.svg",
    title: "FUSO Map",
    description: "Navigate campus facilities and office locations",
    bgColor: "bg-purple-50",
  },
];

const socialPosts = [
  {
    initials: "DM",
    name: "David Martinez",
    role: "Engineering Manager",
    time: "2h ago",
    content:
      "Great team collaboration today on the new electric truck prototype. Proud of what we are achieving together at FUSO!",
    image: "/img-386.png",
    likes: 42,
    comments: 12,
  },
  {
    initials: "LW",
    name: "Lisa Wang",
    role: "HR Business Partner",
    time: "4h ago",
    content:
      "Reminder: Employee wellness program registration closes this Friday. Take advantage of our comprehensive health and fitness benefits!",
    image: null,
    likes: 28,
    comments: 5,
  },
];

const complianceCards = [
  { icon: "/margin-wrap-1.svg", title: "Compliance & Legal" },
  { icon: "/margin-wrap-4.svg", title: "Data Protection" },
  { icon: "/margin-wrap-3.svg", title: "Whistleblower Portal" },
  { icon: "/margin-wrap-5.svg", title: "Cybersecurity Incident" },
];

export const SocialActivityHighlightsSection = (): JSX.Element => {
  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#111726] text-2xl leading-8">
                Latest News
              </h2>
              <Button
                variant="ghost"
                className="text-[#db2525] hover:text-[#db2525] hover:bg-transparent p-0 h-auto"
              >
                <span className="[font-family:'Roboto',Helvetica] font-medium text-sm leading-5">
                  View All
                </span>
                <ChevronRightIcon className="w-4 h-5 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.map((news, index) => (
                <Card
                  key={index}
                  className="overflow-hidden shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]"
                >
                  <CardContent className="p-0">
                    <div className="h-48 w-full">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#111726] text-base leading-6 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-sm leading-5 line-clamp-3">
                        {news.description}
                      </p>
                      <p className="[font-family:'Roboto',Helvetica] font-normal text-[#6a7280] text-xs leading-4">
                        {news.time}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]">
              <CardContent className="p-6">
                <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#111726] text-xl leading-7 mb-4">
                  HR Quick Links
                </h3>
                <div className="space-y-0">
                  {hrQuickLinks.map((link, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img src={link.icon} alt="" className="w-10 h-10" />
                      <span className="[font-family:'Roboto',Helvetica] font-medium text-[#374050] text-base leading-6">
                        {link.label}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]">
              <CardContent className="p-6">
                <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#111726] text-xl leading-7 mb-4">
                  IT Digitalization
                </h3>
                <div className="space-y-4">
                  {itDigitalization.map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img src={item.icon} alt="" className="w-10 h-10" />
                      <div className="flex flex-col items-start">
                        <span className="[font-family:'Roboto',Helvetica] font-semibold text-[#111726] text-base leading-6">
                          {item.title}
                        </span>
                        <span className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-sm leading-5">
                          {item.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]">
              <CardContent className="p-6">
                <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#111726] text-xl leading-7 mb-4">
                  People Connect
                </h3>
                <div className="space-y-4">
                  {peopleConnect.map((person, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex w-12 h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(239,68,68,1)_0%,rgba(220,38,38,1)_100%)]">
                        <span className="[font-family:'Roboto',Helvetica] font-semibold text-white text-base leading-6">
                          {person.initials}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="[font-family:'Roboto',Helvetica] font-semibold text-[#111726] text-base leading-6">
                          {person.name}
                        </span>
                        <span className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-sm leading-5">
                          {person.role}
                        </span>
                        <span className="[font-family:'Roboto',Helvetica] font-normal text-[#6a7280] text-xs leading-4">
                          {person.followers}
                        </span>
                      </div>
                      <Button className="bg-[#db2525] hover:bg-[#c21f1f] text-white px-4 py-1.5 h-8">
                        <span className="[font-family:'Roboto',Helvetica] font-medium text-sm leading-5">
                          + Follow
                        </span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#111726] text-2xl leading-8">
              Quick Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickAccessData.map((item, index) => (
                <Card
                  key={index}
                  className={`${item.bgColor} border border-[#f2f4f5]`}
                >
                  <CardContent className="p-[25px] space-y-2">
                    <img src={item.icon} alt="" className="mb-2" />
                    <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#111726] text-xl leading-7">
                      {item.title}
                    </h3>
                    <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-sm leading-5">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#111726] text-2xl leading-8">
              Social Activity Highlights
            </h2>
            <div className="space-y-6">
              {socialPosts.map((post, index) => (
                <Card
                  key={index}
                  className="shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex w-12 h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(239,68,68,1)_0%,rgba(220,38,38,1)_100%)]">
                        <span className="[font-family:'Roboto',Helvetica] font-semibold text-white text-base leading-6">
                          {post.initials}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="[font-family:'Roboto',Helvetica] font-semibold text-[#111726] text-base leading-6">
                            {post.name}
                          </span>
                          <span className="[font-family:'Roboto',Helvetica] font-normal text-[#6a7280] text-sm leading-5">
                            · {post.time}
                          </span>
                        </div>
                        <span className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-sm leading-5">
                          {post.role}
                        </span>
                      </div>
                      <img
                        src="/button-422.svg"
                        alt="More options"
                        className="w-8 h-8 cursor-pointer"
                      />
                    </div>

                    <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-800 text-base leading-6 mb-4">
                      {post.content}
                    </p>

                    {post.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt=""
                          className="w-full h-80 object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-6 pt-4 border-t border-[#e4e7eb]">
                      <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                        <img
                          src="/i-389.svg"
                          alt="Like"
                          className="w-[16.67px] h-6"
                        />
                        <span className="[font-family:'Roboto',Helvetica] font-medium text-gray-600 text-base leading-6">
                          {post.likes}
                        </span>
                      </button>
                      <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                        <img
                          src="/i-436.svg"
                          alt="Comment"
                          className="w-[16.67px] h-6"
                        />
                        <span className="[font-family:'Roboto',Helvetica] font-medium text-gray-600 text-base leading-6">
                          {post.comments}
                        </span>
                      </button>
                      <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                        <img
                          src="/i-442.svg"
                          alt="Share"
                          className="w-[16.67px] h-6"
                        />
                        <span className="[font-family:'Roboto',Helvetica] font-medium text-gray-600 text-base leading-6">
                          Share
                        </span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#111726] text-2xl leading-8">
              Corporate Announcements
            </h2>
            <Card className="overflow-hidden shadow-[0px_10px_15px_-3px_#0000001a,0px_4px_6px_-4px_#0000001a]">
              <CardContent className="p-0 relative">
                <div className="relative h-96">
                  <img
                    src="/img-497.png"
                    alt="Corporate announcement"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0)_100%)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <img src="/div-501.svg" alt="" className="w-8 h-8" />
                      <span className="[font-family:'Roboto',Helvetica] font-semibold text-white text-sm tracking-[0.35px] leading-5">
                        CEO Message
                      </span>
                    </div>
                    <h3 className="[font-family:'Roboto',Helvetica] font-bold text-white text-3xl leading-9 mb-2">
                      Vision 2026: Leading the Future of FUSO Commercial
                      Vehicles
                    </h3>
                    <p className="[font-family:'Roboto',Helvetica] font-normal text-[#d0d5da] text-sm leading-5">
                      March 15, 2024
                    </p>
                  </div>
                  <button className="absolute top-1/2 left-1 -translate-y-1/2">
                    <img
                      src="/button-564.svg"
                      alt="Previous"
                      className="w-[72px] h-[72px]"
                    />
                  </button>
                  <button className="absolute top-1/2 right-1 -translate-y-1/2">
                    <img
                      src="/button-567.svg"
                      alt="Next"
                      className="w-[72px] h-[72px]"
                    />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className="w-8 h-2 bg-white rounded-full" />
                    <div className="w-2 h-2 bg-[#ffffff80] rounded-full" />
                    <div className="w-2 h-2 bg-[#ffffff80] rounded-full" />
                    <div className="w-2 h-2 bg-[#ffffff80] rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {complianceCards.map((card, index) => (
                <Card
                  key={index}
                  className="shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]"
                >
                  <CardContent className="p-4">
                    <img src={card.icon} alt="" className="mb-2" />
                    <h4 className="[font-family:'Roboto',Helvetica] font-semibold text-[#111726] text-sm leading-5">
                      {card.title}
                    </h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
