const { env } = require("../config/env");
const { store } = require("../data/store");
const { sendPasswordResetEmail } = require("./email");
const { createNotificationLog } = require("./notifications");
const { unauthorized, forbidden, conflict, badRequest } = require("../utils/httpError");
const { createToken, createResetCode, hashPassword } = require("../utils/security");

function sanitizeUser(user) {
  return {
    id: user.id,
    role: user.role,
    email: user.email,
    name: user.displayName,
  };
}

function createSession(user) {
  const token = createToken();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + env.TOKEN_TTL_HOURS * 60 * 60 * 1000);

  store.create("sessions", {
    token,
    userId: user.id,
    role: user.role,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });

  return token;
}

function login({ role, email, password }) {
  const user = store.findOne(
    "users",
    (item) => item.role === role && item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user || user.passwordHash !== hashPassword(password)) {
    throw unauthorized("Invalid login credentials.");
  }

  const token = createSession(user);
  return { token, user: sanitizeUser(user) };
}

function activateStudentAccount({ admissionNo, accessPin, lastName, email, password }) {
  const normalizedAdmissionNo = admissionNo.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedLastName = lastName.trim().toLowerCase();

  const student = store.findOne(
    "students",
    (item) => item.admissionNo.toUpperCase() === normalizedAdmissionNo,
  );

  if (!student) {
    throw badRequest("No student record was found for that admission number.");
  }

  if (!["active", "pending"].includes(student.status)) {
    throw forbidden("This student account is not currently eligible for portal activation.");
  }

  if (student.userId) {
    throw conflict("This student portal account has already been activated. Please log in.");
  }

  if (student.accessPin !== accessPin.trim()) {
    throw unauthorized("The admission number or activation PIN is incorrect.");
  }

  if (student.lastName.trim().toLowerCase() !== normalizedLastName) {
    throw unauthorized("The surname does not match our admission record.");
  }

  const existingUser = store.findOne(
    "users",
    (item) => item.email.toLowerCase() === normalizedEmail,
  );

  if (existingUser) {
    throw conflict("That email address is already in use. Please use a different email.");
  }

  const user = store.create("users", {
    role: "student",
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    displayName: `${student.firstName} ${student.lastName}`,
    createdAt: new Date().toISOString(),
  });

  store.update("students", student.id, (current) => ({
    ...current,
    userId: user.id,
    status: "active",
  }));

  const token = createSession(user);
  return { token, user: sanitizeUser(user) };
}

function activateParentAccount({ admissionNo, phone, lastName, email, password }) {
  const normalizedAdmissionNo = admissionNo.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedLastName = lastName.trim().toLowerCase();
  const normalizedPhone = phone.replace(/\s+/g, "");

  const student = store.findOne(
    "students",
    (item) => item.admissionNo.toUpperCase() === normalizedAdmissionNo,
  );

  if (!student) {
    throw badRequest("No student record was found for that admission number.");
  }

  const parent = store.findOne(
    "parents",
    (item) =>
      item.studentIds.includes(student.id) || student.parentIds.includes(item.id),
  );

  if (!parent) {
    throw badRequest("No parent portal record was found for this admitted student.");
  }

  if (parent.userId) {
    throw conflict("This parent portal account has already been activated. Please log in.");
  }

  if (parent.lastName.trim().toLowerCase() !== normalizedLastName) {
    throw unauthorized("The surname does not match our parent record.");
  }

  if (String(parent.phone).replace(/\s+/g, "") !== normalizedPhone) {
    throw unauthorized("The phone number does not match our parent record.");
  }

  const existingUser = store.findOne(
    "users",
    (item) => item.email.toLowerCase() === normalizedEmail,
  );

  if (existingUser) {
    throw conflict("That email address is already in use. Please use a different email.");
  }

  const user = store.create("users", {
    role: "parent",
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    displayName: `${parent.firstName} ${parent.lastName}`,
    createdAt: new Date().toISOString(),
  });

  store.update("parents", parent.id, (current) => ({
    ...current,
    userId: user.id,
  }));

  const token = createSession(user);
  return { token, user: sanitizeUser(user) };
}

function getUserFromToken(token) {
  if (!token) {
    throw unauthorized("Missing authentication token.");
  }

  const session = store.findOne("sessions", (item) => item.token === token);

  if (!session) {
    throw unauthorized("Invalid authentication token.");
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    store.remove("sessions", session.id);
    throw unauthorized("Session expired. Please log in again.");
  }

  const user = store.findById("users", session.userId);

  if (!user) {
    throw unauthorized("User session is no longer valid.");
  }

  return sanitizeUser(user);
}

function logout(token) {
  const session = store.findOne("sessions", (item) => item.token === token);

  if (session) {
    store.remove("sessions", session.id);
  }
}

async function requestPasswordReset({ role, email }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = store.findOne(
    "users",
    (item) => item.role === role && item.email.toLowerCase() === normalizedEmail,
  );

  if (!user) {
    return {
      message:
        "If an account matches those details, a password reset code has been prepared.",
      delivery: env.NODE_ENV === "production" ? "email" : "demo",
      resetCode: null,
      resetUrl: null,
    };
  }

  store
    .filter("passwordResetTokens", (item) => item.userId === user.id && !item.usedAt)
    .forEach((item) => {
      store.update("passwordResetTokens", item.id, (current) => ({
        ...current,
        usedAt: new Date().toISOString(),
      }));
    });

  const createdAt = new Date();
  const expiresAt = new Date(
    createdAt.getTime() + env.PASSWORD_RESET_TTL_MINUTES * 60 * 1000,
  );
  const code = createResetCode();

  store.create("passwordResetTokens", {
    userId: user.id,
    role,
    email: normalizedEmail,
    code,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    usedAt: null,
  });

  const delivery = await sendPasswordResetEmail({
    role,
    email: normalizedEmail,
    name: user.displayName,
    code,
    expiresInMinutes: env.PASSWORD_RESET_TTL_MINUTES,
  });

  createNotificationLog({
    role,
    channel: delivery.delivery === "email" ? "email" : "demo",
    delivery: delivery.delivery,
    recipientEmail: normalizedEmail,
    subject: `Success Academy ${role} password reset`,
    eventType: "password_reset",
    detail:
      delivery.delivery === "email"
        ? "Password reset email sent."
        : "Password reset prepared in demo mode.",
  });

  return {
    message:
      delivery.delivery === "email"
        ? "If an account matches those details, a password reset email has been sent."
        : "Reset code generated successfully for local testing.",
    delivery: delivery.delivery,
    resetCode: delivery.delivery === "email" ? null : code,
    resetUrl: delivery.delivery === "email" ? null : delivery.resetUrl,
    expiresInMinutes: env.PASSWORD_RESET_TTL_MINUTES,
  };
}

function resetPassword({ role, email, code, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = store.findOne(
    "users",
    (item) => item.role === role && item.email.toLowerCase() === normalizedEmail,
  );

  if (!user) {
    throw badRequest("Invalid reset code or email address.");
  }

  const resetToken = store.findOne(
    "passwordResetTokens",
    (item) =>
      item.userId === user.id &&
      item.role === role &&
      item.email === normalizedEmail &&
      item.code === code.trim() &&
      !item.usedAt,
  );

  if (!resetToken) {
    throw badRequest("Invalid reset code or email address.");
  }

  if (new Date(resetToken.expiresAt).getTime() < Date.now()) {
    store.update("passwordResetTokens", resetToken.id, (current) => ({
      ...current,
      usedAt: new Date().toISOString(),
    }));
    throw badRequest("This reset code has expired. Please request a new one.");
  }

  store.update("users", user.id, (current) => ({
    ...current,
    passwordHash: hashPassword(password),
  }));

  store.update("passwordResetTokens", resetToken.id, (current) => ({
    ...current,
    usedAt: new Date().toISOString(),
  }));

  store
    .filter("sessions", (item) => item.userId === user.id)
    .forEach((session) => {
      store.remove("sessions", session.id);
    });

  return {
    message: "Password reset successful. Please log in with your new password.",
  };
}

function requireRole(user, roles) {
  if (!roles.includes(user.role)) {
    throw forbidden("You do not have permission to access this resource.");
  }
}

module.exports = {
  activateStudentAccount,
  activateParentAccount,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
  getUserFromToken,
  requireRole,
};
