import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Send,
  MapPin,
  ChevronDown,
  UserCircle,
  Briefcase,
  ChevronRight
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

const Contact = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Admission', path: '/admission' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100 overflow-x-hidden">
      
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm" : "bg-transparent py-5 md:py-8"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group relative z-[110]">
            <div className={`p-2 rounded-xl transition-all duration-300 ${scrolled ? "bg-blue-600 shadow-lg shadow-blue-100" : "bg-white/10 backdrop-blur-md border border-white/20"}`}>
              <GraduationCap className={scrolled ? "text-white" : "text-blue-500"} size={22} />
            </div>
            <span className={`text-xl md:text-2xl font-black tracking-tighter transition-colors duration-300 ${scrolled || isMenuOpen ? "text-slate-900" : "text-white"}`}>
              PRECIOUS<span className="text-blue-500">ACADEMY</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-xs font-black transition-colors uppercase tracking-widest ${
                  item.name === 'Contact' ? "text-blue-600 underline underline-offset-8" : scrolled ? "text-slate-500 hover:text-blue-600" : "text-slate-200 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div 
              className="relative"
              onMouseEnter={() => setIsPortalOpen(true)}
              onMouseLeave={() => setIsPortalOpen(false)}
            >
              <button 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
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
                    className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 overflow-hidden text-left"
                  >
                    <Link to="/login" className="flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl transition-all group">
                      <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <UserCircle size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">Student</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Access Results</p>
                      </div>
                    </Link>
                    
                    <Link to="/admin" className="flex items-center gap-4 p-4 hover:bg-slate-100 rounded-2xl transition-all group mt-1">
                      <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">Staff</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Panel</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button className="lg:hidden p-2 relative z-[110] transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} className="text-slate-900" /> : <Menu size={28} className={scrolled ? "text-slate-900" : "text-white"} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white lg:hidden flex flex-col p-8 pt-28"
          >
            <div className="flex flex-col gap-6 mb-12">
              {navLinks.map(item => (
                <Link key={item.name} to={item.path} className="text-4xl font-black text-slate-900 tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-8">
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Portal Access</p>
               <div className="grid grid-cols-1 gap-4">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-blue-50 rounded-2xl group active:scale-95 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg"><UserCircle size={24} /></div>
                      <span className="font-black text-slate-900">Student Portal</span>
                    </div>
                    <ChevronRight size={20} className="text-blue-600" />
                  </Link>
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group active:scale-95 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 p-3 rounded-xl text-white shadow-lg"><Briefcase size={24} /></div>
                      <span className="font-black text-slate-900">Staff Admin</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-900" />
                  </Link>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative pt-40 pb-48 md:pt-64 md:pb-56 bg-slate-900 overflow-hidden px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-blue-600/20 text-blue-400 font-black tracking-widest uppercase text-[10px] md:text-xs px-5 py-2 rounded-full border border-blue-500/30 inline-block">Connect With Us</span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mt-8 mb-6 tracking-tighter leading-none">
              We're Here to <br/><span className="text-blue-500 italic">Help You Grow</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-base md:text-xl font-medium leading-relaxed px-4">
              Have questions about our curriculum or digital portal? Reach out to our 24/7 support team.
            </p>
          </motion.div>
        </div>
      </header>

      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-24 md:-mt-32 relative z-20">
          {[
            { icon: <FaPhone />, title: "Call Support", text: "+234 810 000 0000", sub: "Mon-Fri from 8am-6pm", color: "text-blue-600" },
            { icon: <FaEnvelope />, title: "Email Office", text: "hello@preciousacademy.edu", sub: "Online support 24/7", color: "text-amber-500" },
            { icon: <FaMapMarkerAlt />, title: "Visit Campus", text: "Academy Way, Ibadan", sub: "Oyo State, Nigeria", color: "text-blue-600" }
          ].map((card, i) => (
            <div key={i} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col items-center text-center group transition-all duration-300">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 ${card.color} flex items-center justify-center text-xl md:text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                {card.icon}
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{card.title}</h3>
              <p className="text-base md:text-lg font-bold text-slate-700 mb-1">{card.text}</p>
              <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 md:mt-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start pb-20">
          <div className="order-2 lg:order-1 px-2">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Send A Message</h2>
            <p className="text-slate-500 text-base md:text-lg mb-10 font-medium leading-relaxed">
              Use the form below to submit a formal inquiry. We respond within 24 business hours.
            </p>
            
            <form className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <input type="text" placeholder="Full Name" className="w-full px-6 py-4 md:py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold transition-all text-sm md:text-base" />
                <input type="email" placeholder="Email Address" className="w-full px-6 py-4 md:py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold transition-all text-sm md:text-base" />
              </div>
              <select className="w-full px-6 py-4 md:py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold text-slate-400 text-sm md:text-base">
                <option>General Inquiry</option>
                <option>Admissions Support</option>
                <option>Portal Help</option>
              </select>
              <textarea rows={5} placeholder="Your Message" className="w-full px-6 py-4 md:py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold transition-all text-sm md:text-base"></textarea>
              <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 shadow-xl transition-all active:scale-95">
                Send Inquiry <Send size={18} />
              </button>
            </form>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Our Location</h2>
            <div className="h-[350px] md:h-[500px] w-full bg-slate-100 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-4 md:border-8 border-white shadow-2xl relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126601.27218335027!2d3.823903!3d7.3775355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10398d77eeff3f67%3A0x13396568a032f3!2sIbadan!5e0!3m2!1sen!2sng!4v1715600000000!5m2!1sen!2sng" 
                className="w-full h-full relative z-10 border-none grayscale"
                loading="lazy"
              ></iframe>
              <div className="absolute bottom-4 left-4 right-4 md:bottom-10 md:left-10 md:right-10 bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:rounded-3xl z-20 shadow-2xl flex items-center gap-4 md:gap-6">
                <div className="bg-blue-600 p-3 md:p-4 rounded-xl md:rounded-2xl text-white shadow-lg"><MapPin size={20} /></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm md:text-base">Main Campus</h4>
                  <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">Academy Way, Ibadan, Nigeria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-10 md:py-12 border-t border-slate-100 text-center px-4">
        <div className="flex justify-center gap-6 mb-6">
          {[FaTwitter, FaInstagram, FaLinkedin, FaGithub].map((Icon, i) => (
            <a key={i} href="#" className="text-slate-400 hover:text-blue-600 transition-colors text-xl"><Icon /></a>
          ))}
        </div>
        <p className="text-slate-400 font-black text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase italic leading-loose">
          © 2026 Precious Academy. Empowering Lives from Ibadan, Nigeria.
        </p>
      </footer>
    </div>
  );
};

export default Contact;