/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Download, Send } from "lucide-react";
import { Link } from "react-router";
import type { PortalRole } from "../content/portal";
import { apiRequest } from "./api";
import { usePortalAuth } from "./AuthContext";
import {
  PortalCard,
  PortalLoadingScreen,
  PortalPageShell,
  PortalStateCard,
  PortalStatGrid,
  PortalTable,
} from "./PortalComponents";
import { usePortalResource } from "./usePortalResource";

type DashboardResponse = {
  stats: { label: string; value: string }[];
  results?: { subject: string; score: number; grade: string }[];
  assignments?: { id?: string; title: string; subject?: string; due: string; className?: string }[];
  timetable?: { day?: string; time: string; item: string }[];
  announcements?: { id?: string; title: string; detail: string }[];
  reportCard?: {
    studentName: string;
    className: string;
    term: string;
    comments: string;
    principalComment?: string;
  };
  student?: { className: string; admissionNo: string };
  childPerformance?: { area: string; score: string; note: string }[];
  feeHistory?: { id?: string; item: string; status: string; amount: string; balance: string }[];
  teacherMessages?: { from: string; subject: string; note: string }[];
  attendance?: { percentage: string; summary: { status: string; count: string }[] };
  classList?: { className: string; students: number; classTeacher: string }[];
  attendanceRoster?: { studentId?: string; name: string; status: string }[];
  resultsQueue?: { student: string; status: string }[];
  admissions?: { applicant: string; level: string; status: string }[];
  feeOverview?: { className: string; paid: string; outstanding: string }[];
  staff?: { name: string; department: string; status: string }[];
  portalAccess?: {
    activatedAccounts: string;
    studentsReady: string;
    parentsReady: string;
    invitesSent: string;
  };
};

type AttendanceResponse =
  | { percentage: string; summary: { status: string; count: string }[] }
  | { classId: string; roster: { studentId: string; name: string; status: string }[] };

type FeesResponse = {
  records: { id: string; item: string; status: string; amount: string; balance: string }[];
  totalOutstanding: number;
};

type CalendarResponse = {
  currentTerm: { name: string; sessionName: string };
  events: { date: string; event: string }[];
};

type PortalAccessOverview = {
  summary: {
    activatedAccounts: string;
    studentsReady: string;
    parentsReady: string;
    invitesSent: string;
  };
  students: {
    id: string;
    fullName: string;
    admissionNo: string;
    classId: string;
    className: string;
    status: string;
    portalStatus: string;
    email: string;
    latestInviteAt: string;
    accessPin: string;
    parentCount: number;
  }[];
  parents: {
    id: string;
    fullName: string;
    linkedStudent: string;
    admissionNo: string;
    phone: string;
    portalStatus: string;
    email: string;
    latestInviteAt: string;
  }[];
};

type AdminAdmissionRecord = {
  id: string;
  childName: string;
  programme: string;
  status: string;
  enrolledStudentId?: string | null;
  enrolledParentId?: string | null;
  enrolledAt?: string | null;
};

type PortalPublishingChecklist = {
  summary: {
    fullyPublished: string;
    pendingPublishing: string;
    currentTerm: string;
  };
  rows: {
    studentId: string;
    studentName: string;
    admissionNo: string;
    className: string;
    status: string;
    completedCount: number;
    totalChecks: number;
    progressLabel: string;
    pendingSteps: string[];
  }[];
};

type AuditLogRecord = {
  id: string;
  actorUserId: string;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  detail: string;
  createdAt: string;
};

type NotificationLogRecord = {
  id: string;
  role: string;
  channel: string;
  delivery: string;
  recipientEmail: string;
  subject: string;
  eventType: string;
  detail: string;
  createdAt: string;
};

function endpointFor(role: PortalRole, page?: string) {
  if (!page) {
    return `/api/portal/${role}/dashboard`;
  }

  const map: Record<string, string> = {
    results: `/api/portal/${role}/results`,
    attendance: `/api/portal/${role}/attendance`,
    assignments: `/api/portal/${role}/assignments`,
    timetable: `/api/portal/${role}/timetable`,
    announcements: `/api/portal/${role}/announcements`,
    "report-card": `/api/portal/${role}/report-card`,
    performance: `/api/portal/${role}/performance`,
    fees: `/api/portal/${role}/fees`,
    "class-list": `/api/portal/${role}/class-list`,
  };

  return map[page] || `/api/portal/${role}/dashboard`;
}

function LoadingOrError({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error: string;
}) {
  if (isLoading) {
    return <PortalLoadingScreen />;
  }

  if (error) {
    return <PortalStateCard title="Unable to load portal data" message={error} tone="error" />;
  }

  return null;
}

function hasRosterData(value: AttendanceResponse | null): value is { classId: string; roster: { studentId: string; name: string; status: string }[] } {
  return Boolean(value && "classId" in value && "roster" in value);
}

export function PortalDashboardHome({ role }: { role: PortalRole }) {
  const { data, isLoading, error } = usePortalResource<DashboardResponse>(endpointFor(role));
  const state = LoadingOrError({ isLoading, error });
  if (state) return state;

  if (!data) {
    return <PortalStateCard title="No dashboard data" message="No portal data is available yet." />;
  }

  if (role === "student") {
    return (
      <PortalPageShell
        title="Student Dashboard"
        description="View your recent results, attendance, timetable, assignments, and school announcements."
        action={<Link to="/portal/student/results" className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]">Check Results</Link>}
      >
        <PortalStatGrid items={data.stats} />
        <div className="grid gap-5 xl:grid-cols-2">
          <PortalCard title="Recent Results" description="Latest assessment overview for this term.">
            <PortalTable columns={["Subject", "Score", "Grade"]} rows={(data.results || []).map((item) => [item.subject, `${item.score}%`, item.grade])} emptyMessage="Results will appear here once uploaded." />
          </PortalCard>
          <PortalCard title="Upcoming Assignments" description="Deadlines to complete this week.">
            {(data.assignments || []).length === 0 ? (
              <PortalStateCard title="No assignments" message="Assignments will appear here when teachers publish them." />
            ) : (
              <div className="space-y-3">
                {(data.assignments || []).map((assignment) => (
                  <div key={assignment.title} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                    <p className="text-sm font-semibold text-[var(--brand-ink)]">{assignment.title}</p>
                    <p className="mt-1 text-sm text-[var(--brand-muted)]">{assignment.subject} • Due {assignment.due}</p>
                  </div>
                ))}
              </div>
            )}
          </PortalCard>
          <PortalCard title="Today’s Timetable" description="Your next lessons for the day.">
            <div className="space-y-3">
              {(data.timetable || []).map((lesson) => (
                <div key={`${lesson.time}-${lesson.item}`} className="flex items-center justify-between rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                  <span className="text-sm font-semibold text-[var(--brand-ink)]">{lesson.time}</span>
                  <span className="text-sm text-[var(--brand-muted)]">{lesson.item}</span>
                </div>
              ))}
            </div>
          </PortalCard>
          <PortalCard title="Announcements" description="Latest notices from school.">
            <div className="space-y-3">
              {(data.announcements || []).map((announcement) => (
                <div key={announcement.title} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--brand-ink)]">{announcement.title}</p>
                  <p className="mt-1 text-sm leading-7 text-[var(--brand-muted)]">{announcement.detail}</p>
                </div>
              ))}
            </div>
          </PortalCard>
        </div>
      </PortalPageShell>
    );
  }

  if (role === "parent") {
    return (
      <PortalPageShell
        title="Parent Dashboard"
        description="Track your child’s performance, school fees, attendance summary, and key teacher messages."
        action={<Link to="/portal/parent/report-card" className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]">Download Report Card</Link>}
      >
        <PortalStatGrid items={data.stats} />
        <div className="grid gap-5 xl:grid-cols-2">
          <PortalCard title="Child Performance" description="Current learning snapshot across core areas.">
            <PortalTable columns={["Area", "Score", "Teacher Note"]} rows={(data.childPerformance || []).map((item) => [item.area, item.score, item.note])} emptyMessage="Performance records will appear here." />
          </PortalCard>
          <PortalCard title="Fees and Payment Status" description="Recent fee records and balances.">
            <PortalTable columns={["Item", "Status", "Amount", "Balance"]} rows={(data.feeHistory || []).map((item) => [item.item, item.status, item.amount, item.balance])} emptyMessage="Fee records will appear here." />
          </PortalCard>
          <PortalCard title="Teacher Messages" description="Recent updates from class teachers.">
            {(data.teacherMessages || []).length === 0 ? (
              <PortalStateCard title="No teacher messages" message="Teacher messages will appear here." />
            ) : (
              <div className="space-y-3">
                {(data.teacherMessages || []).map((message) => (
                  <div key={message.subject} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                    <p className="text-sm font-semibold text-[var(--brand-ink)]">{message.subject}</p>
                    <p className="mt-1 text-sm text-[var(--brand-muted)]">From {message.from}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">{message.note}</p>
                  </div>
                ))}
              </div>
            )}
          </PortalCard>
          <PortalCard title="Announcements" description="Notices relevant to parents and guardians.">
            <div className="space-y-3">
              {(data.announcements || []).map((announcement) => (
                <div key={announcement.title} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--brand-ink)]">{announcement.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">{announcement.detail}</p>
                </div>
              ))}
            </div>
          </PortalCard>
        </div>
      </PortalPageShell>
    );
  }

  if (role === "teacher") {
    return (
      <PortalPageShell
        title="Teacher Dashboard"
        description="Manage classes, results, attendance, assignments, and timetable tasks from one place."
        action={<Link to="/portal/teacher/results" className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]">Upload Results</Link>}
      >
        <PortalStatGrid items={data.stats} />
        <div className="grid gap-5 xl:grid-cols-2">
          <PortalCard title="Assigned Classes" description="Classes under your current teaching load.">
            <PortalTable columns={["Class", "Students", "Role"]} rows={(data.classList || []).map((item) => [item.className, String(item.students), item.classTeacher])} emptyMessage="No classes assigned yet." />
          </PortalCard>
          <PortalCard title="Today’s Timetable" description="Upcoming lessons and sessions.">
            <div className="space-y-3">
              {(data.timetable || []).map((lesson) => (
                <div key={lesson.item} className="flex items-center justify-between rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                  <span className="text-sm font-semibold text-[var(--brand-ink)]">{lesson.time}</span>
                  <span className="text-sm text-[var(--brand-muted)]">{lesson.item}</span>
                </div>
              ))}
            </div>
          </PortalCard>
          <PortalCard title="Published Assignments" description="Assignments already shared with learners.">
            <div className="space-y-3">
              {(data.assignments || []).map((assignment) => (
                <div key={assignment.title} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--brand-ink)]">{assignment.title}</p>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">{assignment.className} • Due {assignment.due}</p>
                </div>
              ))}
            </div>
          </PortalCard>
          <PortalCard title="Announcements" description="Staff bulletins and class updates.">
            {(data.announcements || []).length === 0 ? (
              <PortalStateCard title="No new teacher announcements" message="This empty state is ready for live staff notices once the backend is connected." />
            ) : (
              <div className="space-y-3">
                {(data.announcements || []).map((announcement) => (
                  <div key={announcement.title} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                    <p className="text-sm font-semibold text-[var(--brand-ink)]">{announcement.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">{announcement.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </PortalCard>
        </div>
      </PortalPageShell>
    );
  }

  return (
    <PortalPageShell
      title="Admin Dashboard"
      description="Monitor the operational side of school life including students, staff, fees, applications, and results."
      action={<Link to="/portal/admin/admissions" className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]">Review Applications</Link>}
    >
      <PortalStatGrid items={data.stats} />
      <PortalStateCard title="Demo persistence active" message="This portal now reads from the backend seed store. Swap the in-memory store for a real database when you are ready." />
      <div className="grid gap-5 xl:grid-cols-2">
        <PortalCard title="Portal Access Readiness" description="Quick view of account activation and invitation progress.">
          <PortalTable
            columns={["Metric", "Value"]}
            rows={[
              ["Activated accounts", data.portalAccess?.activatedAccounts || "0"],
              ["Students ready", data.portalAccess?.studentsReady || "0/0"],
              ["Parents ready", data.portalAccess?.parentsReady || "0/0"],
              ["Invites sent", data.portalAccess?.invitesSent || "0"],
            ]}
          />
        </PortalCard>
        <PortalCard title="Admissions Snapshot" description="Current application progress.">
          <PortalTable columns={["Applicant", "Level", "Status"]} rows={(data.admissions || []).map((item) => [item.applicant, item.level, item.status])} emptyMessage="No applications yet." />
        </PortalCard>
        <PortalCard title="Fee Overview" description="High-level fee position by school section.">
          <PortalTable columns={["Section", "Paid", "Outstanding"]} rows={(data.feeOverview || []).map((item) => [item.className, item.paid, item.outstanding])} emptyMessage="Fee overview unavailable." />
        </PortalCard>
      </div>
    </PortalPageShell>
  );
}

export function PortalRolePage({
  role,
  page,
}: {
  role: PortalRole;
  page:
    | "results"
    | "attendance"
    | "assignments"
    | "timetable"
    | "announcements"
    | "report-card"
    | "performance"
    | "fees"
    | "class-list"
    | "students"
    | "teachers"
    | "admissions"
    | "management-results";
}) {
  const { token } = usePortalAuth();
  const [actionMessage, setActionMessage] = useState("");
  const [auditQuery, setAuditQuery] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("all");
  const [notificationQuery, setNotificationQuery] = useState("");
  const [notificationRoleFilter, setNotificationRoleFilter] = useState("all");
  const [notificationEventFilter, setNotificationEventFilter] = useState("all");

  async function downloadAdminExport(dataset: string) {
    if (!token) return;

    const response = await fetch(`/api/admin/exports/${dataset}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unable to download export right now.");
    }

    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="([^"]+)"/);
    const filename = match?.[1] || `success-academy-${dataset}.csv`;
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
    setActionMessage(`Downloaded ${filename}.`);
  }

  const endpoint = useMemo(() => {
    if (role === "admin" && page === "students") return "/api/admin/students";
    if (role === "admin" && page === "teachers") return "/api/admin/teachers";
    if (role === "admin" && page === "admissions") return "/api/admin/admissions";
    if (role === "admin" && page === "fees") return "/api/admin/fees/overview";
    if (role === "admin" && page === "management-results") return "/api/admin/results";
    if (role === "admin" && page === "announcements") return "/api/admin/announcements";
    return endpointFor(role, page);
  }, [page, role]);
  const { data, isLoading, error, setData } = usePortalResource<any>(endpoint);
  const {
    data: portalAccessData,
    isLoading: isPortalAccessLoading,
    error: portalAccessError,
    setData: setPortalAccessData,
  } = usePortalResource<PortalAccessOverview>(
    role === "admin" && page === "students" ? "/api/admin/portal-access" : null,
  );
  const {
    data: publishingChecklistData,
    isLoading: isPublishingChecklistLoading,
    error: publishingChecklistError,
    setData: setPublishingChecklistData,
  } = usePortalResource<PortalPublishingChecklist>(
    role === "admin" && page === "students" ? "/api/admin/portal-publishing" : null,
  );
  const {
    data: auditLogData,
    isLoading: isAuditLogLoading,
    error: auditLogError,
    setData: setAuditLogData,
  } = usePortalResource<AuditLogRecord[]>(
    role === "admin" && page === "students"
      ? `/api/admin/audit-logs?limit=12${auditQuery ? `&q=${encodeURIComponent(auditQuery)}` : ""}${
          auditActionFilter !== "all" ? `&action=${encodeURIComponent(auditActionFilter)}` : ""
        }`
      : null,
  );
  const {
    data: notificationLogData,
    isLoading: isNotificationLogLoading,
    error: notificationLogError,
    setData: setNotificationLogData,
  } = usePortalResource<NotificationLogRecord[]>(
    role === "admin" && page === "students"
      ? `/api/admin/notification-logs?limit=12${notificationQuery ? `&q=${encodeURIComponent(notificationQuery)}` : ""}${
          notificationRoleFilter !== "all" ? `&role=${encodeURIComponent(notificationRoleFilter)}` : ""
        }${notificationEventFilter !== "all" ? `&eventType=${encodeURIComponent(notificationEventFilter)}` : ""}`
      : null,
  );
  const state = LoadingOrError({ isLoading, error });
  if (state) return state;

  if (role === "student" && page === "results") {
    return (
      <PortalPageShell title="Result Checking" description="Review your latest term scores and performance grades.">
        <PortalCard title="Current Results" description="Latest uploaded result sheet for the current term.">
          <PortalTable columns={["Subject", "Score", "Grade"]} rows={(data || []).map((item: any) => [item.subject, `${item.score}%`, item.grade])} emptyMessage="Results will appear here after teacher upload." />
        </PortalCard>
      </PortalPageShell>
    );
  }

  if ((role === "student" || role === "parent") && page === "attendance") {
    const attendanceData = data as { percentage: string; summary: { status: string; count: string }[] };
    return (
      <PortalPageShell title="Attendance" description="See attendance patterns and punctuality for the current term.">
        <PortalCard title="Attendance Summary" description={`Current attendance: ${attendanceData?.percentage || "N/A"}.`}>
          <PortalTable columns={["Status", "Count"]} rows={(attendanceData?.summary || []).map((item) => [item.status, item.count])} emptyMessage="Attendance records will appear here." />
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "student" && page === "assignments") {
    return (
      <PortalPageShell title="Assignments" description="Track active assignments and due dates.">
        <PortalCard title="Assignment List" description="Work to complete this week.">
          {(data || []).length === 0 ? (
            <PortalStateCard title="No assignments" message="Assignments will appear here when teachers publish them." />
          ) : (
            <div className="space-y-3">
              {(data || []).map((assignment: any) => (
                <div key={assignment.id || assignment.title} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--brand-ink)]">{assignment.title}</p>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">{assignment.subject} • Due {assignment.due}</p>
                </div>
              ))}
            </div>
          )}
        </PortalCard>
      </PortalPageShell>
    );
  }

  if ((role === "student" || role === "parent" || role === "teacher") && page === "timetable") {
    return (
      <PortalPageShell title="Timetable" description="Structured schedule for classes, lessons, and day planning.">
        <PortalCard title="Weekly View" description="Today’s active schedule snapshot.">
          <div className="space-y-3">
            {(data || []).map((lesson: any) => (
              <div key={`${lesson.time}-${lesson.item}`} className="flex items-center justify-between rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                <span className="text-sm font-semibold text-[var(--brand-ink)]">{lesson.time}</span>
                <span className="text-sm text-[var(--brand-muted)]">{lesson.item}</span>
              </div>
            ))}
          </div>
        </PortalCard>
      </PortalPageShell>
    );
  }

  if ((role === "student" || role === "parent" || role === "teacher" || role === "admin") && page === "announcements") {
    const announcements = Array.isArray(data) ? data : [];

    async function publishAnnouncement() {
      if (!token) return;
      const created = await apiRequest<any>(
        role === "admin" ? "/api/admin/announcements" : "/api/portal/teacher/announcements",
        {
          method: "POST",
          body: JSON.stringify({
            title: "Portal Maintenance Notice",
            message: "This is a demo announcement published from the frontend.",
            audience: role === "admin" ? "all" : "students",
            authorUserId: "user-admin-1",
          }),
        },
        token,
      );
      setActionMessage("Announcement published to the portal feed.");
      setData([created, ...announcements]);
    }

    return (
      <PortalPageShell title="Announcements" description="Important notices and updates for your portal role.">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          {(role === "teacher" || role === "admin") && (
            <PortalCard title="Compose Announcement" description="Mock announcement management form.">
              {actionMessage && <div className="mb-4 rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionMessage}</div>}
              <button type="button" onClick={publishAnnouncement} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white">
                <Send className="h-4 w-4" />
                Publish Announcement
              </button>
            </PortalCard>
          )}
          <PortalCard title="Announcement Feed" description="Recent notices and updates.">
            {announcements.length === 0 ? (
              <PortalStateCard title="No announcements available" message="This empty state is ready for backend-powered portal notices." />
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement: any) => (
                  <div key={announcement.id || announcement.title} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                    <p className="text-sm font-semibold text-[var(--brand-ink)]">{announcement.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">{announcement.detail || announcement.message}</p>
                  </div>
                ))}
              </div>
            )}
          </PortalCard>
        </div>
      </PortalPageShell>
    );
  }

  if ((role === "student" || role === "parent") && page === "report-card") {
    const reportCard = data as any;
    const downloadHref = `data:text/plain;charset=utf-8,${encodeURIComponent(
      [
        `Student: ${reportCard?.studentName || ""}`,
        `Class: ${reportCard?.className || ""}`,
        `Term: ${reportCard?.term || ""}`,
        `Teacher Comment: ${reportCard?.comments || ""}`,
        `Principal Comment: ${reportCard?.principalComment || ""}`,
      ].join("\n"),
    )}`;

    return (
      <PortalPageShell
        title="Report Card Preview"
        description="Preview the learner’s report card and download a simple export."
        action={<a href={downloadHref} download="success-academy-report-card.txt" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]"><Download className="h-4 w-4" />Download</a>}
      >
        <PortalCard title={reportCard?.term || "Current Term"} description="Preview generated from the backend report card structure.">
          <div className="space-y-4 rounded-[1.4rem] bg-[var(--brand-surface)] p-5">
            <p className="text-sm"><span className="font-semibold text-[var(--brand-ink)]">Student:</span> {reportCard?.studentName}</p>
            <p className="text-sm"><span className="font-semibold text-[var(--brand-ink)]">Class:</span> {reportCard?.className}</p>
            <p className="text-sm"><span className="font-semibold text-[var(--brand-ink)]">Teacher Comment:</span> {reportCard?.comments}</p>
            <p className="text-sm"><span className="font-semibold text-[var(--brand-ink)]">Principal Comment:</span> {reportCard?.principalComment}</p>
          </div>
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "parent" && page === "performance") {
    return (
      <PortalPageShell title="Child Performance" description="Detailed progress snapshot for the current term.">
        <PortalCard title="Subject Performance" description="Teacher-entered scores and notes.">
          <PortalTable columns={["Area", "Score", "Teacher Note"]} rows={(data || []).map((item: any) => [item.area, item.score, item.note])} emptyMessage="Performance records will appear here." />
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "parent" && page === "fees") {
    const feeData = data as FeesResponse;

    async function initializePayment() {
      if (!token || !(feeData?.records?.[0]?.id)) return;
      const payment = await apiRequest<any>(
        "/api/portal/payments/initialize",
        {
          method: "POST",
          body: JSON.stringify({ feeId: feeData.records[0].id, provider: "paystack" }),
        },
        token,
      );
      setActionMessage(`Payment initialized: ${payment.reference}`);
    }

    return (
      <PortalPageShell title="Fees and Payment Status" description="Track payment completion and outstanding balances.">
        <PortalStateCard title="Payment gateway structure ready" message="This page is connected to a backend payment initialization structure for Paystack or Stripe." />
        <PortalCard
          title="Fee Records"
          description="Current term billing overview."
          action={<button type="button" onClick={initializePayment} className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]">Pay Outstanding</button>}
        >
          {actionMessage && <div className="mb-4 rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionMessage}</div>}
          <PortalTable columns={["Item", "Status", "Amount", "Balance"]} rows={(feeData?.records || []).map((item) => [item.item, item.status, item.amount, item.balance])} emptyMessage="Fee records will appear here." />
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "teacher" && page === "class-list") {
    return (
      <PortalPageShell title="Class List" description="Review current teaching groups and student totals.">
        <PortalCard title="Assigned Classes" description="Quick overview of teaching responsibilities.">
          <PortalTable columns={["Class", "Students", "Role"]} rows={(data || []).map((item: any) => [item.className, String(item.students), item.classTeacher])} emptyMessage="No classes assigned yet." />
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "teacher" && page === "results") {
    async function uploadResult() {
      if (!token) return;
      const created = await apiRequest<any>(
        "/api/portal/teacher/results",
        {
          method: "POST",
          body: JSON.stringify({
            studentId: "student-1",
            subjectId: "subject-eng",
            score: 86,
          }),
        },
        token,
      );
      setActionMessage("Demo result uploaded successfully. It is now queued for review.");
      setData((current: any[] | null) => [{ student: "Adaeze Okafor", status: "Pending" }, ...(current || [])]);
      return created;
    }

    return (
      <PortalPageShell title="Upload Results" description="Backend-ready result entry and publishing workflow.">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <PortalCard title="Result Upload Form" description="Submit result records to the teacher API.">
            {actionMessage && <div className="mb-4 rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionMessage}</div>}
            <button type="button" onClick={uploadResult} className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white">
              Upload Demo Result
            </button>
          </PortalCard>
          <PortalCard title="Pending Result Queue" description="Students awaiting entry or approval.">
            <PortalTable columns={["Student", "Status"]} rows={(data || []).map((item: any) => [item.student, item.status])} emptyMessage="No pending result rows." />
          </PortalCard>
        </div>
      </PortalPageShell>
    );
  }

  if (role === "teacher" && page === "attendance") {
    const rosterData = data as AttendanceResponse;

    async function saveAttendance() {
      if (!token || !hasRosterData(rosterData)) return;
      await apiRequest(
        "/api/portal/teacher/attendance",
        {
          method: "POST",
          body: JSON.stringify({
            classId: rosterData.classId,
            entries: rosterData.roster.map((item) => ({
              studentId: item.studentId,
              status: item.status.toLowerCase(),
            })),
          }),
        },
        token,
      );
      setActionMessage("Attendance saved for the selected class.");
    }

    return (
      <PortalPageShell title="Attendance" description="Mark class attendance and review learner status.">
        <PortalCard
          title="Attendance Register"
          description="Connected to the teacher attendance API."
          action={<button type="button" onClick={saveAttendance} className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]">Save Attendance</button>}
        >
          {actionMessage && <div className="mb-4 rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionMessage}</div>}
          <PortalTable columns={["Student", "Status"]} rows={(hasRosterData(rosterData) ? rosterData.roster : []).map((item) => [item.name, item.status])} emptyMessage="Attendance roster unavailable." />
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "teacher" && page === "assignments") {
    async function publishAssignment() {
      if (!token) return;
      const created = await apiRequest<any>(
        "/api/portal/teacher/assignments",
        {
          method: "POST",
          body: JSON.stringify({
            title: "Demo Portal Assignment",
            description: "Published from the new backend API structure.",
            classId: "class-jss2-gold",
            subjectId: "subject-eng",
            dueDate: "2026-05-10",
          }),
        },
        token,
      );
      setActionMessage("Assignment published successfully to the selected class.");
      setData((current: any[] | null) => [created, ...(current || [])]);
    }

    return (
      <PortalPageShell title="Assignments" description="Create and review homework or project tasks.">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <PortalCard title="New Assignment" description="Publish assignments through the teacher API.">
            {actionMessage && <div className="mb-4 rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionMessage}</div>}
            <button type="button" onClick={publishAssignment} className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white">
              Publish Assignment
            </button>
          </PortalCard>
          <PortalCard title="Published Assignments" description="Current class tasks.">
            <div className="space-y-3">
              {(data || []).map((assignment: any) => (
                <div key={assignment.id || assignment.title} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--brand-ink)]">{assignment.title}</p>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">{assignment.className} • Due {assignment.due || assignment.dueDate}</p>
                </div>
              ))}
            </div>
          </PortalCard>
        </div>
      </PortalPageShell>
    );
  }

  if (role === "admin" && page === "students") {
    if (isPortalAccessLoading) {
      return <PortalLoadingScreen label="Loading portal access overview" />;
    }

    if (portalAccessError) {
      return <PortalStateCard title="Unable to load portal access" message={portalAccessError} tone="error" />;
    }

    if (isPublishingChecklistLoading) {
      return <PortalLoadingScreen label="Loading portal publishing checklist" />;
    }

    if (publishingChecklistError) {
      return <PortalStateCard title="Unable to load publishing checklist" message={publishingChecklistError} tone="error" />;
    }

    if (isAuditLogLoading) {
      return <PortalLoadingScreen label="Loading admin audit logs" />;
    }

    if (auditLogError) {
      return <PortalStateCard title="Unable to load audit logs" message={auditLogError} tone="error" />;
    }

    if (isNotificationLogLoading) {
      return <PortalLoadingScreen label="Loading notification logs" />;
    }

    if (notificationLogError) {
      return <PortalStateCard title="Unable to load notification logs" message={notificationLogError} tone="error" />;
    }

    const portalAccess = portalAccessData;
    const publishingChecklist = publishingChecklistData;
    const auditLogs = auditLogData || [];
    const notificationLogs = notificationLogData || [];

    async function sendInvite(targetType: "student" | "parent", targetId: string, fallbackEmail: string) {
      if (!token) return;

      const invite = await apiRequest<{ delivery: string; activationUrl: string }>(
        "/api/admin/portal-access/invite",
        {
          method: "POST",
          body: JSON.stringify({
            targetType,
            targetId,
            email: fallbackEmail,
          }),
        },
        token,
      );

      setActionMessage(
        invite.delivery === "email"
          ? "Portal invitation sent successfully."
          : `Demo portal invite prepared: ${invite.activationUrl}`,
      );

      if (setPortalAccessData && portalAccess) {
        setPortalAccessData((current) => {
          if (!current) return current;

          const stamp = new Date().toISOString();
          if (targetType === "student") {
            return {
              ...current,
              summary: {
                ...current.summary,
                invitesSent: String(Number(current.summary.invitesSent) + 1),
              },
              students: current.students.map((item) =>
                item.id === targetId ? { ...item, latestInviteAt: stamp } : item,
              ),
            };
          }

          return {
            ...current,
            summary: {
              ...current.summary,
              invitesSent: String(Number(current.summary.invitesSent) + 1),
            },
            parents: current.parents.map((item) =>
              item.id === targetId ? { ...item, latestInviteAt: stamp } : item,
            ),
          };
        });
      }

      if (setPublishingChecklistData) {
        setPublishingChecklistData((current) => {
          if (!current) return current;

          return {
            ...current,
            summary: {
              ...current.summary,
              pendingPublishing: current.summary.pendingPublishing,
            },
            rows: current.rows.map((item) =>
              item.studentId === targetId
                ? {
                    ...item,
                    completedCount: Math.min(item.totalChecks, item.completedCount + 1),
                    progressLabel: `${Math.min(item.totalChecks, item.completedCount + 1)}/${item.totalChecks}`,
                    pendingSteps: item.pendingSteps.filter((step) =>
                      targetType === "student" ? step !== "Send student invite" : step !== "Send parent invite",
                    ),
                  }
                : item,
            ),
          };
        });
      }

      if (setAuditLogData) {
        setAuditLogData((current) => [
          {
            id: `local-audit-${Date.now()}`,
            actorUserId: "current-admin",
            actorName: "Admin Demo User",
            action: "send_portal_invite",
            resourceType: targetType,
            resourceId: targetId,
            detail: `Sent portal invite to ${fallbackEmail}`,
            createdAt: new Date().toISOString(),
          },
          ...(current || []),
        ]);
      }

      if (setNotificationLogData) {
        setNotificationLogData((current) => [
          {
            id: `local-notification-${Date.now()}`,
            role: targetType,
            channel: "demo",
            delivery: "demo",
            recipientEmail: fallbackEmail,
            subject: `Success Academy ${targetType} portal invitation`,
            eventType: "portal_invite",
            detail: `Portal invite prepared for ${fallbackEmail}`,
            createdAt: new Date().toISOString(),
          },
          ...(current || []),
        ]);
      }
    }

    async function completeOnboarding(studentId: string, classId: string) {
      if (!token) return;

      const result = await apiRequest<{ createdFees: { id: string }[] }>(
        `/api/admin/students/${studentId}/onboard`,
        {
          method: "POST",
          body: JSON.stringify({ classId }),
        },
        token,
      );

      setActionMessage(
        result.createdFees.length > 0
          ? `Student onboarding completed and ${result.createdFees.length} fee items were provisioned.`
          : "Student onboarding completed. Existing fee plan was preserved.",
      );

      if (setPortalAccessData) {
        setPortalAccessData((current) => {
          if (!current) return current;

          return {
            ...current,
            students: current.students.map((item) =>
              item.id === studentId ? { ...item, status: "active", portalStatus: item.portalStatus, latestInviteAt: item.latestInviteAt } : item,
            ),
          };
        });
      }

      if (setPublishingChecklistData) {
        setPublishingChecklistData((current) => {
          if (!current) return current;

          return {
            ...current,
            rows: current.rows.map((item) =>
              item.studentId === studentId
                ? {
                    ...item,
                    status: "active",
                    completedCount: Math.min(item.totalChecks, item.completedCount + 2),
                    progressLabel: `${Math.min(item.totalChecks, item.completedCount + 2)}/${item.totalChecks}`,
                    pendingSteps: item.pendingSteps.filter(
                      (step) => step !== "Complete onboarding" && step !== "Provision fee plan",
                    ),
                  }
                : item,
            ),
          };
        });
      }

      if (setAuditLogData) {
        setAuditLogData((current) => [
          {
            id: `local-audit-${Date.now()}`,
            actorUserId: "current-admin",
            actorName: "Admin Demo User",
            action: "onboard_student",
            resourceType: "student",
            resourceId: studentId,
            detail:
              result.createdFees.length > 0
                ? `Completed onboarding and created ${result.createdFees.length} fee items`
                : "Completed onboarding with existing fee plan",
            createdAt: new Date().toISOString(),
          },
          ...(current || []),
        ]);
      }
    }

    async function sendBulkInvites(targetType: "student" | "parent") {
      if (!token) return;

      const result = await apiRequest<{ processed: number }>(
        "/api/admin/portal-access/invite/bulk",
        {
          method: "POST",
          body: JSON.stringify({ targetType }),
        },
        token,
      );

      setActionMessage(
        `Bulk ${targetType} invites completed for ${result.processed} account${result.processed === 1 ? "" : "s"}.`,
      );

      if (setPortalAccessData) {
        setPortalAccessData((current) => {
          if (!current) return current;

          const stamp = new Date().toISOString();
          if (targetType === "student") {
            const pending = current.students.filter((item) => item.portalStatus !== "Activated").length;
            return {
              ...current,
              summary: {
                ...current.summary,
                invitesSent: String(Number(current.summary.invitesSent) + pending),
              },
              students: current.students.map((item) =>
                item.portalStatus !== "Activated" ? { ...item, latestInviteAt: stamp } : item,
              ),
            };
          }

          const pending = current.parents.filter((item) => item.portalStatus !== "Activated").length;
          return {
            ...current,
            summary: {
              ...current.summary,
              invitesSent: String(Number(current.summary.invitesSent) + pending),
            },
            parents: current.parents.map((item) =>
              item.portalStatus !== "Activated" ? { ...item, latestInviteAt: stamp } : item,
            ),
          };
        });
      }

      if (setAuditLogData) {
        setAuditLogData((current) => [
          {
            id: `local-audit-${Date.now()}`,
            actorUserId: "current-admin",
            actorName: "Admin Demo User",
            action: "send_bulk_portal_invites",
            resourceType: targetType,
            resourceId: "bulk",
            detail: `Sent ${result.processed} bulk ${targetType} portal invites`,
            createdAt: new Date().toISOString(),
          },
          ...(current || []),
        ]);
      }

      if (setNotificationLogData && targetType === "student") {
        setNotificationLogData((current) => {
          const pendingStudents =
            portalAccess?.students.filter((item) => item.portalStatus !== "Activated") || [];

          const newRows = pendingStudents.map((item, index) => ({
            id: `local-notification-${Date.now()}-${index}`,
            role: "student",
            channel: "demo",
            delivery: "demo",
            recipientEmail: `portal+student-${item.admissionNo.toLowerCase()}@successacademy.edu.ng`,
            subject: "Success Academy student portal invitation",
            eventType: "portal_invite",
            detail: `Portal invite prepared for ${item.admissionNo}`,
            createdAt: new Date().toISOString(),
          }));

          return [...newRows, ...(current || [])];
        });
      }

      if (setNotificationLogData && targetType === "parent") {
        setNotificationLogData((current) => {
          const pendingParents =
            portalAccess?.parents.filter((item) => item.portalStatus !== "Activated") || [];

          const newRows = pendingParents.map((item, index) => ({
            id: `local-notification-${Date.now()}-${index}`,
            role: "parent",
            channel: "demo",
            delivery: "demo",
            recipientEmail: `portal+parent-${item.admissionNo.toLowerCase()}@successacademy.edu.ng`,
            subject: "Success Academy parent portal invitation",
            eventType: "portal_invite",
            detail: `Portal invite prepared for ${item.admissionNo}`,
            createdAt: new Date().toISOString(),
          }));

          return [...newRows, ...(current || [])];
        });
      }
    }

    async function completeBulkOnboarding() {
      if (!token) return;

      const result = await apiRequest<{ processed: number }>(
        "/api/admin/students/onboard/bulk",
        {
          method: "POST",
        },
        token,
      );

      setActionMessage(
        `Bulk onboarding completed for ${result.processed} student${result.processed === 1 ? "" : "s"}.`,
      );

      if (setPortalAccessData) {
        setPortalAccessData((current) => {
          if (!current) return current;

          return {
            ...current,
            students: current.students.map((item) =>
              item.status !== "active" ? { ...item, status: "active" } : item,
            ),
          };
        });
      }

      if (setPublishingChecklistData) {
        setPublishingChecklistData((current) => {
          if (!current) return current;

          return {
            ...current,
            rows: current.rows.map((item) => ({
              ...item,
              status: "active",
              completedCount: item.pendingSteps.includes("Complete onboarding") || item.pendingSteps.includes("Provision fee plan")
                ? Math.min(item.totalChecks, item.completedCount + 2)
                : item.completedCount,
              progressLabel:
                item.pendingSteps.includes("Complete onboarding") || item.pendingSteps.includes("Provision fee plan")
                  ? `${Math.min(item.totalChecks, item.completedCount + 2)}/${item.totalChecks}`
                  : item.progressLabel,
              pendingSteps: item.pendingSteps.filter(
                (step) => step !== "Complete onboarding" && step !== "Provision fee plan",
              ),
            })),
          };
        });
      }

      if (setAuditLogData) {
        setAuditLogData((current) => [
          {
            id: `local-audit-${Date.now()}`,
            actorUserId: "current-admin",
            actorName: "Admin Demo User",
            action: "bulk_onboard_students",
            resourceType: "student",
            resourceId: "bulk",
            detail: `Completed onboarding for ${result.processed} students`,
            createdAt: new Date().toISOString(),
          },
          ...(current || []),
        ]);
      }
    }

    return (
      <PortalPageShell title="Student Management" description="Monitor student and parent portal readiness, then send activation invites where needed.">
        <PortalStatGrid
          items={[
            { label: "Activated accounts", value: portalAccess?.summary.activatedAccounts || "0" },
            { label: "Students ready", value: portalAccess?.summary.studentsReady || "0/0" },
            { label: "Parents ready", value: portalAccess?.summary.parentsReady || "0/0" },
            { label: "Invites sent", value: portalAccess?.summary.invitesSent || "0" },
          ]}
        />
        <PortalCard title="Portal Invite Actions" description="Use these quick actions to send account setup invitations.">
          {actionMessage && <div className="rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionMessage}</div>}
          <p className="text-sm leading-7 text-[var(--brand-muted)]">
            Pending accounts can receive a portal activation invite. In demo mode, the generated activation link is shown
            here after sending.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => completeBulkOnboarding()}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Onboard All Pending Students
            </button>
            <button
              type="button"
              onClick={() => sendBulkInvites("student")}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-ink)] px-4 text-sm font-semibold text-white"
            >
              Send All Student Invites
            </button>
            <button
              type="button"
              onClick={() => sendBulkInvites("parent")}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Send All Parent Invites
            </button>
            <button
              type="button"
              onClick={() => void downloadAdminExport("portal-publishing")}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Export Publishing Report
            </button>
          </div>
        </PortalCard>
        <PortalCard title="Publish-To-Portal Checklist" description={`Readiness tracker for ${publishingChecklist?.summary.currentTerm || "the current term"}.`}>
          <PortalTable
            columns={["Student", "Class", "Progress", "Next Step"]}
            rows={(publishingChecklist?.rows || []).map((item) => [
              item.studentName,
              item.className,
              item.progressLabel,
              item.pendingSteps[0] || "Fully published",
            ])}
            emptyMessage="No publishing checklist items found."
          />
          <div className="mt-4 grid gap-3">
            {(publishingChecklist?.rows || [])
              .filter((item) => item.pendingSteps.length > 0)
              .slice(0, 4)
              .map((item) => (
                <div key={item.studentId} className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--brand-ink)]">{item.studentName}</p>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">
                    Next: {item.pendingSteps.join(" • ")}
                  </p>
                </div>
              ))}
          </div>
        </PortalCard>
        <PortalCard
          title="Recent Admin Activity"
          description="Latest operational actions recorded in the admin audit trail."
          action={
            <button
              type="button"
              onClick={() => void downloadAdminExport("audit-logs")}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Export Audit Log
            </button>
          }
        >
          <div className="mb-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
            <input
              type="search"
              value={auditQuery}
              onChange={(event) => setAuditQuery(event.target.value)}
              className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
              placeholder="Search actor, action, resource, or detail"
            />
            <select
              value={auditActionFilter}
              onChange={(event) => setAuditActionFilter(event.target.value)}
              className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
            >
              <option value="all">All actions</option>
              <option value="send_portal_invite">Single invite</option>
              <option value="send_bulk_portal_invites">Bulk invites</option>
              <option value="onboard_student">Single onboarding</option>
              <option value="bulk_onboard_students">Bulk onboarding</option>
              <option value="enroll_admission">Enroll admission</option>
              <option value="export_dataset">Export dataset</option>
            </select>
          </div>
          <PortalTable
            columns={["When", "Actor", "Action", "Detail"]}
            rows={auditLogs.map((item) => [
              new Date(item.createdAt).toLocaleString(),
              item.actorName,
              item.action,
              item.detail,
            ])}
            emptyMessage="Audit events will appear here once admin actions are performed."
          />
        </PortalCard>
        <PortalCard
          title="Recent Notifications"
          description="Recent student and parent notifications prepared or sent by the platform."
          action={
            <button
              type="button"
              onClick={() => void downloadAdminExport("notification-logs")}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Export Notification Log
            </button>
          }
        >
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <input
              type="search"
              value={notificationQuery}
              onChange={(event) => setNotificationQuery(event.target.value)}
              className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
              placeholder="Search recipient, subject, or detail"
            />
            <select
              value={notificationRoleFilter}
              onChange={(event) => setNotificationRoleFilter(event.target.value)}
              className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
            >
              <option value="all">All roles</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
            <select
              value={notificationEventFilter}
              onChange={(event) => setNotificationEventFilter(event.target.value)}
              className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
            >
              <option value="all">All events</option>
              <option value="portal_invite">Portal invite</option>
              <option value="password_reset">Password reset</option>
            </select>
          </div>
          <PortalTable
            columns={["When", "Role", "Delivery", "Recipient", "Event"]}
            rows={notificationLogs.map((item) => [
              new Date(item.createdAt).toLocaleString(),
              item.role,
              item.delivery,
              item.recipientEmail,
              item.eventType,
            ])}
            emptyMessage="Notification events will appear here when invites or resets are prepared."
          />
        </PortalCard>
        <PortalCard title="Student Portal Accounts" description="Students who have or still need portal access.">
          <div className="mb-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void downloadAdminExport("students")}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Export Student Accounts
            </button>
            <button
              type="button"
              onClick={() => void downloadAdminExport("portal-access")}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Export Portal Access
            </button>
          </div>
          <PortalTable
            columns={["Student", "Class", "Portal Status", "Last Invite"]}
            rows={(portalAccess?.students || []).map((item) => [
              item.fullName,
              item.className,
              item.portalStatus,
              item.latestInviteAt ? new Date(item.latestInviteAt).toLocaleDateString() : "Not sent",
            ])}
            emptyMessage="No student records found."
          />
          <div className="mt-4 grid gap-3">
            {(portalAccess?.students || [])
              .filter((item) => item.portalStatus !== "Activated")
              .map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-ink)]">{item.fullName}</p>
                    <p className="mt-1 text-sm text-[var(--brand-muted)]">
                      {item.admissionNo} • PIN {item.accessPin} • {item.parentCount} linked parent{item.parentCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => completeOnboarding(item.id, item.classId)}
                      className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm font-semibold text-[var(--brand-ink)]"
                    >
                      Complete Onboarding
                    </button>
                    <button
                      type="button"
                      onClick={() => sendInvite("student", item.id, `portal+student-${item.admissionNo.toLowerCase()}@successacademy.edu.ng`)}
                      className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-ink)] px-4 text-sm font-semibold text-white"
                    >
                      Send Student Invite
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </PortalCard>
        <PortalCard title="Parent Portal Accounts" description="Parent accounts linked to current student records.">
          <PortalTable
            columns={["Parent", "Linked Student", "Portal Status", "Last Invite"]}
            rows={(portalAccess?.parents || []).map((item) => [
              item.fullName,
              item.linkedStudent,
              item.portalStatus,
              item.latestInviteAt ? new Date(item.latestInviteAt).toLocaleDateString() : "Not sent",
            ])}
            emptyMessage="No parent portal records found."
          />
          <div className="mt-4 grid gap-3">
            {(portalAccess?.parents || [])
              .filter((item) => item.portalStatus !== "Activated")
              .map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-ink)]">{item.fullName}</p>
                    <p className="mt-1 text-sm text-[var(--brand-muted)]">
                      {item.linkedStudent} • {item.phone}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => sendInvite("parent", item.id, `portal+parent-${item.admissionNo.toLowerCase()}@successacademy.edu.ng`)}
                    className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
                  >
                    Send Parent Invite
                  </button>
                </div>
              ))}
          </div>
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "admin" && page === "teachers") {
    return (
      <PortalPageShell title="Teacher Management" description="Manage teacher records, departments, and account status.">
        <PortalCard title="Teacher Directory" description="Connected to the admin teacher CRUD API.">
          <PortalTable columns={["Name", "Department", "Status"]} rows={(data || []).map((item: any) => [`${item.firstName} ${item.lastName}`, item.department, item.status])} emptyMessage="No teacher records found." />
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "admin" && page === "admissions") {
    async function convertAdmission(admissionId: string) {
      if (!token) return;

      await apiRequest(
        `/api/admin/admissions/${admissionId}/enroll`,
        {
          method: "POST",
        },
        token,
      );

      setActionMessage("Applicant enrolled successfully. Student and parent records were created.");
      setData((current: AdminAdmissionRecord[] | null) =>
        (current || []).map((item) =>
          item.id === admissionId
            ? {
                ...item,
                enrolledStudentId: "created",
                enrolledParentId: "created",
                enrolledAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    }

    return (
      <PortalPageShell title="Admission Applications" description="Track applications from enquiry through offer stage.">
        {actionMessage && <div className="rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionMessage}</div>}
        <PortalCard
          title="Current Applications"
          description="Connected to the admissions storage API."
          action={
            <button
              type="button"
              onClick={() => void downloadAdminExport("admissions")}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Export CSV
            </button>
          }
        >
          <PortalTable
            columns={["Applicant", "Programme", "Status", "Enrollment"]}
            rows={(data || []).map((item: AdminAdmissionRecord) => [
              item.childName,
              item.programme,
              item.status,
              item.enrolledStudentId ? "Enrolled" : "Pending",
            ])}
            emptyMessage="No applications submitted yet."
          />
          <div className="mt-4 grid gap-3">
            {(data || [])
              .filter((item: AdminAdmissionRecord) => !item.enrolledStudentId)
              .map((item: AdminAdmissionRecord) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-ink)]">{item.childName}</p>
                    <p className="mt-1 text-sm text-[var(--brand-muted)]">
                      {item.programme} • {item.status.split("_").join(" ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => convertAdmission(item.id)}
                    className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-ink)] px-4 text-sm font-semibold text-white"
                  >
                    Enroll Applicant
                  </button>
                </div>
              ))}
          </div>
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "admin" && page === "fees") {
    return (
      <PortalPageShell title="Fees Overview" description="Overview of fee collection and outstanding balances.">
        <PortalStateCard title="Billing integration pending" message="The payment structure is live at the API level and ready for Paystack or Stripe checkout integration." />
        <PortalCard
          title="Fee Summary by Section"
          description="Current fee overview."
          action={
            <button
              type="button"
              onClick={() => void downloadAdminExport("fees")}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Export CSV
            </button>
          }
        >
          <PortalTable columns={["Fee ID", "Amount Due", "Amount Paid", "Status"]} rows={(data || []).map((item: any) => [item.id, item.amountDueLabel, item.amountPaidLabel, item.status])} emptyMessage="No fee records found." />
        </PortalCard>
      </PortalPageShell>
    );
  }

  if (role === "admin" && page === "management-results") {
    return (
      <PortalPageShell title="Results Management" description="Oversee publication readiness and data quality.">
        <PortalCard
          title="Publishing Status"
          description="Connected to stored result records."
          action={
            <button
              type="button"
              onClick={() => void downloadAdminExport("results")}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Export CSV
            </button>
          }
        >
          <PortalTable columns={["Student ID", "Subject ID", "Score", "Grade"]} rows={(data || []).map((item: any) => [item.studentId, item.subjectId, String(item.score), item.grade])} emptyMessage="No result records found." />
        </PortalCard>
      </PortalPageShell>
    );
  }

  return <PortalStateCard title="Page not available" message="This portal page is not available right now." />;
}

export function AcademicCalendarSection() {
  const { data, isLoading, error } = usePortalResource<CalendarResponse>("/api/public/calendar", false);
  const state = LoadingOrError({ isLoading, error });
  if (state) return state;

  return (
    <PortalCard
      title="Academic Calendar"
      description={`Key dates for ${data?.currentTerm?.name || "the current term"} ${data?.currentTerm?.sessionName || ""}.`}
    >
      <div className="space-y-3">
        {(data?.events || []).map((event) => (
          <div key={event.date} className="flex flex-col gap-1 rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-[var(--brand-ink)]">{event.date}</span>
            <span className="text-sm text-[var(--brand-muted)]">{event.event}</span>
          </div>
        ))}
      </div>
    </PortalCard>
  );
}
