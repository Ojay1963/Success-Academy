const express = require("express");
const {
  getCurrentTerm,
  submitAdmissionApplication,
  submitContactInquiry,
  checkResultByAccess,
} = require("../services/portal");
const {
  requireFields,
  ensureEmail,
  ensurePositiveNumber,
  ensureOneOf,
  sanitizeString,
} = require("../utils/validators");

const router = express.Router();

function createAdmissionPayload(body) {
  requireFields(body, ["childName", "age", "programme", "parentName", "email", "phone"]);
  ensurePositiveNumber(body.age, "age");
  ensureEmail(body.email);

  return {
    childName: sanitizeString(body.childName),
    age: body.age,
    programme: sanitizeString(body.programme),
    parentName: sanitizeString(body.parentName),
    email: sanitizeString(body.email),
    phone: sanitizeString(body.phone),
    notes: sanitizeString(body.notes || ""),
  };
}

function createInquiryPayload(body) {
  requireFields(body, ["name", "email", "subject", "message"]);
  ensureEmail(body.email);

  return {
    name: sanitizeString(body.name),
    email: sanitizeString(body.email),
    subject: sanitizeString(body.subject),
    message: sanitizeString(body.message),
  };
}

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "success-academy-server",
    timestamp: new Date().toISOString(),
  });
});

router.get("/public/calendar", (_req, res, next) => {
  try {
    const currentTerm = getCurrentTerm();
    res.json({
      ok: true,
      data: {
        currentTerm,
        events: [
          { date: "May 6, 2026", event: "Mid-term progress review released" },
          { date: "May 12, 2026", event: "Mid-term assessments begin" },
          { date: "May 21, 2026", event: "Parents open classroom afternoon" },
          { date: "June 3, 2026", event: "Inter-house sports preparation week" },
          { date: "June 26, 2026", event: "End of term assembly and report distribution" },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/admissions/applications", (req, res, next) => {
  try {
    const application = submitAdmissionApplication(createAdmissionPayload(req.body));

    res.status(201).json({
      ok: true,
      message: "Application received. Our admissions team will contact you shortly.",
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/contact/inquiries", (req, res, next) => {
  try {
    const inquiry = submitContactInquiry(createInquiryPayload(req.body));

    res.status(201).json({
      ok: true,
      message: "Message received. A member of our team will respond soon.",
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/results/check", (req, res, next) => {
  try {
    requireFields(req.body, ["studentId", "accessPin"]);
    const result = checkResultByAccess({
      studentId: sanitizeString(req.body.studentId),
      accessPin: sanitizeString(req.body.accessPin),
    });
    res.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/payments/providers", (_req, res) => {
  res.json({
    ok: true,
    data: ["paystack", "stripe"],
  });
});

router.post("/applications", (req, res, next) => {
  try {
    const application = submitAdmissionApplication(createAdmissionPayload(req.body));
    res.status(201).json({
      ok: true,
      message: "Application received. Our admissions team will contact you shortly.",
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/inquiries", (req, res, next) => {
  try {
    const inquiry = submitContactInquiry(createInquiryPayload(req.body));
    res.status(201).json({
      ok: true,
      message: "Message received. A member of our team will respond soon.",
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { publicRouter: router };
