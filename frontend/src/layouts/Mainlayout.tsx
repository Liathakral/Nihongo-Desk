import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashboardPage from "../components/dashboard";
import { useState } from "react";
import { Dialog, Modal, ModalOverlay } from "../components/UI/Modal";
import PerformanceForm from "../components/PerformanceFrom";
import StudySessionForm from "../pages/StudySessionForm";
import TimelineAnalyticsView from "../components/TimeLineList";
export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  return (
    <div className="min-h-screen flex p-2 ">
      <div className="flex w-full overflow-hidden">
        
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
        <div className="flex-1 bg-white rounded-2xl p-8 overflow-y-auto">
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
      </div>
    </div>
  );
}