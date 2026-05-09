const express = require("express");
const {
  listEntities,
  getEntity,
  createEntity,
  updateEntity,
  removeEntity,
  getPortalAccessOverview,
  getPortalPublishingChecklist,
  sendPortalInvitation,
  sendBulkPortalInvitations,
  onboardStudentEnrollment,
  completeBulkStudentOnboarding,
  enrollAdmission,
  exportAdminDataset,
  createAuditLog,
  listAuditLogs,
  listNotificationLogs,
} = require("../services/portal");
const { ensureEmail, requireFields, ensurePositiveNumber, sanitizeString } = require("../utils/validators");

const router = express.Router();

function createCrudHandlers(resourceName, validators = {}) {
  router.get(`/${resourceName}`, (_req, res) => {
    res.json({ ok: true, data: listEntities(resourceName) });
  });

  router.post(`/${resourceName}`, (req, res, next) => {
    try {
      if (validators.create) {
        validators.create(req.body);
      }
      const created = createEntity(resourceName, req.body);
      res.status(201).json({ ok: true, message: `${resourceName} created successfully.`, data: created });
    } catch (error) {
      next(error);
    }
  });

  router.get(`/${resourceName}/:id`, (req, res, next) => {
    try {
      res.json({ ok: true, data: getEntity(resourceName, req.params.id) });
    } catch (error) {
      next(error);
    }
  });

  router.patch(`/${resourceName}/:id`, (req, res, next) => {
    try {
      if (validators.update) {
        validators.update(req.body);
      }
      const updated = updateEntity(resourceName, req.params.id, req.body);
      res.json({ ok: true, message: `${resourceName} updated successfully.`, data: updated });
    } catch (error) {
      next(error);
    }
  });

  router.delete(`/${resourceName}/:id`, (req, res, next) => {
    try {
      const removed = removeEntity(resourceName, req.params.id);
      res.json({ ok: true, message: `${resourceName} deleted successfully.`, data: removed });
    } catch (error) {
      next(error);
    }
  });
}

createCrudHandlers("students", {
  create(payload) {
    requireFields(payload, ["firstName", "lastName", "admissionNo", "classId"]);
  },
});

createCrudHandlers("teachers", {
  create(payload) {
    requireFields(payload, ["firstName", "lastName", "department"]);
  },
});

createCrudHandlers("classes", {
  create(payload) {
    requireFields(payload, ["name", "section"]);
  },
});

createCrudHandlers("subjects", {
  create(payload) {
    requireFields(payload, ["code", "name", "section"]);
  },
});

createCrudHandlers("terms", {
  create(payload) {
    requireFields(payload, ["name", "sessionName", "startDate", "endDate"]);
  },
});

createCrudHandlers("admissions", {
  update(payload) {
    if (payload.email) {
      ensureEmail(payload.email);
    }
  },
});

createCrudHandlers("fees", {
  create(payload) {
    requireFields(payload, ["studentId", "termId", "item", "amountDue"]);
    ensurePositiveNumber(payload.amountDue, "amountDue");
  },
  update(payload) {
    if (payload.amountDue !== undefined) {
      ensurePositiveNumber(payload.amountDue, "amountDue");
    }
    if (payload.amountPaid !== undefined) {
      ensurePositiveNumber(payload.amountPaid, "amountPaid");
    }
  },
});

createCrudHandlers("results", {
  create(payload) {
    requireFields(payload, ["studentId", "subjectId", "termId", "score"]);
    ensurePositiveNumber(payload.score, "score");
  },
});

createCrudHandlers("announcements", {
  create(payload) {
    requireFields(payload, ["title", "message", "audience", "authorUserId"]);
  },
});

router.get("/fees/overview", (_req, res) => {
  const data = listEntities("fees").map((fee) => ({
    ...fee,
    amountDueLabel: `₦${Number(fee.amountDue).toLocaleString()}`,
    amountPaidLabel: `₦${Number(fee.amountPaid).toLocaleString()}`,
  }));
  res.json({ ok: true, data });
});

router.get("/applications", (_req, res) => {
  res.json({ ok: true, data: listEntities("admissions") });
});

router.get("/management-summary", (_req, res) => {
  res.json({
    ok: true,
    data: {
      students: listEntities("students").length,
      teachers: listEntities("teachers").length,
      classes: listEntities("classes").length,
      subjects: listEntities("subjects").length,
    },
  });
});

router.get("/portal-access", (_req, res) => {
  res.json({
    ok: true,
    data: getPortalAccessOverview(),
  });
});

router.get("/portal-publishing", (_req, res) => {
  res.json({
    ok: true,
    data: getPortalPublishingChecklist(),
  });
});

router.get("/audit-logs", (req, res) => {
  const limit = Number(req.query.limit || 30);
  res.json({
    ok: true,
    data: listAuditLogs({
      limit,
      q: req.query.q,
      action: req.query.action,
      resourceType: req.query.resourceType,
    }),
  });
});

router.get("/notification-logs", (req, res) => {
  const limit = Number(req.query.limit || 30);
  const role = typeof req.query.role === "string" ? req.query.role : undefined;
  res.json({
    ok: true,
    data: listNotificationLogs({
      role,
      limit,
      q: req.query.q,
      eventType: req.query.eventType,
    }),
  });
});

router.get("/exports/:dataset", (req, res, next) => {
  try {
    const exportFile = exportAdminDataset(req.params.dataset);
    writeAudit(req, {
      action: "export_dataset",
      resourceType: "export",
      resourceId: req.params.dataset,
      detail: `Exported admin dataset: ${req.params.dataset}`,
    });
    res.setHeader("Content-Type", exportFile.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${exportFile.filename}"`);
    res.status(200).send(exportFile.csv);
  } catch (error) {
    next(error);
  }
});

router.post("/portal-access/invite", async (req, res, next) => {
  try {
    requireFields(req.body, ["targetType", "targetId", "email"]);
    ensureEmail(req.body.email);

    const data = await sendPortalInvitation(req.body);
    writeAudit(req, {
      action: "send_portal_invite",
      resourceType: req.body.targetType,
      resourceId: req.body.targetId,
      detail: `Sent portal invite to ${req.body.email}`,
    });
    res.status(201).json({
      ok: true,
      message: "Portal invitation prepared successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/portal-access/invite/bulk", async (req, res, next) => {
  try {
    requireFields(req.body, ["targetType"]);

    const data = await sendBulkPortalInvitations(req.body.targetType);
    writeAudit(req, {
      action: "send_bulk_portal_invites",
      resourceType: req.body.targetType,
      resourceId: "bulk",
      detail: `Sent ${data.processed} bulk ${req.body.targetType} portal invites`,
    });
    res.status(201).json({
      ok: true,
      message: "Bulk portal invitations prepared successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/admissions/:id/enroll", (req, res, next) => {
  try {
    const data = enrollAdmission(req.params.id);
    writeAudit(req, {
      action: "enroll_admission",
      resourceType: "admission",
      resourceId: req.params.id,
      detail: `Converted admission to student ${data.student.id} and parent ${data.parent.id}`,
    });
    res.status(201).json({
      ok: true,
      message: "Admission converted into enrolled student and parent records.",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/students/:id/onboard", (req, res, next) => {
  try {
    const data = onboardStudentEnrollment(req.params.id, req.body || {});
    writeAudit(req, {
      action: "onboard_student",
      resourceType: "student",
      resourceId: req.params.id,
      detail: `Completed onboarding with ${data.createdFees.length} created fee items`,
    });
    res.status(201).json({
      ok: true,
      message: "Student onboarding setup completed successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/students/onboard/bulk", (_req, res, next) => {
  try {
    const data = completeBulkStudentOnboarding();
    writeAudit(_req, {
      action: "bulk_onboard_students",
      resourceType: "student",
      resourceId: "bulk",
      detail: `Completed onboarding for ${data.processed} students`,
    });
    res.status(201).json({
      ok: true,
      message: "Bulk student onboarding completed successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/seed/reset", (_req, res) => {
  require("../data/store").store.reset();
  writeAudit(_req, {
    action: "reset_seed_data",
    resourceType: "system",
    resourceId: "seed",
    detail: "Reset in-memory seed data",
  });
  res.json({
    ok: true,
    message: "Seed data reset successfully.",
  });
});

router.patch("/announcements/:id/publish", (req, res, next) => {
  try {
    const updated = updateEntity("announcements", req.params.id, {
      message: sanitizeString(req.body.message || ""),
    });
    writeAudit(req, {
      action: "update_announcement",
      resourceType: "announcement",
      resourceId: req.params.id,
      detail: "Updated announcement content",
    });
    res.json({
      ok: true,
      message: "Announcement updated successfully.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

function writeAudit(req, { action, resourceType, resourceId, detail }) {
  const actor = req.auth?.user;
  if (!actor) {
    return;
  }

  createAuditLog({
    actorUserId: actor.id || "unknown",
    actorName: actor.name || actor.email || "Admin",
    action,
    resourceType,
    resourceId,
    detail,
  });
}

module.exports = { adminRouter: router };
