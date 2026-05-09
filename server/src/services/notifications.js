const { store } = require("../data/store");

function createNotificationLog({
  role,
  channel,
  delivery,
  recipientEmail,
  subject,
  eventType,
  detail,
}) {
  return store.create("notificationLogs", {
    role,
    channel,
    delivery,
    recipientEmail,
    subject,
    eventType,
    detail,
    createdAt: new Date().toISOString(),
  });
}

function listNotificationLogs({ role, eventType, q, limit = 30 } = {}) {
  const query = String(q || "").trim().toLowerCase();

  return store
    .list("notificationLogs")
    .filter((item) => (role ? item.role === role : true))
    .filter((item) => (eventType ? item.eventType === eventType : true))
    .filter((item) => {
      if (!query) {
        return true;
      }

      return [
        item.recipientEmail,
        item.subject,
        item.detail,
        item.role,
        item.eventType,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

module.exports = {
  createNotificationLog,
  listNotificationLogs,
};
