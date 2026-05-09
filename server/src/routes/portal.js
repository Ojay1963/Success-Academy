const express = require("express");
const { forbidden } = require("../utils/httpError");
const {
  buildStudentDashboard,
  buildParentDashboard,
  buildTeacherDashboard,
  buildAdminDashboard,
  getStudentByUserId,
  getParentByUserId,
  getTeacherByUserId,
  getStudentResults,
  getStudentAttendanceSummary,
  getStudentAssignments,
  getClassTimetable,
  getAnnouncementsForAudience,
  buildReportCard,
  getFeesForStudent,
  getAssignmentsForTeacher,
  initializePayment,
  generateReportCard,
  buildResultQueue,
  createEntity,
  getCurrentTerm,
} = require("../services/portal");
const { requireFields, ensureOneOf, sanitizeString } = require("../utils/validators");

const router = express.Router();

function allowRoles(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.auth.user.role)) {
      return next(forbidden("You do not have permission to access this resource."));
    }
    return next();
  };
}

router.get("/student/dashboard", allowRoles("student"), (req, res, next) => {
  try {
    const data = buildStudentDashboard(req.auth.user.id);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.get("/student/results", allowRoles("student"), (req, res, next) => {
  try {
    const student = getStudentByUserId(req.auth.user.id);
    res.json({ ok: true, data: getStudentResults(student.id) });
  } catch (error) {
    next(error);
  }
});

router.get("/student/attendance", allowRoles("student"), (req, res, next) => {
  try {
    const student = getStudentByUserId(req.auth.user.id);
    res.json({ ok: true, data: getStudentAttendanceSummary(student.id) });
  } catch (error) {
    next(error);
  }
});

router.get("/student/assignments", allowRoles("student"), (req, res, next) => {
  try {
    const student = getStudentByUserId(req.auth.user.id);
    res.json({ ok: true, data: getStudentAssignments(student.classId) });
  } catch (error) {
    next(error);
  }
});

router.get("/student/timetable", allowRoles("student"), (req, res, next) => {
  try {
    const student = getStudentByUserId(req.auth.user.id);
    res.json({ ok: true, data: getClassTimetable(student.classId) });
  } catch (error) {
    next(error);
  }
});

router.get("/student/announcements", allowRoles("student"), (_req, res) => {
  res.json({ ok: true, data: getAnnouncementsForAudience("students") });
});

router.get("/student/report-card", allowRoles("student"), (req, res, next) => {
  try {
    const student = getStudentByUserId(req.auth.user.id);
    res.json({ ok: true, data: buildReportCard(student.id) });
  } catch (error) {
    next(error);
  }
});

router.get("/parent/dashboard", allowRoles("parent"), (req, res, next) => {
  try {
    res.json({ ok: true, data: buildParentDashboard(req.auth.user.id) });
  } catch (error) {
    next(error);
  }
});

router.get("/parent/performance", allowRoles("parent"), (req, res, next) => {
  try {
    const data = buildParentDashboard(req.auth.user.id);
    res.json({ ok: true, data: data.childPerformance });
  } catch (error) {
    next(error);
  }
});

router.get("/parent/attendance", allowRoles("parent"), (req, res, next) => {
  try {
    const parent = getParentByUserId(req.auth.user.id);
    res.json({ ok: true, data: getStudentAttendanceSummary(parent.studentIds[0]) });
  } catch (error) {
    next(error);
  }
});

router.get("/parent/fees", allowRoles("parent"), (req, res, next) => {
  try {
    const parent = getParentByUserId(req.auth.user.id);
    res.json({ ok: true, data: getFeesForStudent(parent.studentIds[0]) });
  } catch (error) {
    next(error);
  }
});

router.get("/parent/timetable", allowRoles("parent"), (req, res, next) => {
  try {
    const data = buildParentDashboard(req.auth.user.id);
    res.json({ ok: true, data: data.timetable });
  } catch (error) {
    next(error);
  }
});

router.get("/parent/announcements", allowRoles("parent"), (_req, res) => {
  res.json({ ok: true, data: getAnnouncementsForAudience("parents") });
});

router.get("/parent/report-card", allowRoles("parent"), (req, res, next) => {
  try {
    const parent = getParentByUserId(req.auth.user.id);
    res.json({ ok: true, data: buildReportCard(parent.studentIds[0]) });
  } catch (error) {
    next(error);
  }
});

router.get("/teacher/dashboard", allowRoles("teacher"), (req, res, next) => {
  try {
    res.json({ ok: true, data: buildTeacherDashboard(req.auth.user.id) });
  } catch (error) {
    next(error);
  }
});

router.get("/teacher/class-list", allowRoles("teacher"), (req, res, next) => {
  try {
    const data = buildTeacherDashboard(req.auth.user.id);
    res.json({ ok: true, data: data.classList });
  } catch (error) {
    next(error);
  }
});

router.get("/teacher/results", allowRoles("teacher"), (req, res, next) => {
  try {
    const teacher = getTeacherByUserId(req.auth.user.id);
    res.json({ ok: true, data: buildResultQueue(teacher.classIds[0]) });
  } catch (error) {
    next(error);
  }
});

router.post("/teacher/results", allowRoles("teacher"), (req, res, next) => {
  try {
    requireFields(req.body, ["studentId", "subjectId", "score"]);
    const teacher = getTeacherByUserId(req.auth.user.id);
    const score = Number(req.body.score);
    const result = createEntity("results", {
      studentId: sanitizeString(req.body.studentId),
      subjectId: sanitizeString(req.body.subjectId),
      termId: req.body.termId || getCurrentTerm().id,
      score,
      grade: score >= 80 ? "A" : score >= 70 ? "B+" : score >= 60 ? "B" : "C",
      teacherId: teacher.id,
      publishedAt: null,
    });
    res.status(201).json({ ok: true, message: "Result uploaded successfully.", data: result });
  } catch (error) {
    next(error);
  }
});

router.get("/teacher/attendance", allowRoles("teacher"), (req, res, next) => {
  try {
    const teacher = getTeacherByUserId(req.auth.user.id);
    const data = buildTeacherDashboard(req.auth.user.id);
    res.json({ ok: true, data: { classId: teacher.classIds[0], roster: data.attendanceRoster } });
  } catch (error) {
    next(error);
  }
});

router.post("/teacher/attendance", allowRoles("teacher"), (req, res, next) => {
  try {
    requireFields(req.body, ["classId", "entries"]);
    const teacher = getTeacherByUserId(req.auth.user.id);
    const entries = Array.isArray(req.body.entries) ? req.body.entries : [];
    const created = entries.map((entry) =>
      createEntity("attendance", {
        studentId: sanitizeString(entry.studentId),
        classId: sanitizeString(req.body.classId),
        date: req.body.date || new Date().toISOString().slice(0, 10),
        status: sanitizeString(entry.status || "present").toLowerCase(),
        markedBy: teacher.id,
      }),
    );
    res.status(201).json({ ok: true, message: "Attendance saved successfully.", data: created });
  } catch (error) {
    next(error);
  }
});

router.get("/teacher/assignments", allowRoles("teacher"), (req, res, next) => {
  try {
    const teacher = getTeacherByUserId(req.auth.user.id);
    res.json({ ok: true, data: getAssignmentsForTeacher(teacher.id) });
  } catch (error) {
    next(error);
  }
});

router.post("/teacher/assignments", allowRoles("teacher"), (req, res, next) => {
  try {
    requireFields(req.body, ["title", "classId", "subjectId", "dueDate"]);
    const teacher = getTeacherByUserId(req.auth.user.id);
    const assignment = createEntity("assignments", {
      title: sanitizeString(req.body.title),
      description: sanitizeString(req.body.description || ""),
      classId: sanitizeString(req.body.classId),
      subjectId: sanitizeString(req.body.subjectId),
      teacherId: teacher.id,
      dueDate: sanitizeString(req.body.dueDate),
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ ok: true, message: "Assignment published successfully.", data: assignment });
  } catch (error) {
    next(error);
  }
});

router.get("/teacher/timetable", allowRoles("teacher"), (req, res, next) => {
  try {
    const data = buildTeacherDashboard(req.auth.user.id);
    res.json({ ok: true, data: data.timetable });
  } catch (error) {
    next(error);
  }
});

router.get("/teacher/announcements", allowRoles("teacher"), (_req, res) => {
  res.json({ ok: true, data: getAnnouncementsForAudience("teachers") });
});

router.post("/teacher/announcements", allowRoles("teacher"), (req, res, next) => {
  try {
    requireFields(req.body, ["title", "message"]);
    ensureOneOf(req.body.audience || "students", ["all", "students", "parents", "teachers"], "audience");
    const announcement = createEntity("announcements", {
      title: sanitizeString(req.body.title),
      message: sanitizeString(req.body.message),
      audience: req.body.audience || "students",
      authorUserId: req.auth.user.id,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ ok: true, message: "Announcement published to the portal feed.", data: announcement });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/dashboard", allowRoles("admin"), (_req, res) => {
  res.json({ ok: true, data: buildAdminDashboard() });
});

router.post("/payments/initialize", allowRoles("parent", "admin"), (req, res, next) => {
  try {
    requireFields(req.body, ["feeId", "provider"]);
    ensureOneOf(req.body.provider, ["paystack", "stripe"], "provider");
    res.json({
      ok: true,
      message: "Payment initialized successfully.",
      data: initializePayment(req.body),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/report-cards/:studentId/generate", allowRoles("teacher", "admin"), (req, res, next) => {
  try {
    res.json({
      ok: true,
      message: "Report card generation structure prepared.",
      data: generateReportCard(req.params.studentId),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { portalRouter: router };
