// import { useNavigate, useLocation } from "react-router-dom";
// import { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosAnalytics } from "react-icons/io";
import { PiBooks } from "react-icons/pi";
import DashboardPage from "../components/dashboard";
// import NihongoDesk from "../assets/nihongodesk.svg";
// import { Dialog, Modal, ModalOverlay } from "../components/UI/Modal";
// import PerformanceForm from "../components/PerformanceFrom";
// import StudySessionForm from "../components/StudySessionForm";
// import TimelineAnalyticsView from "../components/TimeLineList";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

export default function MainLayout() {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  return (
    <div className=" flex h-screen bg-[#F4F1EA]  ">
      <div className=" fixed  left-0 top-0 h-full  w-64 bg-white text-mauve-500 p-9  transition-transform duration-300">
        <button className="absolute -right-3 top-5 cursor-pointer rounded-full bg-white p-1 shadow-lg">
          <MdKeyboardDoubleArrowLeft size={20} />
        </button>
        <div className="p-4 text-xl text-nowrap font-bold font-mono flex items-center justify-center ">
          Nihongo Desk
        </div>
        <nav className="mt-6 space-y-10 flex flex-col cursor-pointer text-gray-500  text-md font-semibold">
          <a className="flex  hover:text-olive-600   items-center gap-4">
            <IoHomeOutline />
            <h1>Dashboard</h1>
          </a>
          <a className="flex  hover:text-olive-600  items-center gap-4">
            <IoIosAnalytics />
            <h1>Analytics</h1>
          </a>
          <a className="flex   hover:text-olive-600   items-center gap-4">
            <PiBooks />

            <h1>Study session</h1>
          </a>
        </nav>
      </div>
      <DashboardPage/>
     
      <div className="  h-full  w-64 bg-white text-mauve-500 p-9  transition-transform duration-300">
        
      </div>

      {/* <div className="flex w-full overflow-hidden">
        
        <aside className="w-64 text-white flex flex-col justify-between">
          <div>
            <div className="text-xl font-semibold mb-10 px-10 tracking-wide">
              Nihongo Desk
            </div>

            <nav className="space-y-4 text-sm font-medium">
              <div
                onClick={() => navigate("/dashboard")}
                className={`px-6 py-2 cursor-pointer ${
                  location.pathname === "/dashboard"
                    ? "bg-coconut-cream text-savory-sage rounded-l-3xl"
                    : ""
                }`}
              >
                Dashboard
              </div>
              <div onClick={ ()=> navigate("/timeline")}
               className={`px-6 py-2 cursor-pointer ${
                  location.pathname === "/timeline"
                    ? "bg-coconut-cream text-savory-sage rounded-l-3xl"
                    : ""
                }`}
              >
                timeline
              </div>

              <div
                onClick={() => navigate("/study")}
                className={`px-6 py-2 cursor-pointer ${
                  location.pathname === "/study"
                    ? "bg-coconut-cream text-savory-sage rounded-l-3xl"
                    : ""
                }`}
              >
                Study
              </div>
            </nav>
          </div>

          <div className="bg-avocado-smoothie/30  rounded-2xl p-4 text-center mx-4 mb-5 text-sm">
            Support Panel
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
      {/* <div className="flex-1 bg-white rounded-2xl p-8 overflow-y-auto">
          {location.pathname === "/dashboard" && (
            <DashboardPage/>
        )}
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
    <Modal className="rounded-2xl bg-white p-6 shadow-xl max-w-lg mx-auto">
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

        {location.pathname === "/timeline" && (
          <TimelineAnalyticsView/>)}
        </div>
      </div> */}
    </div>
  );
}
