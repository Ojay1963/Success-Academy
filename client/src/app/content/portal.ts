import {
  Bell,
  BookOpen,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileBarChart2,
  GraduationCap,
  LayoutDashboard,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";

export type PortalRole = "student" | "parent" | "teacher" | "admin";

export type PortalNavItem = {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
};

export const portalRoleMeta: Record<
  PortalRole,
  {
    label: string;
    shortLabel: string;
    icon: typeof LayoutDashboard;
    loginHeading: string;
    loginDescription: string;
    defaultPath: string;
  }
> = {
  student: {
    label: "Student",
    shortLabel: "Student",
    icon: GraduationCap,
    loginHeading: "Student Portal Login",
    loginDescription: "Access results, attendance, assignments, timetable, and announcements.",
    defaultPath: "/portal/student",
  },
  parent: {
    label: "Parent",
    shortLabel: "Parent",
    icon: Users,
    loginHeading: "Parent Portal Login",
    loginDescription: "Track child performance, fees, attendance, messages, and report cards.",
    defaultPath: "/portal/parent",
  },
  teacher: {
    label: "Teacher",
    shortLabel: "Teacher",
    icon: School,
    loginHeading: "Teacher Portal Login",
    loginDescription: "Manage classes, upload results, track attendance, and post assignments.",
    defaultPath: "/portal/teacher",
  },
  admin: {
    label: "Admin",
    shortLabel: "Admin",
    icon: ShieldCheck,
    loginHeading: "Admin Portal Login",
    loginDescription: "Oversee admissions, fees, results, staff, students, and announcements.",
    defaultPath: "/portal/admin",
  },
};

export const portalNavigation: Record<PortalRole, PortalNavItem[]> = {
  student: [
    { path: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
    { path: "/portal/student/results", label: "Results", icon: FileBarChart2 },
    { path: "/portal/student/attendance", label: "Attendance", icon: ClipboardList },
    { path: "/portal/student/assignments", label: "Assignments", icon: BookOpen },
    { path: "/portal/student/timetable", label: "Timetable", icon: CalendarClock },
    { path: "/portal/student/announcements", label: "Announcements", icon: Bell },
    { path: "/portal/student/report-card", label: "Report Card", icon: GraduationCap },
  ],
  parent: [
    { path: "/portal/parent", label: "Dashboard", icon: LayoutDashboard },
    { path: "/portal/parent/performance", label: "Performance", icon: FileBarChart2 },
    { path: "/portal/parent/attendance", label: "Attendance", icon: ClipboardList },
    { path: "/portal/parent/fees", label: "Fees", icon: CreditCard },
    { path: "/portal/parent/timetable", label: "Timetable", icon: CalendarClock },
    { path: "/portal/parent/announcements", label: "Announcements", icon: Bell },
    { path: "/portal/parent/report-card", label: "Report Card", icon: GraduationCap },
  ],
  teacher: [
    { path: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
    { path: "/portal/teacher/class-list", label: "Class List", icon: Users },
    { path: "/portal/teacher/results", label: "Upload Results", icon: FileBarChart2 },
    { path: "/portal/teacher/attendance", label: "Attendance", icon: ClipboardList },
    { path: "/portal/teacher/assignments", label: "Assignments", icon: BookOpen },
    { path: "/portal/teacher/timetable", label: "Timetable", icon: CalendarClock },
    { path: "/portal/teacher/announcements", label: "Announcements", icon: Bell },
  ],
  admin: [
    { path: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/portal/admin/students", label: "Students", icon: Users },
    { path: "/portal/admin/teachers", label: "Teachers", icon: School },
    { path: "/portal/admin/admissions", label: "Admissions", icon: GraduationCap },
    { path: "/portal/admin/fees", label: "Fees", icon: CreditCard },
    { path: "/portal/admin/results", label: "Results", icon: FileBarChart2 },
    { path: "/portal/admin/announcements", label: "Announcements", icon: Bell },
  ],
};

export const portalLandingCards = [
  {
    title: "Student Portal",
    description: "Check results, attendance, assignments, timetable, and school updates.",
    role: "student" as const,
  },
  {
    title: "Parent Portal",
    description: "Review your child's performance, fees, attendance, and report cards.",
    role: "parent" as const,
  },
  {
    title: "Teacher Portal",
    description: "Manage classes, attendance, assignments, and results with demo workflows.",
    role: "teacher" as const,
  },
  {
    title: "Admin Portal",
    description: "Monitor admissions, users, fees, results, and announcements in one place.",
    role: "admin" as const,
  },
];

export const studentDashboard = {
  stats: [
    { label: "Attendance", value: "94%" },
    { label: "Average score", value: "82%" },
    { label: "Assignments due", value: "3" },
    { label: "Unread announcements", value: "2" },
  ],
  results: [
    { subject: "English Language", score: 84, grade: "A" },
    { subject: "Mathematics", score: 88, grade: "A" },
    { subject: "Basic Science", score: 79, grade: "B+" },
    { subject: "Civic Education", score: 76, grade: "B" },
  ],
  assignments: [
    { title: "Read chapter 5 and answer review questions", subject: "English", due: "May 3, 2026" },
    { title: "Algebra worksheet set B", subject: "Mathematics", due: "May 4, 2026" },
    { title: "Prepare science fair topic summary", subject: "Science", due: "May 6, 2026" },
  ],
  timetable: [
    { time: "8:00 AM", item: "Assembly / Form Time" },
    { time: "9:00 AM", item: "Mathematics" },
    { time: "10:00 AM", item: "English Language" },
    { time: "11:30 AM", item: "Basic Science" },
    { time: "1:00 PM", item: "ICT / Coding Club" },
  ],
  announcements: [
    { title: "Mid-term tests begin May 12", detail: "Revise class notes and check timetable updates." },
    { title: "Open Day for parents", detail: "Parents may visit classrooms on Friday at 1:30 PM." },
  ],
  reportCard: {
    studentName: "Adaeze Okafor",
    className: "JSS 2 Gold",
    term: "Second Term 2025/2026",
    comments: "Adaeze is consistent, confident, and contributes well in class discussions.",
  },
};

export const parentDashboard = {
  stats: [
    { label: "Child attendance", value: "94%" },
    { label: "Fees balance", value: "N120,000" },
    { label: "Unread messages", value: "1" },
    { label: "Current average", value: "82%" },
  ],
  childPerformance: [
    { area: "English", score: "84%", note: "Strong reading comprehension." },
    { area: "Mathematics", score: "88%", note: "Excellent problem-solving pace." },
    { area: "Science", score: "79%", note: "Needs more detail in practical writeups." },
  ],
  feeHistory: [
    { item: "Tuition - Second Term", status: "Partially Paid", amount: "N280,000", balance: "N120,000" },
    { item: "Transport", status: "Paid", amount: "N65,000", balance: "N0" },
  ],
  teacherMessages: [
    { from: "Mrs. Johnson", subject: "Reading progress", note: "Adaeze has shown strong improvement in oral reading." },
  ],
  announcements: [
    { title: "Parent forum next week", detail: "The school leadership team will host a virtual parent forum on Thursday." },
  ],
};

export const teacherDashboard = {
  stats: [
    { label: "Classes today", value: "5" },
    { label: "Students assigned", value: "128" },
    { label: "Pending results", value: "18" },
    { label: "Unread notices", value: "3" },
  ],
  classList: [
    { className: "JSS 1 Blue", students: 32, classTeacher: "You" },
    { className: "JSS 2 Gold", students: 30, classTeacher: "You" },
    { className: "SS 1 Green", students: 29, classTeacher: "You" },
  ],
  attendanceRoster: [
    { name: "Adaeze Okafor", status: "Present" },
    { name: "Tunde Adebayo", status: "Present" },
    { name: "Maryam Bello", status: "Late" },
    { name: "Favour Daniels", status: "Absent" },
  ],
  assignments: [
    { title: "Essay on leadership", className: "JSS 2 Gold", due: "May 6, 2026" },
    { title: "Fractions revision set", className: "JSS 1 Blue", due: "May 4, 2026" },
  ],
  timetable: [
    { time: "8:30 AM", item: "JSS 1 Blue - English" },
    { time: "10:00 AM", item: "JSS 2 Gold - Literature" },
    { time: "11:30 AM", item: "SS 1 Green - Language Arts" },
  ],
  announcements: [] as { title: string; detail: string }[],
};

export const adminDashboard = {
  stats: [
    { label: "Active students", value: "642" },
    { label: "Teachers", value: "48" },
    { label: "New applications", value: "27" },
    { label: "Fees collected", value: "N18.4M" },
  ],
  admissions: [
    { applicant: "Chidera Nwosu", level: "Primary 4", status: "Interview Scheduled" },
    { applicant: "David Yusuf", level: "Nursery 2", status: "Under Review" },
    { applicant: "Amina Sani", level: "JSS 1", status: "Offer Sent" },
  ],
  staff: [
    { name: "Mrs. Johnson", department: "Languages", status: "Active" },
    { name: "Mr. Afolabi", department: "Mathematics", status: "Active" },
    { name: "Mrs. Oke", department: "Early Years", status: "Leave" },
  ],
  feeOverview: [
    { className: "Primary", paid: "N5.6M", outstanding: "N1.1M" },
    { className: "Secondary", paid: "N8.9M", outstanding: "N1.7M" },
    { className: "Nursery", paid: "N3.9M", outstanding: "N0.6M" },
  ],
  announcements: [
    { title: "Portal maintenance window", detail: "Live integrations are not connected yet. Demo data is currently displayed." },
  ],
};

export const academicCalendarEvents = [
  { date: "May 6, 2026", event: "Mid-term progress review released" },
  { date: "May 12, 2026", event: "Mid-term assessments begin" },
  { date: "May 21, 2026", event: "Parents open classroom afternoon" },
  { date: "June 3, 2026", event: "Inter-house sports preparation week" },
  { date: "June 26, 2026", event: "End of term assembly and report distribution" },
];
