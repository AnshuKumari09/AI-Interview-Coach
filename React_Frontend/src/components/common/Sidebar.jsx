import React from "react";
import {
  FiHome,
  FiMic,
  FiBookOpen,
  FiBarChart2,
  FiFileText,
  FiClock,
  FiBookmark,
  FiSettings,
} from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { MdWorkspacePremium } from "react-icons/md";

const Sidebar = () => {
  const menuItems = [
    {
      name: "New Interview",
      icon: <FiMic size={20} />,
      active: true,
    },
    {
      name: "Dashboard",
      icon: <FiHome size={20} />,
    },
    {
      name: "Interviews",
      icon: <RiRobot2Line size={20} />,
    },
    {
      name: "Question Bank",
      icon: <FiBookOpen size={20} />,
    },
    {
      name: "Analytics",
      icon: <FiBarChart2 size={20} />,
    },
    {
      name: "Resume Review",
      icon: <FiFileText size={20} />,
    },
    {
      name: "Mock History",
      icon: <FiClock size={20} />,
    },
    {
      name: "Bookmarks",
      icon: <FiBookmark size={20} />,
    },
    {
      name: "Settings",
      icon: <FiSettings size={20} />,
    },
  ];

  return (
    <div className="w-[380px] h-screen bg-[#030712]/60 border-r border-white/10 flex flex-col justify-between">

      {/* Top */}
      <div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-7 py-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <RiRobot2Line size={24} className="text-white" />
          </div>

          <div>
            <h1 className="text-white font-semibold text-xl">
              AI Interviewer
            </h1>
            <p className="text-gray-400 text-xs">
              Practice. Improve. Succeed.
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="px-4 flex flex-col gap-2">

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300
              ${
                item.active
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-4">

        {/* Upgrade Card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#131C4D] to-[#25145D] p-5 border border-white/10">

          <div className="h-10 w-10 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4">
            <MdWorkspacePremium
              size={22}
              className="text-yellow-400"
            />
          </div>

          <h3 className="text-white font-semibold text-lg">
            Upgrade to Pro
          </h3>

          <p className="text-gray-400 text-sm mt-2">
            Unlock unlimited interviews, advanced analytics,
            and personalized AI coaching.
          </p>

          <button className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium">
            Upgrade Now
          </button>
        </div>

        {/* User */}
        <div className="mt-6 flex items-center gap-3 px-2">

          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            N
          </div>

          <div>
            <h4 className="text-white font-medium">
              Nishu
            </h4>

            <p className="text-gray-400 text-xs">
              nishu@example.com
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;