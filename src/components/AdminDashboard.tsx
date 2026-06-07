import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios, { AxiosError } from "axios";
import {
  Users,
  BookOpen,
  FileText,
  LogOut,
  Menu,
  X,
  Search,
  Sparkles,
  Trash2,
  Mail,
  TrendingUp,
  GraduationCap,
  RefreshCw,
  LayoutDashboard,
  UserCheck,
  ChevronRight,
  Layers,
  BarChart3,
  Globe,
  Cpu,
  Plus,
  Bell,
  Calendar,
  CreditCard,
  Settings,
  UserPlus,
  Clock,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  PenSquare,
  ShieldAlert,
  IdCard as IdCardIcon,
  Paperclip,
  Timer,
} from "lucide-react";

interface Student {
  _id: string;
  studentId?: string;
  fullname: string;
  email: string;
  course: string;
  level?: number;
  password?: string;

  guardianLink?: string;
  parentGuardianName?: string;
  parentGuardianPhone?: string;

  admissionDate?: string;
  status?: "active" | "graduated" | "suspended";
}
interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  code: string;
  schedule: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

interface AdminData {
  _id: string;
  fullname: string;
  email: string;
  course?: string;
}

interface AdminAssignment {
  _id: string;
  title: string;
  description: string;
  course: string | { _id: string; cohort: string; name?: string };
  courseName?: string;
  dueDate: string;
  type?: string;
  attachments: string[];
  createdAt?: string;
}

interface CurriculumModule {
  _id: string;
  moduleId: string;
  title: string;
  cohort: string;
  progress: number;
  iconType: string;
}

interface SchoolClass {
  _id: string;
  name: string;
  cohort: string;
  level: string;
  room: string;
  teacher?: string;
  createdAt: string;
}

interface SubjectAssignment {
  _id: string;
  subject: string;
  className: string;
  teacher: string;
  schedule?: string;
  status: "active" | "inactive" | "completed";
  createdAt: string;
}

interface DeployModuleForm {
  moduleId: string;
  title: string;
  cohort: "software" | "linguistics" | "business";
  progress: number;
  description: string;
  iconType: string;
}

interface SystemLogEntry {
  id: string;
  message: string;
  detail: string;
  level: "info" | "success" | "warning" | "error";
  timestamp: string;
}

interface DashboardStats {
  totalStudents: number;
  softwareStudents: number;
  linguisticsStudents: number;
  businessStudents: number;
}

interface ListItemSummary {
  _id: string;
  studentId?: string;
  title?: string;
  name?: string;
  status?: string;
  date?: string;
  createdAt?: string;
  studentName?: string;
  course?: string;
  message?: string;
  channel?: string;
  fullname?: string;
  email?: string;
}

interface ExamQuestion {
  _id?: string;
  course: string;
  level: number;
  subject: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

interface ExamResult {
  _id: string;
  studentName: string;
  subject: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  term: string;
  examDate: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  location: string;
}

interface TransportRoute {
  _id: string;
  routeName: string;
  driverName: string;
  vehicleNumber: string;
  capacity: number;
  assignedStudents: number;
  status: "active" | "maintenance" | "inactive";
}

interface HostelRoom {
  _id: string;
  roomNumber: string;
  blockName: string;
  roomType: "Single" | "Shared" | "Suite";
  capacity: number;
  occupants: string[];
  status: "available" | "full" | "maintenance";
}

interface Event {
  _id: string;
  title: string;
  date: string;
}

interface StaffMember {
  _id: string;
  fullname: string;
  email: string;
  role: "admin" | "instructor" | "Registrar" | "student";
}

interface EditRoleModalProps {
  user: StaffMember;
  onClose: () => void;
  onUpdate: (userId: string, newRole: string) => void;
}

interface AssignmentForm {
  title: string;
  description: string;
  courseName: string;
  dueDate: string;
  attachments: string[];
}

interface Session {
  _id: string;
  title: string;
  time: string;
  date: string;
  location: string;
}

const EditRoleModal = ({ user, onClose, onUpdate }: EditRoleModalProps) => {
  const [selectedRole, setSelectedRole] = useState(user.role);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-black text-slate-900 mb-6">
          Edit Role: {user.fullname}
        </h3>

        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">
          Select New Role
        </label>
        <select
          className="w-full p-4 rounded-2xl bg-slate-50 font-bold mb-8 border-none focus:ring-2 focus:ring-indigo-500"
          value={selectedRole}
          onChange={(e) =>
            setSelectedRole(e.target.value as StaffMember["role"])
          }
        >
          <option value="admin">Super Admin</option>
          <option value="instructor">Instructor</option>
          <option value="Registrar">Registrar</option>
          <option value="student">Student</option>
        </select>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(user._id, selectedRole)}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumModule[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>([]);
  const [viewingCard, setViewingCard] = useState<Student | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [editingUser, setEditingUser] = useState<StaffMember | null>(null);
  const [adminCourses, setAdminCourses] = useState<Course[]>([]);
  const [adminAssignments, setAdminAssignments] = useState<AdminAssignment[]>(
    []
  );
  const [editingAssignment, setEditingAssignment] =
    useState<AdminAssignment | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventForm, setEventForm] = useState({ title: "", date: "" });
  const [activeTab, setActiveTab] = useState("Overview");
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deployForm, setDeployForm] = useState<DeployModuleForm>({
    moduleId: "",
    title: "",
    cohort: "software",
    progress: 0,
    description: "",
    iconType: "Cpu",
  });
  const [studentForm, setStudentForm] = useState({
    fullname: "",
    email: "",
    course: "software",
    level: 1,
    password: "",

    guardianLink: "",
    parentGuardianName: "",
    parentGuardianPhone: "",
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [teachers, setTeachers] = useState<AdminData[]>([]);
  const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>([]);
  const [subjectAssignments, setSubjectAssignments] = useState<
    SubjectAssignment[]
  >([]);
  const [classForm, setClassForm] = useState({
    name: "",
    cohort: "software",
    level: "level 1",
    room: "",
    teacher: "",
  });
  const [subjectForm, setSubjectForm] = useState({
    subject: "",
    className: "",
    teacher: "",
    schedule: "",
  });
  const [attendanceRecords, setAttendanceRecords] = useState<ListItemSummary[]>(
    []
  );
  const [admissionsList, setAdmissionsList] = useState<ListItemSummary[]>([]);
  const [notificationsList, setNotificationsList] = useState<ListItemSummary[]>(
    []
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    studentName: "",
    course: "software",
    status: "present",
  });
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [admissionForm, setAdmissionForm] = useState({
    fullname: "",
    email: "",
    course: "software",
  });
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    channel: "in-app",
  });

  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    softwareStudents: 0,
    linguisticsStudents: 0,
    businessStudents: 0,
  });

  const calculateStats = useCallback((studentList: Student[]) => {
    const software = studentList.filter(
      (s) => s.course?.toLowerCase() === "software"
    ).length;
    const linguistics = studentList.filter(
      (s) => s.course?.toLowerCase() === "linguistics"
    ).length;
    const business = studentList.filter(
      (s) => s.course?.toLowerCase() === "business"
    ).length;

    setStats({
      totalStudents: studentList.length,
      softwareStudents: software,
      linguisticsStudents: linguistics,
      businessStudents: business,
    });
  }, []);

  const pushSystemLog = useCallback(
    (
      message: string,
      detail: string,
      level: SystemLogEntry["level"] = "info"
    ) => {
      const entry: SystemLogEntry = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        message,
        detail,
        level,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      setSystemLogs((current) => [entry, ...current].slice(0, 8));
    },
    []
  );

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      const [
        adminRes,
        studentsRes,
        adminsRes,
        curriculumRes,
        resultsRes,
        libraryRes,
        transportRes,
        hostelRes,
        assignmentRes,
      ] = await Promise.all([
        axios.get<{ user: AdminData }>(
          "https://school-website-backend-7r1r.onrender.com/api/users/getUserInfo",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get<Student[]>("https://school-website-backend-7r1r.onrender.com/api/admin/students/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<AdminData[]>("https://school-website-backend-7r1r.onrender.com/api/admin/admins/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<CurriculumModule[]>(
          "https://school-website-backend-7r1r.onrender.com/api/admin/curriculum/all",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get("https://school-website-backend-7r1r.onrender.com/api/admin/results/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://school-website-backend-7r1r.onrender.com/api/admin/library/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://school-website-backend-7r1r.onrender.com/api/admin/transport/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://school-website-backend-7r1r.onrender.com/api/admin/hostel/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://school-website-backend-7r1r.onrender.com/api/admin/assignments/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAdminInfo(adminRes.data.user);
      const studentsList = Array.isArray(studentsRes.data)
        ? studentsRes.data
        : [];
      setStudents(studentsList);
      calculateStats(studentsList);
      setAdmins(Array.isArray(adminsRes.data) ? adminsRes.data : []);
      setCurriculum(
        Array.isArray(curriculumRes.data) ? curriculumRes.data : []
      );
      setResults(Array.isArray(resultsRes.data) ? resultsRes.data : []);
      setBooks(Array.isArray(libraryRes.data) ? libraryRes.data : []);
      setRoutes(Array.isArray(transportRes.data) ? transportRes.data : []);
      setHostelRooms(Array.isArray(hostelRes.data) ? hostelRes.data : []);
      setAdminAssignments(
        Array.isArray(assignmentRes.data) ? assignmentRes.data : []
      );
      pushSystemLog(
        "Cluster sync completed",
        `Loaded ${studentsList.length} student records and ${
          Array.isArray(curriculumRes.data) ? curriculumRes.data.length : 0
        } curriculum modules.`,
        "success"
      );

      const [
        teachersRes,
        attendanceRes,
        admissionsRes,
        notificationsRes,
        classesRes,
        subjectsRes,
      ] = await Promise.allSettled([
        axios.get<AdminData[]>("https://school-website-backend-7r1r.onrender.com/api/admin/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<ListItemSummary[]>(
          "https://school-website-backend-7r1r.onrender.com/api/admin/attendance",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get<ListItemSummary[]>(
          "https://school-website-backend-7r1r.onrender.com/api/admin/admissions",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get<ListItemSummary[]>(
          "https://school-website-backend-7r1r.onrender.com/api/admin/notifications",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get<SchoolClass[]>("https://school-website-backend-7r1r.onrender.com/api/admin/classes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<SubjectAssignment[]>(
          "https://school-website-backend-7r1r.onrender.com/api/admin/subjects",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      if (teachersRes.status === "fulfilled") {
        setTeachers(
          Array.isArray(teachersRes.value.data) ? teachersRes.value.data : []
        );
      }
      if (attendanceRes.status === "fulfilled") {
        setAttendanceRecords(
          Array.isArray(attendanceRes.value.data)
            ? attendanceRes.value.data
            : []
        );
      }
      if (admissionsRes.status === "fulfilled") {
        setAdmissionsList(
          Array.isArray(admissionsRes.value.data)
            ? admissionsRes.value.data
            : []
        );
      }
      if (notificationsRes.status === "fulfilled") {
        setNotificationsList(
          Array.isArray(notificationsRes.value.data)
            ? notificationsRes.value.data
            : []
        );
      }
      if (classesRes.status === "fulfilled") {
        setSchoolClasses(
          Array.isArray(classesRes.value.data) ? classesRes.value.data : []
        );
      }
      if (subjectsRes.status === "fulfilled") {
        setSubjectAssignments(
          Array.isArray(subjectsRes.value.data) ? subjectsRes.value.data : []
        );
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      if (axiosError.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
        pushSystemLog(
          "Authorization denied",
          "Access token rejected during dashboard sync.",
          "error"
        );
      } else {
        setError("Neural synchronization anomaly detected.");
        pushSystemLog(
          "Synchronization anomaly",
          "The dashboard could not complete the data refresh cycle.",
          "warning"
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate, calculateStats, pushSystemLog]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    pushSystemLog(
      "Manual refresh requested",
      "Admin triggered a dashboard-wide sync.",
      "info"
    );
    await fetchData();
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm("Execute systematic deletion sequence?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://school-website-backend-7r1r.onrender.com/api/admin/students/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Node purged successfully.");
      setTimeout(() => setSuccess(""), 3000);
      const updatedList = students.filter((s) => s._id !== studentId);
      setStudents(updatedList);
      calculateStats(updatedList);
      pushSystemLog(
        "Student removed",
        `Student record ${studentId.slice(-8)} was deleted from the cluster.`,
        "warning"
      );
    } catch (err) {
      setError("Purge action rejected.");
      console.error(err);
      setTimeout(() => setError(""), 3000);
      pushSystemLog(
        "Student purge failed",
        `Deletion request for ${studentId.slice(-8)} was rejected.`,
        "error"
      );
    }
  };

  const handleDeleteModule = async (moduleId: string, moduleName: string) => {
    if (!window.confirm("Execute module purge from curriculum datastream?"))
      return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://school-website-backend-7r1r.onrender.com/api/admin/curriculum/${moduleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Module purged from curriculum datastream.");
      setTimeout(() => setSuccess(""), 3000);
      const updatedCurriculum = curriculum.filter((m) => m._id !== moduleId);
      setCurriculum(updatedCurriculum);
      pushSystemLog(
        "Module purged",
        `Module ${moduleName} was deleted from the curriculum datastream.`,
        "warning"
      );
    } catch (err) {
      setError("Module purge rejected.");
      console.error(err);
      setTimeout(() => setError(""), 3000);
      pushSystemLog(
        "Module purge failed",
        `Deletion request for ${moduleName} was rejected.`,
        "error"
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Admin");
  };

  const openDeployModal = () => {
    setError("");
    setSuccess("");
    setIsDeployModalOpen(true);
  };

  const closeDeployModal = () => {
    if (isDeploying) {
      return;
    }

    setIsDeployModalOpen(false);
  };

  const handleDeployChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setDeployForm((current) => ({
      ...current,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const handleDeploySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsDeploying(true);
    setError("");

    try {
      await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/curriculum/deploy",
        deployForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Module deployed successfully.");
      setIsDeployModalOpen(false);
      setDeployForm({
        moduleId: "",
        title: "",
        cohort: "software",
        progress: 0,
        description: "",
        iconType: "Cpu",
      });
      pushSystemLog(
        "Module deployed",
        `${deployForm.moduleId} was published to the curriculum datastream.`,
        "success"
      );
      await fetchData();
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Deployment rejected. Check parameter integrity."
      );
      pushSystemLog(
        "Module deployment failed",
        axiosError.response?.data?.message ||
          "The deploy request did not pass validation.",
        "error"
      );
    } finally {
      setIsDeploying(false);
    }
  };

  const openStudentModal = (student?: Student) => {
    if (student) {
      setIsEditMode(true);
      setSelectedStudentId(student._id);

      setStudentForm({
        fullname: student.fullname,
        email: student.email,
        course: student.course,
        level: Number(student.level) || 1,
        password: "",

        guardianLink: student.guardianLink || "",
        parentGuardianName: student.parentGuardianName || "",
        parentGuardianPhone: student.parentGuardianPhone || "",
      });
    } else {
      setIsEditMode(false);
      setSelectedStudentId(null);
      setStudentForm({
        fullname: "",
        email: "",
        course: "software",
        level: 1,
        password: "",
        guardianLink: "",
        parentGuardianName: "",
        parentGuardianPhone: "",
      });
    }
    setIsStudentModalOpen(true);
  };
  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setIsEditMode(false);
    setSelectedStudentId(null);
  };

  const handleExportIDs = () => {
    const csvContent = [
      ["Full Name", "Email", "Course", "ID"],
      ...students.map((s) => [s.fullname, s.email, s.course, s._id.slice(-8)]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_ids_export.csv";
    a.click();

    pushSystemLog(
      "Data Export",
      "Student registry exported to CSV.",
      "success"
    );
  };

  const openAdminModal = () => {
    setAdminForm({ fullname: "", email: "", password: "" });
    setIsAdminModalOpen(true);
    setError("");
    setSuccess("");
  };
  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
  };

  const openTeacherModal = () => {
    setTeacherForm({ fullname: "", email: "", password: "" });
    setIsTeacherModalOpen(true);
    setError("");
    setSuccess("");
  };
  const closeTeacherModal = () => {
    setIsTeacherModalOpen(false);
  };

  const handleStudentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudentForm((s) => ({ ...s, [name]: value }));
  };
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
      return;
    }

    try {
      if (isEditMode && selectedStudentId) {
        await axios.put(
          `https://school-website-backend-7r1r.onrender.com/api/admin/students/${selectedStudentId}`,
          studentForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSuccess("Student updated successfully.");
        pushSystemLog(
          "Student updated",
          `${studentForm.fullname} was updated.`,
          "success"
        );
      } else {
        await axios.post(
          "https://school-website-backend-7r1r.onrender.com/api/admin/students",
          studentForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSuccess("Student registered successfully.");
        pushSystemLog(
          "Student added",
          `${studentForm.fullname} was added to the registry.`,
          "success"
        );
      }

      closeStudentModal();
      await fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const serverMessage =
        axiosError.response?.data?.message || "Unknown error";

      setError(`Action failed: ${serverMessage}`);
      console.error("Full error:", err);

      pushSystemLog(
        isEditMode ? "Update failed" : "Add student failed",
        serverMessage,
        "error"
      );
    }
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminForm((s) => ({ ...s, [name]: value }));
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
      return;
    }

    try {
      await axios.post("https://school-website-backend-7r1r.onrender.com/api/admin/admins", adminForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Admin added.");
      pushSystemLog(
        "Admin added",
        `${adminForm.fullname} was added to the admin registry.`,
        "success"
      );
      closeAdminModal();
      await fetchData();
      window.setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Add admin failed.");
      pushSystemLog(
        "Add admin failed",
        "The create admin request was rejected.",
        "error"
      );
    }
  };

  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeacherForm((s) => ({ ...s, [name]: value }));
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/teachers",
        teacherForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Teacher added.");
      pushSystemLog(
        "Teacher added",
        `${teacherForm.fullname} was added to the teacher registry.`,
        "success"
      );
      closeTeacherModal();
      await fetchData();
      window.setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Add teacher failed.");
      pushSystemLog(
        "Add teacher failed",
        "The create teacher request was rejected.",
        "error"
      );
    }
  };

  const [attendanceEditId, setAttendanceEditId] = useState<string | null>(null);
  const openAttendanceModal = (item?: ListItemSummary) => {
    if (item) {
      setAttendanceForm({
        studentName: item.studentName || item.name || item.title || "",
        course: item.course || "software",
        status: item.status || "present",
      });
      setAttendanceEditId(item._id || null);
    } else {
      setAttendanceForm({
        studentName: "",
        course: "software",
        status: "present",
      });
      setAttendanceEditId(null);
    }
    setIsAttendanceModalOpen(true);
  };
  const closeAttendanceModal = () => {
    setIsAttendanceModalOpen(false);
    setAttendanceEditId(null);
  };
  const handleAttendanceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAttendanceForm((s) => ({ ...s, [name]: value }));
  };
  const createAttendanceItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      if (attendanceEditId) {
        const res = await axios.put(
          `https://school-website-backend-7r1r.onrender.com/api/admin/attendance/${attendanceEditId}`,
          attendanceForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = res.data.attendance || res.data;
        setAttendanceRecords((cur) =>
          cur.map((c) => (c._id === attendanceEditId ? updated : c))
        );
        pushSystemLog(
          "Attendance updated",
          `Attendance for ${attendanceForm.studentName}`,
          "success"
        );
        setSuccess("Attendance updated");
      } else {
        const res = await axios.post(
          "https://school-website-backend-7r1r.onrender.com/api/admin/attendance",
          attendanceForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttendanceRecords((cur) => [res.data.attendance, ...cur]);
        pushSystemLog(
          "Attendance created",
          `Attendance for ${attendanceForm.studentName}`,
          "success"
        );
        setSuccess("Attendance recorded");
      }
      setTimeout(() => setSuccess(""), 3000);
      closeAttendanceModal();
    } catch (err) {
      setError("Failed to save attendance");
      setTimeout(() => setError(""), 3000);
      console.log(err);
    }
  };
  const deleteAttendanceItem = async (id: string) => {
    if (!window.confirm("Delete attendance record?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/attendance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceRecords((cur) => cur.filter((r) => r._id !== id));
      pushSystemLog("Attendance deleted", id, "warning");
    } catch {
      setError("Delete failed");
      setTimeout(() => setError(""), 3000);
    }
  };

  const [admissionEditId, setAdmissionEditId] = useState<string | null>(null);
  const openAdmissionModal = (item?: ListItemSummary) => {
    if (item) {
      setAdmissionForm({
        fullname: item.fullname || item.title || item.name || "",
        email: item.email || "",
        course: item.course || "software",
      });
      setAdmissionEditId(item._id || null);
    } else {
      setAdmissionForm({ fullname: "", email: "", course: "software" });
      setAdmissionEditId(null);
    }
    setIsAdmissionModalOpen(true);
  };
  const closeAdmissionModal = () => {
    setIsAdmissionModalOpen(false);
    setAdmissionEditId(null);
  };
  const handleAdmissionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAdmissionForm((s) => ({ ...s, [name]: value }));
  };
  const createAdmissionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      if (admissionEditId) {
        const res = await axios.put(
          `https://school-website-backend-7r1r.onrender.com/api/admin/admissions/${admissionEditId}`,
          admissionForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = res.data.admission || res.data;
        setAdmissionsList((cur) =>
          cur.map((c) => (c._id === admissionEditId ? updated : c))
        );
        pushSystemLog("Admission updated", admissionForm.fullname, "success");
        setSuccess("Admission updated");
      } else {
        const res = await axios.post(
          "https://school-website-backend-7r1r.onrender.com/api/admin/admissions",
          admissionForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdmissionsList((cur) => [res.data.admission, ...cur]);
        pushSystemLog("Admission created", admissionForm.fullname, "success");
        setSuccess("Admission created");
      }
      setTimeout(() => setSuccess(""), 3000);
      closeAdmissionModal();
    } catch {
      setError("Failed to save admission");
      setTimeout(() => setError(""), 3000);
    }
  };
  const deleteAdmissionItem = async (id: string) => {
    if (!window.confirm("Delete admission?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/admissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmissionsList((cur) => cur.filter((a) => a._id !== id));
    } catch {
      setError("Delete failed");
      setTimeout(() => setError(""), 3000);
    }
  };

  const [notificationEditId, setNotificationEditId] = useState<string | null>(
    null
  );
  const openNotificationModal = (item?: ListItemSummary) => {
    if (item) {
      setNotificationForm({
        title: item.title || "",
        message: item.message || item.name || "",
        channel: item.channel || "in-app",
      });
      setNotificationEditId(item._id || null);
    } else {
      setNotificationForm({ title: "", message: "", channel: "in-app" });
      setNotificationEditId(null);
    }
    setIsNotificationModalOpen(true);
  };
  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
    setNotificationEditId(null);
  };
  const handleNotificationChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNotificationForm((s) => ({ ...s, [name]: value }));
  };
  const createNotificationItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      if (notificationEditId) {
        const res = await axios.put(
          `https://school-website-backend-7r1r.onrender.com/api/admin/notifications/${notificationEditId}`,
          notificationForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = res.data.notification || res.data;
        setNotificationsList((cur) =>
          cur.map((c) => (c._id === notificationEditId ? updated : c))
        );
        pushSystemLog(
          "Notification updated",
          notificationForm.title,
          "success"
        );
        setSuccess("Notification updated");
      } else {
        const res = await axios.post(
          "https://school-website-backend-7r1r.onrender.com/api/admin/notifications",
          notificationForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotificationsList((cur) => [res.data.notification, ...cur]);
        pushSystemLog(
          "Notification created",
          notificationForm.title,
          "success"
        );
        setSuccess("Notification created");
      }
      setTimeout(() => setSuccess(""), 3000);
      closeNotificationModal();
    } catch {
      setError("Failed to save notification");
      setTimeout(() => setError(""), 3000);
    }
  };
  const deleteNotificationItem = async (id: string) => {
    if (!window.confirm("Delete notification?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(
        `https://school-website-backend-7r1r.onrender.com/api/admin/notifications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotificationsList((cur) => cur.filter((n) => n._id !== id));
    } catch {
      setError("Delete failed");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "cpu":
        return <Cpu size={20} />;
      case "globe":
        return <Globe size={20} />;
      case "barchart":
        return <BarChart3 size={20} />;
      case "layers":
        return <Layers size={20} />;
      default:
        return <BookOpen size={20} />;
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullname?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      s._id?.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  const filteredAdmins = admins.filter(
    (a) =>
      a.fullname?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      a.email?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      a._id?.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  const filteredTeachers = teachers.filter(
    (t) =>
      t.fullname?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      t.email?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      t._id?.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const filteredAttendance = attendanceRecords.filter(
    (a) =>
      a.studentName?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      a.course?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      a.status?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      a._id?.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const filteredResults = results.filter(
    (r) =>
      r.studentName.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      r.score
        .toString()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      r.term.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      r.grade.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      r._id?.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const adminFirstName = adminInfo?.fullname?.split(" ")[0] || "Administrator";
  const staffAttendancePresent = attendanceRecords.filter(
    (entry) => entry.status?.toLowerCase() === "present"
  ).length;
  const staffAttendanceLate = attendanceRecords.filter(
    (entry) => entry.status?.toLowerCase() === "late"
  ).length;
  const staffAttendanceAbsent = attendanceRecords.filter(
    (entry) => entry.status?.toLowerCase() === "absent"
  ).length;
  const staffAttendanceRate =
    attendanceRecords.length > 0
      ? Math.round((staffAttendancePresent / attendanceRecords.length) * 100)
      : 0;
  const payrollReadyCount = teachers.filter((teacher) => teacher.email).length;
  const recentAttendance = attendanceRecords.slice(0, 4);
  const notificationChannelCounts = notificationsList.reduce(
    (acc, notification) => {
      const channel = (notification.channel || "in-app").toLowerCase();
      if (channel === "announcement") acc.announcement += 1;
      else if (channel === "email") acc.email += 1;
      else if (channel === "sms") acc.sms += 1;
      else acc.inApp += 1;
      return acc;
    },
    { announcement: 0, email: 0, sms: 0, inApp: 0 }
  );
  const recentNotifications = notificationsList.slice(0, 5);
  const classCount = schoolClasses.length;
  const subjectCount = subjectAssignments.length;
  const teachingLoadCount =
    teachers.length > 0
      ? Math.min(subjectAssignments.length, teachers.length)
      : 0;

  const handleClassFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setClassForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubjectFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSubjectForm((current) => ({ ...current, [name]: value }));
  };

  const createClassItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classForm.name.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post<{ message: string; class: SchoolClass }>(
        "https://school-website-backend-7r1r.onrender.com/api/admin/classes",
        {
          name: classForm.name.trim(),
          cohort: classForm.cohort,
          level: classForm.level,
          room: classForm.room.trim() || "TBA",
          teacher: classForm.teacher.trim() || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSchoolClasses((current) => [res.data.class, ...current]);
      setSubjectForm((current) =>
        current.className
          ? current
          : { ...current, className: classForm.name.trim() }
      );
      setClassForm({
        name: "",
        cohort: "software",
        level: "level 1",
        room: "",
        teacher: "",
      });
      setSuccess(`${classForm.name} created.`);
      pushSystemLog(
        "Class created",
        `${classForm.name.trim()} was added to the academic registry.`,
        "success"
      );
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Failed to create class");
      window.setTimeout(() => setError(""), 3000);
    }
  };

  const assignSubjectToClass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectForm.subject.trim() || !subjectForm.className.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post<{
        message: string;
        assignment: SubjectAssignment;
      }>(
        "https://school-website-backend-7r1r.onrender.com/api/admin/subjects",
        {
          subject: subjectForm.subject.trim(),
          className: subjectForm.className.trim(),
          teacher: subjectForm.teacher.trim() || "Unassigned",
          schedule: subjectForm.schedule.trim() || null,
          status: "active",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubjectAssignments((current) => [res.data.assignment, ...current]);
      setSubjectForm({
        subject: "",
        className: subjectForm.className,
        teacher: "",
        schedule: "",
      });
      setSuccess(`${subjectForm.subject} assigned.`);
      pushSystemLog(
        "Subject assigned",
        `${subjectForm.subject} assigned to ${subjectForm.className}.`,
        "success"
      );
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message || "Failed to assign subject"
      );
      window.setTimeout(() => setError(""), 3000);
    }
  };

  const deleteClassItem = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchoolClasses((current) => current.filter((item) => item._id !== id));
      setSuccess("Class deleted.");
      pushSystemLog(
        "Class deleted",
        "Class was removed from the academic registry.",
        "success"
      );
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Failed to delete class");
      window.setTimeout(() => setError(""), 3000);
    }
  };

  const deleteSubjectAssignment = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjectAssignments((current) =>
        current.filter((item) => item._id !== id)
      );
      setSuccess("Subject removed.");
      pushSystemLog(
        "Subject removed",
        "Subject assignment was removed.",
        "success"
      );
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message || "Failed to remove subject"
      );
      window.setTimeout(() => setError(""), 3000);
    }
  };

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [questionForm, setQuestionForm] = useState<ExamQuestion>({
    course: "software",
    level: 1,
    subject: "software",
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 5,
  });

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuestion(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/questions/add",
        questionForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Question node integrated into curriculum.");
      setIsQuestionModalOpen(false);
      pushSystemLog(
        "Question Added",
        `${questionForm.subject}: ${questionForm.questionText.slice(0, 20)}...`,
        "success"
      );
      setQuestionForm({
        course: "software",
        level: 1,
        subject: "software",
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 5,
      });
    } catch {
      setError("Question deployment failed.");
    } finally {
      setIsSubmittingQuestion(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const deleteResult = async (id: string) => {
    if (!window.confirm("Purge result node?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/results/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults((prev) => prev.filter((r) => r._id !== id));
      pushSystemLog("Result Purged", id, "warning");
    } catch {
      setError("Purge failed");
    }
  };

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [examForm, setExamForm] = useState({
    studentName: "",
    subject: "",
    score: "",
    term: "First Term",
  });

  const openExamModal = () => {
    setExamForm({
      studentName: "",
      subject: "",
      score: "",
      term: "First Term",
    });
    setIsExamModalOpen(true);
  };
  const handlePublishResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    const token = localStorage.getItem("token");

    const calculateGrade = (numScore: number) => {
      if (numScore >= 70) return "A";
      if (numScore >= 60) return "B";
      if (numScore >= 50) return "C";
      if (numScore >= 45) return "D";
      return "F";
    };

    const numScore = Number(examForm.score);
    const payload = {
      ...examForm,
      score: numScore,
      grade: calculateGrade(numScore),
    };

    try {
      const res = await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/results",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults((prev) => [res.data.result, ...prev]);
      setSuccess("Academic performance node published.");
      setIsExamModalOpen(false);
      pushSystemLog(
        "Result Published",
        `${payload.studentName} - ${payload.subject}`,
        "success"
      );
    } catch (err) {
      setError("Publication rejected by cluster.");
      console.error(err);
      pushSystemLog(
        "Result Publication Failed",
        `Failed to publish result for ${payload.studentName} - ${payload.subject}.`,
        "error"
      );
    } finally {
      setIsPublishing(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCataloging, setIsCataloging] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "software",
    totalCopies: 1,
    location: "",
  });
  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCataloging(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/library/add",
        bookForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBooks((prev) => [res.data.book, ...prev]);
      setSuccess("Asset cataloged successfully.");
      setIsBookModalOpen(false);
      pushSystemLog(
        "Library Update",
        `Cataloged: ${bookForm.title}`,
        "success"
      );

      setBookForm({
        title: "",
        author: "",
        isbn: "",
        category: "general",
        totalCopies: 1,
        location: "",
      });
    } catch (err) {
      setError("Cataloging sequence failed. Check ISBN uniqueness.");
      console.error(err);
      pushSystemLog(
        "Cataloging Failed",
        `Failed to catalog: ${bookForm.title}`,
        "error"
      );
    } finally {
      setIsCataloging(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isDeployingRoute, setIsDeployingRoute] = useState(false);
  const [routeForm, setRouteForm] = useState({
    routeName: "",
    driverName: "",
    vehicleNumber: "",
    capacity: 15,
    status: "active",
  });
  const handleRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeployingRoute(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/transport/add",
        routeForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoutes((prev) => [res.data.route, ...prev]);
      setSuccess("Transit node deployed to fleet registry.");
      setIsRouteModalOpen(false);
      setRouteForm({
        routeName: "",
        driverName: "",
        vehicleNumber: "",
        capacity: 15,
        status: "active",
      });
    } catch (err) {
      setError("Fleet deployment failed.");
      console.error(err);
    } finally {
      setIsDeployingRoute(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const deleteRoute = async (id: string) => {
    if (!window.confirm("Purge transit node from registry?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/transport/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes((prev) => prev.filter((r) => r._id !== id));
      pushSystemLog(
        "Fleet Purge",
        `Route node ${id.slice(-6)} removed.`,
        "warning"
      );
    } catch {
      setError("Purge rejected.");
    }
  };

  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [hostelForm, setHostelForm] = useState({
    roomNumber: "",
    blockName: "",
    roomType: "Shared",
    capacity: 4,
    status: "available",
  });
  const handleHostelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/hostel/add",
        hostelForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHostelRooms((prev) => [res.data.room, ...prev]);
      setSuccess("Residential node initialized.");
      setIsHostelModalOpen(false);
      pushSystemLog(
        "Hostel Updated",
        `Room ${hostelForm.roomNumber} added to ${hostelForm.blockName}`,
        "success"
      );
    } catch {
      setError("Hostel deployment failed.");
    }
  };

  const deleteRoom = async (id: string) => {
    if (!window.confirm("Purge residential node?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/hostel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHostelRooms((prev) => prev.filter((r) => r._id !== id));
      pushSystemLog("Hostel Purged", id, "warning");
    } catch {
      setError("Purge failed");
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/events/add",
        eventForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents([...events, res.data]);
      setEventForm({ title: "", date: "" });
      pushSystemLog("Event Scheduled", `Date: ${eventForm.date}`, "success");
    } catch {
      setError("Failed to schedule event");
    }
  };

  const deleteEvent = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e._id !== id));
      pushSystemLog("Event Removed", "Event deleted from calendar", "warning");
    } catch {
      setError("Failed to remove event");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("https://school-website-backend-7r1r.onrender.com/api/admin/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleAcceptApplication = async (admissionId: string) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Promote this applicant to a registered student?"))
      return;

    try {
      await axios.post(
        `https://school-website-backend-7r1r.onrender.com/api/admin/admissions/${admissionId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Applicant promoted to student.");
      pushSystemLog(
        "Admission Accepted",
        "Applicant moved to student registry.",
        "success"
      );
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Promotion failed.");
      console.error(err);
      pushSystemLog("Admission Error", "Could not promote applicant.", "error");
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get<StaffMember[]>(
        "https://school-website-backend-7r1r.onrender.com/api/admin/staff",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStaffMembers(res.data);
    } catch (err) {
      setError("Failed to load staff members.");
      console.error("Failed to fetch staff:", err);
    }
  };
  useEffect(() => {
    const loadStaff = async () => {
      await fetchStaff();
    };

    loadStaff();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://school-website-backend-7r1r.onrender.com/api/admin/users/${userId}/role`,
        { newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchStaff();
      setEditingUser(null);
      setSuccess("Role updated successfully.");
      setTimeout(() => setSuccess(""), 3000);

      pushSystemLog(
        "Role Updated",
        `Changed user ${userId} to ${newRole}`,
        "success"
      );
    } catch (err) {
      setError("Failed to update role.");
      console.error(err);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    const fetchAdminCourses = async () => {
      try {
        const response = await fetch(
          "https://school-website-backend-7r1r.onrender.com/api/admin/courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setAdminCourses(data.courses);
        } else {
          console.error(data.message || "Failed to load courses");
        }
      } catch (err) {
        console.error("Error loading admin courses:", err);
      }
    };

    fetchAdminCourses();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    code: "",
    schedule: "",
  });
  const [formSubmitLoading, setFormSubmitLoading] = useState<boolean>(false);
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/courses/create",
        newCourse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAdminCourses((prevCourses) => [
          response.data.course,
          ...prevCourses,
        ]);

        setNewCourse({
          title: "",
          description: "",
          instructor: "",
          code: "",
          schedule: "",
        });

        setIsModalOpen(false);

        setError("Course created successfully!");
      }
    } catch (err) {
      console.error("Error creating course:", err);

      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        alert(serverMessage || "Failed to create course. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `https://school-website-backend-7r1r.onrender.com/api/admin/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setAdminCourses((prev) =>
          prev.filter((course) => course._id !== courseId)
        );
        setError("Course deleted successfully");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete course.");
    }
  };

  const openEditModal = (course: Course) => {
    setEditingId(course._id);
    setNewCourse({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      code: course.code,
      schedule: course.schedule,
    });
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingId
      ? `https://school-website-backend-7r1r.onrender.com/api/admin/courses/${editingId}`
      : "https://school-website-backend-7r1r.onrender.com/api/admin/courses/create";

    try {
      const response = await axios({
        method: editingId ? "put" : "post",
        url: url,
        data: newCourse,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        if (editingId) {
          setAdminCourses((prev) =>
            prev.map((c) => (c._id === editingId ? response.data.course : c))
          );
        } else {
          setAdminCourses((prev) => [response.data.course, ...prev]);
        }
        setIsModalOpen(false);
        setEditingId(null);
      }
    } catch (err) {
      console.error("Full Debug Error:", err);

      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        const status = err.response?.status;

        setError(
          `Error (${status}): ${
            serverMessage || err.message || "Unknown Server Error"
          }`
        );
      } else {
        setError("An unexpected JavaScript error occurred.");
      }
    }
  };

  const [newAssignment, setNewAssignment] = useState<AssignmentForm>({
    title: "",
    description: "",
    courseName: "",
    dueDate: "",
    attachments: [],
  });

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/assignments",
        newAssignment,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdminAssignments((prev) => [
        response.data.assignment || response.data,
        ...prev,
      ]);
      setIsCreateModalOpen(false);
      setNewAssignment({
        title: "",
        description: "",
        courseName: "",
        dueDate: "",
        attachments: [],
      });
    } catch (err) {
      setError("Failed to dispatch new assessment to database vector.");
      console.error(err);
    }
  };

  const handleAddAttachment = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();

    const input = document.getElementById(
      "attachment-input"
    ) as HTMLInputElement;
    const value = input?.value.trim();

    if (value && !newAssignment.attachments.includes(value)) {
      setNewAssignment((prev) => ({
        ...prev,
        attachments: [...prev.attachments, value],
      }));
      input.value = "";
      input.focus();
    } else if (newAssignment.attachments.includes(value)) {
      setError("This resource is already attached!");
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/assignments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdminAssignments((prev) =>
        prev.filter((assignment) => assignment._id !== id)
      );
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleUpdateAssignment = async (
    id: string,
    updatedData: AdminAssignment
  ) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://school-website-backend-7r1r.onrender.com/api/admin/assignments/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEditingAssignment(null);
        setSuccess("Task Vector updated successfully!");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "https://school-website-backend-7r1r.onrender.com/api/admin/sessions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSessions(res.data.sessions || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://school-website-backend-7r1r.onrender.com/api/admin/sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://school-website-backend-7r1r.onrender.com/api/admin/sessions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(formData);
      setSessions((prev) => [...prev, response.data.session || response.data]);
      setIsCreateSessionOpen(false);
      setFormData({ title: "", date: "", time: "", location: "" });
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  const navItems = [
    { icon: <LayoutDashboard size={22} />, label: "Overview" },
    { icon: <Users size={22} />, label: "Students" },
    { icon: <UserCheck size={22} />, label: "Admins" },
    { icon: <GraduationCap size={22} />, label: "Teachers/Staff" },
    { icon: <Bell size={22} />, label: "Notifications" },

    { icon: <BookOpen size={22} />, label: "Classes & Subjects" },
    { icon: <Cpu size={22} />, label: "Curriculum" },
    { icon: <BookOpen size={22} />, label: "Courses" },
    { icon: <ClipboardList size={22} />, label: "Assessment" },
    { icon: <TrendingUp size={22} />, label: "Attendance" },
    { icon: <FileText size={22} />, label: "Grades" },

    { icon: <BookOpen size={22} />, label: "Library" },
    { icon: <Globe size={22} />, label: "Transport" },
    { icon: <Layers size={22} />, label: "Hostel/Dormitory" },

    { icon: <Mail size={22} />, label: "Communication" },
    { icon: <Calendar size={22} />, label: "Events & Calendar" },
    { icon: <BarChart3 size={22} />, label: "Reports & Analytics" },
    { icon: <CreditCard size={22} />, label: "Fees & Payments" },
    { icon: <UserPlus size={22} />, label: "Admissions" },
    { icon: <Timer size={22} />, label: "Schedule" },

    { icon: <Settings size={22} />, label: "Settings" },
    { icon: <FileText size={22} />, label: "System Logs" },
  ];

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F172A]">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-slate-400 font-bold tracking-[0.4em] text-[10px] uppercase">
          Mounting Privilege Matrix
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
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-5 mt-6 text-rose-500 font-bold border-t border-slate-100 uppercase tracking-widest text-xs"
                >
                  <LogOut size={20} /> logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col py-8 h-screen sticky top-0">
        <div className="flex items-center gap-4 px-8 mb-10">
          <img
            src="/favicon.svg"
            alt="Logo"
            className="w-12 h-12 rounded-xl shadow-xl shadow-blue-100"
          />
          <span className="text-xl font-black tracking-tighter uppercase tracking-widest">
            PRECIOUS ACADEMY
          </span>
        </div>

        <nav className="flex-grow px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative ${
                activeTab === item.label
                  ? "text-indigo-600 bg-indigo-50/50 font-bold"
                  : "text-slate-400"
              }`}
            >
              {activeTab === item.label && (
                <motion.div
                  layoutId="admin-nav-pill"
                  className="absolute left-0 w-1.5 h-6 bg-indigo-600 rounded-full"
                />
              )}
              {item.icon} <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 pt-4 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm uppercase tracking-widest"
          >
            <LogOut size={22} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen bg-[#F8FAFC]/50 custom-scrollbar">
        <header className="px-6 md:px-12 py-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-[50] border-b border-slate-100">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 bg-white border border-slate-100 rounded-2xl shadow-sm"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100/50 rounded-2xl px-4 py-2 border border-slate-100 focus-within:bg-white transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Query database indexes..."
                className="bg-transparent border-none outline-none px-3 py-1.5 text-sm font-medium w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleManualRefresh}
              className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all"
              disabled={refreshing}
            >
              <RefreshCw
                size={20}
                className={refreshing ? "animate-spin text-indigo-600" : ""}
              />
            </button>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-black">{adminInfo?.fullname}</span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">
                Root Authority
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-slate-900 flex items-center justify-center text-white font-black uppercase shadow-lg shadow-indigo-100">
              {adminFirstName.charAt(0)}
            </div>
          </div>
        </header>

        {(error || success) && (
          <div className="px-6 md:px-12 pt-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="px-6 md:px-12 py-6">
          <AnimatePresence mode="wait">
            {activeTab === "Overview" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-12 text-left"
              >
                <div className="relative p-8 md:p-12 rounded-[3.5rem] bg-[#0F172A] text-white overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -ml-20 -mb-20" />

                  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-4 py-2 rounded-full text-indigo-400 text-[10px] font-black uppercase mb-6 tracking-widest border border-indigo-500/30">
                        <Sparkles size={14} /> Neural Interface Active
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                        Welcome back, <br />
                        <span className="text-indigo-400">
                          {adminFirstName}.
                        </span>
                      </h1>
                      <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed">
                        The institutional cluster is currently monitoring{" "}
                        <span className="text-white font-bold">
                          {stats.totalStudents} authenticated nodes
                        </span>
                        . System integrity is{" "}
                        <span className="text-emerald-400 font-bold">
                          Optimal
                        </span>
                        .
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setActiveTab("Notifications")}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        Broadcast Alert
                      </button>
                      <button
                        onClick={() => setActiveTab("Students")}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all"
                      >
                        Audit Registry
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Global Registry",
                      val: stats.totalStudents,
                      color: "indigo",
                      icon: <Users />,
                      detail: "Total Students",
                    },
                    {
                      label: "Engineering",
                      val: stats.softwareStudents,
                      color: "blue",
                      icon: <Cpu />,
                      detail: "Software Cohort",
                    },
                    {
                      label: "Linguistics",
                      val: stats.linguisticsStudents,
                      color: "emerald",
                      icon: <Globe />,
                      detail: "Modern Languages",
                    },
                    {
                      label: "Management",
                      val: stats.businessStudents,
                      color: "amber",
                      icon: <BarChart3 />,
                      detail: "Business Sector",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div
                        className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                      >
                        {stat.icon}
                      </div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                        {stat.label}
                      </p>
                      <h3 className="text-3xl font-black text-slate-900">
                        {stat.val}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold mt-2 flex items-center gap-1">
                        <TrendingUp size={12} className="text-emerald-500" />{" "}
                        {stat.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                            Academic Signals
                          </h3>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Latest result publications
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab("Grades")}
                          className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                        >
                          Full Ledger
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.slice(0, 4).map((res) => (
                          <div
                            key={res._id}
                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
                          >
                            <div className="min-w-0">
                              <p className="font-black text-xs text-slate-900 truncate">
                                {res.studentName}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                {res.subject}
                              </p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-lg font-black text-xs ${
                                res.grade === "F"
                                  ? "text-rose-500 bg-rose-50"
                                  : "text-indigo-600 bg-indigo-50"
                              }`}
                            >
                              {res.score}%
                            </div>
                          </div>
                        ))}
                        {results.length === 0 && (
                          <p className="col-span-2 text-center py-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            No results synchronized
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">
                            Live Activity Feed
                          </h3>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            Latest system events
                          </p>
                        </div>
                        <button
                          onClick={handleManualRefresh}
                          className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 transition-colors"
                        >
                          <RefreshCw
                            size={18}
                            className={refreshing ? "animate-spin" : ""}
                          />
                        </button>
                      </div>
                      <div className="p-4 space-y-2">
                        {systemLogs.length > 0 ? (
                          systemLogs.slice(0, 5).map((log) => (
                            <div
                              key={log.id}
                              className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                            >
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  log.level === "success"
                                    ? "bg-emerald-500"
                                    : log.level === "error"
                                    ? "bg-rose-500"
                                    : "bg-indigo-500"
                                }`}
                              />
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-black text-slate-800">
                                  {log.message}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                  {log.detail}
                                </p>
                              </div>
                              <span className="text-[10px] font-black text-slate-300 uppercase shrink-0">
                                {log.timestamp}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-12 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                            No recent activity signals
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                          <UserPlus size={18} />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">
                          New Admissions
                        </h4>
                      </div>
                      <div className="space-y-4">
                        {admissionsList.slice(0, 3).map((adm) => (
                          <div key={adm._id} className="group cursor-pointer">
                            <p className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {adm.fullname}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                              {adm.course} • Pending
                            </p>
                          </div>
                        ))}
                        {admissionsList.length === 0 && (
                          <p className="text-xs text-slate-400 font-bold italic">
                            No pending applications
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setActiveTab("Admissions")}
                        className="w-full mt-6 py-3 rounded-xl bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                      >
                        Review Queue
                      </button>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">
                        Cluster Status
                      </h4>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10">
                            <CheckCircle size={20} />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-black">Database Core</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">
                              Synchronized
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 border border-white/10">
                            <Clock size={20} />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-black">API Latency</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">
                              24ms (Optimal)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-xl shadow-indigo-200">
                      <Cpu className="mb-4 opacity-50" size={32} />
                      <p className="text-lg font-black leading-tight mb-6">
                        Deploy new curriculum modules instantly.
                      </p>
                      <button
                        onClick={openDeployModal}
                        className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                      >
                        Launch Builder
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Students" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Student Registry
                    </h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      Database Management & Credentials
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleExportIDs();
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all"
                    >
                      <CreditCard size={16} /> Batch ID Export
                    </button>
                    <button
                      onClick={() => openStudentModal()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      <Plus size={16} /> Add New Node
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="py-5 px-8">Student Detail</th>
                          <th className="py-5 px-6">Parent/Guardian Info</th>
                          <th className="py-5 px-6">Credential Status</th>
                          <th className="py-5 px-8 text-right">
                            Administrative Interventions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm font-medium">
                        {filteredStudents.map((student) => (
                          <tr
                            key={student._id}
                            className="hover:bg-slate-50/40 transition-colors group"
                          >
                            <td className="py-5 px-8">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">
                                  {student.fullname.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900">
                                    {student.fullname}
                                  </p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {student.course} Specialist
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 px-6">
                              <p className="text-xs font-black text-slate-700">
                                {student.parentGuardianName || "Not Linked"}
                              </p>
                              <p className="text-[10px] font-bold text-indigo-500">
                                {student.parentGuardianPhone || "No Contact"}
                              </p>
                            </td>
                            <td className="py-5 px-6">
                              <button
                                onClick={() => {}}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                              >
                                <CreditCard size={12} /> ID Issued
                              </button>
                            </td>
                            <td className="py-5 px-8 text-right">
                              <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                  title="View Profile"
                                  onClick={() => setViewingCard(student)}
                                  className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-indigo-600 hover:border-indigo-100 transition-all"
                                >
                                  <UserCheck size={15} />
                                </button>

                                <button
                                  title="Edit Student"
                                  onClick={() => openStudentModal(student)}
                                  className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-amber-600 hover:border-amber-100 transition-all"
                                >
                                  <Settings size={15} />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteStudent(student._id)
                                  }
                                  className="p-2.5 bg-white border border-slate-100 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Admins" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      Admins
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Privileged user registry and contact directory
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
                      {filteredAdmins.length} Admin
                      {filteredAdmins.length === 1 ? "" : "s"}
                    </div>
                    <button
                      onClick={openAdminModal}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      <Plus size={15} /> Add Admin
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          <th className="py-5 px-8 text-left">Admin</th>
                          <th className="py-5 px-6 text-left">Email</th>
                          <th className="py-5 px-6 text-left">Access</th>
                          <th className="py-5 px-8 text-right">Contact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm font-medium">
                        {filteredAdmins.length > 0 ? (
                          filteredAdmins.map((admin) => (
                            <tr
                              key={admin._id}
                              className="group hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="py-5 px-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-700 to-indigo-600 flex items-center justify-center font-black text-white uppercase shadow-sm">
                                    {admin.fullname?.charAt(0) || "?"}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-black text-slate-900 truncate">
                                        {admin.fullname}
                                      </span>
                                      {admin._id === adminInfo?._id && (
                                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded-md uppercase tracking-wider shrink-0">
                                          You
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                      Administrator account
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 px-6">
                                <a
                                  href={`mailto:${admin.email}`}
                                  className="font-bold text-slate-600 hover:text-indigo-600 transition-colors break-all"
                                >
                                  {admin.email}
                                </a>
                              </td>
                              <td className="py-5 px-6">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                  Full access
                                </span>
                              </td>
                              <td className="py-5 px-8 text-right">
                                <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                  <a
                                    href={`mailto:${admin.email}`}
                                    className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-indigo-600 hover:border-indigo-100 transition-all"
                                    aria-label={`Email ${admin.fullname}`}
                                  >
                                    <Mail size={15} />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-16 px-8 text-center">
                              <div className="inline-flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                  <UserCheck size={22} />
                                </div>
                                <div>
                                  <p className="font-black text-slate-900">
                                    No admins found
                                  </p>
                                  <p className="text-slate-400 text-sm mt-1">
                                    Try a different search term or refresh the
                                    dashboard.
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Curriculum" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-12"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      Curriculum Datastream
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Institutional Academic Architecture
                    </p>
                  </div>
                  <button
                    onClick={openDeployModal}
                    className="flex items-center gap-3 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    <Plus size={16} /> Deploy New Module
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {curriculum.map((module) => {
                    const theme =
                      {
                        software: "indigo",
                        linguistics: "emerald",
                        business: "amber",
                      }[module.cohort?.toLowerCase()] || "slate";
                    return (
                      <div
                        key={module._id}
                        className="group bg-white p-8 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-8">
                          <div
                            className={`p-4 bg-${theme}-50 text-${theme}-600 rounded-[1.5rem] group-hover:bg-${theme}-600 group-hover:text-white transition-colors`}
                          >
                            {getIcon(module.iconType)}
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteModule(module._id, module.title)
                            }
                            className="p-2.5 bg-slate-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p
                          className={`text-[9px] font-black uppercase tracking-widest text-${theme}-600 mb-2`}
                        >
                          {module.cohort} Engineering
                        </p>
                        <h4 className="text-lg font-black leading-tight mb-8">
                          {module.title}
                        </h4>
                        <div className="space-y-3 mb-8">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${module.progress}%` }}
                              className={`h-full bg-${theme}-600`}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((u) => (
                              <div
                                key={u}
                                className="w-7 h-7 rounded-full border-2 border-white bg-slate-200"
                              />
                            ))}
                          </div>
                          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {curriculum.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                    <Sparkles className="text-slate-200 mb-4" size={32} />
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                      No modules synchronized
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "Courses" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 p-6 bg-white rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Course Management
                    </h2>
                    <p className="text-sm text-gray-500">
                      Manage, monitor, and create academic courses.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    + Create New Course
                  </button>

                  {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                          Create New Course
                        </h3>

                        <form
                          onSubmit={handleCreateCourse}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                              Course Title
                            </label>
                            <input
                              type="text"
                              required
                              value={newCourse.title}
                              onChange={(e) =>
                                setNewCourse({
                                  ...newCourse,
                                  title: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                                Course Code
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. CS101"
                                value={newCourse.code}
                                onChange={(e) =>
                                  setNewCourse({
                                    ...newCourse,
                                    code: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                                Instructor
                              </label>
                              <input
                                type="text"
                                required
                                value={newCourse.instructor}
                                onChange={(e) =>
                                  setNewCourse({
                                    ...newCourse,
                                    instructor: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                              Schedule
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Mon/Wed 10:00 AM"
                              value={newCourse.schedule}
                              onChange={(e) =>
                                setNewCourse({
                                  ...newCourse,
                                  schedule: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                              Description
                            </label>
                            <textarea
                              required
                              rows={3}
                              value={newCourse.description}
                              onChange={(e) =>
                                setNewCourse({
                                  ...newCourse,
                                  description: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                          </div>

                          <div className="flex justify-end space-x-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsModalOpen(false)}
                              className="px-4 py-2 border text-gray-600 rounded hover:bg-gray-50 text-sm transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={formSubmitLoading}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium disabled:bg-blue-400 transition-colors"
                            >
                              {formSubmitLoading
                                ? "Creating..."
                                : "Save Course"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Instructor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled Students
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {adminCourses.map((course) => (
                        <tr
                          key={course._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {course.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.instructor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {course.students?.length || 0} Students
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <button
                              onClick={() => openEditModal(course)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "Teachers/Staff" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 pb-12"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Teachers & Staff</h2>
                    <p className="text-slate-400 text-[10px]">
                      Manage teacher profiles, attendance, payroll and
                      assignments.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={openTeacherModal}
                      className="px-4 py-2 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2"
                    >
                      <Plus size={16} /> Add Teacher
                    </button>
                    <button
                      onClick={handleManualRefresh}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-2xl"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="font-black mb-4">Teacher Directory</h3>
                    {filteredTeachers.length === 0 ? (
                      <p className="text-slate-400 text-sm">
                        No teachers loaded. Use Refresh to fetch.
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {filteredTeachers.map((t) => (
                          <li
                            key={t._id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <div className="font-black">{t.fullname}</div>
                              <div className="text-[11px] text-slate-400">
                                {t.email}
                              </div>
                            </div>
                            <div className="text-[11px] text-indigo-600 font-black">
                              {t._id.slice(-6)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
                          Attendance & Payroll
                        </p>
                        <h3 className="font-black text-slate-900 text-xl leading-tight">
                          Staff operations snapshot
                        </h3>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        {staffAttendanceRate}% present
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Staff
                        </p>
                        <div className="mt-2 text-2xl font-black text-slate-900">
                          {teachers.length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Profiles loaded
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Attendance
                        </p>
                        <div className="mt-2 text-2xl font-black text-slate-900">
                          {attendanceRecords.length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Entries recorded
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Payroll ready
                        </p>
                        <div className="mt-2 text-2xl font-black text-slate-900">
                          {payrollReadyCount}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Eligible staff
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Attendance breakdown</span>
                        <span>Present / Late / Absent</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{
                            width: `${Math.max(staffAttendanceRate, 8)}%`,
                          }}
                        />
                        <div
                          className="h-2 rounded-full bg-amber-400"
                          style={{
                            width: `${
                              attendanceRecords.length > 0
                                ? Math.max(
                                    Math.round(
                                      (staffAttendanceLate /
                                        attendanceRecords.length) *
                                        100
                                    ),
                                    8
                                  )
                                : 8
                            }%`,
                          }}
                        />
                        <div
                          className="h-2 rounded-full bg-rose-400"
                          style={{
                            width: `${
                              attendanceRecords.length > 0
                                ? Math.max(
                                    Math.round(
                                      (staffAttendanceAbsent /
                                        attendanceRecords.length) *
                                        100
                                    ),
                                    8
                                  )
                                : 8
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-900">
                          Recent attendance logs
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Latest 4
                        </span>
                      </div>
                      <div className="space-y-2">
                        {recentAttendance.length > 0 ? (
                          recentAttendance.map((record) => {
                            const status =
                              record.status?.toLowerCase() || "present";
                            const statusStyles =
                              {
                                present:
                                  "bg-emerald-50 text-emerald-700 border-emerald-100",
                                late: "bg-amber-50 text-amber-700 border-amber-100",
                                absent:
                                  "bg-rose-50 text-rose-700 border-rose-100",
                              }[status as "present" | "late" | "absent"] ||
                              "bg-slate-50 text-slate-700 border-slate-100";

                            return (
                              <div
                                key={record._id}
                                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3"
                              >
                                <div className="min-w-0">
                                  <p className="font-black text-slate-900 truncate">
                                    {record.studentName ||
                                      record.name ||
                                      record.title ||
                                      "Unnamed record"}
                                  </p>
                                  <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
                                    {record.course || "staff"} attendance
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span
                                    className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusStyles}`}
                                  >
                                    {record.status || "present"}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    {record.date
                                      ? new Date(
                                          record.date
                                        ).toLocaleDateString([], {
                                          month: "short",
                                          day: "numeric",
                                        })
                                      : "Today"}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center">
                            <p className="font-black text-slate-900">
                              No attendance logs yet
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                              Use the attendance panel to start tracking staff
                              activity.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                          Payroll status
                        </p>
                        <p className="mt-2 font-black text-slate-900">
                          Ready for next run
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Review attendance before processing salaries.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Flagged entries
                        </p>
                        <p className="mt-2 font-black text-slate-900">
                          {staffAttendanceLate + staffAttendanceAbsent}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Late or absent logs to verify.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Classes & Subjects" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black">Classes & Subjects</h2>
                    <p className="text-slate-400 text-[10px]">
                      Create classes, assign subjects, schedule timetables and
                      manage departments.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="px-3 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {classCount} Classes
                    </span>
                    <span className="px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {subjectCount} Subjects
                    </span>
                    <span className="px-3 py-2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {teachingLoadCount} Teachers linked
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 mb-2">
                          Class Builder
                        </p>
                        <h3 className="text-xl font-black text-slate-900">
                          Create a class
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <BookOpen size={20} />
                      </div>
                    </div>

                    <form
                      onSubmit={createClassItem}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Class name
                        </span>
                        <input
                          name="name"
                          value={classForm.name}
                          onChange={handleClassFormChange}
                          required
                          placeholder="Primary 5A"
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Cohort
                        </span>
                        <select
                          name="cohort"
                          value={classForm.cohort}
                          onChange={handleClassFormChange}
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                        >
                          <option value="software">Software</option>
                          <option value="linguistics">Linguistics</option>
                          <option value="business">Business</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Level
                        </span>
                        <select
                          name="level"
                          value={classForm.level}
                          onChange={handleClassFormChange}
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                        >
                          <option value="level 1">Level 1</option>
                          <option value="level 2">Level 2</option>
                          <option value="level 3">Level 3</option>
                          <option value="level 4">Level 4</option>
                          <option value="level 5">Level 5</option>
                          <option value="level 6">Level 6</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Room
                        </span>
                        <input
                          name="room"
                          value={classForm.room}
                          onChange={handleClassFormChange}
                          placeholder="Block A / Room 3"
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Class teacher
                        </span>
                        <select
                          name="teacher"
                          value={classForm.teacher}
                          onChange={handleClassFormChange}
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                        >
                          <option value="">Unassigned</option>
                          {teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher.fullname}>
                              {teacher.fullname}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="md:col-span-2 flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black flex items-center gap-2"
                        >
                          <Plus size={16} /> Create Class
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-2">
                          Subject Assignment
                        </p>
                        <h3 className="text-xl font-black text-slate-900">
                          Assign a subject
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Layers size={20} />
                      </div>
                    </div>

                    <form
                      onSubmit={assignSubjectToClass}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Subject name
                        </span>
                        <input
                          name="subject"
                          value={subjectForm.subject}
                          onChange={handleSubjectFormChange}
                          required
                          placeholder="Mathematics"
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Class
                        </span>
                        <select
                          name="className"
                          value={subjectForm.className}
                          onChange={handleSubjectFormChange}
                          required
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                        >
                          <option value="">Select class</option>
                          {schoolClasses.map((item) => (
                            <option key={item._id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Teacher
                        </span>
                        <select
                          name="teacher"
                          value={subjectForm.teacher}
                          onChange={handleSubjectFormChange}
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                        >
                          <option value="">Unassigned</option>
                          {teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher.fullname}>
                              {teacher.fullname}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Schedule
                        </span>
                        <input
                          name="schedule"
                          value={subjectForm.schedule}
                          onChange={handleSubjectFormChange}
                          placeholder="Mon 8:00 AM - 9:00 AM"
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                        />
                      </label>
                      <div className="md:col-span-2 flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black flex items-center gap-2"
                        >
                          <Plus size={16} /> Assign Subject
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                          Class Registry
                        </p>
                        <h3 className="text-lg font-black text-slate-900">
                          Created classes
                        </h3>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {schoolClasses.length} total
                      </span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {schoolClasses.length > 0 ? (
                        schoolClasses.map((item) => (
                          <div
                            key={item._id}
                            className="px-6 py-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                          >
                            <div className="min-w-0 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-black text-slate-900 truncate">
                                  {item.name}
                                </h4>
                                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
                                  {item.cohort}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500">
                                {item.level} · {item.room}
                              </p>
                              <p className="text-[11px] font-medium text-slate-400">
                                Class teacher: {item.teacher}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteClassItem(item._id)}
                              className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-16 text-center">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                            <BookOpen size={26} />
                          </div>
                          <p className="font-black text-slate-900">
                            No classes created yet
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            Use the class builder to start the timetable
                            structure.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                          Subject Map
                        </p>
                        <h3 className="text-lg font-black text-slate-900">
                          Assignments
                        </h3>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {subjectAssignments.length} total
                      </span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {subjectAssignments.length > 0 ? (
                        subjectAssignments.map((item) => (
                          <div
                            key={item._id}
                            className="px-6 py-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                          >
                            <div className="min-w-0 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-black text-slate-900 truncate">
                                  {item.subject}
                                </h4>
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                  {item.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500">
                                {item.className}
                              </p>
                              <p className="text-[11px] font-medium text-slate-400">
                                {item.teacher} · {item.schedule}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteSubjectAssignment(item._id)}
                              className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                              aria-label={`Delete ${item.subject}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-16 text-center">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                            <Layers size={26} />
                          </div>
                          <p className="font-black text-slate-900">
                            No subjects assigned yet
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            Map a subject to a class to populate the timetable.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Attendance" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 pb-12"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Attendance</h2>
                    <p className="text-slate-400 text-[10px]">
                      Real-time student and staff attendance tracking with daily
                      analytics.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openAttendanceModal()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-2xl font-bold text-sm"
                    >
                      Record Attendance
                    </button>
                    <button
                      onClick={handleManualRefresh}
                      className="px-4 py-2 bg-slate-100 rounded-2xl font-medium"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <motion.div
                    className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 border border-emerald-200"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-1">
                          Present
                        </p>
                        <p className="text-3xl font-black text-emerald-900">
                          {
                            attendanceRecords.filter(
                              (r) => r.status === "present"
                            ).length
                          }
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center text-emerald-700">
                        <UserCheck size={24} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 border border-rose-200"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mb-1">
                          Absent
                        </p>
                        <p className="text-3xl font-black text-rose-900">
                          {
                            attendanceRecords.filter(
                              (r) => r.status === "absent"
                            ).length
                          }
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-rose-200 flex items-center justify-center text-rose-700">
                        <Users size={24} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 border border-amber-200"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest mb-1">
                          Late
                        </p>
                        <p className="text-3xl font-black text-amber-900">
                          {
                            filteredAttendance.filter(
                              (r) => r.status === "late"
                            ).length
                          }
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center text-amber-700">
                        <Clock size={24} />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {attendanceRecords.length} records
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {filteredAttendance.length === 0 ? (
                      <div className="px-6 py-16 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                          <Calendar size={26} />
                        </div>
                        <p className="font-black text-slate-900">
                          No attendance records
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          Start recording daily attendance to populate this
                          section.
                        </p>
                      </div>
                    ) : (
                      filteredAttendance.map((r) => {
                        const statusColor =
                          r.status === "present"
                            ? "emerald"
                            : r.status === "absent"
                            ? "rose"
                            : "amber";
                        const statusIcon =
                          r.status === "present"
                            ? "✓"
                            : r.status === "absent"
                            ? "✕"
                            : "⏱";
                        return (
                          <div
                            key={r._id}
                            className="px-6 py-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                          >
                            <div className="flex items-start gap-4 flex-1">
                              <div
                                className={`w-10 h-10 rounded-xl bg-${statusColor}-100 text-${statusColor}-600 flex items-center justify-center font-black text-xs`}
                              >
                                {statusIcon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900">
                                  {r.studentName || r.name || "Unknown"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  Course:{" "}
                                  <span className="font-medium text-slate-700">
                                    {r.course || "N/A"}
                                  </span>
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {new Date(
                                    r.date || r.createdAt || ""
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full bg-${statusColor}-50 text-${statusColor}-700 text-[10px] font-black uppercase tracking-widest`}
                              >
                                {r.status}
                              </span>
                              <button
                                onClick={() => openAttendanceModal(r)}
                                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                              >
                                <Sparkles size={14} />
                              </button>
                              <button
                                onClick={() => deleteAttendanceItem(r._id)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {(activeTab === "Grades" || activeTab === "Exams & Results") && (
              <div className="space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      Academic Performance
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Manage results and examination nodes
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsQuestionModalOpen(true)}
                      className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                    >
                      <Plus size={16} /> Add Question
                    </button>

                    <button
                      onClick={openExamModal}
                      className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                    >
                      <Plus size={16} /> Publish Result
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto text-left">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          <th className="p-6">Student</th>
                          <th className="p-6">Subject / Term</th>
                          <th className="p-6">Score</th>
                          <th className="p-6">Grade</th>
                          <th className="p-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredResults.map((res) => (
                          <tr
                            key={res._id}
                            className="hover:bg-slate-50/30 transition-colors group"
                          >
                            <td className="p-6 font-black text-slate-900">
                              {res.studentName}
                            </td>
                            <td className="p-6">
                              <span className="font-bold text-slate-600">
                                {res.subject}
                              </span>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                {res.term}
                              </p>
                            </td>
                            <td className="p-6 font-mono font-bold text-indigo-600">
                              {res.score}%
                            </td>
                            <td className="p-6">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  res.grade === "F"
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-emerald-50 text-emerald-600"
                                }`}
                              >
                                Grade {res.grade}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <button
                                onClick={() => deleteResult(res._id)}
                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Schedule" && (
              <motion.div
                key="admin-schedule"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-12"
              >
                <AnimatePresence>
                  {isCreateSessionOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <form
                        onSubmit={handleCreate}
                        className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 mb-8 grid grid-cols-2 gap-4"
                      >
                        <div className="col-span-2">
                          <h3 className="text-xl font-bold mb-2">
                            New Session
                          </h3>
                        </div>
                        <input
                          className="p-3 rounded-xl border border-slate-200"
                          placeholder="Session Title"
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                        />
                        <input
                          className="p-3 rounded-xl border border-slate-200"
                          type="date"
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          required
                        />
                        <input
                          className="p-3 rounded-xl border border-slate-200"
                          placeholder="Time (e.g. 10:00 AM)"
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          required
                        />
                        <input
                          className="p-3 rounded-xl border border-slate-200"
                          placeholder="Location"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          required
                        />
                        <div className="col-span-2 flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium"
                          >
                            Save Session
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCreateSessionOpen(false)}
                            className="text-slate-500 px-6 py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">All Sessions</h2>
                    {!isCreateSessionOpen && (
                      <button
                        onClick={() => setIsCreateSessionOpen(true)}
                        className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors"
                      >
                        + Add Session
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div
                        key={session._id}
                        className="group border border-slate-100 rounded-2xl p-5 flex items-center justify-between hover:border-indigo-200 transition-all"
                      >
                        <div>
                          <h3 className="font-bold text-lg">{session.title}</h3>
                          <div className="flex gap-4 text-sm text-slate-500">
                            <span>
                              {new Date(session.date).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{session.time}</span>
                            <span>•</span>
                            <span>{session.location}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(session._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Assessment" && (
              <motion.div
                key="admin-assignments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-12"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Assessment Dispatch Engine
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                      Curriculum Administration Layer
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2 self-start md:self-auto"
                  >
                    <Sparkles size={14} className="text-blue-400" /> Create
                    Assessment
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">
                        Active Curricular Tasks
                      </p>
                      <h3 className="text-2xl font-black text-slate-900">
                        {adminAssignments.length}
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
                      <ClipboardList size={18} />
                    </div>
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">
                        Awaiting Grading
                      </p>
                      <h3 className="text-2xl font-black text-amber-600">14</h3>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-sm">
                      <Clock size={18} />
                    </div>
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">
                        Avg Completion Rate
                      </p>
                      <h3 className="text-2xl font-black text-emerald-600">
                        88.4%
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/50">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Task Information
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Course Node
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Target Type
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Due Matrix Date
                          </th>
                          <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {adminAssignments.map((assignment) => (
                          <tr
                            key={assignment._id}
                            className="hover:bg-slate-50/40 transition-colors group"
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="font-black text-slate-900 block text-sm">
                                    {assignment.title}
                                  </span>
                                  <span className="text-xs text-slate-400 truncate max-w-xs block font-medium mt-0.5">
                                    {assignment.description}
                                  </span>
                                </div>

                                {assignment.attachments?.length > 0 && (
                                  <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-500 rounded-md border border-blue-100">
                                    <Paperclip size={10} />
                                    <span className="text-[9px] font-black">
                                      {assignment.attachments.length}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                {typeof assignment.course === "object"
                                  ? assignment.course.cohort ||
                                    assignment.course.name
                                  : assignment.courseName || "Unassigned"}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-500 capitalize">
                                  {assignment.type || "Standard Project"}
                                </span>
                                <span className="text-[9px] text-slate-300 font-black uppercase tracking-tighter">
                                  Vector Dispatch
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-xs text-slate-400 font-medium">
                              {assignment.dueDate
                                ? new Date(
                                    assignment.dueDate
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "Open Ended"}
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="text-[10px] font-black tracking-widest uppercase text-blue-600 hover:text-blue-800 transition-colors mr-2">
                                  Track Metrics
                                </button>

                                <button
                                  onClick={() =>
                                    setEditingAssignment(assignment)
                                  }
                                  className="p-2 text-slate-300 hover:text-amber-500 rounded-lg hover:bg-amber-50 transition-all group-hover:scale-105 duration-200"
                                  title="Modify Task Vector"
                                >
                                  <PenSquare size={14} />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteAssignment(assignment._id)
                                  }
                                  className="p-2 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-all group-hover:scale-105 duration-200"
                                  title="Purge Task Vector"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {adminAssignments.length === 0 && (
                      <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        No live assignments catalogued on network system.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Library" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12 text-left"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      Library Inventory
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Manage institutional knowledge assets and circulation
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsBookModalOpen(true)}
                      className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all"
                    >
                      <Plus size={16} /> Catalog New Book
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                        Resource Ledger
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                        {books.length} Volumes
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <th className="p-6">Book Details</th>
                            <th className="p-6">Classification</th>
                            <th className="p-6">Availability</th>
                            <th className="p-6 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {books.length > 0 ? (
                            books.map((book) => (
                              <tr
                                key={book._id}
                                className="group hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="p-6">
                                  <p className="font-black text-slate-900 text-sm">
                                    {book.title}
                                  </p>
                                  <p className="text-xs text-slate-400 font-medium">
                                    By {book.author}
                                  </p>
                                </td>
                                <td className="p-6">
                                  <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-black text-[9px] uppercase tracking-widest">
                                    {book.category}
                                  </span>
                                </td>
                                <td className="p-6">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-emerald-500"
                                        style={{
                                          width: `${
                                            (book.availableCopies /
                                              book.totalCopies) *
                                            100
                                          }%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-600">
                                      {book.availableCopies}/{book.totalCopies}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-6 text-right">
                                  <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                    <ChevronRight size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest"
                              >
                                Archive empty. Awaiting cataloging...
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
                      <Clock className="mb-4 opacity-50" size={32} />
                      <h3 className="text-xl font-black leading-tight">
                        Circulation Control
                      </h3>
                      <p className="text-indigo-100 text-xs mt-3 leading-relaxed">
                        Currently tracking{" "}
                        <span className="font-bold text-white">
                          14 active loans
                        </span>{" "}
                        with zero overdue nodes across the network.
                      </p>
                      <button className="w-full mt-6 bg-white text-indigo-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                        Scan Return
                      </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                        Financial Recovery
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">
                            Outstanding Fines
                          </span>
                          <span className="text-sm font-black text-rose-500">
                            ₦12,400
                          </span>
                        </div>
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                          <p className="text-[10px] font-medium text-rose-700 leading-relaxed">
                            <AlertTriangle
                              size={12}
                              className="inline mr-1 mb-0.5"
                            />{" "}
                            3 students flagged for long-term overdue assets.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Transport" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12 text-left"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      Logistics & Transport
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Fleet management and student transit nodes
                    </p>
                  </div>
                  <button
                    onClick={() => setIsRouteModalOpen(true)}
                    className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
                  >
                    <Plus size={16} /> Add Route Node
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                        Fleet Registry
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                        {routes.length} Active Routes
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <th className="p-6">Route / Vehicle</th>
                            <th className="p-6">Driver Node</th>
                            <th className="p-6">Payload</th>
                            <th className="p-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {routes.length > 0 ? (
                            routes.map((route) => (
                              <tr
                                key={route._id}
                                className="group hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="p-6">
                                  <p className="font-black text-slate-900 text-sm">
                                    {route.routeName}
                                  </p>
                                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
                                    {route.vehicleNumber}
                                  </p>
                                </td>
                                <td className="p-6">
                                  <p className="font-bold text-slate-700 text-sm">
                                    {route.driverName}
                                  </p>
                                  <span
                                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                      route.status === "active"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-amber-50 text-amber-600"
                                    }`}
                                  >
                                    {route.status}
                                  </span>
                                </td>
                                <td className="p-6">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-indigo-500"
                                        style={{
                                          width: `${
                                            (route.assignedStudents /
                                              route.capacity) *
                                            100
                                          }%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500">
                                      {route.assignedStudents}/{route.capacity}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-6 text-right">
                                  <button
                                    onClick={() => deleteRoute(route._id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest"
                              >
                                No transit nodes deployed
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px]" />
                      <Globe className="text-indigo-400 mb-6" size={32} />
                      <h3 className="text-lg font-black leading-tight text-left">
                        Geospatial Cluster <br /> Overview
                      </h3>
                      <p className="text-xs text-slate-400 mt-4 leading-relaxed text-left">
                        Systematic route optimization has reduced cluster fuel
                        consumption by{" "}
                        <span className="text-emerald-400 font-bold">
                          18.4%
                        </span>{" "}
                        this term.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Hostel/Dormitory" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12 text-left"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      Residential Management
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Dormitory allocation and housing logistics
                    </p>
                  </div>
                  <button
                    onClick={() => setIsHostelModalOpen(true)}
                    className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
                  >
                    <Plus size={16} /> Initialize Room
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                        Occupancy Ledger
                      </h3>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">
                        Live Sync
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <th className="p-6">Location / ID</th>
                            <th className="p-6">Configuration</th>
                            <th className="p-6">Occupancy</th>
                            <th className="p-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {hostelRooms.length > 0 ? (
                            hostelRooms.map((room) => (
                              <tr
                                key={room._id}
                                className="group hover:bg-slate-50/30 transition-colors"
                              >
                                <td className="p-6">
                                  <p className="font-black text-slate-900 text-sm">
                                    {room.blockName}
                                  </p>
                                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
                                    Room {room.roomNumber}
                                  </p>
                                </td>
                                <td className="p-6">
                                  <span className="text-xs font-bold text-slate-600">
                                    {room.roomType}
                                  </span>
                                </td>
                                <td className="p-6">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full ${
                                          room.occupants.length >= room.capacity
                                            ? "bg-rose-500"
                                            : "bg-emerald-500"
                                        }`}
                                        style={{
                                          width: `${
                                            (room.occupants.length /
                                              room.capacity) *
                                            100
                                          }%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">
                                      {room.occupants.length}/{room.capacity}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-6 text-right">
                                  <button
                                    onClick={() => deleteRoom(room._id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest"
                              >
                                No residential nodes detected.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px]" />
                      <Layers className="text-indigo-400 mb-6" size={32} />
                      <h3 className="text-lg font-black leading-tight">
                        Housing Capacity
                      </h3>
                      <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">
                            Total Slots
                          </span>
                          <span className="text-sm font-black">120</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">
                            Allocated
                          </span>
                          <span className="text-sm font-black text-indigo-400">
                            84
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full mt-2">
                          <div className="h-full bg-indigo-500 w-[70%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                        Security & Logins
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <UserCheck className="text-emerald-500" size={16} />
                          <div className="text-left">
                            <p className="text-[10px] font-black text-slate-900">
                              Wardens Online
                            </p>
                            <p className="text-[9px] text-slate-400 uppercase font-bold">
                              4 Active Nodes
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Communication" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      Communication Hub
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Manage institutional broadcasts and direct messaging
                    </p>
                  </div>
                  <button
                    onClick={() => openNotificationModal()}
                    className="flex items-center gap-3 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    <Plus size={16} /> New Broadcast
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem]">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">
                          Broadcast Center
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Active System Notifications
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {notificationsList.length > 0 ? (
                        notificationsList.slice(0, 3).map((n) => (
                          <div
                            key={n._id}
                            className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between group cursor-pointer hover:bg-indigo-50 transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="font-black text-slate-900 truncate">
                                {n.title}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">
                                {n.channel}
                              </p>
                            </div>
                            <ChevronRight
                              size={16}
                              className="text-slate-300 group-hover:text-indigo-600"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          No broadcasts found.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem]">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">
                          Direct Conversations
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Parent-Teacher Private Channels
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        No active chats
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Individual messaging module coming soon.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Events & Calendar" && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Events & Calendar
                  </h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
                    Manage academic schedule
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <form
                    onSubmit={handleAddEvent}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4"
                  >
                    <h3 className="font-black text-lg">Schedule Event</h3>
                    <input
                      required
                      className="w-full p-4 rounded-2xl bg-slate-50 font-bold"
                      placeholder="Event Title"
                      value={eventForm.title}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, title: e.target.value })
                      }
                    />
                    <input
                      required
                      type="date"
                      className="w-full p-4 rounded-2xl bg-slate-50 font-bold"
                      value={eventForm.date}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, date: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="w-full p-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all"
                    >
                      Add to Calendar
                    </button>
                  </form>

                  <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                    <h3 className="font-black text-lg mb-6">
                      Upcoming Schedule
                    </h3>
                    {events.length === 0 ? (
                      <p className="text-slate-400 text-sm italic">
                        No events scheduled.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {events.map((event: Event) => (
                          <div
                            key={event._id}
                            className="flex justify-between items-center p-4 border-b border-slate-50"
                          >
                            <div>
                              <p className="font-bold">{event.title}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-black">
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteEvent(event._id)}
                              className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Reports & Analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      System Analytics
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Data visualization and institutional performance reports
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all"
                    >
                      Export PDF Report
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem]">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">
                          Exam Performance
                        </h3>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                          {results.length} total results
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                        <span>A-Grade Density</span>
                        <span>
                          {results.filter((r) => r.grade === "A").length}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600"
                          style={{
                            width: `${
                              (results.filter((r) => r.grade === "A").length /
                                (results.length || 1)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem]">
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">
                          Attendance Rate
                        </h3>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                          {staffAttendanceRate}% Overall
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
                        <p className="text-[10px] text-slate-400 uppercase font-black">
                          Present
                        </p>
                        <p className="font-black">
                          {
                            attendanceRecords.filter(
                              (a) => a.status === "present"
                            ).length
                          }
                        </p>
                      </div>
                      <div className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
                        <p className="text-[10px] text-slate-400 uppercase font-black">
                          Absent
                        </p>
                        <p className="font-black">
                          {
                            attendanceRecords.filter(
                              (a) => a.status === "absent"
                            ).length
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white/10 rounded-[1.5rem]">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-white">
                          Admissions Flow
                        </h3>
                        <p className="text-[10px] text-indigo-300 uppercase font-black tracking-widest">
                          {admissionsList.length} Pending
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-indigo-200 leading-relaxed">
                      Total current population:{" "}
                      <span className="font-black text-white">
                        {stats.totalStudents}
                      </span>{" "}
                      students across all cohorts.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Fees & Payments" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 pb-12"
              >
                <h2 className="text-2xl font-black">Fees & Payments</h2>
                <p className="text-slate-400 text-[10px]">
                  Track school fees, payments, invoices and outstanding
                  balances.
                </p>
                <div className="bg-white p-6 rounded-2xl border">
                  Invoices, payment history and outstanding balances.
                </div>
              </motion.div>
            )}

            {activeTab === "Admissions" && (
              <motion.div
                key="admissions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8 pb-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Admissions Portal
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Manage prospective student applications
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openAdmissionModal()}
                      className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      <Plus size={16} className="inline mr-2" /> New Application
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                      Application Queue
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                      {admissionsList.length} Applications
                    </span>
                  </div>

                  {admissionsList.length === 0 ? (
                    <div className="py-24 text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                        <UserPlus size={26} />
                      </div>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        No pending admissions
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <th className="p-6">Applicant Name</th>
                          <th className="p-6">Course / Email</th>
                          <th className="p-6">Status</th>
                          <th className="p-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {admissionsList.map((a) => (
                          <tr
                            key={a._id}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="p-6 font-black text-slate-900">
                              {a.fullname || a.title || "Applicant"}
                            </td>
                            <td className="p-6">
                              <p className="text-xs font-bold text-slate-700">
                                {a.course}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {a.email}
                              </p>
                            </td>
                            <td className="p-6">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  a.status === "accepted"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : a.status === "pending"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {a.status || "pending"}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex justify-end gap-2">
                                {a.status !== "accepted" && (
                                  <button
                                    onClick={() =>
                                      handleAcceptApplication(a._id)
                                    }
                                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] uppercase"
                                  >
                                    Accept
                                  </button>
                                )}

                                <button
                                  onClick={() => openAdmissionModal(a)}
                                  className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => deleteAdmissionItem(a._id)}
                                  className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "Settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-12"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    System Configuration
                  </h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                    Manage institutional governance and security
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-black">Institutional Profile</h3>
                    <input
                      className="w-full p-4 rounded-2xl bg-slate-50 font-bold"
                      defaultValue="Precious Academy"
                    />
                    <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase">
                      Update Profile
                    </button>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="font-black text-xs uppercase tracking-widest">
                        Administrative Roles
                      </h3>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <tr>
                          <th className="p-6">Role Name</th>
                          <th className="p-6">Access Level</th>
                          <th className="p-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {staffMembers.length > 0 ? (
                          staffMembers.map((member: StaffMember) => (
                            <tr
                              key={member._id}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="p-6 font-black text-slate-900">
                                {member.fullname}
                              </td>
                              <td className="p-6 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                                {member.role}
                              </td>
                              <td className="p-6 text-right">
                                <button
                                  onClick={() => setEditingUser(member)}
                                  className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-all"
                                >
                                  EDIT ROLE
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="p-12 text-center text-slate-400 font-bold uppercase text-[10px]"
                            >
                              No staff data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 pb-12"
              >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black">Notifications</h2>
                    <p className="text-slate-400 text-[10px]">
                      Announcements, SMS/Email alerts and delivery inbox.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest">
                      {notificationsList.length} Message
                      {notificationsList.length === 1 ? "" : "s"}
                    </div>
                    <button
                      onClick={() => openNotificationModal()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2"
                    >
                      <Plus size={16} /> New Notification
                    </button>
                    <button
                      onClick={handleManualRefresh}
                      className="px-4 py-2 bg-slate-100 rounded-2xl font-bold"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total",
                      value: notificationsList.length,
                      tone: "indigo",
                      detail: "Queued and sent",
                    },
                    {
                      label: "Announcements",
                      value: notificationChannelCounts.announcement,
                      tone: "slate",
                      detail: "Broadcast alerts",
                    },
                    {
                      label: "Email",
                      value: notificationChannelCounts.email,
                      tone: "emerald",
                      detail: "Inbox messages",
                    },
                    {
                      label: "SMS",
                      value: notificationChannelCounts.sms,
                      tone: "amber",
                      detail: "Text alerts",
                    },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {metric.label}
                      </p>
                      <div
                        className={`mt-3 text-3xl font-black text-${metric.tone}-600`}
                      >
                        {metric.value}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {metric.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6">
                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                          Inbox
                        </p>
                        <h3 className="text-lg font-black text-slate-900">
                          Recent notifications
                        </h3>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Latest 5
                      </span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {recentNotifications.length > 0 ? (
                        recentNotifications.map((notification) => {
                          const channel = (
                            notification.channel || "in-app"
                          ).toLowerCase();
                          const channelStyles =
                            {
                              announcement:
                                "bg-slate-100 text-slate-700 border-slate-200",
                              email:
                                "bg-emerald-50 text-emerald-700 border-emerald-100",
                              sms: "bg-amber-50 text-amber-700 border-amber-100",
                              "in-app":
                                "bg-indigo-50 text-indigo-700 border-indigo-100",
                            }[
                              channel as
                                | "announcement"
                                | "email"
                                | "sms"
                                | "in-app"
                            ] || "bg-slate-50 text-slate-700 border-slate-100";

                          return (
                            <div
                              key={notification._id}
                              className="px-6 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                            >
                              <div className="min-w-0 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-black text-slate-900 truncate">
                                    {notification.title || notification._id}
                                  </h4>
                                  <span
                                    className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${channelStyles}`}
                                  >
                                    {notification.channel || "in-app"}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                  {notification.message ||
                                    notification.name ||
                                    "No message text available."}
                                </p>
                                <p className="text-[11px] font-medium text-slate-400">
                                  {notification.createdAt
                                    ? new Date(
                                        notification.createdAt
                                      ).toLocaleString([], {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                      })
                                    : "Just now"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 sm:pt-1">
                                <button
                                  onClick={() =>
                                    openNotificationModal(notification)
                                  }
                                  className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                                  aria-label={`Edit ${
                                    notification.title || "notification"
                                  }`}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    deleteNotificationItem(notification._id)
                                  }
                                  className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                                  aria-label={`Delete ${
                                    notification.title || "notification"
                                  }`}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-6 py-16 text-center">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                            <Bell size={26} />
                          </div>
                          <p className="font-black text-slate-900">
                            No notifications yet
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            Create an announcement, email, or SMS alert to
                            populate this inbox.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">
                        Delivery mix
                      </p>
                      <div className="space-y-4">
                        {[
                          {
                            label: "In-App",
                            value: notificationChannelCounts.inApp,
                            color: "indigo",
                          },
                          {
                            label: "Email",
                            value: notificationChannelCounts.email,
                            color: "emerald",
                          },
                          {
                            label: "SMS",
                            value: notificationChannelCounts.sms,
                            color: "amber",
                          },
                          {
                            label: "Announcement",
                            value: notificationChannelCounts.announcement,
                            color: "slate",
                          },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                              <span>{item.label}</span>
                              <span>{item.value}</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-${item.color}-500`}
                                style={{
                                  width: `${
                                    notificationsList.length > 0
                                      ? Math.max(
                                          (item.value /
                                            notificationsList.length) *
                                            100,
                                          item.value > 0 ? 8 : 0
                                        )
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-indigo-700 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-indigo-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2">
                        Quick Note
                      </p>
                      <h3 className="text-2xl font-black leading-tight">
                        Keep notification copy short and actionable.
                      </h3>
                      <p className="text-sm text-indigo-100/80 mt-3 leading-relaxed">
                        Use the editor to switch between in-app, email, and SMS
                        delivery. Short titles and clear calls to action perform
                        best.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "System Logs" && (
              <motion.div
                key="system-logs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      System Logs Datastream
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                      Live activity, sync events, and deployment signals
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="px-3 py-2 rounded-full bg-slate-100 text-slate-600">
                      {systemLogs.length} events
                    </span>
                    <span className="px-3 py-2 rounded-full bg-emerald-50 text-emerald-600">
                      Real-time
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                          Event Stream
                        </p>
                        <h3 className="text-lg font-black text-slate-900">
                          Activity timeline
                        </h3>
                      </div>
                      <Sparkles size={18} className="text-indigo-500" />
                    </div>
                    <div className="divide-y divide-slate-50">
                      {systemLogs.length > 0 ? (
                        systemLogs.map((log) => (
                          <div
                            key={log.id}
                            className="px-6 py-5 flex items-start gap-4"
                          >
                            <div
                              className={`mt-1 w-2.5 h-2.5 rounded-full ${
                                log.level === "success"
                                  ? "bg-emerald-500"
                                  : log.level === "warning"
                                  ? "bg-amber-500"
                                  : log.level === "error"
                                  ? "bg-rose-500"
                                  : "bg-indigo-500"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-4">
                                <p className="font-black text-slate-900">
                                  {log.message}
                                </p>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">
                                  {log.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                {log.detail}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-16 text-center">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                            <FileText size={26} />
                          </div>
                          <p className="font-black text-slate-900">
                            No log events yet
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Trigger a refresh, deploy a module, or delete a
                            record to populate the stream.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-[3rem] p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 blur-[80px]" />
                    <p className="relative text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300 mb-2">
                      System Snapshot
                    </p>
                    <h3 className="relative text-2xl font-black mb-8">
                      Operational summary
                    </h3>
                    <div className="relative space-y-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Dashboard state
                        </p>
                        <p className="mt-1 font-bold text-white">
                          {refreshing ? "Synchronizing" : "Stable"}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Current modules
                        </p>
                        <p className="mt-1 font-bold text-white">
                          {curriculum.length} active entries
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Recent signal
                        </p>
                        <p className="mt-1 font-bold text-white">
                          {systemLogs[0]?.message || "Awaiting input"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isDeployModalOpen && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeployModal}
            >
              <motion.div
                className="w-full max-w-2xl rounded-[2rem] bg-white p-6 md:p-8 shadow-2xl"
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
                      Deploy Module
                    </p>
                    <h3 className="text-2xl font-black text-slate-900">
                      Create a new curriculum module
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Fill in the module details and publish it to the
                      dashboard.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeDeployModal}
                    className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form
                  onSubmit={handleDeploySubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <label className="flex flex-col gap-2 md:col-span-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Module ID
                    </span>
                    <input
                      name="moduleId"
                      value={deployForm.moduleId}
                      onChange={handleDeployChange}
                      required
                      placeholder="SW-01"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </label>

                  <label className="flex flex-col gap-2 md:col-span-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Cohort
                    </span>
                    <select
                      name="cohort"
                      value={deployForm.cohort}
                      onChange={handleDeployChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 bg-white"
                    >
                      <option value="software">Software</option>
                      <option value="linguistics">Linguistics</option>
                      <option value="business">Business</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Title
                    </span>
                    <input
                      name="title"
                      value={deployForm.title}
                      onChange={handleDeployChange}
                      required
                      placeholder="Introduction to Web Systems"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </label>

                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Description
                    </span>
                    <textarea
                      name="description"
                      value={deployForm.description}
                      onChange={handleDeployChange}
                      rows={4}
                      placeholder="Short description of the module and its learning goals."
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 resize-none"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Progress
                    </span>
                    <input
                      name="progress"
                      type="number"
                      min={0}
                      max={100}
                      value={deployForm.progress}
                      onChange={handleDeployChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Icon Type
                    </span>
                    <select
                      name="iconType"
                      value={deployForm.iconType}
                      onChange={handleDeployChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 bg-white"
                    >
                      <option value="Cpu">Cpu</option>
                      <option value="Globe">Globe</option>
                      <option value="BarChart3">BarChart3</option>
                      <option value="Layers">Layers</option>
                    </select>
                  </label>

                  <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeDeployModal}
                      className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                      disabled={isDeploying}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isDeploying}
                      className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isDeploying ? "Deploying..." : "Deploy Module"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAttendanceModalOpen && (
            <motion.div
              className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAttendanceModal}
            >
              <motion.div
                className="w-full max-w-lg rounded-[2rem] bg-white p-6 md:p-8 shadow-2xl"
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
                      Attendance
                    </p>
                    <h3 className="text-2xl font-black text-slate-900">
                      {attendanceEditId
                        ? "Edit attendance record"
                        : "Record attendance"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeAttendanceModal}
                    className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form
                  onSubmit={createAttendanceItem}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Student name
                    </span>
                    <input
                      name="studentName"
                      value={attendanceForm.studentName}
                      onChange={handleAttendanceChange}
                      required
                      placeholder="Jane Doe"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Course
                    </span>
                    <select
                      name="course"
                      value={attendanceForm.course}
                      onChange={handleAttendanceChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                    >
                      <option value="software">Software</option>
                      <option value="linguistics">Linguistics</option>
                      <option value="business">Business</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Status
                    </span>
                    <select
                      name="status"
                      value={attendanceForm.status}
                      onChange={handleAttendanceChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </label>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeAttendanceModal}
                      className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black"
                    >
                      {attendanceEditId ? "Update" : "Record"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAdmissionModalOpen && (
            <motion.div
              className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAdmissionModal}
            >
              <motion.div
                className="w-full max-w-lg rounded-[2rem] bg-white p-6 md:p-8 shadow-2xl"
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
                      Admissions
                    </p>
                    <h3 className="text-2xl font-black text-slate-900">
                      {admissionEditId ? "Edit admission" : "New admission"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeAdmissionModal}
                    className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form
                  onSubmit={createAdmissionItem}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Full name
                    </span>
                    <input
                      name="fullname"
                      value={admissionForm.fullname}
                      onChange={handleAdmissionChange}
                      required
                      placeholder="Jane Doe"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Email
                    </span>
                    <input
                      name="email"
                      value={admissionForm.email}
                      onChange={handleAdmissionChange}
                      required
                      placeholder="jane@example.com"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Course
                    </span>
                    <select
                      name="course"
                      value={admissionForm.course}
                      onChange={handleAdmissionChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                    >
                      <option value="software">Software</option>
                      <option value="linguistics">Linguistics</option>
                      <option value="business">Business</option>
                    </select>
                  </label>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeAdmissionModal}
                      className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black"
                    >
                      {admissionEditId ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isNotificationModalOpen && (
            <motion.div
              className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeNotificationModal}
            >
              <motion.div
                className="w-full max-w-lg rounded-[2rem] bg-white p-6 md:p-8 shadow-2xl"
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
                      Notifications
                    </p>
                    <h3 className="text-2xl font-black text-slate-900">
                      {notificationEditId
                        ? "Edit notification"
                        : "New notification"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeNotificationModal}
                    className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form
                  onSubmit={createNotificationItem}
                  className="grid grid-cols-1 gap-4"
                >
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Title
                    </span>
                    <input
                      name="title"
                      value={notificationForm.title}
                      onChange={handleNotificationChange}
                      required
                      placeholder="Announcement title"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Message
                    </span>
                    <textarea
                      name="message"
                      value={notificationForm.message}
                      onChange={handleNotificationChange}
                      required
                      placeholder="Message body"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none min-h-[120px]"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Channel
                    </span>
                    <select
                      name="channel"
                      value={notificationForm.channel}
                      onChange={handleNotificationChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                    >
                      <option value="announcement">Announcement</option>
                      <option value="in-app">In-App</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                    </select>
                  </label>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeNotificationModal}
                      className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black"
                    >
                      {notificationEditId ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isStudentModalOpen && (
            <motion.div
              className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeStudentModal}
            >
              <motion.div
                className="w-full max-w-lg rounded-[2rem] bg-white p-6 md:p-8 shadow-2xl"
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
                      Add Student
                    </p>
                    <h3 className="text-2xl font-black text-slate-900">
                      Create a new student profile
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeStudentModal}
                    className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form
                  onSubmit={handleStudentSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Full name
                    </span>
                    <input
                      name="fullname"
                      value={studentForm.fullname}
                      onChange={handleStudentChange}
                      required
                      placeholder="Jane Doe"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Email
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={studentForm.email}
                      onChange={handleStudentChange}
                      required
                      placeholder="jane@example.com"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Password
                    </span>
                    <input
                      name="password"
                      type="password"
                      value={studentForm.password}
                      onChange={handleStudentChange}
                      required
                      placeholder="Create a temporary password"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Course
                    </span>
                    <select
                      name="course"
                      value={studentForm.course}
                      onChange={handleStudentChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white"
                    >
                      <option value="software">Software</option>
                      <option value="linguistics">Linguistics</option>
                      <option value="business">Business</option>
                    </select>
                  </label>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeStudentModal}
                      className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black"
                    >
                      Create Student
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isStudentModalOpen && (
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeStudentModal}
                className="absolute inset-0 bg-slate-950/60"
              />
              <motion.form
                onSubmit={handleStudentSubmit}
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8 overflow-y-auto max-h-[90vh] text-left"
              >
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {isEditMode ? "Modify Student" : "Register New Student"}
                  </h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
                    Core Registry Entry
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 flex items-center gap-2 text-indigo-600">
                    <UserCheck size={14} />{" "}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Personal Identity
                    </span>
                  </div>

                  <input
                    required
                    placeholder="Full Name"
                    className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={studentForm.fullname}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        fullname: e.target.value,
                      })
                    }
                  />

                  <select
                    required
                    className="p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={studentForm.course}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, course: e.target.value })
                    }
                  >
                    <option value="software">Software Engineering</option>
                    <option value="linguistics">Linguistics</option>
                    <option value="business">Business</option>
                  </select>

                  <select
                    required
                    className="p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={studentForm.level}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        level: Number(e.target.value),
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5, 6].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Level {lvl}
                      </option>
                    ))}
                  </select>

                  <div className="md:col-span-2 flex items-center gap-2 text-indigo-600 mt-4">
                    <ShieldAlert size={14} />{" "}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Access Credentials
                    </span>
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="Institutional Email"
                    className="p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={studentForm.email}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, email: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder={
                      isEditMode
                        ? "Leave blank to keep current"
                        : "Access Password"
                    }
                    className="p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={studentForm.password}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        password: e.target.value,
                      })
                    }
                  />

                  <div className="md:col-span-2 flex items-center gap-2 text-indigo-600 mt-4">
                    <Users size={14} />{" "}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Guardian Link
                    </span>
                  </div>
                  <input
                    placeholder="Parent/Guardian Name"
                    className="p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={studentForm.parentGuardianName}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        parentGuardianName: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="Guardian Phone (e.g. +234)"
                    className="p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={studentForm.parentGuardianPhone}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        parentGuardianPhone: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="Residential Address"
                    className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={studentForm.guardianLink}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        guardianLink: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeStudentModal}
                    className="flex-1 p-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all"
                  >
                    {isEditMode ? "Update Registry" : "Initialize Node"}
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {viewingCard && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewingCard(null)}
                className="absolute inset-0 bg-slate-950/40"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 20 }}
                className="relative z-10"
              >
                <button
                  onClick={() => setViewingCard(null)}
                  className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:text-indigo-400 transition-colors"
                >
                  Close Preview <X size={16} />
                </button>

                <div className="mx-auto w-[340px] max-w-[90vw] rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-900 to-black p-8 text-white shadow-2xl border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
                      Student ID
                    </span>
                    <IdCardIcon size={24} className="text-indigo-400" />
                  </div>

                  <div className="space-y-1 mb-8">
                    <h4 className="text-2xl font-black leading-tight">
                      {viewingCard.fullname}
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                      {viewingCard.course}
                    </p>
                    <p className="text-xs text-white/70">{viewingCard.email}</p>
                  </div>

                  <div className="flex items-end justify-between pt-6 border-t border-white/10">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                        Credential Hash
                      </p>

                      <p className="font-mono text-xs text-indigo-300">
                        {viewingCard?.studentId}
                      </p>
                    </div>
                    <div className="bg-white p-1 rounded-xl shadow-lg">
                      <QRCodeSVG
                        value={viewingCard?.studentId || ""}
                        size={48}
                        level="M"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isViewProfileOpen && viewingCard && (
            <div
              className="fixed inset-0 z-[220] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setIsViewProfileOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-2xl w-96"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>{viewingCard.fullname}</h3>
                <p>{viewingCard.email}</p>

                <button onClick={() => setIsViewProfileOpen(false)}>
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAdminModalOpen && (
            <motion.div
              className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAdminModal}
            >
              <motion.div
                className="w-full max-w-lg rounded-[2rem] bg-white p-6 md:p-8 shadow-2xl"
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
                      Add Admin
                    </p>
                    <h3 className="text-2xl font-black text-slate-900">
                      Create a new admin profile
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeAdminModal}
                    className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form
                  onSubmit={handleAdminSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Full name
                    </span>
                    <input
                      name="fullname"
                      value={adminForm.fullname}
                      onChange={handleAdminChange}
                      required
                      placeholder="Jane Admin"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Email
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={adminForm.email}
                      onChange={handleAdminChange}
                      required
                      placeholder="admin@example.com"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Password
                    </span>
                    <input
                      name="password"
                      type="password"
                      value={adminForm.password}
                      onChange={handleAdminChange}
                      required
                      placeholder="Create admin password"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeAdminModal}
                      className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black"
                    >
                      Create Admin
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTeacherModalOpen && (
            <motion.div
              className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeTeacherModal}
            >
              <motion.div
                className="w-full max-w-lg rounded-[2rem] bg-white p-6 md:p-8 shadow-2xl"
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
                      Add Teacher
                    </p>
                    <h3 className="text-2xl font-black text-slate-900">
                      Create a new teacher profile
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeTeacherModal}
                    className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form
                  onSubmit={handleTeacherSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Full name
                    </span>
                    <input
                      name="fullname"
                      value={teacherForm.fullname}
                      onChange={handleTeacherChange}
                      required
                      placeholder="Jane Teacher"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Email
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={teacherForm.email}
                      onChange={handleTeacherChange}
                      required
                      placeholder="teacher@example.com"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Password
                    </span>
                    <input
                      name="password"
                      type="password"
                      value={teacherForm.password}
                      onChange={handleTeacherChange}
                      required
                      minLength={6}
                      placeholder="Create teacher password"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeTeacherModal}
                      className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black"
                    >
                      Create Teacher
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isQuestionModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md"
            >
              <motion.form
                onSubmit={handleQuestionSubmit}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Question Builder
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      Create digital assessment node
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQuestionModalOpen(false)}
                    className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Subject Cluster
                    </label>
                    <select
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                      value={questionForm.subject}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          subject: e.target.value,
                        })
                      }
                    >
                      <option value="software">Software Engineering</option>
                      <option value="linguistics">Modern Linguistics</option>
                      <option value="business">Business Management</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Academic Level
                    </label>
                    <select
                      required
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                      value={questionForm.level}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          level: Number(e.target.value),
                        })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6].map((lvl) => (
                        <option key={lvl} value={lvl}>
                          Level {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Question Text
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold resize-none"
                      placeholder="Enter the examination question here..."
                      value={questionForm.questionText}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          questionText: e.target.value,
                        })
                      }
                    />
                  </div>

                  {questionForm.options.map((opt, i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                        Option {String.fromCharCode(65 + i)}
                      </label>
                      <input
                        required
                        className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                        placeholder={`Choice ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...questionForm.options];
                          newOpts[i] = e.target.value;
                          setQuestionForm({
                            ...questionForm,
                            options: newOpts,
                          });
                        }}
                      />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Correct Answer
                    </label>
                    <select
                      required
                      className="w-full p-4 rounded-2xl bg-indigo-50 border-none outline-none font-bold text-indigo-600"
                      value={questionForm.correctAnswer}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          correctAnswer: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Correct Option</option>
                      {questionForm.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt || `Option ${String.fromCharCode(65 + i)}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Weight (Points)
                    </label>
                    <input
                      type="number"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                      value={questionForm.points}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          points: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  disabled={isSubmittingQuestion}
                  type="submit"
                  className="w-full p-5 rounded-2xl bg-slate-900 text-white font-black shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
                >
                  {isSubmittingQuestion ? (
                    <RefreshCw className="animate-spin" />
                  ) : (
                    <Plus />
                  )}
                  {isSubmittingQuestion
                    ? "Synchronizing Node..."
                    : "Integrate Question"}
                </button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExamModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExamModalOpen(false)}
                className="absolute inset-0 bg-[#0F172A]/80"
              />
              <motion.form
                onSubmit={handlePublishResult}
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900">
                    Publish Result
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsExamModalOpen(false)}
                    className="p-2 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Student Name
                    </label>
                    <input
                      required
                      type="text"
                      value={examForm.studentName}
                      onChange={(e) =>
                        setExamForm({
                          ...examForm,
                          studentName: e.target.value,
                        })
                      }
                      placeholder="Enter full name"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Subject
                    </label>
                    <input
                      required
                      type="text"
                      value={examForm.subject}
                      onChange={(e) =>
                        setExamForm({ ...examForm, subject: e.target.value })
                      }
                      placeholder="e.g. Mathematics"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                        Score (%)
                      </label>
                      <input
                        required
                        type="number"
                        max="100"
                        value={examForm.score}
                        onChange={(e) =>
                          setExamForm({ ...examForm, score: e.target.value })
                        }
                        placeholder="0-100"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                        Term
                      </label>
                      <select
                        value={examForm.term}
                        onChange={(e) =>
                          setExamForm({ ...examForm, term: e.target.value })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none appearance-none"
                      >
                        <option>First Term</option>
                        <option>Second Term</option>
                        <option>Third Term</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  disabled={isPublishing}
                  type="submit"
                  className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-[#0F172A] transition-all flex items-center justify-center gap-3"
                >
                  {isPublishing ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                  {isPublishing ? "Synchronizing..." : "Publish to Ledger"}
                </button>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isBookModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBookModalOpen(false)}
                className="absolute inset-0 bg-slate-950/60"
              />
              <motion.form
                onSubmit={handleBookSubmit}
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative w-full max-w-xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-none">
                      Catalog Asset
                    </h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
                      Add volume to physical archives
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(false)}
                    className="p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Book Title
                    </label>
                    <input
                      required
                      type="text"
                      value={bookForm.title}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, title: e.target.value })
                      }
                      placeholder="Mastering React & TypeScript"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Author
                    </label>
                    <input
                      required
                      type="text"
                      value={bookForm.author}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, author: e.target.value })
                      }
                      placeholder="P. Enoch"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      ISBN Identifier
                    </label>
                    <input
                      required
                      type="text"
                      value={bookForm.isbn}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, isbn: e.target.value })
                      }
                      placeholder="978-3-16..."
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Classification
                    </label>
                    <select
                      value={bookForm.category}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, category: e.target.value })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none appearance-none"
                    >
                      <option value="software">Software Engineering</option>
                      <option value="linguistics">Modern Linguistics</option>
                      <option value="business">Business Management</option>
                      <option value="general">General Reference</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Stock (Copies)
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={bookForm.totalCopies}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          totalCopies: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                      Physical Location
                    </label>
                    <input
                      required
                      type="text"
                      value={bookForm.location}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, location: e.target.value })
                      }
                      placeholder="e.g. Shelf A-04"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 font-bold outline-none"
                    />
                  </div>
                </div>

                <button
                  disabled={isCataloging}
                  type="submit"
                  className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
                >
                  {isCataloging ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                  {isCataloging
                    ? "Synchronizing Archive..."
                    : "Commit to Library"}
                </button>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isRouteModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsRouteModalOpen(false)}
                className="absolute inset-0 bg-slate-950/60"
              />
              <motion.form
                onSubmit={handleRouteSubmit}
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black text-slate-900">
                    Add Route Node
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsRouteModalOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    required
                    placeholder="Route Name (e.g. Ikeja Express)"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={routeForm.routeName}
                    onChange={(e) =>
                      setRouteForm({ ...routeForm, routeName: e.target.value })
                    }
                  />
                  <input
                    required
                    placeholder="Driver Name"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={routeForm.driverName}
                    onChange={(e) =>
                      setRouteForm({ ...routeForm, driverName: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Vehicle Plate"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold font-mono"
                      value={routeForm.vehicleNumber}
                      onChange={(e) =>
                        setRouteForm({
                          ...routeForm,
                          vehicleNumber: e.target.value,
                        })
                      }
                    />
                    <input
                      required
                      type="number"
                      placeholder="Max Capacity"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                      value={routeForm.capacity}
                      onChange={(e) =>
                        setRouteForm({
                          ...routeForm,
                          capacity: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  disabled={isDeployingRoute}
                  type="submit"
                  className="w-full p-5 rounded-2xl bg-indigo-600 text-white font-black shadow-lg hover:bg-slate-900 transition-all"
                >
                  {isDeployingRoute ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Deploy Transit Node"
                  )}
                </button>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isHostelModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsHostelModalOpen(false)}
                className="absolute inset-0 bg-slate-950/60"
              />
              <motion.form
                onSubmit={handleHostelSubmit}
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl space-y-6"
              >
                <h3 className="text-2xl font-black text-slate-900">
                  Initialize Residential Node
                </h3>
                <div className="space-y-4">
                  <input
                    required
                    placeholder="Block Name (e.g. Diamond Wing)"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={hostelForm.blockName}
                    onChange={(e) =>
                      setHostelForm({
                        ...hostelForm,
                        blockName: e.target.value,
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Room #"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                      value={hostelForm.roomNumber}
                      onChange={(e) =>
                        setHostelForm({
                          ...hostelForm,
                          roomNumber: e.target.value,
                        })
                      }
                    />
                    <select
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                      value={hostelForm.roomType}
                      onChange={(e) =>
                        setHostelForm({
                          ...hostelForm,
                          roomType: e.target.value as HostelRoom["roomType"],
                        })
                      }
                    >
                      <option>Single</option>
                      <option>Shared</option>
                      <option>Suite</option>
                    </select>
                  </div>
                  <input
                    required
                    type="number"
                    placeholder="Capacity"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none font-bold"
                    value={hostelForm.capacity}
                    onChange={(e) =>
                      setHostelForm({
                        ...hostelForm,
                        capacity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full p-5 rounded-2xl bg-indigo-600 text-white font-black shadow-lg hover:bg-slate-900 transition-all uppercase text-xs tracking-widest"
                >
                  Execute Deployment
                </button>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingUser && (
            <EditRoleModal
              user={editingUser}
              onClose={() => setEditingUser(null)}
              onUpdate={handleUpdateRole}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.form
                onSubmit={handleSaveCourse}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative"
              >
                <h2 className="text-2xl font-bold text-[#1e293b] mb-8">
                  {editingId ? "Edit Course" : "Add New Course"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourse.title}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, title: e.target.value })
                      }
                      placeholder="e.g. Fullstack Web Development"
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourse.code}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, code: e.target.value })
                      }
                      placeholder="CS101"
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Instructor
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourse.instructor}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          instructor: e.target.value,
                        })
                      }
                      placeholder="Dr. Precious"
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Schedule
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourse.schedule}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, schedule: e.target.value })
                      }
                      placeholder="Mon/Wed/Fri - 10:00 AM"
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end items-center gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingId(null);
                      setError("");
                    }}
                    className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitLoading}
                    className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-8 py-2.5 rounded-lg font-semibold shadow-md active:scale-95 transition-all disabled:bg-indigo-300"
                  >
                    {formSubmitLoading
                      ? "Saving..."
                      : editingId
                      ? "Update"
                      : "Save Course"}
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCreateModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCreateModalOpen(false)}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[200]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="fixed inset-0 m-auto max-w-xl h-[85vh] bg-white border border-slate-100 rounded-[3.5rem] shadow-2xl p-10 z-[210] flex flex-col justify-between overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Deploy New Assessment
                    </h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      Dispatches data immediately across targeted portals
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>

                <form
                  onSubmit={handleCreateAssignment}
                  className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar"
                >
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newAssignment.title}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          title: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                      placeholder="e.g., Cryptographic Handshake Report"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Targeted Cohort
                    </label>
                    <select
                      required
                      value={newAssignment.courseName}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          courseName: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">Select a Department/Cohort</option>
                      <option value="Software Engineering">
                        Software Engineering
                      </option>
                      <option value="linguistics">Linguistics</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Execution Due Date
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newAssignment.dueDate}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          dueDate: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Task Directives & Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newAssignment.description}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:bg-white transition-all resize-none"
                      placeholder="Provide system criteria details..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Resource Reference Attachments
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        id="attachment-input"
                        placeholder="Paste reference link..."
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white transition-all"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddAttachment(e)
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAddAttachment}
                        className="px-4 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 min-h-[50px]">
                      {newAssignment.attachments.length > 0 ? (
                        newAssignment.attachments.map((link, index) => (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={`${link}-${index}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-blue-600 rounded-full text-[10px] font-bold tracking-wide border border-slate-100 shadow-sm"
                          >
                            <span className="truncate max-w-[150px]">
                              {link}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setNewAssignment((prev) => ({
                                  ...prev,
                                  attachments: prev.attachments.filter(
                                    (_, i) => i !== index
                                  ),
                                }));
                              }}
                              className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </motion.div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400 opacity-60">
                          <Paperclip size={14} />
                          <p className="text-[10px] font-bold uppercase tracking-widest">
                            No resources indexed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-900/10 flex-shrink-0"
                  >
                    Create Assignment
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingAssignment && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingAssignment(null)}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[200]"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="fixed inset-0 m-auto max-w-xl h-[85vh] bg-white border border-slate-100 rounded-[3.5rem] shadow-2xl p-10 z-[210] flex flex-col justify-between overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Modify Task Vector
                    </h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      Updating active protocol across targeted portals
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingAssignment(null)}
                    className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateAssignment(
                      editingAssignment._id,
                      editingAssignment
                    );
                  }}
                  className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar"
                >
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editingAssignment.title}
                      onChange={(e) =>
                        setEditingAssignment({
                          ...editingAssignment,
                          title: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Targeted Cohort
                    </label>
                    <select
                      required
                      value={editingAssignment.courseName}
                      onChange={(e) =>
                        setEditingAssignment({
                          ...editingAssignment,
                          courseName: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Software Engineering">
                        Software Engineering
                      </option>
                      <option value="linguistics">Linguistics</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Execution Due Date
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={
                        editingAssignment.dueDate
                          ? new Date(editingAssignment.dueDate)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setEditingAssignment({
                          ...editingAssignment,
                          dueDate: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Task Directives
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={editingAssignment.description}
                      onChange={(e) =>
                        setEditingAssignment({
                          ...editingAssignment,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Resource Reference Attachments
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        id="edit-attachment-input"
                        placeholder="Add new reference link..."
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(
                            "edit-attachment-input"
                          ) as HTMLInputElement;
                          if (input.value.trim()) {
                            setEditingAssignment({
                              ...editingAssignment,
                              attachments: [
                                ...editingAssignment.attachments,
                                input.value.trim(),
                              ],
                            });
                            input.value = "";
                          }
                        }}
                        className="px-4 bg-amber-500 text-white hover:bg-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      {editingAssignment.attachments.map((link, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-amber-600 rounded-full text-[10px] font-bold border border-slate-100"
                        >
                          <span className="truncate max-w-[150px]">{link}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingAssignment({
                                ...editingAssignment,
                                attachments:
                                  editingAssignment.attachments.filter(
                                    (_, i) => i !== index
                                  ),
                              })
                            }
                            className="text-slate-300 hover:text-rose-500"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingAssignment(null)}
                      className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Abort
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20"
                    >
                      Commit Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
