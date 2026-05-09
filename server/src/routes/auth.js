const express = require("express");
const {
  activateParentAccount,
  activateStudentAccount,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
} = require("../services/auth");
const { unauthorized, badRequest } = require("../utils/httpError");
const { requireFields, ensureOneOf, ensureEmail } = require("../utils/validators");

const router = express.Router();

router.post("/student-activate", (req, res, next) => {
  try {
    requireFields(req.body, ["admissionNo", "accessPin", "lastName", "email", "password"]);
    ensureEmail(req.body.email);

    if (String(req.body.password).trim().length < 8) {
      throw badRequest("Password must be at least 8 characters long.");
    }

    const session = activateStudentAccount(req.body);
    res.status(201).json({
      ok: true,
      message: "Student portal account activated successfully.",
      data: session,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/parent-activate", (req, res, next) => {
  try {
    requireFields(req.body, ["admissionNo", "phone", "lastName", "email", "password"]);
    ensureEmail(req.body.email);

    if (String(req.body.password).trim().length < 8) {
      throw badRequest("Password must be at least 8 characters long.");
    }

    const session = activateParentAccount(req.body);
    res.status(201).json({
      ok: true,
      message: "Parent portal account activated successfully.",
      data: session,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  try {
    requireFields(req.body, ["role", "email", "password"]);
    ensureOneOf(req.body.role, ["student", "parent", "teacher", "admin"], "role");
    ensureEmail(req.body.email);

    const session = login(req.body);
    res.json({
      ok: true,
      message: "Login successful.",
      data: session,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/password-reset/request", async (req, res, next) => {
  try {
    requireFields(req.body, ["role", "email"]);
    ensureOneOf(req.body.role, ["student", "parent"], "role");
    ensureEmail(req.body.email);

    const data = await requestPasswordReset(req.body);
    res.json({
      ok: true,
      message: data.message,
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/password-reset/confirm", (req, res, next) => {
  try {
    requireFields(req.body, ["role", "email", "code", "password"]);
    ensureOneOf(req.body.role, ["student", "parent"], "role");
    ensureEmail(req.body.email);

    if (String(req.body.password).trim().length < 8) {
      throw badRequest("Password must be at least 8 characters long.");
    }

    const data = resetPassword(req.body);
    res.json({
      ok: true,
      message: data.message,
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", (req, res, next) => {
  try {
    if (!req.auth?.user) {
      throw unauthorized("Authentication token is required.");
    }
    res.json({
      ok: true,
      data: req.auth.user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res, next) => {
  try {
    if (!req.auth?.token) {
      throw unauthorized("Authentication token is required.");
    }
    logout(req.auth.token);
    res.json({
      ok: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { authRouter: router };
