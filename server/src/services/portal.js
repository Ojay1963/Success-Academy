const { env } = require("../config/env");
const { store } = require("../data/store");
const { badRequest, notFound } = require("../utils/httpError");
const { createResetCode } = require("../utils/security");
const { sendPortalInvitationEmail } = require("./email");
const { createNotificationLog, listNotificationLogs } = require("./notifications");

function getCurrentTerm() {
  const term = store.findOne("terms", (item) => item.isCurrent);
  if (!term) {
    throw notFound("Current term not configured.");
  }
  return term;
}

function getStudentByUserId(userId) {
  const student = store.findOne("students", (item) => item.userId === userId);
  if (!student) {
    throw notFound("Student profile not found.");
  }
  return student;
}

function getParentByUserId(userId) {
  const parent = store.findOne("parents", (item) => item.userId === userId);
  if (!parent) {
    throw notFound("Parent profile not found.");
  }
  return parent;
}

function getTeacherByUserId(userId) {
  const teacher = store.findOne("teachers", (item) => item.userId === userId);
  if (!teacher) {
    throw notFound("Teacher profile not found.");
  }
  return teacher;
}

function getStudentResults(studentId) {
  const currentTerm = getCurrentTerm();
  return store
    .filter("results", (item) => item.studentId === studentId && item.termId === currentTerm.id)
    .map((result) => {
      const subject = store.findById("subjects", result.subjectId);
      return {
        subject: subject?.name || "Unknown Subject",
        score: result.score,
        grade: result.grade,
      };
    });
}

function getStudentAttendanceSummary(studentId) {
  const attendance = store.filter("attendance", (item) => item.studentId === studentId);
  const total = attendance.length || 1;
  const present = attendance.filter((item) => item.status === "present").length;
  const late = attendance.filter((item) => item.status === "late").length;
  const absent = attendance.filter((item) => item.status === "absent").length;
  const percentage = Math.round(((present + late * 0.5) / total) * 100);

  return {
    percentage: `${percentage}%`,
    summary: [
      { status: "Present", count: `${present} days` },
      { status: "Late", count: `${late} days` },
      { status: "Absent", count: `${absent} days` },
    ],
  };
}

function getStudentAssignments(classId) {
  return store
    .filter("assignments", (item) => item.classId === classId)
    .map((assignment) => {
      const subject = store.findById("subjects", assignment.subjectId);
      return {
        id: assignment.id,
        title: assignment.title,
        subject: subject?.name || "Unknown Subject",
        due: assignment.dueDate,
        description: assignment.description,
        className: store.findById("classes", assignment.classId)?.name || "Unknown Class",
      };
    });
}

function getClassTimetable(classId) {
  return store
    .filter("timetableEntries", (item) => item.classId === classId)
    .map((entry) => {
      const subject = store.findById("subjects", entry.subjectId);
      return {
        day: entry.day,
        time: entry.time,
        item: subject?.name || "Unknown Subject",
      };
    });
}

function getAnnouncementsForAudience(audience) {
  return store
    .filter("announcements", (item) => item.audience === "all" || item.audience === audience)
    .map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.message,
      createdAt: item.createdAt,
    }));
}

function buildStudentDashboard(userId) {
  const student = getStudentByUserId(userId);
  return buildStudentDashboardFromStudent(student);
}

function buildStudentDashboardFromStudent(student) {
  const results = getStudentResults(student.id);
  const classInfo = store.findById("classes", student.classId);
  const attendance = getStudentAttendanceSummary(student.id);
  const assignments = getStudentAssignments(student.classId);
  const announcements = getAnnouncementsForAudience("students");
  const averageScore =
    results.length > 0
      ? `${Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length)}%`
      : "N/A";

  return {
    stats: [
      { label: "Attendance", value: attendance.percentage },
      { label: "Average score", value: averageScore },
      { label: "Assignments due", value: String(assignments.length) },
      { label: "Unread announcements", value: String(announcements.length) },
    ],
    results,
    assignments,
    timetable: getClassTimetable(student.classId).slice(0, 5),
    announcements,
    reportCard: buildReportCard(student.id),
    student: {
      studentId: student.id,
      admissionNo: student.admissionNo,
      className: classInfo?.name || "Unknown Class",
    },
  };
}

function buildReportCard(studentId) {
  const student = store.findById("students", studentId);
  if (!student) {
    throw notFound("Student not found.");
  }
  const reportCard = store.findOne("reportCards", (item) => item.studentId === studentId) || {
    id: `report-card-preview-${studentId}`,
    studentId,
    termId: getCurrentTerm().id,
    teacherComment: "Report card has not been generated yet.",
    principalComment: "",
    generatedAt: new Date().toISOString(),
    downloadUrl: null,
  };
  const term = store.findById("terms", reportCard.termId);

  return {
    id: reportCard.id,
    studentName: `${student.firstName} ${student.lastName}`,
    className: store.findById("classes", student.classId)?.name || "Unknown Class",
    term: `${term?.name || "Current Term"} ${term?.sessionName || ""}`.trim(),
    comments: reportCard.teacherComment,
    principalComment: reportCard.principalComment,
    generatedAt: reportCard.generatedAt,
    downloadUrl: reportCard.downloadUrl,
  };
}

function buildParentDashboard(userId) {
  const parent = getParentByUserId(userId);
  const primaryStudentId = parent.studentIds[0];
  const student = store.findById("students", primaryStudentId);
  if (!student) {
    throw notFound("Linked student profile not found.");
  }
  const studentDashboard = buildStudentDashboardFromStudent(student);
  const fees = getFeesForStudent(student.id);
  const teacherMessages = store
    .filter("teacherMessages", (item) => item.parentId === parent.id)
    .map((message) => {
      const teacher = store.findById("teachers", message.teacherId);
      return {
        from: teacher ? `${teacher.firstName} ${teacher.lastName}` : "Teacher",
        subject: message.subject,
        note: message.message,
      };
    });

  return {
    stats: [
      { label: "Child attendance", value: studentDashboard.stats[0].value },
      { label: "Fees balance", value: `₦${fees.totalOutstanding.toLocaleString()}` },
      { label: "Unread messages", value: String(teacherMessages.length) },
      { label: "Current average", value: studentDashboard.stats[1].value },
    ],
    childPerformance: studentDashboard.results.map((item) => ({
      area: item.subject,
      score: `${item.score}%`,
      note: item.grade === "A" ? "Strong performance." : "Progressing steadily.",
    })),
    feeHistory: fees.records,
    teacherMessages,
    announcements: getAnnouncementsForAudience("parents"),
    reportCard: studentDashboard.reportCard,
    timetable: studentDashboard.timetable,
    attendance: getStudentAttendanceSummary(student.id),
  };
}

function getFeesForStudent(studentId) {
  const records = store.filter("fees", (item) => item.studentId === studentId).map((fee) => ({
    id: fee.id,
    item: fee.item,
    status:
      fee.status === "partially_paid"
        ? "Partially Paid"
        : fee.status === "paid"
          ? "Paid"
          : "Unpaid",
    amount: `₦${fee.amountDue.toLocaleString()}`,
    balance: `₦${Math.max(fee.amountDue - fee.amountPaid, 0).toLocaleString()}`,
    amountDue: fee.amountDue,
    amountPaid: fee.amountPaid,
    provider: fee.provider,
  }));
  const totalOutstanding = records.reduce((sum, fee) => sum + Math.max(fee.amountDue - fee.amountPaid, 0), 0);

  return { records, totalOutstanding };
}

function buildTeacherDashboard(userId) {
  const teacher = getTeacherByUserId(userId);
  const classes = teacher.classIds.map((classId) => store.findById("classes", classId)).filter(Boolean);
  const queue = store.filter("results", (result) => result.teacherId === teacher.id && !result.publishedAt).length;
  const announcements = getAnnouncementsForAudience("teachers");

  return {
    stats: [
      { label: "Classes today", value: String(classes.length || 0) },
      { label: "Students assigned", value: String(countStudentsInClasses(teacher.classIds)) },
      { label: "Pending results", value: String(queue) },
      { label: "Unread notices", value: String(announcements.length) },
    ],
    classList: classes.map((item) => ({
      className: item.name,
      students: store.filter("students", (student) => student.classId === item.id).length,
      classTeacher: "You",
    })),
    attendanceRoster: buildAttendanceRoster(classes[0]?.id),
    assignments: getAssignmentsForTeacher(teacher.id),
    timetable: buildTeacherTimetable(teacher.id),
    announcements,
    resultsQueue: buildResultQueue(classes[0]?.id),
  };
}

function buildAttendanceRoster(classId) {
  const students = store.filter("students", (item) => item.classId === classId);
  return students.map((student) => {
    const latest = store
      .filter("attendance", (entry) => entry.studentId === student.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    return {
      studentId: student.id,
      name: `${student.firstName} ${student.lastName}`,
      status: latest ? capitalizeStatus(latest.status) : "Present",
    };
  });
}

function buildTeacherTimetable(teacherId) {
  return store
    .filter("timetableEntries", (entry) => entry.teacherId === teacherId)
    .map((entry) => ({
      day: entry.day,
      time: entry.time,
      item: `${store.findById("classes", entry.classId)?.name || "Class"} - ${store.findById("subjects", entry.subjectId)?.name || "Subject"}`,
    }));
}

function getAssignmentsForTeacher(teacherId) {
  return store.filter("assignments", (item) => item.teacherId === teacherId).map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    className: store.findById("classes", assignment.classId)?.name || "Unknown Class",
    due: assignment.dueDate,
  }));
}

function buildResultQueue(classId) {
  const students = store.filter("students", (item) => item.classId === classId);
  return students.map((student, index) => ({
    student: `${student.firstName} ${student.lastName}`,
    status: index % 2 === 0 ? "Pending" : "Reviewed",
  }));
}

function countStudentsInClasses(classIds) {
  return store.filter("students", (item) => classIds.includes(item.classId)).length;
}

function buildAdminDashboard() {
  const feeRecords = store.list("fees");
  const paidTotal = feeRecords.reduce((sum, fee) => sum + fee.amountPaid, 0);
  const portalAccess = getPortalAccessOverview();

  return {
    stats: [
      { label: "Active students", value: String(store.filter("students", (item) => item.status === "active").length) },
      { label: "Teachers", value: String(store.list("teachers").length) },
      { label: "New applications", value: String(store.filter("admissions", (item) => item.status === "new").length) },
      { label: "Fees collected", value: `₦${paidTotal.toLocaleString()}` },
    ],
    admissions: store.list("admissions").map((item) => ({
      id: item.id,
      applicant: item.childName,
      level: item.programme,
      status: formatStatus(item.status),
    })),
    staff: store.list("teachers").map((item) => ({
      id: item.id,
      name: `${item.firstName} ${item.lastName}`,
      department: item.department,
      status: capitalizeStatus(item.status),
    })),
    feeOverview: buildFeeOverview(),
    announcements: getAnnouncementsForAudience("admins"),
    portalAccess: portalAccess.summary,
  };
}

function buildFeeOverview() {
  const classGroups = new Map();
  store.list("fees").forEach((fee) => {
    const student = store.findById("students", fee.studentId);
    const classInfo = student ? store.findById("classes", student.classId) : null;
    const key = classInfo?.section || "unknown";
    const current = classGroups.get(key) || { paid: 0, outstanding: 0 };
    current.paid += fee.amountPaid;
    current.outstanding += Math.max(fee.amountDue - fee.amountPaid, 0);
    classGroups.set(key, current);
  });

  return Array.from(classGroups.entries()).map(([className, value]) => ({
    className: capitalizeStatus(className),
    paid: `₦${value.paid.toLocaleString()}`,
    outstanding: `₦${value.outstanding.toLocaleString()}`,
  }));
}

function getPortalAccessOverview() {
  const students = store.list("students");
  const parents = store.list("parents");
  const invitations = store.list("portalInvitations");

  const studentAccounts = students.map((student) => {
    const user = student.userId ? store.findById("users", student.userId) : null;
    const latestInvite = invitations
      .filter((item) => item.targetType === "student" && item.targetId === student.id)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];

    return {
      id: student.id,
      fullName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      classId: student.classId,
      className: store.findById("classes", student.classId)?.name || student.classId,
      status: student.status,
      portalStatus: user ? "Activated" : "Pending activation",
      email: user?.email || "",
      latestInviteAt: latestInvite?.sentAt || "",
      accessPin: student.accessPin,
      parentCount: student.parentIds.length,
    };
  });

  const parentAccounts = parents.map((parent) => {
    const user = parent.userId ? store.findById("users", parent.userId) : null;
    const latestInvite = invitations
      .filter((item) => item.targetType === "parent" && item.targetId === parent.id)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];
    const firstStudent = store.findById("students", parent.studentIds[0]);

    return {
      id: parent.id,
      fullName: `${parent.firstName} ${parent.lastName}`,
      linkedStudent: firstStudent ? `${firstStudent.firstName} ${firstStudent.lastName}` : "Unlinked",
      admissionNo: firstStudent?.admissionNo || "",
      phone: parent.phone,
      portalStatus: user ? "Activated" : "Pending activation",
      email: user?.email || "",
      latestInviteAt: latestInvite?.sentAt || "",
    };
  });

  const activatedStudents = studentAccounts.filter((item) => item.portalStatus === "Activated").length;
  const activatedParents = parentAccounts.filter((item) => item.portalStatus === "Activated").length;

  return {
    summary: {
      activatedAccounts: String(activatedStudents + activatedParents),
      studentsReady: `${activatedStudents}/${studentAccounts.length}`,
      parentsReady: `${activatedParents}/${parentAccounts.length}`,
      invitesSent: String(invitations.length),
    },
    students: studentAccounts,
    parents: parentAccounts,
  };
}

function getPortalPublishingChecklist() {
  const currentTerm = getCurrentTerm();
  const invitations = store.list("portalInvitations");

  const rows = store.list("students").map((student) => {
    const parent = store.findById("parents", student.parentIds[0]);
    const studentUser = student.userId ? store.findById("users", student.userId) : null;
    const parentUser = parent?.userId ? store.findById("users", parent.userId) : null;
    const classInfo = store.findById("classes", student.classId);
    const feeCount = store.filter(
      "fees",
      (item) => item.studentId === student.id && item.termId === currentTerm.id,
    ).length;
    const studentInvite = invitations
      .filter((item) => item.targetType === "student" && item.targetId === student.id)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];
    const parentInvite = parent
      ? invitations
          .filter((item) => item.targetType === "parent" && item.targetId === parent.id)
          .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0]
      : null;

    const checks = {
      studentRecord: true,
      linkedParent: Boolean(parent),
      classAssigned: Boolean(classInfo),
      onboardingComplete: student.status === "active",
      feePlanReady: feeCount > 0,
      studentInviteSent: Boolean(studentInvite),
      parentInviteSent: Boolean(parentInvite),
      studentActivated: Boolean(studentUser),
      parentActivated: Boolean(parentUser),
    };

    const pendingSteps = [];
    if (!checks.linkedParent) pendingSteps.push("Link parent");
    if (!checks.classAssigned) pendingSteps.push("Assign class");
    if (!checks.onboardingComplete) pendingSteps.push("Complete onboarding");
    if (!checks.feePlanReady) pendingSteps.push("Provision fee plan");
    if (!checks.studentInviteSent) pendingSteps.push("Send student invite");
    if (checks.linkedParent && !checks.parentInviteSent) pendingSteps.push("Send parent invite");
    if (checks.studentInviteSent && !checks.studentActivated) pendingSteps.push("Await student activation");
    if (checks.parentInviteSent && !checks.parentActivated) pendingSteps.push("Await parent activation");

    const completedCount = Object.values(checks).filter(Boolean).length;

    return {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      className: classInfo?.name || "Unassigned",
      status: student.status,
      completedCount,
      totalChecks: Object.keys(checks).length,
      progressLabel: `${completedCount}/${Object.keys(checks).length}`,
      checks,
      pendingSteps,
    };
  });

  return {
    summary: {
      fullyPublished: String(rows.filter((item) => item.pendingSteps.length === 0).length),
      pendingPublishing: String(rows.filter((item) => item.pendingSteps.length > 0).length),
      currentTerm: `${currentTerm.name} ${currentTerm.sessionName}`,
    },
    rows,
  };
}

async function sendPortalInvitation({ targetType, targetId, email }) {
  if (!["student", "parent"].includes(targetType)) {
    throw badRequest("Invalid portal invitation target type.");
  }

  if (targetType === "student") {
    const student = getEntity("students", targetId);
    const destinationEmail = String(email || "").trim().toLowerCase();

    if (!destinationEmail) {
      throw badRequest("Student invitation email is required.");
    }

    const invitationCode = createResetCode();
    const delivery = await sendPortalInvitationEmail({
      role: "student",
      email: destinationEmail,
      recipientName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      activationCode: invitationCode,
    });

      const invitation = createEntity("portalInvitations", {
        targetType,
        targetId,
        email: destinationEmail,
      status: delivery.delivery === "email" ? "sent" : "delivered_demo",
      activationUrl: delivery.activationUrl,
      invitationCode,
        sentAt: new Date().toISOString(),
      });

      createNotificationLog({
        role: "student",
        channel: delivery.delivery === "email" ? "email" : "demo",
        delivery: delivery.delivery,
        recipientEmail: destinationEmail,
        subject: "Success Academy student portal invitation",
        eventType: "portal_invite",
        detail: `Student portal invite prepared for ${student.admissionNo}.`,
      });

      return {
        invitation,
      delivery: delivery.delivery,
      activationUrl: delivery.activationUrl,
    };
  }

  const parent = getEntity("parents", targetId);
  const linkedStudent = store.findById("students", parent.studentIds[0]);

  if (!linkedStudent) {
    throw badRequest("This parent does not have a linked student record yet.");
  }

  const destinationEmail = String(email || "").trim().toLowerCase();

  if (!destinationEmail) {
    throw badRequest("Parent invitation email is required.");
  }

  const invitationCode = createResetCode();
  const delivery = await sendPortalInvitationEmail({
    role: "parent",
    email: destinationEmail,
    recipientName: `${parent.firstName} ${parent.lastName}`,
    admissionNo: linkedStudent.admissionNo,
    activationCode: invitationCode,
  });

  const invitation = createEntity("portalInvitations", {
    targetType,
    targetId,
    email: destinationEmail,
    status: delivery.delivery === "email" ? "sent" : "delivered_demo",
    activationUrl: delivery.activationUrl,
    invitationCode,
    sentAt: new Date().toISOString(),
  });

  createNotificationLog({
    role: "parent",
    channel: delivery.delivery === "email" ? "email" : "demo",
    delivery: delivery.delivery,
    recipientEmail: destinationEmail,
    subject: "Success Academy parent portal invitation",
    eventType: "portal_invite",
    detail: `Parent portal invite prepared for ${linkedStudent.admissionNo}.`,
  });

  return {
    invitation,
    delivery: delivery.delivery,
    activationUrl: delivery.activationUrl,
  };
}

async function sendBulkPortalInvitations(targetType) {
  if (!["student", "parent"].includes(targetType)) {
    throw badRequest("Invalid bulk invitation target type.");
  }

  if (targetType === "student") {
    const targets = getPortalAccessOverview().students.filter(
      (item) => item.portalStatus !== "Activated",
    );

    const results = [];
    for (const target of targets) {
      const email = `portal+student-${target.admissionNo.toLowerCase()}@successacademy.edu.ng`;
      const result = await sendPortalInvitation({
        targetType: "student",
        targetId: target.id,
        email,
      });
      results.push({
        targetId: target.id,
        name: target.fullName,
        email,
        ...result,
      });
    }

    return {
      processed: results.length,
      results,
    };
  }

  const targets = getPortalAccessOverview().parents.filter(
    (item) => item.portalStatus !== "Activated",
  );

  const results = [];
  for (const target of targets) {
    const email = `portal+parent-${target.admissionNo.toLowerCase()}@successacademy.edu.ng`;
    const result = await sendPortalInvitation({
      targetType: "parent",
      targetId: target.id,
      email,
    });
    results.push({
      targetId: target.id,
      name: target.fullName,
      email,
      ...result,
    });
  }

  return {
    processed: results.length,
    results,
  };
}

function formatStatus(status) {
  return status
    .split("_")
    .map((part) => capitalizeStatus(part))
    .join(" ");
}

function capitalizeStatus(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function listEntities(name) {
  return store.list(name);
}

function getEntity(name, id) {
  const entity = store.findById(name, id);
  if (!entity) {
    throw notFound(`${name} record not found.`);
  }
  return entity;
}

function createEntity(name, payload) {
  return store.create(name, payload);
}

function updateEntity(name, id, payload) {
  const updated = store.update(name, id, payload);
  if (!updated) {
    throw notFound(`${name} record not found.`);
  }
  return updated;
}

function removeEntity(name, id) {
  const removed = store.remove(name, id);
  if (!removed) {
    throw notFound(`${name} record not found.`);
  }
  return removed;
}

function onboardStudentEnrollment(studentId, overrides = {}) {
  const student = getEntity("students", studentId);
  const currentTerm = getCurrentTerm();
  const classId = overrides.classId || student.classId;
  const classInfo = getEntity("classes", classId);

  const updatedStudent = updateEntity("students", student.id, {
    classId: classInfo.id,
    status: "active",
  });

  const existingFees = store.filter(
    "fees",
    (item) => item.studentId === student.id && item.termId === currentTerm.id,
  );

  const createdFees =
    existingFees.length > 0
      ? []
      : buildDefaultFeePlan(classInfo.section).map((fee) =>
          createEntity("fees", {
            studentId: student.id,
            termId: currentTerm.id,
            item: fee.item,
            amountDue: fee.amountDue,
            amountPaid: 0,
            provider: "manual",
            status: "unpaid",
          }),
        );

  return {
    student: updatedStudent,
    class: classInfo,
    createdFees,
    existingFeesCount: existingFees.length,
  };
}

function completeBulkStudentOnboarding() {
  const targets = getPortalPublishingChecklist().rows.filter((item) =>
    item.pendingSteps.includes("Complete onboarding") ||
    item.pendingSteps.includes("Provision fee plan"),
  );

  const results = targets.map((target) =>
    onboardStudentEnrollment(target.studentId, {}),
  );

  return {
    processed: results.length,
    results,
  };
}

function enrollAdmission(admissionId) {
  const admission = getEntity("admissions", admissionId);

  if (admission.enrolledStudentId || admission.enrolledParentId) {
    throw badRequest("This admission has already been enrolled.");
  }

  if (!["offer_sent", "interview_scheduled", "under_review"].includes(admission.status)) {
    throw badRequest("Only reviewed admissions can be converted into enrolled records.");
  }

  const classId = resolveClassIdForProgramme(admission.programme);
  const studentName = splitPersonName(admission.childName);
  const parentName = splitPersonName(admission.parentName);

  const existingStudent = store.findOne(
    "students",
    (item) =>
      item.firstName.toLowerCase() === studentName.firstName.toLowerCase() &&
      item.lastName.toLowerCase() === studentName.lastName.toLowerCase() &&
      item.classId === classId,
  );

  if (existingStudent) {
    throw badRequest("A matching student record already exists for this applicant.");
  }

  const existingParent = store.findOne(
    "parents",
    (item) => String(item.phone).trim() === String(admission.phone).trim(),
  );

  if (existingParent) {
    throw badRequest("A parent record with this phone number already exists.");
  }

  const student = createEntity("students", {
    userId: null,
    admissionNo: createAdmissionNumber(),
    firstName: studentName.firstName,
    lastName: studentName.lastName,
    classId,
    parentIds: [],
    accessPin: createResetCode(),
    status: "pending",
  });

  const parent = createEntity("parents", {
    userId: null,
    firstName: parentName.firstName,
    lastName: parentName.lastName,
    studentIds: [student.id],
    phone: admission.phone,
  });

  const linkedStudent = updateEntity("students", student.id, {
    parentIds: [parent.id],
  });

  const enrolledAt = new Date().toISOString();
  const updatedAdmission = updateEntity("admissions", admission.id, {
    status: "offer_sent",
    enrolledStudentId: linkedStudent.id,
    enrolledParentId: parent.id,
    enrolledAt,
  });

  return {
    admission: updatedAdmission,
    student: linkedStudent,
    parent,
  };
}

function buildDefaultFeePlan(section) {
  if (section === "nursery") {
    return [
      { item: "Tuition - Current Term", amountDue: 180000 },
      { item: "Learning Materials", amountDue: 35000 },
    ];
  }

  if (section === "primary") {
    return [
      { item: "Tuition - Current Term", amountDue: 220000 },
      { item: "Learning Materials", amountDue: 40000 },
    ];
  }

  return [
    { item: "Tuition - Current Term", amountDue: 280000 },
    { item: "Laboratory and Activities", amountDue: 50000 },
  ];
}

function resolveClassIdForProgramme(programme) {
  const normalized = String(programme || "").trim().toLowerCase();
  const classes = store.list("classes");

  const directMatch = classes.find((item) => item.name.trim().toLowerCase() === normalized);
  if (directMatch) {
    return directMatch.id;
  }

  const sectionMatch =
    normalized.includes("nursery")
      ? classes.find((item) => item.section === "nursery")
      : normalized.includes("primary")
        ? classes.find((item) => item.section === "primary")
        : normalized.includes("jss") || normalized.includes("ss") || normalized.includes("secondary")
          ? classes.find((item) => item.section === "secondary")
          : null;

  if (sectionMatch) {
    return sectionMatch.id;
  }

  throw badRequest("Unable to match this admission programme to an existing class.");
}

function splitPersonName(fullName) {
  const cleaned = String(fullName || "").replace(/^(mr|mrs|miss|ms|dr)\.?\s+/i, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "Unknown", lastName: "Applicant" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1),
  };
}

function createAdmissionNumber() {
  const currentYear = new Date().getUTCFullYear();
  const existingNumbers = store
    .list("students")
    .map((item) => item.admissionNo)
    .filter((value) => value.startsWith(`SA-${currentYear}-`))
    .map((value) => Number(value.split("-").at(-1)))
    .filter((value) => !Number.isNaN(value));

  const nextNumber = (existingNumbers.length ? Math.max(...existingNumbers) : 0) + 1;
  return `SA-${currentYear}-${String(nextNumber).padStart(3, "0")}`;
}

function submitAdmissionApplication(payload) {
  return createEntity("admissions", {
    ...payload,
    age: Number(payload.age),
    status: "new",
    createdAt: new Date().toISOString(),
    enrolledStudentId: null,
    enrolledParentId: null,
    enrolledAt: null,
  });
}

function submitContactInquiry(payload) {
  return createEntity("contactInquiries", {
    ...payload,
    status: "new",
    createdAt: new Date().toISOString(),
  });
}

function checkResultByAccess({ studentId, accessPin }) {
  const student = store.findOne(
    "students",
    (item) => item.admissionNo === studentId || item.id === studentId,
  );

  if (!student || student.accessPin !== accessPin) {
    throw badRequest("Invalid student ID or access PIN.");
  }

  const reportCard = buildReportCard(student.id);
  const results = getStudentResults(student.id);
  const average =
    results.length > 0
      ? `${Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length)}%`
      : "N/A";

  return {
    candidate: reportCard.studentName,
    className: reportCard.className,
    term: reportCard.term,
    average,
    results,
  };
}

function initializePayment({ feeId, provider }) {
  const fee = getEntity("fees", feeId);
  const outstanding = Math.max(fee.amountDue - fee.amountPaid, 0);

  const transaction = createEntity("paymentTransactions", {
    feeId,
    provider,
    reference: `${provider.toUpperCase()}-${Date.now()}`,
    amount: outstanding,
    status: "initialized",
    checkoutUrl:
      provider === "stripe"
        ? "https://checkout.stripe.com/pay/success-academy-demo"
        : "https://paystack.com/pay/success-academy-demo",
  });

  return {
    provider,
    publicKey:
      provider === "stripe" ? env.STRIPE_PUBLIC_KEY : env.PAYSTACK_PUBLIC_KEY,
    amount: outstanding,
    reference: transaction.reference,
    checkoutUrl: transaction.checkoutUrl,
  };
}

function generateReportCard(studentId) {
  const reportCard = buildReportCard(studentId);
  return {
    ...reportCard,
    generated: true,
    exportFormat: "pdf-ready-structure",
    downloadUrl: reportCard.downloadUrl,
  };
}

function exportAdminDataset(dataset) {
  const supportedDatasets = {
    students: () =>
      getPortalAccessOverview().students.map((item) => ({
        student_id: item.id,
        full_name: item.fullName,
        admission_no: item.admissionNo,
        class_name: item.className,
        status: item.status,
        portal_status: item.portalStatus,
        portal_email: item.email,
        latest_invite_at: item.latestInviteAt,
        access_pin: item.accessPin,
        parent_count: item.parentCount,
      })),
    admissions: () =>
      listEntities("admissions").map((item) => ({
        admission_id: item.id,
        child_name: item.childName,
        programme: item.programme,
        parent_name: item.parentName,
        email: item.email,
        phone: item.phone,
        status: item.status,
        enrolled_student_id: item.enrolledStudentId || "",
        enrolled_parent_id: item.enrolledParentId || "",
        enrolled_at: item.enrolledAt || "",
      })),
    fees: () =>
      listEntities("fees").map((item) => ({
        fee_id: item.id,
        student_id: item.studentId,
        term_id: item.termId,
        item: item.item,
        amount_due: item.amountDue,
        amount_paid: item.amountPaid,
        balance: Math.max(item.amountDue - item.amountPaid, 0),
        provider: item.provider,
        status: item.status,
      })),
    results: () =>
      listEntities("results").map((item) => ({
        result_id: item.id,
        student_id: item.studentId,
        subject_id: item.subjectId,
        term_id: item.termId,
        score: item.score,
        grade: item.grade,
        teacher_id: item.teacherId,
        published_at: item.publishedAt || "",
      })),
    "portal-access": () => {
      const overview = getPortalAccessOverview();
      return [
        ...overview.students.map((item) => ({
          record_type: "student",
          id: item.id,
          name: item.fullName,
          admission_no: item.admissionNo,
          class_name: item.className,
          portal_status: item.portalStatus,
          email: item.email,
          latest_invite_at: item.latestInviteAt,
        })),
        ...overview.parents.map((item) => ({
          record_type: "parent",
          id: item.id,
          name: item.fullName,
          admission_no: item.admissionNo,
          class_name: item.linkedStudent,
          portal_status: item.portalStatus,
          email: item.email,
          latest_invite_at: item.latestInviteAt,
        })),
      ];
    },
    "portal-publishing": () =>
      getPortalPublishingChecklist().rows.map((item) => ({
        student_id: item.studentId,
        student_name: item.studentName,
        admission_no: item.admissionNo,
        class_name: item.className,
        status: item.status,
        progress: item.progressLabel,
        pending_steps: item.pendingSteps.join(" | "),
      })),
    "notification-logs": () =>
      listNotificationLogs().map((item) => ({
        notification_id: item.id,
        role: item.role,
        channel: item.channel,
        delivery: item.delivery,
        recipient_email: item.recipientEmail,
        subject: item.subject,
        event_type: item.eventType,
        detail: item.detail,
        created_at: item.createdAt,
      })),
    "audit-logs": () =>
      listAuditLogs().map((item) => ({
        audit_id: item.id,
        actor_name: item.actorName,
        action: item.action,
        resource_type: item.resourceType,
        resource_id: item.resourceId,
        detail: item.detail,
        created_at: item.createdAt,
      })),
  };

  const buildRows = supportedDatasets[dataset];

  if (!buildRows) {
    throw badRequest("Unsupported export dataset.");
  }

  const rows = buildRows();
  const csv = toCsv(rows);

  return {
    filename: `success-academy-${dataset}-${new Date().toISOString().slice(0, 10)}.csv`,
    contentType: "text/csv; charset=utf-8",
    csv,
  };
}

function toCsv(rows) {
  if (!rows.length) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvCell(row[header])).join(","),
    ),
  ];

  return lines.join("\n");
}

function escapeCsvCell(value) {
  const stringValue = value === null || value === undefined ? "" : String(value);
  const escaped = stringValue.replace(/"/g, '""');

  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }

  return escaped;
}

function createAuditLog({
  actorUserId,
  actorName,
  action,
  resourceType,
  resourceId,
  detail,
}) {
  return createEntity("auditLogs", {
    actorUserId,
    actorName,
    action,
    resourceType,
    resourceId,
    detail,
    createdAt: new Date().toISOString(),
  });
}

function listAuditLogs({ q, action, resourceType, limit = 30 } = {}) {
  const query = String(q || "").trim().toLowerCase();

  return store
    .list("auditLogs")
    .filter((item) => (action ? item.action === action : true))
    .filter((item) => (resourceType ? item.resourceType === resourceType : true))
    .filter((item) => {
      if (!query) {
        return true;
      }

      return [
        item.actorName,
        item.action,
        item.resourceType,
        item.resourceId,
        item.detail,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

module.exports = {
  getCurrentTerm,
  buildStudentDashboard,
  buildStudentDashboardFromStudent,
  buildParentDashboard,
  buildTeacherDashboard,
  buildAdminDashboard,
  getPortalAccessOverview,
  getPortalPublishingChecklist,
  sendPortalInvitation,
  sendBulkPortalInvitations,
  getStudentResults,
  getStudentAttendanceSummary,
  getStudentAssignments,
  getClassTimetable,
  getAnnouncementsForAudience,
  buildReportCard,
  getFeesForStudent,
  getAssignmentsForTeacher,
  buildResultQueue,
  getStudentByUserId,
  getParentByUserId,
  getTeacherByUserId,
  listEntities,
  getEntity,
  createEntity,
  updateEntity,
  removeEntity,
  onboardStudentEnrollment,
  completeBulkStudentOnboarding,
  enrollAdmission,
  submitAdmissionApplication,
  submitContactInquiry,
  checkResultByAccess,
  initializePayment,
  generateReportCard,
  exportAdminDataset,
  createAuditLog,
  listAuditLogs,
  listNotificationLogs,
};
