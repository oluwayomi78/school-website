import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios, { AxiosError } from "axios";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  LogOut,
  GraduationCap,
  X,
  Mail,
  User,
  Clock,
  TrendingUp,
  CheckCircle2,
  Menu,
  Search,
  Sparkles,
  FileText,
  AlertCircle,
  ArrowUpRight,
  Activity,
  ExternalLink,
  Paperclip,
} from "lucide-react";

interface UserData {
  _id: string;
  studentId: string;
  fullname: string;
  email: string;
  course: string;
  guardianLink?: string;
  parentGuardianName?: string;
  parentGuardianPhone?: string;
  level?: number;
}

interface ApiResponse {
  message: string;
  user: UserData;
}

interface Course {
  _id: string;
  title: string;
  code: string;
  instructor: string;
  schedule: string;
}

interface Assessment {
  _id: string;
  title: string;
  description: string;
  course: {
    _id: string;
    cohort: string;
    name?: string;
  };
  dueDate: string;
  status: "Pending" | "Completed" | "Overdue";
  attachments: string[];
}

interface Session {
  _id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  joinedCount?: number;
  isJoined?: boolean;
}

interface SessionApiItem {
  _id?: string;
  id?: string;
  title?: string;
  date?: string | Date;
  time?: string;
  location?: string;
  joinedCount?: number;
  isJoined?: boolean;
}

interface GradeResult {
  _id: string;
  studentName: string;
  subject: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  term: string;
  createdAt: string;
}

interface GradeApiItem {
  _id?: string;
  studentName?: string;
  subject?: string;
  score?: number | string;
  grade?: GradeResult["grade"];
  term?: string;
  createdAt?: string;
}

interface AttendanceRecord {
  _id: string;
  studentName: string;
  course: string;
  status: "present" | "absent" | "late";
  date: string;
  createdAt: string;
}

interface AttendanceApiItem {
  _id?: string;
  studentName?: string;
  course?: string;
  status?: AttendanceRecord["status"];
  date?: string | Date;
  createdAt?: string | Date;
}

interface FeeRecord {
  _id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  reference: string;
  paymentDate: string;
  createdAt: string;
  studentId?: {
    _id: string;
    fullname?: string;
    studentId?: string;
    email?: string;
    course?: string;
  };
}

interface FeeApiItem {
  _id?: string;
  amount?: number;
  currency?: string;
  status?: FeeRecord["status"];
  reference?: string;
  paymentDate?: string | Date;
  createdAt?: string | Date;
  studentId?: FeeRecord["studentId"];
}

interface AnnouncementItem {
  _id: string;
  title: string;
  message: string;
  channel: "announcement" | "email" | "sms" | "in-app";
  createdAt: string;
}

interface AnnouncementApiItem {
  _id?: string;
  title?: string;
  message?: string;
  channel?: AnnouncementItem["channel"];
  createdAt?: string | Date;
}

interface InboxMessage {
  _id: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
  sender?: {
    _id: string;
    fullname?: string;
    email?: string;
    role?: string;
  };
}

interface InboxMessageApiItem {
  _id?: string;
  subject?: string;
  body?: string;
  read?: boolean;
  createdAt?: string | Date;
  sender?: InboxMessage["sender"];
}

interface ExamQuestionItem {
  _id: string;
  subject: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  points: number;
  createdAt: string;
}

interface ExamQuestionApiItem {
  _id?: string;
  course: string;
  level: number;
  subject?: string;
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  points?: number;
  createdAt?: string | Date;
}

interface ExamResultItem {
  _id: string;
  studentName: string;
  subject: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  term: string;
  createdAt: string;
}

interface ExamResultApiItem {
  _id?: string;
  studentName?: string;
  subject?: string;
  score?: number | string;
  grade?: ExamResultItem["grade"];
  term?: string;
  createdAt?: string | Date;
}

interface ExamSubmitResponse {
  success: boolean;
  message: string;
  score: number;
  grade: ExamResultItem["grade"];
  totalPoints: number;
  earnedPoints: number;
  totalQuestions: number;
  result: ExamResultItem;
}

interface ActivityItem {
  _id: string;
  type: string;
  title: string;
  desc: string;
  time: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<UserData | null>(null);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourse] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assessment[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [grades, setGrades] = useState<GradeResult[]>([]);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesError, setGradesError] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [feesLoading, setFeesLoading] = useState(false);
  const [feesError, setFeesError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [examQuestions, setExamQuestions] = useState<ExamQuestionItem[]>([]);
  const [examResults, setExamResults] = useState<ExamResultItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);
  const [selectedExamAnswers, setSelectedExamAnswers] = useState<
    Record<string, string>
  >({});
  const [examTimeLeft, setExamTimeLeft] = useState<number>(30 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [securityStrikes, setSecurityStrikes] = useState<number>(0);
  const [isCheatingLocked, setIsCheatingLocked] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);

  const [cgpaLoading, setCgpaLoading] = useState(false);
  const [currentCGPA, setCurrentCGPA] = useState<string>("0.00");
  const [milestoneLoading, setMilestoneLoading] = useState(false);
  const [nextMilestoneText, setNextMilestoneText] = useState<string>(
    "No upcoming milestones",
  );
  const [examSubmitting, setExamSubmitting] = useState(false);
  const [examFeedback, setExamFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get<ApiResponse>(
          "https://school-website-backend-7r1r.onrender.com/api/users/getUserInfo",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStudentData(response.data.user);
      } catch (err) {
        if ((err as AxiosError).response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, [navigate]);

  useEffect(() => {
    const syncDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [catalogueRes, enrolledRes, assignmentsRes] = await Promise.all([
          axios.get("https://school-website-backend-7r1r.onrender.com/api/users/courses/all", { headers }),
          axios.get("https://school-website-backend-7r1r.onrender.com/api/users/my-courses", { headers }),
          axios.get("https://school-website-backend-7r1r.onrender.com/api/users/assignments/all", {
            headers,
          }),
        ]);

        if (catalogueRes.data.success) {
          setAvailableCourses(catalogueRes.data.courses);
        }

        if (enrolledRes.data.success) {
          setUserCourse(enrolledRes.data.courses);
        }

        setAssignments(
          Array.isArray(assignmentsRes.data) ? assignmentsRes.data : [],
        );
      } catch (err) {
        console.error("Error synchronizing portal course vectors:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load data.");
        }
      }
    };

    if (!loading && studentData) {
      syncDashboardData();
    }
  }, [loading, studentData]);

  const handleEnroll = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://school-website-backend-7r1r.onrender.com/api/users/enrollInCourse/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const getColorSchema = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "submitted")
      return {
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "hover:border-emerald-200",
      };
    if (s === "overdue")
      return {
        text: "text-rose-600",
        bg: "bg-rose-50",
        border: "hover:border-rose-200",
      };
    return {
      text: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-200",
    };
  };

  useEffect(() => {
    const fetchAcademics = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setCgpaLoading(true);
      setMilestoneLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [cgpaRes, milestoneRes] = await Promise.all([
          axios.get("https://school-website-backend-7r1r.onrender.com/api/users/academics/cgpa", {
            headers,
          }),
          axios.get(
            "https://school-website-backend-7r1r.onrender.com/api/users/academics/next-milestone",
            { headers },
          ),
        ]);

        if (cgpaRes.data?.success)
          setCurrentCGPA(String(cgpaRes.data.currentCGPA ?? "0.00"));
        if (milestoneRes.data?.success)
          setNextMilestoneText(
            String(
              milestoneRes.data.nextMilestoneText ?? "No upcoming milestones",
            ),
          );
      } catch (err) {
        console.error("Failed to fetch academics:", err);
      } finally {
        setCgpaLoading(false);
        setMilestoneLoading(false);
      }
    };

    if (!loading && studentData) fetchAcademics();
  }, [loading, studentData]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      setScheduleLoading(true);
      setScheduleError(null);
      try {
        const res = await axios.get(
          "https://school-website-backend-7r1r.onrender.com/api/users/sessions/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const sessionsData = Array.isArray(res.data.sessions)
          ? (res.data.sessions as SessionApiItem[])
          : [];
        setSessions(
          sessionsData.map((s) => ({
            _id: s._id || s.id,
            title: s.title || "",
            date:
              typeof s.date === "string"
                ? s.date
                : s.date
                  ? new Date(s.date).toISOString()
                  : "",
            time: s.time || "",
            location: s.location || "",
            joinedCount:
              typeof (s as Session).joinedCount === "number"
                ? (s as Session).joinedCount
                : undefined,
            isJoined: Boolean((s as Session).isJoined),
          })),
        );
      } catch (error) {
        console.error("Failed to load schedule data:", error);
        setScheduleError("Unable to load schedule.");
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setGradesLoading(true);
      setGradesError(null);

      try {
        const res = await axios.get(
          "https://school-website-backend-7r1r.onrender.com/api/users/grades/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const gradesData = Array.isArray(res.data.grades)
          ? (res.data.grades as GradeApiItem[])
          : [];
        setGrades(
          gradesData.map((g) => ({
            _id:
              g._id || `${g.subject || "grade"}-${g.createdAt || Date.now()}`,
            studentName: g.studentName || "",
            subject: g.subject || "",
            score: Number(g.score) || 0,
            grade: g.grade || "F",
            term: g.term || "",
            createdAt: g.createdAt || "",
          })),
        );
      } catch (err) {
        console.error("Failed to load grade data:", err);
        setGradesError("Unable to load grades.");
      } finally {
        setGradesLoading(false);
      }
    };

    if (!loading && studentData) {
      fetchGrades();
    }
  }, [loading, studentData]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setAttendanceLoading(true);
      setAttendanceError(null);

      try {
        const res = await axios.get(
          "https://school-website-backend-7r1r.onrender.com/api/users/attendance/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const attendanceData = Array.isArray(res.data.attendance)
          ? (res.data.attendance as AttendanceApiItem[])
          : [];
        setAttendance(
          attendanceData.map((record) => ({
            _id:
              record._id ||
              `${record.studentName || "attendance"}-${String(
                record.date || Date.now(),
              )}`,
            studentName: record.studentName || "",
            course: record.course || "",
            status: record.status || "present",
            date:
              typeof record.date === "string"
                ? record.date
                : record.date
                  ? new Date(record.date).toISOString()
                  : "",
            createdAt:
              typeof record.createdAt === "string"
                ? record.createdAt
                : record.createdAt
                  ? new Date(record.createdAt).toISOString()
                  : "",
          })),
        );
      } catch (err) {
        console.error("Failed to load attendance data:", err);
        setAttendanceError("Unable to load attendance.");
      } finally {
        setAttendanceLoading(false);
      }
    };

    if (!loading && studentData) {
      fetchAttendance();
    }
  }, [loading, studentData]);

  useEffect(() => {
    const fetchFees = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setFeesLoading(true);
      setFeesError(null);

      try {
        const res = await axios.get(
          "https://school-website-backend-7r1r.onrender.com/api/users/fees/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const feeData = Array.isArray(res.data.payments)
          ? (res.data.payments as FeeApiItem[])
          : [];
        setFees(
          feeData.map((item) => ({
            _id:
              item._id ||
              `${item.reference || "fee"}-${item.paymentDate || Date.now()}`,
            amount: Number(item.amount) || 0,
            currency: item.currency || "NGN",
            status: item.status || "pending",
            reference: item.reference || "",
            paymentDate:
              typeof item.paymentDate === "string"
                ? item.paymentDate
                : item.paymentDate
                  ? new Date(item.paymentDate).toISOString()
                  : "",
            createdAt:
              typeof item.createdAt === "string"
                ? item.createdAt
                : item.createdAt
                  ? new Date(item.createdAt).toISOString()
                  : "",
            studentId: item.studentId,
          })),
        );
      } catch (err) {
        console.error("Failed to load fee data:", err);
        setFeesError("Unable to load fees.");
      } finally {
        setFeesLoading(false);
      }
    };

    if (!loading && studentData) {
      fetchFees();
    }
  }, [loading, studentData]);

  useEffect(() => {
    const fetchAnnouncementsMessagesAndExams = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setAnnouncementsLoading(true);
      setMessagesLoading(true);
      setExamLoading(true);
      setAnnouncementsError(null);
      setMessagesError(null);
      setExamError(null);

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [announcementsRes, messagesRes, examsRes] = await Promise.all([
          axios.get("https://school-website-backend-7r1r.onrender.com/api/users/announcements/all", {
            headers,
          }),
          axios.get("https://school-website-backend-7r1r.onrender.com/api/users/messages/all", {
            headers,
          }),
          axios.get("https://school-website-backend-7r1r.onrender.com/api/users/exams/all", { headers }),
        ]);

        const announcementsData = Array.isArray(
          announcementsRes.data.announcements,
        )
          ? (announcementsRes.data.announcements as AnnouncementApiItem[])
          : [];
        setAnnouncements(
          announcementsData.map((item) => ({
            _id:
              item._id ||
              `${item.title || "announcement"}-${item.createdAt || Date.now()}`,
            title: item.title || "",
            message: item.message || "",
            channel: item.channel || "in-app",
            createdAt:
              typeof item.createdAt === "string"
                ? item.createdAt
                : item.createdAt
                  ? new Date(item.createdAt).toISOString()
                  : "",
          })),
        );

        const messagesData = Array.isArray(messagesRes.data.messages)
          ? (messagesRes.data.messages as InboxMessageApiItem[])
          : [];
        setMessages(
          messagesData.map((item) => ({
            _id:
              item._id ||
              `${item.subject || "message"}-${item.createdAt || Date.now()}`,
            subject: item.subject || "",
            body: item.body || "",
            read: Boolean(item.read),
            createdAt:
              typeof item.createdAt === "string"
                ? item.createdAt
                : item.createdAt
                  ? new Date(item.createdAt).toISOString()
                  : "",
            sender: item.sender,
          })),
        );

        const examQuestionsData = Array.isArray(examsRes.data.questions)
          ? (examsRes.data.questions as ExamQuestionApiItem[])
          : [];
        const examResultsData = Array.isArray(examsRes.data.results)
          ? (examsRes.data.results as ExamResultApiItem[])
          : [];

        setExamQuestions(
          examQuestionsData.map((item) => ({
            _id:
              item._id ||
              `${item.subject || "question"}-${item.createdAt || Date.now()}`,
            course: item.course || "software",
            level: Number(item.level) || 1,
            subject: item.subject || "",
            questionText: item.questionText || "",
            options: Array.isArray(item.options) ? item.options : [],
            correctAnswer: item.correctAnswer || "",
            points: Number(item.points) || 0,
            createdAt:
              typeof item.createdAt === "string"
                ? item.createdAt
                : item.createdAt
                  ? new Date(item.createdAt).toISOString()
                  : "",
          })),
        );

        setExamResults(
          examResultsData.map((item) => ({
            _id:
              item._id ||
              `${item.subject || "result"}-${item.createdAt || Date.now()}`,
            studentName: item.studentName || "",
            subject: item.subject || "",
            score: Number(item.score) || 0,
            type: "result",
            grade: item.grade || "F",
            term: item.term || "",
            createdAt:
              typeof item.createdAt === "string"
                ? item.createdAt
                : item.createdAt
                  ? new Date(item.createdAt).toISOString()
                  : "",
          })),
        );
      } catch (err) {
        console.error("Failed to load announcements/messages/exams:", err);
        setAnnouncementsError("Unable to load announcements.");
        setMessagesError("Unable to load messages.");
        setExamError("Unable to load exams.");
      } finally {
        setAnnouncementsLoading(false);
        setMessagesLoading(false);
        setExamLoading(false);
      }
    };

    if (!loading && studentData) {
      fetchAnnouncementsMessagesAndExams();
    }
  }, [loading, studentData]);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(d);
    } catch {
      return iso;
    }
  };

  const getGradeTheme = (grade: GradeResult["grade"]) => {
    switch (grade) {
      case "A":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
          accent: "bg-emerald-500",
        };
      case "B":
        return {
          pill: "bg-blue-50 text-blue-700 border-blue-100",
          accent: "bg-blue-500",
        };
      case "C":
        return {
          pill: "bg-indigo-50 text-indigo-700 border-indigo-100",
          accent: "bg-indigo-500",
        };
      case "D":
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-100",
          accent: "bg-amber-500",
        };
      default:
        return {
          pill: "bg-rose-50 text-rose-700 border-rose-100",
          accent: "bg-rose-500",
        };
    }
  };

  const getAttendanceTheme = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
          accent: "bg-emerald-500",
          label: "Present",
        };
      case "late":
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-100",
          accent: "bg-amber-500",
          label: "Late",
        };
      default:
        return {
          pill: "bg-rose-50 text-rose-700 border-rose-100",
          accent: "bg-rose-500",
          label: "Absent",
        };
    }
  };

  const getFeeTheme = (status: FeeRecord["status"]) => {
    switch (status) {
      case "paid":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
          accent: "bg-emerald-500",
          label: "Paid",
        };
      case "failed":
        return {
          pill: "bg-rose-50 text-rose-700 border-rose-100",
          accent: "bg-rose-500",
          label: "Failed",
        };
      case "refunded":
        return {
          pill: "bg-indigo-50 text-indigo-700 border-indigo-100",
          accent: "bg-indigo-500",
          label: "Refunded",
        };
      default:
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-100",
          accent: "bg-amber-500",
          label: "Pending",
        };
    }
  };

  const attendanceRate = attendance.length
    ? Math.round(
        (attendance.filter((item) => item.status === "present").length /
          attendance.length) *
          100,
      )
    : 0;
  const examSubject = (studentData?.course || "").toLowerCase();
  const currentExamQuestions = examQuestions.filter(
    (question) =>
      !examSubject || question.subject.toLowerCase() === examSubject,
  );
  const currentExamResults = examResults.filter(
    (result) => !examSubject || result.subject.toLowerCase() === examSubject,
  );

  const upcomingAssignments = assignments
    .filter((task) => task.dueDate)
    .sort(
      (left, right) =>
        new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
    );
  const nextAssignment = upcomingAssignments[0];
  const nextSession = sessions
    .filter((session) => session.date)
    .sort(
      (left, right) =>
        new Date(left.date).getTime() - new Date(right.date).getTime(),
    )[0];

  const handleExamAnswerChange = (questionId: string, answer: string) => {
    setSelectedExamAnswers((current) => ({ ...current, [questionId]: answer }));
  };

  const handleExamSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !studentData) return;

    setExamSubmitting(true);
    setExamFeedback(null);
    setExamError(null);

    try {
      const response = await axios.post<ExamSubmitResponse>(
        "https://school-website-backend-7r1r.onrender.com/api/users/exams/submit",
        {
          subject: studentData.course,
          term: "First Term",
          answers: selectedExamAnswers,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const result = response.data.result;
      setExamResults((current) => [
        result,
        ...current.filter((item) => item._id !== result._id),
      ]);
      setExamFeedback(
        `${response.data.message} Score: ${response.data.score}% (${response.data.grade})`,
      );
      setSelectedExamAnswers({});
    } catch (error) {
      console.error("Exam submission failed:", error);
      setExamError("Unable to submit exam.");
    } finally {
      setExamSubmitting(false);
    }
  };

  const handleJoinSession = async (sessionId: string, isJoined: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (isJoined) {
        await axios.post(
          `https://school-website-backend-7r1r.onrender.com/api/users/sessions/${sessionId}/leave`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSessions((current) =>
          current.map((s) =>
            s._id === sessionId
              ? {
                  ...s,
                  isJoined: false,
                  joinedCount: s.joinedCount ? s.joinedCount - 1 : 0,
                }
              : s,
          ),
        );
      } else {
        await axios.post(
          `https://school-website-backend-7r1r.onrender.com/api/users/sessions/${sessionId}/join`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSessions((current) =>
          current.map((s) =>
            s._id === sessionId
              ? {
                  ...s,
                  isJoined: true,
                  joinedCount: s.joinedCount ? s.joinedCount + 1 : 1,
                }
              : s,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update session join status:", error);
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://school-website-backend-7r1r.onrender.com/api/users/activities",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setActivities(res.data);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      }
    };
    fetchActivities();
  }, []);

  const handleForcedSecuritySubmit = useCallback(
    async (feedbackMessage: string) => {
      const token = localStorage.getItem("token");
      if (!token || !studentData) return;

      setExamSubmitting(true);
      setError(null);

      try {
        const response = await axios.post<ExamSubmitResponse>(
          "https://school-website-backend-7r1r.onrender.com/api/users/exams/submit",
          {
            subject: studentData.course,
            term: "First Term",
            answers: selectedExamAnswers,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const result = response.data.result;
        setExamResults((current) => [
          result,
          ...current.filter((item) => item._id !== result._id),
        ]);
        setExamFeedback(feedbackMessage);
        setSelectedExamAnswers({});
      } catch (error) {
        console.error("Lockdown routine failure:", error);
        setExamError(
          "Terminal locked. Academic monitoring flagged a strict session violation.",
        );
      } finally {
        setExamSubmitting(false);
      }
    },
    [studentData, selectedExamAnswers],
  );

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setExamTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);

          setTimeout(() => {
            handleForcedSecuritySubmit(
              "⌛ Time Expired: Your 30-minute allocation slot has run out. Sheet compiled.",
            );
          }, 0);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, handleForcedSecuritySubmit]);

  useEffect(() => {
    const isTakingExam =
      activeTab === "Exams" &&
      currentExamQuestions.length > 0 &&
      currentExamResults.length === 0 &&
      isExamStarted;

    if (!isTakingExam || isCheatingLocked) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSecurityStrikes((prevStrikes) => {
          const updatedStrikes = prevStrikes + 1;

          if (updatedStrikes >= 5) {
            setIsCheatingLocked(true);
            setIsTimerRunning(false);

            handleForcedSecuritySubmit(
              "🚨 Security Lockdown: Switched workspaces 5 times. Session terminated.",
            );
            return 5;
          }

          setError(
            `⚠️ Security Warning: Tab switch detected! Strike ${updatedStrikes}/5. Turning away from exam page will result in an immediate auto-fail submission!`,
          );
          return updatedStrikes;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    activeTab,
    currentExamQuestions,
    currentExamResults,
    isCheatingLocked,
    isExamStarted,
    handleForcedSecuritySubmit,
  ]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "upload":
        return "bg-blue-50 text-blue-600";
      case "grade":
        return "bg-emerald-50 text-emerald-600";
      case "security":
        return "bg-slate-50 text-slate-600";
      default:
        return "bg-indigo-50 text-indigo-600";
    }
  };

  const firstName = studentData?.fullname?.split(" ")[0] || "Scholar";

  const navItems = [
    { icon: <LayoutDashboard size={22} />, label: "Overview" },
    { icon: <BookOpen size={22} />, label: "Courses" },
    { icon: <FileText size={22} />, label: "Assessment" },
    { icon: <Calendar size={22} />, label: "Schedule" },
    { icon: <Award size={22} />, label: "Grades" },
    { icon: <CheckCircle2 size={22} />, label: "Attendance" },
    { icon: <TrendingUp size={22} />, label: "Fees" },
    { icon: <AlertCircle size={22} />, label: "Announcements" },
    { icon: <FileText size={22} />, label: "Exams" },
    { icon: <Mail size={22} />, label: "Messages" },
    { icon: <User size={22} />, label: "Profile" },
  ];

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F172A]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-slate-400 font-bold tracking-[0.4em] text-[10px] uppercase">
          Initializing Portal
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 flex font-sans overflow-hidden">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-md z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[110] p-8 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4 px-2">
                  <img src="/favicon.svg" alt="Logo" className="w-12 h-12" />
                  <span className="text-sm font-black uppercase tracking-widest leading-tight">
                    PRECIOUS ACADEMY
                  </span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                <nav className="space-y-4">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setActiveTab(item.label);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${
                        activeTab === item.label
                          ? "bg-indigo-600 text-white shadow-xl"
                          : "text-slate-400"
                      }`}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </nav>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="mt-auto flex items-center gap-4 p-5 text-rose-500 font-bold border-t border-slate-100"
                >
                  <LogOut size={20} />
                  logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex w-24 xl:w-72 bg-white border-r border-slate-100 flex-col py-8 transition-all duration-500 h-screen sticky top-0">
        <div className="flex items-center gap-3 px-8 mb-16 shrink-0">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter hidden xl:block uppercase tracking-widest">
            Precious
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar pr-2 max-h-[calc(100vh-250px)]">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative group ${
                activeTab === item.label
                  ? "text-blue-600 bg-blue-50/50"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {activeTab === item.label && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute left-0 w-1.5 h-6 bg-blue-600 rounded-full"
                />
              )}
              {item.icon}{" "}
              <span className="font-bold text-sm hidden xl:block">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="px-4 mt-auto shrink-0 pt-4">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
          >
            <LogOut size={22} />{" "}
            <span className="hidden xl:block">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen bg-[#F8FAFC]/50 custom-scrollbar">
        <header className="px-6 md:px-12 py-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-[50]">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-blue-50 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100/50 rounded-2xl px-4 py-2 border border-slate-100 group focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="bg-transparent border-none outline-none px-3 py-1.5 text-sm font-medium w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right mr-2">
              <span className="text-sm font-black text-slate-800">
                {studentData?.fullname}
              </span>
              <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase font-black">
                2026 Season
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-blue-100">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-blue-600 uppercase">
                {firstName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-12 py-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center justify-between gap-4 text-rose-700"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle
                    size={18}
                    className="text-rose-500 flex-shrink-0"
                  />
                  <p className="text-xs font-bold uppercase tracking-wider">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  <X size={16} className="text-rose-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === "Overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-12 pb-12"
              >
                <div className="relative p-8 md:p-12 rounded-[3.5rem] bg-[#0F172A] text-white overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="max-w-md">
                      <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} /> Personal Assistant Active
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                        Keep pushing, <br />
                        <span className="text-blue-500">{firstName}.</span>
                      </h1>
                      <p className="text-slate-400 font-medium leading-relaxed">
                        You have assignments due this week. Your performance is
                        currently{" "}
                        <span className="text-white font-bold tracking-widest uppercase">
                          Excellent
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <TrendingUp size={24} />
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                      Current CGPA
                    </p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                      {cgpaLoading ? "Loading..." : currentCGPA}
                    </h3>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                      Program Status
                    </p>
                    <h3 className="text-3xl font-black text-slate-900 capitalize tracking-tighter">
                      {studentData?.course}
                    </h3>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                      <Clock size={24} />
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                      Next Milestone
                    </p>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {milestoneLoading
                        ? "Calculating milestone..."
                        : nextMilestoneText}
                    </h3>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-amber-200 transition-all">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                      <BookOpen size={24} />
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                      Attendance Rate
                    </p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                      {attendanceRate}%
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                  <div className="xl:col-span-3">
                    <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                            Recent Activities
                          </h2>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                            Your latest portal interactions
                          </p>
                        </div>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                          <Activity size={18} />
                        </button>
                      </div>

                      <div className="space-y-8">
                        {activities.map((act) => (
                          <div
                            key={act._id}
                            className="flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-6">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${getActivityColor(
                                  act.type,
                                )}`}
                              >
                                <Activity size={18} />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-slate-900 leading-none mb-1">
                                  {act.title}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  {act.desc}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                {act.time}
                              </span>
                              <ArrowUpRight
                                size={14}
                                className="text-slate-200 group-hover:text-blue-600 transition-colors"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-widest">
                            Next Assignment
                          </h3>
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-slate-900">
                        {nextAssignment?.title || "No pending assignments"}
                      </h4>
                      {nextAssignment?.dueDate && (
                        <p className="text-xs text-slate-400 mt-2">
                          Due:{" "}
                          {new Date(
                            nextAssignment.dueDate,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </section>

                    <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                          <Clock size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-widest">
                            Next Session
                          </h3>
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-slate-900">
                        {nextSession?.title || "No upcoming session"}
                      </h4>
                      {nextSession?.date && (
                        <p className="text-xs text-slate-400 mt-2">
                          {new Date(nextSession.date).toLocaleDateString()}
                        </p>
                      )}
                    </section>

                    <section className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[3rem] text-white shadow-xl">
                      <Sparkles className="text-blue-200 mb-6" size={24} />
                      <h3 className="text-sm font-black uppercase tracking-widest mb-4">
                        Neural Tip
                      </h3>
                      <p className="text-xs font-medium leading-relaxed opacity-80 italic">
                        "Based on your study patterns, reviewing System
                        Architecture tonight will boost your retention by 40%."
                      </p>
                    </section>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Assessment" && (
              <motion.div
                key="assignments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {assignments.map((task: Assessment, i) => {
                    const theme = getColorSchema(task.status);
                    const courseName =
                      typeof task.course === "object"
                        ? task.course.cohort
                        : task.course;
                    return (
                      <div
                        key={task._id || i}
                        className={`group bg-white p-8 rounded-[3.5rem] border border-slate-100 ${theme.border} transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50`}
                      >
                        {task.status === "Overdue" && (
                          <div className="absolute top-0 right-0 p-4 bg-rose-500 text-white rounded-bl-3xl animate-pulse z-10">
                            <AlertCircle size={18} />
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <p
                              className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${theme.text}`}
                            >
                              {courseName}
                            </p>
                            <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                              {task.title}
                            </h4>
                            <p className="text-slate-400 text-xs mt-3 line-clamp-2 font-medium leading-relaxed">
                              {task.description}
                            </p>
                          </div>
                        </div>
                        {task.attachments && task.attachments.length > 0 && (
                          <div className="mb-8 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                              <Paperclip size={12} /> Reference Architecture &
                              Links
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {task.attachments.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all truncate max-w-[140px]"
                                >
                                  Resource {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.bg} ${theme.text}`}
                            >
                              {task.status}
                            </span>
                            <button className="p-2 bg-slate-900 text-white rounded-xl hover:scale-110 transition-transform">
                              <ExternalLink size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "Courses" && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-12"
              >
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0F172A] p-8 md:p-10 text-white shadow-2xl">
                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                  <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-3">
                        Course Center
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                        Courses
                      </h2>
                      <p className="text-slate-400 mt-2">
                        Manage your enrolled classes and register for new ones.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Enrolled
                        </p>
                        <p className="text-2xl font-black text-white">
                          {userCourses.length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Catalog
                        </p>
                        <p className="text-2xl font-black text-white">
                          {availableCourses.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        Enrolled Courses
                      </h2>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                        Academic Session 2025/2026
                      </p>
                    </div>
                  </div>

                  {userCourses && userCourses.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {userCourses.map((course, i) => {
                        const themePairs = [
                          {
                            text: "text-blue-600",
                            bg: "bg-blue-50",
                            hover: "hover:bg-blue-100",
                            shadow: "hover:shadow-blue-100/40",
                          },
                          {
                            text: "text-emerald-600",
                            bg: "bg-emerald-50",
                            hover: "hover:bg-emerald-100",
                            shadow: "hover:shadow-emerald-100/40",
                          },
                          {
                            text: "text-indigo-600",
                            bg: "bg-indigo-50",
                            hover: "hover:bg-indigo-100",
                            shadow: "hover:shadow-indigo-100/40",
                          },
                          {
                            text: "text-violet-600",
                            bg: "bg-violet-50",
                            hover: "hover:bg-violet-100",
                            shadow: "hover:shadow-violet-100/40",
                          },
                        ];
                        const theme = themePairs[i % themePairs.length];
                        return (
                          <div
                            key={course._id || `enrolled-${i}`}
                            className={`group bg-white p-8 rounded-[3.5rem] border border-slate-100 hover:shadow-2xl ${theme.shadow} transition-all duration-500 relative overflow-hidden`}
                          >
                            <div className="flex items-start justify-between mb-8">
                              <div>
                                <p
                                  className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${theme.text}`}
                                >
                                  {course.code}
                                </p>
                                <h4 className="text-xl font-black text-slate-900 leading-tight">
                                  {course.title}
                                </h4>
                                <p className="text-sm text-slate-400 font-medium mt-1">
                                  Instructor: {course.instructor}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={14}
                                  className="text-slate-400"
                                />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {course.schedule}
                                </span>
                              </div>
                              <button
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.bg} ${theme.text} ${theme.hover} transition-colors`}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-[3.5rem] border-2 border-dashed border-slate-100">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        No active enrollments found
                      </p>
                      <p className="text-slate-300 text-xs mt-1">
                        Use the catalogue below to register for classes.
                      </p>
                    </div>
                  )}
                </div>

                <hr className="border-slate-100" />

                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Available Catalogue
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                      Add new courses to your curriculum
                    </p>
                  </div>
                  {availableCourses && availableCourses.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {availableCourses.map((course, i) => (
                        <div
                          key={course._id || `catalogue-${i}`}
                          className="bg-slate-50 p-8 rounded-[3.5rem] border border-slate-100/80 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-500"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-600">
                                {course.code}
                              </p>
                              <h4 className="text-lg font-black text-slate-900 leading-tight">
                                {course.title}
                              </h4>
                              <p className="text-xs text-slate-400 font-medium mt-1">
                                Instructor: {course.instructor}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {course.schedule}
                            </span>
                            <button
                              onClick={() => handleEnroll(course._id)}
                              className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                            >
                              Register Course
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-[3.5rem] border-2 border-dashed border-slate-100">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        Catalogue clear
                      </p>
                      <p className="text-slate-300 text-xs mt-1">
                        You have registered for all available courses this
                        semester.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "Profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-5xl mx-auto pb-20 space-y-8"
              >
                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-xl overflow-hidden">
                  <div className="h-56 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 relative">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.3),_transparent_30%)]" />
                    <div className="absolute -bottom-16 left-12">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1 shadow-2xl">
                        <div className="w-full h-full bg-slate-100 rounded-[2.2rem] flex items-center justify-center text-blue-600 text-4xl font-black">
                          {firstName.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-24 px-12 pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                          {studentData?.fullname}
                        </h2>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
                          Student ID: {studentData?.studentId}
                        </p>
                        <p className="text-slate-500 text-sm mt-3 max-w-2xl">
                          Your academic profile, contact details, and
                          guardianship information are synchronized from the
                          student record.
                        </p>
                      </div>
                      <div className="rounded-[2rem] bg-slate-50 border border-slate-100 px-5 py-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                          Current Level
                        </p>
                        <p className="text-3xl font-black text-slate-900">
                          {studentData?.level ?? "1"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <div className="rounded-[2rem] border border-slate-100 bg-slate-50/60 p-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
                          Email
                        </p>
                        <p className="text-sm font-bold text-slate-900 break-all">
                          {studentData?.email}
                        </p>
                      </div>
                      <div className="rounded-[2rem] border border-slate-100 bg-slate-50/60 p-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
                          Course
                        </p>
                        <p className="text-sm font-bold text-slate-900 capitalize">
                          {studentData?.course}
                        </p>
                      </div>
                      <div className="rounded-[2rem] border border-slate-100 bg-slate-50/60 p-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
                          Guardian
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {studentData?.parentGuardianName || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center gap-5">
                        <Mail className="text-slate-400" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Institutional Email
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            {studentData?.email}
                          </p>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center gap-5">
                        <User className="text-slate-400" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Guardian Phone
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            {studentData?.parentGuardianPhone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Announcements" && (
              <motion.div
                key="announcements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0F172A] p-8 md:p-10 text-white shadow-2xl">
                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                  <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-3">
                        Broadcast Center
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                        Announcements
                      </h2>
                      <p className="text-slate-400 mt-2">
                        Latest school-wide updates and notices.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                        Items
                      </p>
                      <p className="text-2xl font-black text-white">
                        {announcements.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {announcementsLoading ? (
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-5"
                      >
                        <div className="space-y-2 w-full">
                          <div className="h-4 w-1/3 rounded bg-slate-100" />
                          <div className="h-3 w-2/3 rounded bg-slate-100" />
                        </div>
                      </div>
                    ))
                  ) : announcementsError ? (
                    <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 text-rose-700">
                      {announcementsError}
                    </div>
                  ) : announcements.length > 0 ? (
                    announcements.map((item) => (
                      <motion.div
                        key={item._id}
                        whileHover={{ y: -2 }}
                        className="group rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <AlertCircle size={20} />
                              </div>
                              <div>
                                <h3 className="text-lg font-black text-slate-900">
                                  {item.title}
                                </h3>
                                <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">
                                  {item.channel}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
                              {item.message}
                            </p>
                          </div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-100 bg-slate-50/50 p-10 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                        <AlertCircle size={28} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">
                        No announcements yet
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        School updates will appear here when the admin publishes
                        them.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "Messages" && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0F172A] p-8 md:p-10 text-white shadow-2xl">
                  <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                  <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-3">
                        Inbox
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                        Messages
                      </h2>
                      <p className="text-slate-400 mt-2">
                        Private messages from staff and administration.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Unread
                        </p>
                        <p className="text-2xl font-black text-white">
                          {messages.filter((item) => !item.read).length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Total
                        </p>
                        <p className="text-2xl font-black text-white">
                          {messages.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {messagesLoading ? (
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-[2rem] border border-slate-100 bg-white p-5"
                      >
                        <div className="h-4 w-48 rounded bg-slate-100 mb-3" />
                        <div className="h-3 w-full rounded bg-slate-100 mb-2" />
                        <div className="h-3 w-5/6 rounded bg-slate-100" />
                      </div>
                    ))
                  ) : messagesError ? (
                    <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 text-rose-700">
                      {messagesError}
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((item) => (
                      <motion.div
                        key={item._id}
                        whileHover={{ y: -2 }}
                        className={`group rounded-[2rem] border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                          item.read ? "border-slate-100" : "border-indigo-100"
                        }`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                  item.read
                                    ? "bg-slate-50 text-slate-500"
                                    : "bg-indigo-50 text-indigo-600"
                                }`}
                              >
                                <Mail size={20} />
                              </div>
                              <div>
                                <h3 className="text-lg font-black text-slate-900">
                                  {item.subject || "No subject"}
                                </h3>
                                <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">
                                  From {item.sender?.fullname || "Staff"}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
                              {item.body}
                            </p>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-2">
                            <span
                              className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                item.read
                                  ? "bg-slate-50 text-slate-600 border-slate-100"
                                  : "bg-indigo-50 text-indigo-700 border-indigo-100"
                              }`}
                            >
                              {item.read ? "Read" : "Unread"}
                            </span>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-100 bg-slate-50/50 p-10 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                        <Mail size={28} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">
                        No messages yet
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        Your inbox will appear here when staff send a message.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "Exams" && (
              <motion.div
                key="exams"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0F172A] p-8 md:p-10 text-white shadow-2xl">
                  <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300 mb-3">
                        Examination Hub
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                        Exams
                      </h2>
                      <p className="text-slate-400 mt-2">
                        Questions assigned to your course and your published
                        result entries.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:flex items-center gap-4">
                      {isTimerRunning && (
                        <div
                          className={`rounded-2xl border px-6 py-3 text-center min-w-[120px] transition-colors ${
                            examTimeLeft < 60
                              ? "border-rose-500 bg-rose-500/10 text-rose-400 animate-pulse"
                              : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5 font-bold">
                            Time Left
                          </p>
                          <p className="text-2xl font-black tabular-nums">
                            {formatTimer(examTimeLeft)}
                          </p>
                        </div>
                      )}
                      {isTimerRunning && securityStrikes > 0 && (
                        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-6 py-3 text-center min-w-[120px] text-rose-400 animate-pulse">
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5 font-bold">
                            Violations
                          </p>
                          <p className="text-2xl font-black">
                            {securityStrikes} / 5
                          </p>
                        </div>
                      )}
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center min-w-[100px]">
                        <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5">
                          Questions
                        </p>
                        <p className="text-2xl font-black text-white">
                          {currentExamQuestions.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {examFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`rounded-[2rem] border p-5 font-bold ${
                        isCheatingLocked || examTimeLeft <= 0
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : "border-emerald-100 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {examFeedback}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isExamStarted &&
                currentExamResults.length === 0 &&
                currentExamQuestions.length > 0 ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-14 text-center shadow-xl shadow-slate-100/40"
                  >
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-inner">
                      <FileText size={36} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                      Assessment Briefing
                    </h3>
                    <p className="mt-3 text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
                      You are about to launch the examination session for{" "}
                      <span className="text-slate-950 font-bold capitalize">
                        {studentData?.course}
                      </span>
                      . Please review the environmental parameters before
                      deployment.
                    </p>

                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-8 text-left">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                        <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                          Duration
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          30 Minutes Total
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                        <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                          Anti-Cheat
                        </span>
                        <span className="font-bold text-rose-600 text-sm">
                          5 Tab-Switch Limit
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsExamStarted(true)}
                      className="mt-10 w-full max-w-md bg-slate-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl transition-all duration-300 transform hover:-y-0.5"
                    >
                      Begin Assessment Session
                    </button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900">
                          Exam Questions
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {isCheatingLocked ||
                          currentExamResults.length > 0 ||
                          examTimeLeft <= 0
                            ? "🔒 Attempt Locked"
                            : "📝 Active Session"}
                        </span>
                      </div>

                      <div className="grid gap-4">
                        {examLoading ? (
                          [1, 2].map((i) => (
                            <div
                              key={i}
                              className="animate-pulse rounded-[2rem] border border-slate-100 bg-white p-5"
                            >
                              <div className="h-4 w-2/3 rounded bg-slate-100 mb-3" />
                              <div className="h-3 w-full rounded bg-slate-100 mb-2" />
                              <div className="h-3 w-5/6 rounded bg-slate-100" />
                            </div>
                          ))
                        ) : examError ? (
                          <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 text-rose-700">
                            {examError}
                          </div>
                        ) : isCheatingLocked || examTimeLeft <= 0 ? (
                          <div className="rounded-[3rem] border border-rose-200 bg-rose-50/40 p-10 text-center backdrop-blur-sm shadow-xl shadow-rose-50">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-600 text-white shadow-xl shadow-rose-200">
                              <AlertCircle size={36} />
                            </div>
                            <h3 className="text-2xl font-black text-rose-900 tracking-tight">
                              {examTimeLeft <= 0
                                ? "Session Expired"
                                : "Security Breach Lockout"}
                            </h3>
                            <p className="mt-3 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                              {examTimeLeft <= 0
                                ? "The allotted 30-minute exam window has ended. Your selections have been archived successfully."
                                : "Workspace boundary infractions crossed the maximum 5-strike safety limit. Your record sheet has been locked and auto-submitted."}
                            </p>
                            <div className="mt-6 inline-block bg-rose-600 rounded-2xl px-5 py-3 text-xs font-black text-white uppercase tracking-wider">
                              Session Finished
                            </div>
                          </div>
                        ) : currentExamResults.length > 0 ? (
                          <div className="rounded-[3rem] border border-emerald-100 bg-emerald-50/30 p-10 text-center backdrop-blur-sm">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-200">
                              <CheckCircle2 size={36} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                              Assessment Completed
                            </h3>
                            <p className="mt-3 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                              Your examination sheet has been signed and
                              compiled into our database cluster. Double
                              submissions are locked out for academic record
                              integrity.
                            </p>
                            <div className="mt-6 inline-block bg-white border border-emerald-100 rounded-2xl px-5 py-3 text-xs font-black text-emerald-700 uppercase tracking-wider">
                              Attempt Archived Successfully
                            </div>
                          </div>
                        ) : currentExamQuestions.length > 0 ? (
                          currentExamQuestions.map((question, index) => (
                            <div
                              key={question._id}
                              className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm"
                            >
                              <div className="flex items-center justify-between gap-3 mb-3">
                                <h4 className="font-black text-slate-900">
                                  Q{index + 1}. {question.questionText}
                                </h4>
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700">
                                  {question.points} pts
                                </span>
                              </div>
                              <div className="grid gap-2">
                                {question.options.map((option, optionIndex) => {
                                  const optionLabel = String.fromCharCode(
                                    65 + optionIndex,
                                  );
                                  const optionId = `${question._id}-${optionLabel}`;
                                  return (
                                    <label
                                      key={optionIndex}
                                      htmlFor={optionId}
                                      className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition-all ${
                                        selectedExamAnswers[question._id] ===
                                        option
                                          ? "border-blue-300 bg-blue-50 text-blue-700"
                                          : "border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-white"
                                      }`}
                                    >
                                      <input
                                        id={optionId}
                                        type="radio"
                                        name={question._id}
                                        value={option}
                                        checked={
                                          selectedExamAnswers[question._id] ===
                                          option
                                        }
                                        onChange={() =>
                                          handleExamAnswerChange(
                                            question._id,
                                            option,
                                          )
                                        }
                                        className="mr-3"
                                      />
                                      <span className="font-black text-slate-400">
                                        {optionLabel}.
                                      </span>
                                      <span className="ml-2">{option}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[2rem] border border-dashed border-slate-100 bg-slate-50/50 p-10 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                              <FileText size={28} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">
                              No exam questions yet
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                              Questions will appear here when the exam bank is
                              published for your course.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-black text-slate-900">
                          Your Results
                        </h3>
                        <button
                          type="button"
                          onClick={handleExamSubmit}
                          disabled={
                            examSubmitting ||
                            currentExamQuestions.length === 0 ||
                            currentExamResults.length > 0 ||
                            isCheatingLocked ||
                            examTimeLeft <= 0
                          }
                          className="rounded-full bg-slate-900 px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          {examSubmitting
                            ? "Submitting..."
                            : currentExamResults.length > 0 ||
                                isCheatingLocked ||
                                examTimeLeft <= 0
                              ? "Locked"
                              : "Submit Answers"}
                        </button>
                      </div>
                      <div className="grid gap-4">
                        {currentExamResults.length > 0 ? (
                          currentExamResults.map((result) => {
                            const theme = getGradeTheme(result.grade);
                            return (
                              <div
                                key={result._id}
                                className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="font-black text-slate-900 capitalize">
                                      {result.subject}
                                    </p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                      {result.term || "First Term"}
                                    </p>
                                  </div>
                                  <span
                                    className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${theme.pill}`}
                                  >
                                    {result.grade}
                                  </span>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                  <p className="text-sm text-slate-500">
                                    Score
                                  </p>
                                  <p className="text-xl font-black text-slate-900">
                                    {result.score}%
                                  </p>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className={`h-full rounded-full ${theme.accent}`}
                                    style={{
                                      width: `${Math.min(result.score, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="rounded-[2rem] border border-dashed border-slate-100 bg-slate-50/50 p-10 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                              <Award size={28} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">
                              No published results yet
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                              Your exam results will appear here once published
                              by the admin team.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === "Schedule" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 pb-12"
              >
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0F172A] p-8 md:p-10 text-white shadow-2xl">
                  <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                  <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-3">
                        Weekly Planner
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                        Your Schedule
                      </h2>
                      <p className="text-slate-400 mt-2">
                        You have {sessions.length} sessions scheduled for this
                        week.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Joined
                        </p>
                        <p className="text-2xl font-black text-white">
                          {
                            sessions.filter((session) => session.isJoined)
                              .length
                          }
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Total
                        </p>
                        <p className="text-2xl font-black text-white">
                          {sessions.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {scheduleLoading ? (
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100" />
                          <div className="space-y-2">
                            <div className="h-4 w-48 bg-slate-100 rounded" />
                            <div className="h-3 w-32 bg-slate-100 rounded" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : scheduleError ? (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700">
                      {scheduleError}
                    </div>
                  ) : sessions.length > 0 ? (
                    sessions.map((session) => (
                      <motion.div
                        key={session._id || session.title}
                        whileHover={{ scale: 1.01 }}
                        className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-lg bg-gradient-to-tr from-blue-50 to-indigo-50 flex flex-col items-center justify-center text-blue-600">
                            <span className="text-sm font-bold">
                              {formatDate(session.date)}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {session.time}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg">
                              {session.title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                              {session.location}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                              {typeof session.joinedCount === "number"
                                ? `${session.joinedCount} joined`
                                : "Live session"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleJoinSession(
                                session._id!,
                                session.isJoined ?? false,
                              )
                            }
                            className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                              session.isJoined
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {session.isJoined ? "Joined" : "Join"}
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-8 rounded-2xl border border-dashed border-slate-100 text-center">
                      <p className="text-slate-500 mb-2">No sessions found.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "Attendance" && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0F172A] p-8 md:p-10 text-white shadow-2xl">
                  <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300 mb-3">
                        Attendance Overview
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                        Your Attendance
                      </h2>
                      <p className="text-slate-400 mt-2">
                        Latest attendance records synchronized from the backend.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Present
                        </p>
                        <p className="text-2xl font-black text-white">
                          {
                            attendance.filter(
                              (item) => item.status === "present",
                            ).length
                          }
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Late
                        </p>
                        <p className="text-2xl font-black text-white">
                          {
                            attendance.filter((item) => item.status === "late")
                              .length
                          }
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Absent
                        </p>
                        <p className="text-2xl font-black text-white">
                          {
                            attendance.filter(
                              (item) => item.status === "absent",
                            ).length
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Total Records
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      {attendance.length}
                    </h3>
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Attendance Rate
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      {attendance.length
                        ? Math.round(
                            (attendance.filter(
                              (item) => item.status === "present",
                            ).length /
                              attendance.length) *
                              100,
                          )
                        : 0}
                      %
                    </h3>
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Course
                    </p>
                    <h3 className="text-3xl font-black text-slate-900 capitalize">
                      {studentData?.course || "N/A"}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4">
                  {attendanceLoading ? (
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                          <div className="space-y-2">
                            <div className="h-4 w-40 rounded bg-slate-100" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : attendanceError ? (
                    <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 text-rose-700">
                      {attendanceError}
                    </div>
                  ) : attendance.length > 0 ? (
                    attendance.map((record) => {
                      const theme = getAttendanceTheme(record.status);
                      return (
                        <motion.div
                          key={record._id}
                          whileHover={{ y: -2 }}
                          className="group flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                              <CheckCircle2 size={22} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-black text-slate-900">
                                  {record.studentName}
                                </h3>
                                <span
                                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${theme.pill}`}
                                >
                                  {theme.label}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-slate-500">
                                {record.course}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {formatDate(record.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 self-start md:self-center">
                            <div
                              className={`rounded-2xl border px-4 py-3 text-center ${theme.pill}`}
                            >
                              <p className="text-[10px] font-black uppercase tracking-[0.25em]">
                                Status
                              </p>
                              <p className="text-2xl font-black capitalize">
                                {record.status}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-100 bg-slate-50/50 p-10 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                        <CheckCircle2 size={28} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">
                        No attendance records yet
                      </h3>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "Fees" && (
              <motion.div
                key="fees"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0F172A] p-8 md:p-10 text-white shadow-2xl">
                  <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                  <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-3">
                        Financial Overview
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                        School Fees
                      </h2>
                      <p className="text-slate-400 mt-2">
                        Payment history and balance snapshots from the backend.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Paid
                        </p>
                        <p className="text-2xl font-black text-white">
                          {fees.filter((item) => item.status === "paid").length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Pending
                        </p>
                        <p className="text-2xl font-black text-white">
                          {
                            fees.filter((item) => item.status === "pending")
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Total Payments
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      {fees.length}
                    </h3>
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Total Paid
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      {fees
                        .reduce(
                          (sum, item) =>
                            sum + (item.status === "paid" ? item.amount : 0),
                          0,
                        )
                        .toLocaleString()}
                    </h3>
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Outstanding
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      {fees
                        .reduce(
                          (sum, item) =>
                            sum + (item.status === "paid" ? 0 : item.amount),
                          0,
                        )
                        .toLocaleString()}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4">
                  {feesLoading ? (
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                        </div>
                      </div>
                    ))
                  ) : feesError ? (
                    <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 text-rose-700">
                      {feesError}
                    </div>
                  ) : fees.length > 0 ? (
                    fees.map((item) => {
                      const theme = getFeeTheme(item.status);
                      return (
                        <motion.div
                          key={item._id}
                          whileHover={{ y: -2 }}
                          className="group flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                              <TrendingUp size={22} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-black text-slate-900">
                                  {item.reference || "Payment"}
                                </h3>
                                <span
                                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${theme.pill}`}
                                >
                                  {theme.label}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-slate-500">
                                {item.currency} {item.amount.toLocaleString()}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {formatDate(item.paymentDate || item.createdAt)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-100 bg-slate-50/50 p-10 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                        <TrendingUp size={28} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">
                        No payment history yet
                      </h3>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "Grades" && (
              <motion.div
                key="grades"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0F172A] p-8 md:p-10 text-white shadow-2xl">
                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                  <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-3">
                        Academic Performance
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                        Your Grades
                      </h2>
                      <p className="text-slate-400 mt-2">
                        Latest result entries published for your account.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Records
                        </p>
                        <p className="text-2xl font-black text-white">
                          {grades.length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                          Average
                        </p>
                        <p className="text-2xl font-black text-white">
                          {grades.length
                            ? Math.round(
                                grades.reduce(
                                  (sum, item) => sum + item.score,
                                  0,
                                ) / grades.length,
                              )
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Best Grade
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      {grades.length ? grades[0].grade : "N/A"}
                    </h3>
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Highest Score
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      {grades.length
                        ? Math.max(...grades.map((item) => item.score))
                        : 0}
                    </h3>
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Terms
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      {new Set(grades.map((item) => item.term)).size}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4">
                  {gradesLoading ? (
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                        </div>
                      </div>
                    ))
                  ) : gradesError ? (
                    <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 text-rose-700">
                      {gradesError}
                    </div>
                  ) : grades.length > 0 ? (
                    grades.map((item) => {
                      const theme = getGradeTheme(item.grade);
                      return (
                        <motion.div
                          key={item._id}
                          whileHover={{ y: -2 }}
                          className="group flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                              <Award size={22} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-black text-slate-900">
                                  {item.subject}
                                </h3>
                                <span
                                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${theme.pill}`}
                                >
                                  {item.term}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-slate-500">
                                {formatDate(item.createdAt)}
                              </p>
                              <div className="mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full ${theme.accent}`}
                                  style={{
                                    width: `${Math.min(item.score, 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-100 bg-slate-50/50 p-10 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                        <Sparkles size={28} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">
                        No grades available yet
                      </h3>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
