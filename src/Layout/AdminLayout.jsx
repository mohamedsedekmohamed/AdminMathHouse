import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { 
  FaHome, FaUsers, FaUserGraduate, FaHeart, FaBookOpen, FaBook, 
  FaPlayCircle, FaQuestionCircle, FaClipboardList, FaVideo, 
  FaChalkboardTeacher, FaBox, FaHistory, FaChartBar, FaTv, 
  FaRegFileAlt, FaTasks, FaBell, FaCog, FaHashtag, FaRegEdit, 
  FaDollarSign, FaUserTimes, FaWallet, FaRegClock, FaPiggyBank, 
  FaReceipt, FaExternalLinkAlt, FaTicketAlt, 
  FaShieldAlt, FaFingerprint, FaUserFriends, FaSchool, FaLock, FaRegComments
} from "react-icons/fa";
import { FaHeadphonesAlt } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";
import { BsBookHalf } from "react-icons/bs";

import { 
  MdDashboard, MdGridView, MdLayers, MdOutlineQuestionMark, 
  MdTimeline, MdMonitor, MdPersonRemove, MdOutlineBarChart,
  MdSettingsSuggest
} from "react-icons/md";

const AppLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

const menuItems = [
  {
    title: "Home",
    icon: <FaHome size={20} />,
    path: "/admin/Home",
    module: null,
  },
  {
    title: "Admin",
    icon: <MdDashboard size={20} />,
    path: "/admin/Admin",
    module: "admins",
    children: [
      { title: "Admin", path: "/admin/admin", icon: <FaShieldAlt size={18} /> },
      { title: "Admin Roles", path: "/admin/admin-roles", icon: <FaFingerprint size={18} /> },
    ],
  },
  {
    title: "Users",
    icon: <FaUsers size={20} />,
    path: "/admin/users", 
    module: "users",
    children: [
      { title: "Students", path: "/admin/users/students", icon: <FaUserGraduate size={18} /> },
      { title: "Parents", path: "/admin/users/parents", icon: <FaHeart size={18} /> },
      { title: "Teachers", path: "/admin/users/teachers", icon: <FaChalkboardTeacher size={18} /> },
    ],
  },
  {
    title: "Courses",
    icon: <FaBookOpen size={20} />,
    path: "/admin/courses",
    module: "courses",
    children: [
      // { title: "Semester", path: "/admin/courses/semester", icon: <BsBookHalf size={18} /> },
      { title: "Categories", path: "/admin/courses/categories", icon: <MdGridView size={18} /> },
      // { title: "Courses", path: "/admin/courses/courses", icon: <FaBook size={18} /> },
      // { title: "Chapters", path: "/admin/courses/chapters", icon: <MdLayers size={18} /> },
      // { title: "Lessons", path: "/admin/courses/lessons", icon: <FaPlayCircle size={18} /> },
      // { title: "Questions", path: "/admin/courses/questions", icon: <FaQuestionCircle size={18} /> },
      // { title: "Quiz", path: "/admin/courses/quiz", icon: <MdOutlineQuestionMark size={18} /> },
      // { title: "Diagnostic Exam", path: "/admin/courses/diagnosticexam", icon: <MdTimeline size={18} /> },
      // { title: "Exam", path: "/admin/courses/exam", icon: <FaClipboardList size={18} /> },
    ],
  },
  {
    title: "Live",
    icon: <FaVideo size={20} />,
    path: "/admin/live",
    module: "live",
    children: [
      { title: "Sessions", path: "/admin/live/sessions", icon: <MdMonitor size={18} /> },
      { title: "Groups", path: "/admin/live/groups", icon: <FaUserFriends size={18} /> },
      { title: "Academic", path: "/admin/live/academic", icon: <FaSchool size={18} /> },
      { title: "Private Sessions", path: "/admin/live/private-sessions", icon: <FaLock size={18} /> },
      { title: "Private Requests", path: "/admin/live/private-requests", icon: <FaRegComments size={18} /> },
      { title: "Cancellation", path: "/admin/live/cancellation", icon: <MdPersonRemove size={18} /> },
      { title: "Teacher Sessions", path: "/admin/live/teacher-sessions", icon: <FaChalkboardTeacher size={18} /> },
    ],
  },
  {
    title: "Packages",
    icon: <FaBox size={20} />,
    path: "/admin/packages",
    module: "packages",
    children: [
      { title: "Packages", path: "/admin/packages/packages", icon: <FaBox size={18} /> },
      // { title: "Packages Reports", path: "/admin/packages/reports", icon: <FaChartBar size={18} /> },
      // { title: "Packages History", path: "/admin/packages/history", icon: <FaHistory size={18} /> },
    ],
  },
  {
    title: "Reports",
    icon: <MdOutlineBarChart size={20} />,
    path: "/admin/reports",
    module: "reports",
    children: [
      { title: "Live", path: "/admin/reports/live", icon: <FaTv size={18} /> },
      { title: "Grads", path: "/admin/reports/grads", icon: <FaUserGraduate size={18} /> },
      { title: "Payments", path: "/admin/reports/payments", icon: <FaWallet size={18} /> },
      { title: "Courses", path: "/admin/reports/courses", icon: <FaBook size={18} /> },
      { title: "Exam", path: "/admin/reports/exam", icon: <FaRegFileAlt size={18} /> },
      { title: "Score Sheet", path: "/admin/reports/score-sheet", icon: <FaTasks size={18} /> },
    ],
  },
  {
    title: "Notifications",
    icon: <FaBell size={20} />,
    path: "/admin/notifications",
    module: null,
  },
  {
    title: "Settings",
    icon: <FaCog size={20} />,
    path: "/admin/settings",
    module: "settings",
    children: [
      { title: "Raw Score", path: "/admin/settings/rawscore", icon: <FaHashtag size={18} /> },
      { title: "Exam Code", path: "/admin/settings/examcode", icon: <FaRegEdit size={18} /> },
      { title: "Section", path: "/admin/settings/section", icon: <FaPlayCircle size={18} /> },
      { title: "Currency", path: "/admin/settings/currency", icon: <FaDollarSign size={18} /> },
    ],
  },
  {
    title: "Payment",
    icon: <FaWallet size={20} />,
    path: "/admin/payment",
    module: "payment",
    children: [
      // { title: "Pending Payment", path: "/admin/payment/pandding-payment", icon: <FaRegClock size={18} /> },
      // { title: "Wallet Pending", path: "/admin/payment/pandding-wallet", icon: <FaPiggyBank size={18} /> },
      // { title: "Payment History", path: "/admin/payment/payment-history", icon: <FaReceipt size={18} /> },
      // { title: "Wallet History", path: "/admin/payment/wallet-history", icon: <FaWallet size={18} /> },
      { title: "Payment Method", path: "/admin/payment/payment-method", icon: <MdSettingsSuggest size={18} /> },
    ],
  },
  {
    title: "Marketing",
    icon: <FaHeadphonesAlt size={20} />,
    path: "/admin/marketing",
    module: "marketing",
    children: [
      { title: "Popup", path: "/admin/marketing/popup", icon: <FaExternalLinkAlt size={18} /> },
      { title: "Promo Codes", path: "/admin/marketing/promocodes", icon: <FaTicketAlt size={18} /> },
    ],
  },
];

  

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Overlay للموبايل */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SideBar */}
      <SideBar
        menuItems={menuItems}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="flex items-center bg-white border-b border-gray-100 shrink-0">
          
          <button
            className="p-4 md:hidden text-gray-600 hover:text-one transition-colors"
            onClick={() => setIsMobileOpen(true)}
          >
            <CiMenuBurger size={24} />
          </button>

          <div className="flex-1">
            <Navbar
              route="/admin/profile"
              name={ "User"}
              gmail={" "}
            />
          </div>
        </header>

        <main
         className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50"
          style={{
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
         >
          <Outlet />
        </main>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AppLayout;