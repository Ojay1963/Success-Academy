import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import About from "./pages/About";
import Academics from "./pages/Academics";
import AcademicCalendar from "./pages/AcademicCalendar";
import Admissions from "./pages/Admissions";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Nursery from "./pages/Nursery";
import NotFound from "./pages/NotFound";
import Primary from "./pages/Primary";
import ResultChecker from "./pages/ResultChecker";
import Secondary from "./pages/Secondary";
import PortalLanding from "./portal/PortalLanding";
import PortalLogin from "./portal/PortalLogin";
import PortalParentActivation from "./portal/PortalParentActivation";
import PortalPasswordReset from "./portal/PortalPasswordReset";
import PortalProtectedRoute from "./portal/PortalProtectedRoute";
import PortalStudentActivation from "./portal/PortalStudentActivation";
import { PortalRoleLayout } from "./portal/PortalComponents";
import { PortalDashboardHome, PortalRolePage } from "./portal/PortalPages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "nursery", Component: Nursery },
      { path: "primary", Component: Primary },
      { path: "secondary", Component: Secondary },
      { path: "academics", Component: Academics },
      { path: "calendar", Component: AcademicCalendar },
      { path: "admissions", Component: Admissions },
      { path: "gallery", Component: Gallery },
      { path: "news", Component: News },
      { path: "news/:slug", Component: NewsArticle },
      { path: "contact", Component: Contact },
      { path: "faq", Component: Faq },
      { path: "result-checker", Component: ResultChecker },
      { path: "portal", Component: PortalLanding },
      { path: "portal/login/:role", Component: PortalLogin },
      { path: "portal/reset/:role", Component: PortalPasswordReset },
      { path: "portal/activate/parent", Component: PortalParentActivation },
      { path: "portal/activate/student", Component: PortalStudentActivation },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/portal/student",
    element: <PortalProtectedRoute role="student" />,
    children: [
      {
        element: <PortalRoleLayout role="student" />,
        children: [
          { index: true, element: <PortalDashboardHome role="student" /> },
          { path: "results", element: <PortalRolePage role="student" page="results" /> },
          { path: "attendance", element: <PortalRolePage role="student" page="attendance" /> },
          { path: "assignments", element: <PortalRolePage role="student" page="assignments" /> },
          { path: "timetable", element: <PortalRolePage role="student" page="timetable" /> },
          { path: "announcements", element: <PortalRolePage role="student" page="announcements" /> },
          { path: "report-card", element: <PortalRolePage role="student" page="report-card" /> },
        ],
      },
    ],
  },
  {
    path: "/portal/parent",
    element: <PortalProtectedRoute role="parent" />,
    children: [
      {
        element: <PortalRoleLayout role="parent" />,
        children: [
          { index: true, element: <PortalDashboardHome role="parent" /> },
          { path: "performance", element: <PortalRolePage role="parent" page="performance" /> },
          { path: "attendance", element: <PortalRolePage role="parent" page="attendance" /> },
          { path: "fees", element: <PortalRolePage role="parent" page="fees" /> },
          { path: "timetable", element: <PortalRolePage role="parent" page="timetable" /> },
          { path: "announcements", element: <PortalRolePage role="parent" page="announcements" /> },
          { path: "report-card", element: <PortalRolePage role="parent" page="report-card" /> },
        ],
      },
    ],
  },
  {
    path: "/portal/teacher",
    element: <PortalProtectedRoute role="teacher" />,
    children: [
      {
        element: <PortalRoleLayout role="teacher" />,
        children: [
          { index: true, element: <PortalDashboardHome role="teacher" /> },
          { path: "class-list", element: <PortalRolePage role="teacher" page="class-list" /> },
          { path: "results", element: <PortalRolePage role="teacher" page="results" /> },
          { path: "attendance", element: <PortalRolePage role="teacher" page="attendance" /> },
          { path: "assignments", element: <PortalRolePage role="teacher" page="assignments" /> },
          { path: "timetable", element: <PortalRolePage role="teacher" page="timetable" /> },
          { path: "announcements", element: <PortalRolePage role="teacher" page="announcements" /> },
        ],
      },
    ],
  },
  {
    path: "/portal/admin",
    element: <PortalProtectedRoute role="admin" />,
    children: [
      {
        element: <PortalRoleLayout role="admin" />,
        children: [
          { index: true, element: <PortalDashboardHome role="admin" /> },
          { path: "students", element: <PortalRolePage role="admin" page="students" /> },
          { path: "teachers", element: <PortalRolePage role="admin" page="teachers" /> },
          { path: "admissions", element: <PortalRolePage role="admin" page="admissions" /> },
          { path: "fees", element: <PortalRolePage role="admin" page="fees" /> },
          { path: "results", element: <PortalRolePage role="admin" page="management-results" /> },
          { path: "announcements", element: <PortalRolePage role="admin" page="announcements" /> },
        ],
      },
    ],
  },
]);
