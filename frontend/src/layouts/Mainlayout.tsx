"use client";
import { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosAnalytics } from "react-icons/io";
import { PiBooks } from "react-icons/pi";
import DashboardPage from "../components/Dashboard";
import { useLocation } from "react-router-dom";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { RiRobot3Line } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { Dialog, Modal, ModalOverlay } from "../components/UI/Modal";
import PerformanceForm from "../components/PerformanceForm";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { FiActivity } from "react-icons/fi";

import TimelineAnalyticsView from "../components/Analytics";
import AITutorPage from "../components/ChatBot";
import StudySessionForm from "../components/StudySessionForm";
import AIPlanner from "../components/DailyPlanner";
import Logger from "../components/UI/Logger";
export default function MainLayout() {
  const navigate = useNavigate();
  const [sidebaropen, setsidebaropen] = useState(true);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  const navItems = [
  { label: "Dashboard",     icon: IoHomeOutline,  path: "/dashboard" },
  { label: "Analytics",     icon: IoIosAnalytics, path: "/analytics" },
  { label: "Study Session", icon: PiBooks,        path: "/study"     },
  { label: "Talk To AI",    icon: RiRobot3Line,   path: "/chatbot"   },
  { label: "AI Planner",    icon: SlCalender,     path: "/dailyplans"},
  { label: "Logger",        icon: FiActivity,     path: "/logger"    },
]

  return (
    <div className=" flex h-screen  bg-stone-100 ">
      <div className={`
      relative shrink-0 h-full flex flex-col
      bg-white border-r border-stone-100
      transition-all duration-300
      ${sidebaropen ? "w-56" : "w-16"}
    `}>

      {/* Toggle button */}
      <button
        onClick={() => setsidebaropen(!sidebaropen)}
        className="absolute -right-3 top-6 z-10
                   w-6 h-6 rounded-full bg-white
                   border border-stone-200 shadow-sm
                   flex items-center justify-center
                   text-stone-400 hover:text-stone-600
                   transition-colors duration-150 cursor-pointer"
      >
        {sidebaropen
          ? <MdKeyboardDoubleArrowLeft size={13} />
          : <MdKeyboardDoubleArrowRight size={13} />}
      </button>

      {/* Logo */}
      <div className={`
        flex items-center gap-2.5 shrink-0
        px-4 py-5 border-b border-stone-100
        ${!sidebaropen && "justify-center px-0"}
      `}>
        <img src={logo} alt="Logo" className="h-7 w-7 shrink-0 object-contain" />
        {sidebaropen && (
          <span className="text-sm font-bold text-stone-700 font-serif whitespace-nowrap">
            Nihongo Desk
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2 pt-4 flex-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`
                flex items-center  gap-3 rounded-xl cursor-pointer
                transition-all duration-150 group w-full text-left
                ${sidebaropen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                ${active
                  ? "bg-stone-100 text-stone-800"
                  : "text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                }
              `}
            >
              {/* Icon wrapper — active gets a subtle amber dot */}
              <div className="relative shrink-0">
                <Icon size={16} />
                {active && (
                  <span className="absolute -top-0.5 -right-0.5
                                   w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </div>

              {sidebaropen && (
                <span className={`
                  text-fluid-xs font-semibold whitespace-nowrap
                  tracking-wide transition-colors duration-150
                  ${active ? "text-stone-800" : "text-stone-400 group-hover:text-stone-600"}
                `}>
                  {label}
                </span>
              )}

              {/* Active bar */}
              {active && sidebaropen && (
                <div className="ml-auto w-1 h-4 rounded-full bg-amber-400 shrink-0" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom fade */}
      <div className="h-8 shrink-0" />
    </div>
    
      {location.pathname === "/dashboard" && <DashboardPage />}
      {location.pathname === "/dailyplans" && <AIPlanner />}
      {location.pathname === "/analytics" && <TimelineAnalyticsView />}
      {location.pathname === "/chatbot" && <AITutorPage />}
      {location.pathname==="/logger" && <Logger/>}
      {location.pathname === "/study" && (
        <StudySessionForm
          onSessionCreated={(id) => {
            setActiveSessionId(id);
            setIsModalOpen(true);
          }}
        />
      )}
      {isModalOpen && activeSessionId && (
        <ModalOverlay isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <Modal className="rounded-2xl bg-white p-4 shadow-xl max-w-lg mx-auto overflow-y-auto">
            <Dialog>
              <PerformanceForm
                sessionId={activeSessionId}
                onSuccess={() => {
                  setIsModalOpen(false);
                  setActiveSessionId(null);
                }}
              />
            </Dialog>
          </Modal>
        </ModalOverlay>
      )}
    </div>
  );
}
