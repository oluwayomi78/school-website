import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Heart, 
  ShieldCheck,
  Zap,
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  UserCircle,
  Briefcase
} from 'lucide-react';
import { FaQuoteLeft } from 'react-icons/fa';

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: "Years of Excellence", value: "15+" },
    { label: "Certified Teachers", value: "450+" },
    { label: "Global Partners", value: "25+" },
    { label: "Success Stories", value: "10k+" }
  ];

  const values = [
    {
      title: "Academic Integrity",
      desc: "We uphold the highest standards of honesty and transparency in our curriculum and grading.",
      icon: <ShieldCheck className="text-blue-600" />,
      bg: "bg-blue-50"
    },
    {
      title: "Student Centricity",
      desc: "Every digital tool we build is designed to make the student's journey smoother and more engaging.",
      icon: <Heart className="text-rose-600" />,
      bg: "bg-rose-50"
    },
    {
      title: "Innovative Spirit",
      desc: "Based in Ibadan, we leverage modern technology to provide a world-class learning experience.",
      icon: <Zap className="text-amber-600" />,
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className={`p-2 rounded-xl transition-colors ${scrolled ? "bg-blue-600 shadow-lg" : "bg-white/10 backdrop-blur-md border border-white/20"}`}>
              <GraduationCap className={scrolled ? "text-white" : "text-amber-400"} size={24} />
            </div>
            <span className={`text-xl font-black tracking-tighter transition-colors ${scrolled ? "text-slate-900" : "text-white"}`}>
              PRECIOUS<span className="text-blue-500">ACADEMY</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'About', 'Courses', 'Admission', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className={`text-sm font-bold transition-colors ${scrolled ? "text-slate-600 hover:text-blue-600" : "text-slate-300 hover:text-white"}`}
              >
                {item}
              </Link>
            ))}
            
            {/* E-Portal Dropdown Container */}
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

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-slate-900 p-8 pt-24 lg:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {['Home', 'About', 'Courses', 'Admission', 'Contact'].map((item) => (
                <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-2xl font-black text-white" onClick={() => setIsMenuOpen(false)}>{item}</Link>
              ))}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Link to="/login" className="bg-blue-600 text-white py-4 rounded-2xl font-bold text-center text-sm" onClick={() => setIsMenuOpen(false)}>Student</Link>
                <Link to="/admin" className="bg-white/10 text-white py-4 rounded-2xl font-bold text-center text-sm border border-white/20" onClick={() => setIsMenuOpen(false)}>Staff</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative pt-48 pb-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber-400 font-black tracking-widest uppercase text-sm">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mt-6 mb-8 tracking-tighter leading-tight">
              Legacy of <span className="text-blue-500 italic">Excellence</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              Precious Academy is more than just a school; it's a digital ecosystem where curiosity meets innovation, preparing students for the global stage.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000" 
                alt="Academy Building" 
                className="rounded-[3rem] shadow-2xl z-10 relative object-cover"
              />
              <div className="absolute -bottom-10 -right-10 bg-blue-600 p-12 rounded-[3rem] hidden lg:block -z-10 shadow-2xl shadow-blue-200"></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl inline-flex items-center gap-2 font-bold text-sm">
                <Target size={18} /> Established 2025
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Pioneering the Digital Frontier in Nigerian Education
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Precious Academy began as a vision in Ibadan to bridge the gap between traditional teaching methods and the rapidly evolving digital world.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-6 text-center sm:text-left">
                {stats.map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-3xl font-black text-blue-600">{stat.value}</div>
                    <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -10 }}
            className="p-12 rounded-[3rem] bg-white border border-slate-100 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-blue-50 transition-colors">
              <Eye size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-100">
                <Eye size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Our Vision</h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium italic">
                To be the leading tech-driven educational institution in Africa, fostering a culture of curiosity and producing leaders for global innovation.
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="p-12 rounded-[3rem] bg-white border border-slate-100 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-amber-50 transition-colors">
              <Target size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-amber-100">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Our Mission</h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium italic">
                To provide a safe, modern learning environment where technology simplifies management and amplifies excellence in teaching.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Core Values</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-100 text-center hover:shadow-2xl transition-all duration-500">
              <div className={`w-20 h-20 ${v.bg} rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-sm`}>
                {v.icon}
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4">{v.title}</h4>
              <p className="text-slate-500 font-bold text-xs leading-relaxed uppercase tracking-widest">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8 text-blue-300 opacity-50">
            <FaQuoteLeft size={60} />
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-10 italic tracking-tight">
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-1 bg-amber-400 rounded-full"></div>
            <p className="text-blue-100 font-black uppercase tracking-[0.2em] text-xs">Principal, Precious Academy</p>
            <div className="w-12 h-1 bg-amber-400 rounded-full"></div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 bg-white text-center">
        <p className="text-slate-400 font-black text-[10px] tracking-[0.3em] uppercase">
          © 2026 Precious Academy. Built with Precision in Ibadan, Nigeria.
        </p>
      </footer>
    </div>
  );
};

export default About;