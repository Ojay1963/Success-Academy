const { env } = require("../config/env");

function getEmailMode() {
  if (env.EMAIL_PROVIDER === "resend" && env.RESEND_API_KEY && env.EMAIL_FROM) {
    return "resend";
  }

  if (env.EMAIL_PROVIDER === "sendgrid" && env.SENDGRID_API_KEY && env.EMAIL_FROM) {
    return "sendgrid";
  }

  return "demo";
}

function buildResetUrl({ role, email, code }) {
  const params = new URLSearchParams({
    email,
    code,
  });

  return `${env.APP_BASE_URL}/portal/reset/${role}?${params.toString()}`;
}

function buildActivationUrl({ role, admissionNo, email }) {
  const params = new URLSearchParams({
    admissionNo,
  });

  if (email) {
    params.set("email", email);
  }

  return `${env.APP_BASE_URL}/portal/activate/${role}?${params.toString()}`;
}

async function sendPasswordResetEmail({ role, email, name, code, expiresInMinutes }) {
  const resetUrl = buildResetUrl({ role, email, code });
  const subject = `Success Academy ${capitalize(role)} Portal Password Reset`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f2230;">
      <h2>Success Academy Portal Password Reset</h2>
      <p>Hello ${escapeHtml(name || "Portal User")},</p>
      <p>We received a request to reset your ${role} portal password.</p>
      <p>Your reset code is <strong>${code}</strong>.</p>
      <p>This code expires in ${expiresInMinutes} minutes.</p>
      <p>
        You can also open the reset page directly:
        <a href="${resetUrl}">${resetUrl}</a>
      </p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `.trim();

  const text = [
    "Success Academy Portal Password Reset",
    `Hello ${name || "Portal User"},`,
    `Your reset code is ${code}.`,
    `This code expires in ${expiresInMinutes} minutes.`,
    `Reset link: ${resetUrl}`,
  ].join("\n");

  const mode = getEmailMode();

  if (mode === "demo") {
    return {
      delivery: "demo",
      resetUrl,
    };
  }

  if (mode === "resend") {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [email],
        subject,
        html,
        text,
      }),
    }).then(ensureEmailResponse);

    return {
      delivery: "email",
      resetUrl,
    };
  }

  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { email: env.EMAIL_FROM },
      personalizations: [{ to: [{ email }] }],
      subject,
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html },
      ],
    }),
  }).then(ensureEmailResponse);

  return {
    delivery: "email",
    resetUrl,
  };
}

async function sendPortalInvitationEmail({
  role,
  email,
  recipientName,
  admissionNo,
  activationCode,
}) {
  const activationUrl = buildActivationUrl({ role, admissionNo, email });
  const subject = `Success Academy ${capitalize(role)} Portal Invitation`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f2230;">
      <h2>Success Academy Portal Invitation</h2>
      <p>Hello ${escapeHtml(recipientName || "Portal User")},</p>
      <p>Your ${role} portal access is ready to activate.</p>
      <p>Admission number: <strong>${admissionNo}</strong></p>
      <p>Invitation code: <strong>${activationCode}</strong></p>
      <p>
        Open your activation page here:
        <a href="${activationUrl}">${activationUrl}</a>
      </p>
      <p>If you need help, contact Success Academy support.</p>
    </div>
  `.trim();
  const text = [
    "Success Academy Portal Invitation",
    `Hello ${recipientName || "Portal User"},`,
    `Your ${role} portal access is ready to activate.`,
    `Admission number: ${admissionNo}`,
    `Invitation code: ${activationCode}`,
    `Activation link: ${activationUrl}`,
  ].join("\n");

  const mode = getEmailMode();

  if (mode === "demo") {
    return {
      delivery: "demo",
      activationUrl,
    };
  }

  if (mode === "resend") {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [email],
        subject,
        html,
        text,
      }),
    }).then(ensureEmailResponse);

    return {
      delivery: "email",
      activationUrl,
    };
  }

  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { email: env.EMAIL_FROM },
      personalizations: [{ to: [{ email }] }],
      subject,
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html },
      ],
    }),
  }).then(ensureEmailResponse);

  return {
    delivery: "email",
    activationUrl,
  };
}

async function ensureEmailResponse(response) {
  if (response.ok) {
    return;
  }

  const payload = await response.text();
  throw new Error(`Email provider request failed: ${response.status} ${payload}`);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

module.exports = {
  buildActivationUrl,
  buildResetUrl,
  getEmailMode,
  sendPortalInvitationEmail,
  sendPasswordResetEmail,
};
