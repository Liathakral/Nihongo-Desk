"use client";
import { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosAnalytics } from "react-icons/io";
import { PiBooks } from "react-icons/pi";
import DashboardPage from "../components/dashboard";
import { useLocation } from "react-router-dom";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { RiRobot3Line } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { Dialog, Modal, ModalOverlay } from "../components/UI/Modal";
import PerformanceForm from "../components/PerformanceForm";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import TimelineAnalyticsView from "../components/analytics";
import AITutorPage from "../components/ChatBot";
import StudySessionForm from "../components/StudySessionForm";
import AIPlanner from "../components/DailyPlanner";
export default function MainLayout() {
  const navigate = useNavigate();
  const [sidebaropen, setsidebaropen] = useState(true);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  return (
    <div className=" flex h-screen  bg-avocado-smoothie/10 ">
      <div
        className={` py-20 shrink-0 relative h-full flex flex-col items-center bg-white text-mauve-500 rounded-r-4xl transition-all duration-500
  ${sidebaropen ? "w-64  " : "w-20 "}`}
      >
        {" "}
        <button className="absolute -right-3 top-5 cursor-pointer rounded-full bg-white p-1 shadow-lg">
          {sidebaropen ? (
            <MdKeyboardDoubleArrowLeft
              onClick={() => setsidebaropen(false)}
              size={20}
            />
          ) : (
            <MdKeyboardDoubleArrowRight
              onClick={() => setsidebaropen(true)}
              size={20}
            />
          )}
          {}
        </button>
        <div
          className={`  text-nowrap  text-xl font-bold font-serif flex items-center gap-2 transition-all duration-500`}
        >
          <img src={logo} alt="Logo" className="h-10" />
          {sidebaropen && <h1>Nihongo Desk</h1>}
        </div>
        <nav className=" pt-20 transition-all duration-500 space-y-10 flex flex-col cursor-pointer text-gray-500 text-md font-semibold">
          <a
            onClick={() => navigate("/dashboard")}
            className={`flex hover:text-olive-600 ${sidebaropen ? "items-center justify-start" : "items-center justify-center"} gap-4`}
          >
            <IoHomeOutline size={22} />
            {sidebaropen && <span>Dashboard</span>}
          </a>
          <a
            onClick={() => navigate("/analytics")}
            className={`flex hover:text-olive-600 ${sidebaropen ? "items-center justify-start" : "items-center justify-center"} gap-4`}
          >
            <IoIosAnalytics size={22} />
            {sidebaropen && <span>Analytics</span>}
          </a>
          <a
            onClick={() => navigate("/study")}
            className={`flex hover:text-olive-600 ${sidebaropen ? "items-center justify-start" : "items-center justify-center"} gap-4`}
          >
            <PiBooks size={22} />
            {sidebaropen && <span>Study session</span>}
          </a>
          <a
            onClick={() => navigate("/chatbot")}
            className={`flex hover:text-olive-600 ${sidebaropen ? "items-center justify-start" : "items-center justify-center"} gap-4`}
          >
            <RiRobot3Line size={22} />
            {sidebaropen && <span>Talk To AI</span>}
          </a>
          <a
            onClick={() => navigate("/dailyplans")}
            className={`flex hover:text-olive-600 ${sidebaropen ? "items-center justify-start" : "items-center justify-center"} gap-4`}
          >
            <SlCalender size={22} />
            {sidebaropen && <span>AI Planner</span>}
          </a>
        </nav>
      </div>
      {location.pathname === "/dashboard" && <DashboardPage />}
      {location.pathname === "/dailyplans" && <AIPlanner />}
      {location.pathname === "/analytics" && <TimelineAnalyticsView />}
      {location.pathname === "/chatbot" && <AITutorPage />}
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
