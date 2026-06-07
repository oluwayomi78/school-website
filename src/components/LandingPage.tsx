import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Star, 
  LayoutDashboard, 
  ClipboardCheck, 
  Wallet, 
  Presentation,
  Menu,
  X,
  ChevronDown,
  UserCircle,
  Briefcase
} from 'lucide-react';
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone
} from "react-icons/fa";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`backdrop-blur-md bg-white/70 border border-white/20 shadow-xl rounded-[2rem] ${className}`}>
    {children}
  </div>
);

const SectionHeading = ({ tag, title, subtitle }: { tag: string; title: string; subtitle: string }) => (
  <div className="text-center mb-16 px-4">
    <motion.span 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="text-amber-600 font-bold tracking-[0.2em] uppercase text-xs bg-amber-50 px-4 py-2 rounded-full"
    >
      {tag}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-black text-slate-900 mt-6 mb-6"
    >
      {title}
    </motion.h2>
    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">{subtitle}</p>
  </div>
);

const PreciousAcademy = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-2xl group-hover:rotate-[10deg] transition-transform duration-300 shadow-lg shadow-blue-200">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              PRECIOUS<span className="text-blue-600">ACADEMY</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {['', 'About', 'Courses', 'Teachers', 'Admission', 'Contact'].map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                {item === '' ? '' : item}
              </Link>
            ))}
            
            <div className="relative">
              <button 
                onMouseEnter={() => setIsPortalOpen(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-blue-600 hover:-translate-y-0.5 transition-all"
              >
                E-Portal <ChevronDown size={16} className={`transition-transform ${isPortalOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isPortalOpen && (
                  <motion.div 
                    onMouseLeave={() => setIsPortalOpen(false)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 overflow-hidden"
                  >
                    <Link to="/login" className="flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl transition-colors group">
                      <div className="bg-blue-100 p-2 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <UserCircle size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-slate-900">Student</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Access Results</p>
                      </div>
                    </Link>
                    <Link to="/admin" className="flex items-center gap-4 p-4 hover:bg-amber-50 rounded-2xl transition-colors group">
                      <div className="bg-amber-100 p-2 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
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

          <button className="lg:hidden p-2 bg-white rounded-xl shadow-sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-[90] bg-white p-8 pt-32 lg:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {['Home', 'About', 'Courses', 'Teachers', 'Admission', 'Contact'].map((item) => (
                <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-2xl font-black text-slate-800" onClick={() => setIsMenuOpen(false)}>{item}</Link>
              ))}
              <div className="grid grid-cols-2 gap-4 mt-10">
                <Link to="/login" className="bg-blue-600 text-white py-4 rounded-2xl font-bold">Student</Link>
                <Link to="/admin" className="bg-slate-900 text-white py-4 rounded-2xl font-bold">Staff</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section id="home" className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10 rounded-bl-[150px]" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeIn}>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-5 py-2.5 rounded-full text-xs font-black mb-8 uppercase tracking-widest">
              <Star size={14} fill="currentColor" className="animate-pulse" /> The Gold Standard in Learning
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tight">
              Empowering Students Through <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">Digital Learning</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-lg">
              Experience a world-class management system designed to streamline education, foster growth, and inspire the next generation of leaders.
            </p>
            <div className="flex flex-wrap gap-5">
                <Link to={'/signup'}>
              <button className="flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all hover:scale-105">
                Get Started <ArrowRight size={20} />
              </button>
                </Link>
                <Link to={'/courses'}>
              <button className="flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                Explore Courses <Play size={20} fill="currentColor" className="text-blue-600" />
              </button>
                </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-blue-600/5 blur-3xl rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
              alt="Students" 
              className="relative rounded-[3rem] shadow-2xl border-[12px] border-white object-cover aspect-[4/5] lg:aspect-auto"
            />
            <GlassCard className="absolute -bottom-12 -left-12 p-8 hidden md:flex items-center gap-5 animate-bounce-slow">
              <div className="bg-amber-400 p-4 rounded-2xl text-white shadow-lg shadow-amber-200"><Users size={32} /></div>
              <div>
                <div className="text-3xl font-black text-slate-900">12k+</div>
                <div className="text-slate-500 font-bold text-sm uppercase tracking-tighter">Active Students</div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Students", value: "12,000+", icon: <Users /> },
            { label: "Teachers", value: "450+", icon: <GraduationCap /> },
            { label: "Available Courses", value: "180+", icon: <BookOpen /> },
            { label: "Graduates", value: "35,000+", icon: <Award /> },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-blue-600 mb-4 flex justify-center group-hover:scale-110 transition-transform">{stat.icon}</div>
              <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{stat.value}</h3>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="py-32 px-6">
        <SectionHeading 
          tag="Academy Features"
          title="Digital-First Management"
          subtitle="Everything you need to manage an elite educational institution in the 21st century."
        />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Student Portal", icon: <Users />, desc: "Centralized hub for learning materials, assignments, and grades." },
            { title: "Online Classes", icon: <Presentation />, desc: "Seamless virtual learning with integrated video and collaboration." },
            { title: "Result Tracking", icon: <ClipboardCheck />, desc: "Automated grading and digital report card generation." },
            { title: "Attendance", icon: <CheckCircle2 />, desc: "Biometric and cloud-based attendance tracking for students." },
            { title: "Secure Payments", icon: <Wallet />, desc: "Integrated payment gateways for tuition and academy fees." },
            { title: "Teacher Hub", icon: <LayoutDashboard />, desc: "Advanced tools for lesson planning and performance analytics." },
          ].map((feature, i) => (
            <GlassCard key={i} className="p-10 group hover:bg-blue-600 transition-all duration-500 cursor-default text-center lg:text-left">
              <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 mb-8 mx-auto lg:mx-0 group-hover:bg-white/20 group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-slate-500 group-hover:text-blue-50 transition-colors leading-relaxed">
                {feature.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden group">
              <UserCircle className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 group-hover:scale-110 transition-transform duration-700" />
              <h3 className="text-3xl font-black mb-4">Student E-Portal</h3>
              <p className="text-blue-100 mb-8 max-w-sm">Access your course materials, check your results, and manage your student profile.</p>
              <Link to="/login" className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-sm hover:bg-slate-900 hover:text-white transition-all shadow-xl">
                Enter Portal <ArrowRight size={20} />
              </Link>
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
              <Briefcase className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 group-hover:scale-110 transition-transform duration-700" />
              <h3 className="text-3xl font-black mb-4">Staff E-Portal</h3>
              <p className="text-slate-400 mb-8 max-w-sm">Manage student attendance, upload resources, and process academic results.</p>
              <Link to="/admin" className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-sm hover:bg-white hover:text-slate-900 transition-all shadow-xl">
                Staff Login <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Admission --- */}
      <section id="admission" className="py-20 px-6">
        <div className="max-w-7xl mx-auto relative rounded-[4rem] overflow-hidden bg-slate-900 px-8 py-20 lg:p-24 text-center lg:text-left">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/20 blur-[100px]" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
                Secure Your Seat for the <br />
                <span className="text-amber-400">2026 Academic Year</span>
              </h2>
              <p className="text-slate-400 text-lg lg:text-xl">Applications are now open for all departments. Join a community built on excellence and innovation.</p>
            </div>
              <Link to={'/admission'}>
            <button className="bg-amber-500 text-white px-14 py-7 rounded-3xl font-black text-xl hover:bg-amber-600 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-amber-900/20 whitespace-nowrap">
              Apply Now
            </button>
              </Link>
          </div>
        </div>
      </section>

      {/* --- Contact --- */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <SectionHeading 
              tag="Contact Us"
              title="Reach Out To Us"
              subtitle="Our support team is available 24/7 to assist with your inquiries."
            />
            <div className="space-y-6 mt-10">
              {[
                { icon: <FaMapMarkerAlt />, title: "Address", text: "Precious Way, Ibadan, Nigeria", color: "text-blue-600" },
                { icon: <FaEnvelope />, title: "Email", text: "hello@preciousacademy.edu", color: "text-amber-500" },
                { icon: <FaPhone />, title: "Phone", text: "+234 810 000 0000", color: "text-blue-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`${item.color} text-2xl`}>{item.icon}</div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.title}</p>
                    <p className="text-lg font-bold text-slate-800">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <GlassCard className="p-10 lg:p-14">
            <h3 className="text-3xl font-black mb-8">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="First Name" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" />
                <input type="text" placeholder="Last Name" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" />
              <textarea placeholder="How can we help you?" rows={4} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none"></textarea>
              <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-lg hover:bg-blue-700 shadow-xl shadow-blue-100">
                Submit Inquiry
              </button>
            </form>
          </GlassCard>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 gap-16 mb-16">
          <div className="col-span-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl text-white"><GraduationCap /></div>
              <span className="text-2xl font-black uppercase tracking-tighter">Precious Academy</span>
            </div>
            <p className="text-slate-500 max-w-md leading-loose mb-10 text-lg font-medium mx-auto lg:mx-0">
              A premium educational management platform providing world-class digital tools for students and educators in Ibadan.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              {[
                { icon: <FaTwitter />, link: "#" },
                { icon: <FaInstagram />, link: "#" },
                { icon: <FaLinkedin />, link: "#" },
                { icon: <FaGithub />, link: "#" }
              ].map((social, i) => (
                <a key={i} href={social.link} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-4 text-slate-500 font-bold">
              {['Home', 'About', 'Courses', 'Teachers', 'Admission', 'Contact'].map(link => (
                <li key={link}><Link to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="hover:text-blue-600 transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-sm text-center lg:text-left">Newsletter</h4>
            <p className="text-slate-500 mb-6 font-medium text-center lg:text-left">Stay updated with our latest news.</p>
            <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100 max-w-sm mx-auto lg:mx-0">
              <input type="text" placeholder="Email" className="bg-transparent px-4 py-2 w-full outline-none text-sm font-bold" />
              <button className="bg-blue-600 text-white p-3 rounded-xl hover:scale-105 transition-all"><FaEnvelope /></button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-50 text-center">
          <p className="text-slate-400 font-bold text-sm tracking-tight uppercase">
            © 2026 Precious Academy. Built for the Future in Ibadan, Nigeria.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PreciousAcademy;