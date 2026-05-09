const { hashPassword } = require("../utils/security");

const now = "2026-04-29T08:00:00.000Z";
const demoPasswordHash = hashPassword("password123");

const seedData = {
  users: [
    { id: "user-admin-1", role: "admin", email: "admin@successacademy.edu.ng", passwordHash: demoPasswordHash, displayName: "Admin Demo User", createdAt: now },
    { id: "user-teacher-1", role: "teacher", email: "teacher@successacademy.edu.ng", passwordHash: demoPasswordHash, displayName: "Mrs. Johnson", createdAt: now },
    { id: "user-student-1", role: "student", email: "student@successacademy.edu.ng", passwordHash: demoPasswordHash, displayName: "Adaeze Okafor", createdAt: now },
    { id: "user-parent-1", role: "parent", email: "parent@successacademy.edu.ng", passwordHash: demoPasswordHash, displayName: "Mrs. Okafor", createdAt: now },
  ],
  students: [
    { id: "student-1", userId: "user-student-1", admissionNo: "SA-2026-001", firstName: "Adaeze", lastName: "Okafor", classId: "class-jss2-gold", parentIds: ["parent-1"], accessPin: "123456", status: "active" },
    { id: "student-2", userId: null, admissionNo: "SA-2026-002", firstName: "Tunde", lastName: "Adebayo", classId: "class-jss2-gold", parentIds: ["parent-2"], accessPin: "223344", status: "active" },
    { id: "student-3", userId: null, admissionNo: "SA-2026-003", firstName: "Amina", lastName: "Sani", classId: "class-primary5-blue", parentIds: [], accessPin: "334455", status: "pending" },
  ],
  parents: [
    { id: "parent-1", userId: "user-parent-1", firstName: "Chinelo", lastName: "Okafor", studentIds: ["student-1"], phone: "+2349063135544" },
    { id: "parent-2", userId: null, firstName: "Bisi", lastName: "Adebayo", studentIds: ["student-2"], phone: "+2348012345678" },
  ],
  teachers: [
    { id: "teacher-1", userId: "user-teacher-1", firstName: "Grace", lastName: "Johnson", department: "Languages", classIds: ["class-jss2-gold"], status: "active" },
    { id: "teacher-2", userId: null, firstName: "Bola", lastName: "Afolabi", department: "Mathematics", classIds: ["class-jss1-blue"], status: "active" },
    { id: "teacher-3", userId: null, firstName: "Ifeoma", lastName: "Oke", department: "Early Years", classIds: ["class-nursery2-sun"], status: "leave" },
  ],
  classes: [
    { id: "class-jss2-gold", name: "JSS 2 Gold", section: "secondary", classTeacherId: "teacher-1" },
    { id: "class-jss1-blue", name: "JSS 1 Blue", section: "secondary", classTeacherId: "teacher-2" },
    { id: "class-primary5-blue", name: "Primary 5 Blue", section: "primary", classTeacherId: "teacher-2" },
    { id: "class-nursery2-sun", name: "Nursery 2 Sun", section: "nursery", classTeacherId: "teacher-3" },
  ],
  subjects: [
    { id: "subject-eng", code: "ENG", name: "English Language", section: "secondary" },
    { id: "subject-mth", code: "MTH", name: "Mathematics", section: "secondary" },
    { id: "subject-sci", code: "SCI", name: "Basic Science", section: "secondary" },
    { id: "subject-cve", code: "CVE", name: "Civic Education", section: "secondary" },
  ],
  terms: [
    { id: "term-2026-2", name: "Second Term", sessionName: "2025/2026", startDate: "2026-01-12", endDate: "2026-04-30", isCurrent: true },
  ],
  timetableEntries: [
    { id: "tt-1", classId: "class-jss2-gold", day: "Monday", time: "8:00 AM", subjectId: "subject-eng", teacherId: "teacher-1" },
    { id: "tt-2", classId: "class-jss2-gold", day: "Monday", time: "9:00 AM", subjectId: "subject-mth", teacherId: "teacher-2" },
    { id: "tt-3", classId: "class-jss2-gold", day: "Monday", time: "10:00 AM", subjectId: "subject-sci", teacherId: "teacher-1" },
    { id: "tt-4", classId: "class-jss2-gold", day: "Monday", time: "11:30 AM", subjectId: "subject-cve", teacherId: "teacher-1" },
    { id: "tt-5", classId: "class-jss2-gold", day: "Monday", time: "1:00 PM", subjectId: "subject-eng", teacherId: "teacher-1" },
  ],
  results: [
    { id: "result-1", studentId: "student-1", subjectId: "subject-eng", termId: "term-2026-2", score: 84, grade: "A", teacherId: "teacher-1", publishedAt: now },
    { id: "result-2", studentId: "student-1", subjectId: "subject-mth", termId: "term-2026-2", score: 88, grade: "A", teacherId: "teacher-2", publishedAt: now },
    { id: "result-3", studentId: "student-1", subjectId: "subject-sci", termId: "term-2026-2", score: 79, grade: "B+", teacherId: "teacher-1", publishedAt: now },
    { id: "result-4", studentId: "student-1", subjectId: "subject-cve", termId: "term-2026-2", score: 76, grade: "B", teacherId: "teacher-1", publishedAt: now },
    { id: "result-5", studentId: "student-2", subjectId: "subject-eng", termId: "term-2026-2", score: 72, grade: "B", teacherId: "teacher-1", publishedAt: now },
    { id: "result-6", studentId: "student-2", subjectId: "subject-mth", termId: "term-2026-2", score: 81, grade: "A", teacherId: "teacher-2", publishedAt: now },
    { id: "result-7", studentId: "student-2", subjectId: "subject-sci", termId: "term-2026-2", score: 75, grade: "B", teacherId: "teacher-1", publishedAt: now },
  ],
  attendance: [
    { id: "attendance-1", studentId: "student-1", classId: "class-jss2-gold", date: "2026-04-21", status: "present", markedBy: "teacher-1" },
    { id: "attendance-2", studentId: "student-1", classId: "class-jss2-gold", date: "2026-04-22", status: "present", markedBy: "teacher-1" },
    { id: "attendance-3", studentId: "student-1", classId: "class-jss2-gold", date: "2026-04-23", status: "late", markedBy: "teacher-1" },
    { id: "attendance-4", studentId: "student-1", classId: "class-jss2-gold", date: "2026-04-24", status: "present", markedBy: "teacher-1" },
    { id: "attendance-5", studentId: "student-1", classId: "class-jss2-gold", date: "2026-04-25", status: "absent", markedBy: "teacher-1" },
    { id: "attendance-6", studentId: "student-2", classId: "class-jss2-gold", date: "2026-04-21", status: "present", markedBy: "teacher-1" },
    { id: "attendance-7", studentId: "student-2", classId: "class-jss2-gold", date: "2026-04-22", status: "present", markedBy: "teacher-1" },
    { id: "attendance-8", studentId: "student-2", classId: "class-jss2-gold", date: "2026-04-23", status: "present", markedBy: "teacher-1" },
    { id: "attendance-9", studentId: "student-2", classId: "class-jss2-gold", date: "2026-04-24", status: "late", markedBy: "teacher-1" },
  ],
  assignments: [
    { id: "assignment-1", title: "Read chapter 5 and answer review questions", description: "Complete the reading exercise in your English workbook.", classId: "class-jss2-gold", subjectId: "subject-eng", teacherId: "teacher-1", dueDate: "2026-05-03", createdAt: now },
    { id: "assignment-2", title: "Algebra worksheet set B", description: "Solve all questions and show your working clearly.", classId: "class-jss2-gold", subjectId: "subject-mth", teacherId: "teacher-2", dueDate: "2026-05-04", createdAt: now },
    { id: "assignment-3", title: "Prepare science fair topic summary", description: "Write a one-page summary of your science fair topic idea.", classId: "class-jss2-gold", subjectId: "subject-sci", teacherId: "teacher-1", dueDate: "2026-05-06", createdAt: now },
  ],
  fees: [
    { id: "fee-1", studentId: "student-1", termId: "term-2026-2", item: "Tuition - Second Term", amountDue: 280000, amountPaid: 160000, provider: "manual", status: "partially_paid" },
    { id: "fee-2", studentId: "student-1", termId: "term-2026-2", item: "Transport", amountDue: 65000, amountPaid: 65000, provider: "manual", status: "paid" },
    { id: "fee-3", studentId: "student-2", termId: "term-2026-2", item: "Tuition - Second Term", amountDue: 280000, amountPaid: 280000, provider: "manual", status: "paid" },
  ],
  paymentTransactions: [
    { id: "payment-1", feeId: "fee-1", provider: "paystack", reference: "PAYSTACK-DEMO-001", amount: 160000, status: "success", checkoutUrl: "https://paystack.com/pay/success-academy-demo" },
  ],
  announcements: [
    { id: "announcement-1", title: "Mid-term tests begin May 12", message: "Revise class notes and check timetable updates.", audience: "students", authorUserId: "user-admin-1", createdAt: now },
    { id: "announcement-2", title: "Parent forum next week", message: "The school leadership team will host a virtual parent forum on Thursday.", audience: "parents", authorUserId: "user-admin-1", createdAt: now },
    { id: "announcement-3", title: "Portal maintenance window", message: "Live integrations are not connected yet. Demo data is currently displayed.", audience: "all", authorUserId: "user-admin-1", createdAt: now },
  ],
  admissions: [
    { id: "admission-1", childName: "Chidera Nwosu", age: 9, programme: "Primary 4", parentName: "Mr. Nwosu", email: "nwosu@example.com", phone: "+2349000000001", notes: "Interested in mid-session transfer.", status: "interview_scheduled", createdAt: now, enrolledStudentId: null, enrolledParentId: null, enrolledAt: null },
    { id: "admission-2", childName: "Amina Sani", age: 11, programme: "JSS 1", parentName: "Mrs. Sani", email: "sani@example.com", phone: "+2349000000002", notes: "Returning family enquiry.", status: "offer_sent", createdAt: now, enrolledStudentId: null, enrolledParentId: null, enrolledAt: null },
  ],
  contactInquiries: [
    { id: "inquiry-1", name: "QA Parent", email: "parent@example.com", subject: "Visit Request", message: "Please share available tour dates.", status: "new", createdAt: now },
  ],
  reportCards: [
    { id: "report-card-1", studentId: "student-1", termId: "term-2026-2", teacherComment: "Adaeze is consistent, confident, and contributes well in class discussions.", principalComment: "Keep building this strong academic focus.", generatedAt: now, downloadUrl: null },
    { id: "report-card-2", studentId: "student-2", termId: "term-2026-2", teacherComment: "Tunde is improving steadily and responds well to support.", principalComment: "A promising term with room for continued confidence building.", generatedAt: now, downloadUrl: null },
  ],
  teacherMessages: [
    { id: "teacher-message-1", teacherId: "teacher-1", parentId: "parent-1", studentId: "student-1", subject: "Reading progress", message: "Adaeze has shown strong improvement in oral reading.", createdAt: now },
    { id: "teacher-message-2", teacherId: "teacher-2", parentId: "parent-2", studentId: "student-2", subject: "Mathematics progress", message: "Tunde is participating well and should keep practicing problem-solving steps at home.", createdAt: now },
  ],
  sessions: [],
  passwordResetTokens: [],
  portalInvitations: [],
  auditLogs: [],
  notificationLogs: [],
};

module.exports = { seedData };
