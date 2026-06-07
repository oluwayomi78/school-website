import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  Star,
  Filter,
  ChevronRight,
  GraduationCap,
  Menu,
  X,
  PlayCircle,
  ChevronDown,
  UserCircle,
  Briefcase
} from 'lucide-react';

const Courses = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const categories = ['All', 'Science', 'Arts', 'Technology', 'Business', 'Languages'];

  const courseData = [
    {
      id: 1,
      title: "Advanced Software Engineering",
      category: "Technology",
      instructor: "Engr. Precious Enoch",
      duration: "12 Weeks",
      rating: 4.9,
      students: "1.2k",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
      price: "Free"
    },
    {
      id: 2,
      title: "Digital Business Management",
      category: "Business",
      instructor: "Dr. Sarah Ade",
      duration: "8 Weeks",
      rating: 4.8,
      students: "850",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      price: "Premium"
    },
    {
      id: 3,
      title: "Modern Yoruba Linguistics",
      category: "Languages",
      instructor: "Prof. Olumide",
      duration: "6 Weeks",
      rating: 5.0,
      students: "2.1k",
      image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=800",
      price: "Free"
    },
    {
      id: 4,
      title: "Quantum Physics Fundamentals",
      category: "Science",
      instructor: "Dr. Elizabeth John",
      duration: "15 Weeks",
      rating: 4.7,
      students: "420",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
      price: "Premium"
    }
  ];

  const filteredCourses = courseData.filter(course => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">

      {/* Navigation */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm" : "bg-transparent py-6"
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group z-[110]">
            <div className={`p-2 rounded-xl transition-colors ${scrolled ? "bg-blue-600" : "bg-white/10 backdrop-blur-md border border-white/20"}`}>
              <GraduationCap className={scrolled ? "text-white" : "text-blue-600"} size={24} />
            </div>
            <span className={`text-xl font-black tracking-tighter transition-colors duration-300 ${isMenuOpen ? "text-slate-900" : scrolled ? "text-slate-900" : "text-slate-800"}`}>
              PRECIOUS<span className="text-blue-500">ACADEMY</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">About</Link>
            <Link to="/courses" className="text-sm font-bold text-blue-600">Courses</Link>
            <Link to="/admission" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Admission</Link>
            <Link to="/contact" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Contact</Link>

            <div
              className="relative"
              onMouseEnter={() => setIsPortalOpen(true)}
              onMouseLeave={() => setIsPortalOpen(false)}
            >
              <button
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${scrolled ? "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
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

          {/* Mobile Hamburger Button */}
          <button
            className="lg:hidden p-2 z-[110] relative transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="text-slate-900" size={28} /> : <Menu className={scrolled ? "text-slate-900" : "text-slate-800"} size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-white z-[100] flex flex-col p-8 pt-28 lg:hidden"
            >
              <div className="flex flex-col gap-6">
                {['Home', 'About', 'Courses', 'Admission', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl font-black text-slate-900 tracking-tighter hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Access E-Portal</p>
                <div className="grid grid-cols-1 gap-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-5 bg-blue-50 rounded-2xl group active:scale-95 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
                        <UserCircle size={24} />
                      </div>
                      <span className="font-black text-slate-900">Student Portal</span>
                    </div>
                    <ChevronRight size={20} className="text-blue-600" />
                  </Link>

                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group active:scale-95 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 p-3 rounded-xl text-white shadow-lg">
                        <Briefcase size={24} />
                      </div>
                      <span className="font-black text-slate-900">Staff Admin</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-900" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <header className="pt-40 pb-20 bg-white border-b border-slate-100">
        {/* Header content remains the same */}
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Master New <span className="text-blue-600">Skills</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg mb-10 font-medium leading-relaxed">
              Explore our curated selection of professional courses designed to take your academic and career goals to the next level.
            </p>

            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search for courses..."
                className="w-full pl-14 pr-6 py-4 md:py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-slate-700 font-medium text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Main grid and content remain the same but optimized for touch */}
        <div className="flex flex-wrap items-center gap-3 mb-10 md:mb-12">
          <div className="flex items-center gap-2 mr-4 text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest">
            <Filter size={14} /> Filter By:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ... Rest of the component (Course Grid, Footer) ... */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode='popLayout'>
            {filteredCourses.map((course) => (
              <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className="relative h-56 md:h-60 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-600">
                    {course.category}
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white p-3 md:p-4 rounded-full text-blue-600 shadow-xl">
                      <PlayCircle size={28} />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                    <div className="flex text-amber-400">
                      <Star size={14} fill="currentColor" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{course.rating} ({course.students} students)</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mb-6">By {course.instructor}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wide">
                      <Clock size={14} /> {course.duration}
                    </div>
                    <div className={`text-base md:text-lg font-black ${course.price === 'Free' ? 'text-green-500' : 'text-slate-900'}`}>
                      {course.price}
                    </div>
                  </div>

                  <Link
                    to={`/courses/${course.id}`}
                    className="mt-8 w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95"
                  >
                    Enroll Now <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
      <footer className="bg-white py-12 border-t border-slate-100 text-center">

        <p className="text-slate-400 font-black text-xs tracking-widest uppercase">

          © 2026 Precious Academy. Empowering the Next Generation.

        </p>

      </footer>
    </div>
  );
};

export default Courses;