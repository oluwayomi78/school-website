import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Search, 
  BookOpen, 
  ChevronRight,
  Filter,
  Users,
  ChevronDown,
  UserCircle,
  Briefcase
} from 'lucide-react';
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const Teachers = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDept, setActiveDept] = useState('All');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const departments = ['All', 'Technology', 'Science', 'Arts', 'Business'];

  const faculty = [
    {
      name: "Dr. Precious Enoch",
      role: "Head of Technology",
      dept: "Technology",
      bio: "Expert in Full-stack Development and Software Architecture with 10+ years in the industry.",
      image: "https://avatars.githubusercontent.com/u/202946970?v=4",
      stats: { students: "2.4k", courses: 12 }
    },
    {
      name: "Prof. Sarah Adeyemi",
      role: "Senior Lecturer",
      dept: "Business",
      bio: "Specializing in Digital Transformation and Entrepreneurship in emerging markets.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      stats: { students: "1.8k", courses: 8 }
    },
    {
      name: "Dr. Michael John",
      role: "Physics Lead",
      dept: "Science",
      bio: "Dedicated to making Quantum Mechanics accessible through digital simulation and research.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      stats: { students: "950", courses: 5 }
    },
    {
      name: "Ms. Amina Yusuf",
      role: "Modern Arts Dean",
      dept: "Arts",
      bio: "Bridging the gap between traditional African aesthetics and modern digital design.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
      stats: { students: "3.1k", courses: 15 }
    }
  ];

  const filteredFaculty = faculty.filter(t => activeDept === 'All' || t.dept === activeDept);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100">
      
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className={`p-2 rounded-xl transition-colors ${scrolled ? "bg-blue-600 shadow-lg" : "bg-white/10 backdrop-blur-md border border-white/20"}`}>
              <GraduationCap className={scrolled ? "text-white" : "text-blue-500"} size={22} />
            </div>
            <span className={`text-xl font-black tracking-tighter transition-colors ${scrolled ? "text-slate-900" : "text-white"}`}>
              PRECIOUS<span className="text-blue-500">ACADEMY</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'About', 'Courses', 'Teachers', 'Admission', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className={`text-xs font-black transition-colors uppercase tracking-widest ${
                  item === 'Teachers' ? "text-blue-500" : scrolled ? "text-slate-500 hover:text-blue-600" : "text-slate-200 hover:text-white"
                }`}
              >
                {item}
              </Link>
            ))}

            <div 
              className="relative"
              onMouseEnter={() => setIsPortalOpen(true)}
              onMouseLeave={() => setIsPortalOpen(false)}
            >
              <button 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  scrolled ? "bg-slate-900 text-white hover:bg-blue-600" : "bg-white text-slate-900 hover:bg-blue-50"
                }`}
              >
                E-Portal <ChevronDown size={16} className={`transition-transform duration-300 ${isPortalOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isPortalOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 overflow-hidden"
                  >
                    <Link to="/login" className="flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl transition-all group">
                      <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <UserCircle size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-slate-900">Student</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Access Results</p>
                      </div>
                    </Link>
                    
                    <Link to="/admin" className="flex items-center gap-4 p-4 hover:bg-slate-100 rounded-2xl transition-all group mt-1">
                      <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <Briefcase size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-slate-900">Staff</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Panel</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className={scrolled ? "text-slate-900" : "text-white"} /> : <Menu className={scrolled ? "text-slate-900" : "text-white"} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed inset-0 z-[90] bg-slate-900 p-8 pt-32 lg:hidden flex flex-col gap-8 text-center">
            {['Home', 'About', 'Courses', 'Teachers', 'Admission', 'Contact'].map(item => (
              <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-3xl font-black text-white" onClick={() => setIsMenuOpen(false)}>{item}</Link>
            ))}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Link to="/login" className="bg-blue-600 text-white py-4 rounded-2xl font-bold text-center text-sm" onClick={() => setIsMenuOpen(false)}>Student</Link>
              <Link to="/admin" className="bg-white/10 text-white py-4 rounded-2xl font-bold text-center text-sm border border-white/20" onClick={() => setIsMenuOpen(false)}>Staff</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Header --- */}
      <header className="relative pt-48 pb-32 bg-slate-900 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 font-black tracking-widest uppercase text-xs border border-white/20 px-5 py-2.5 rounded-full inline-block mb-8">Meet the Faculty</span>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              Mentors for the <br/><span className="text-blue-500 italic">Next Generation</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
              Our educators are industry leaders, researchers, and pioneers dedicated to your academic success.
            </p>
          </motion.div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 border-b border-slate-100 pb-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Filter size={16} className="text-slate-300 mr-2" />
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeDept === dept 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search faculty..." className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode='popLayout'>
            {filteredFaculty.map((teacher) => (
              <motion.div
                layout
                key={teacher.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[3rem] p-10 border border-slate-100 hover:shadow-3xl transition-all duration-500"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden border-4 border-slate-50 shadow-sm mx-auto lg:mx-0">
                    <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="absolute top-0 right-0 flex flex-col gap-3">
                    {[FaTwitter, FaLinkedin, FaGithub].map((Icon, i) => (
                      <a key={i} href="#" className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                        <Icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{teacher.dept}</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-4 mb-2 tracking-tight">{teacher.name}</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">{teacher.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">{teacher.bio}</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <Users className="text-slate-300" size={18} />
                      <div>
                        <p className="text-xs font-black text-slate-900">{teacher.stats.students}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Mentored</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-slate-300" size={18} />
                      <div>
                        <p className="text-xs font-black text-slate-900">{teacher.stats.courses}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Courses</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="mt-10 w-full bg-slate-50 text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  View Full Profile <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-white py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 font-black text-[10px] tracking-[0.3em] uppercase italic">
          © 2026 Precious Academy. Empowering Lives through Knowledge.
        </p>
      </footer>
    </div>
  );
};

export default Teachers;