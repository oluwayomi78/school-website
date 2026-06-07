import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Menu, 
  X, 
  CheckCircle2, 
  FileText,  
  ShieldCheck,
  ChevronDown,
  UserPlus,
  UserCircle,
  Briefcase
} from 'lucide-react';

const Admission = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { title: "Online Application", desc: "Fill out the digital form with your academic history and personal details.", icon: <FileText /> },
    { title: "Entrance Exam", desc: "Schedule and sit for our standardized digital entrance assessment.", icon: <ShieldCheck /> },
    { title: "Interview", desc: "A one-on-one session with our department heads to discuss your goals.", icon: <UserPlus /> },
    { title: "Enrollment", desc: "Receive your offer letter and complete the digital onboarding process.", icon: <CheckCircle2 /> }
  ];

  const faqs = [
    { q: "What are the requirements for international students?", a: "International students require a valid passport, certified transcripts, and proof of English proficiency if applying from non-English speaking regions." },
    { q: "Are there scholarship opportunities available?", a: "Yes, Precious Academy offers merit-based scholarships for the top 5% of entrance exam performers and need-based financial aid." },
    { q: "How long does the admission process take?", a: "Typically, the process from application to final offer takes between 2 to 4 weeks depending on the exam schedule." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 overflow-x-hidden">
      
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-colors ${scrolled ? "bg-blue-600 shadow-lg" : "bg-white/10 backdrop-blur-md border border-white/20"}`}>
              <GraduationCap className={scrolled ? "text-white" : "text-amber-400"} size={24} />
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
                className={`text-sm font-bold transition-colors ${
                  item === 'Admission' ? "text-blue-500 underline underline-offset-8" : scrolled ? "text-slate-600 hover:text-blue-600" : "text-slate-300 hover:text-white"
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
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  scrolled ? "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200" : "bg-white text-slate-900 hover:bg-blue-50"
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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-[90] bg-slate-900 p-8 pt-32 lg:hidden flex flex-col gap-8 text-center"
          >
            {['Home', 'About', 'Courses', 'Admission', 'Contact'].map(item => (
              <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-3xl font-black text-white" onClick={() => setIsMenuOpen(false)}>{item}</Link>
            ))}
            <div className="grid grid-cols-2 gap-4 mt-4 px-4">
              <Link to="/login" className="bg-blue-600 text-white py-4 rounded-2xl font-bold text-center text-sm" onClick={() => setIsMenuOpen(false)}>Student</Link>
              <Link to="/admin" className="bg-white/10 text-white py-4 rounded-2xl font-bold text-center text-sm border border-white/20" onClick={() => setIsMenuOpen(false)}>Staff</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative pt-48 pb-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 font-black tracking-widest uppercase text-xs border border-white/20 px-4 py-2 rounded-full">Enrolling for 2026</span>
            <h1 className="text-6xl md:text-8xl font-black text-white mt-8 mb-8 tracking-tighter leading-tight">
              Begin Your <span className="text-blue-500 italic">Journey</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
              Our admission process is designed to identify passionate individuals ready to excel in a tech-driven academic environment.
            </p>
          </motion.div>
        </div>
      </header>

      {/* --- Process Section --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Application Process</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                <div className="text-4xl font-black text-slate-200 absolute top-8 right-10 group-hover:text-blue-100 transition-colors">0{i+1}</div>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-8 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{step.title}</h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed tracking-wide uppercase">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Requirements Section --- */}
      <section className="py-32 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">Admission <br/><span className="text-blue-600">Requirements</span></h2>
            <p className="text-slate-500 text-lg font-medium">To maintain our standard of excellence, we require the following from all applicants:</p>
            
            <div className="space-y-4">
              {[
                "Certified High School Transcripts",
                "Two Letters of Recommendation",
                "Personal Statement (500 Words)",
                "Digital Passport Photograph",
                "Proof of Residence/National ID"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <CheckCircle2 className="text-green-500 flex-shrink-0" />
                  <span className="font-black text-slate-700 text-sm tracking-wide uppercase">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 lg:p-16 rounded-[4rem] shadow-3xl shadow-slate-200 border border-slate-100">
            <h3 className="text-3xl font-black mb-8 tracking-tight">Quick Application</h3>
            <form className="space-y-6">
              <input type="text" placeholder="Full Name" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
              <input type="email" placeholder="Email Address" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
              <select className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-400">
                <option>Select Intended Course</option>
                <option>Software Engineering</option>
                <option>Business Management</option>
                <option>Modern Linguistics</option>
              </select>
              <button className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-3xl border border-slate-100 overflow-hidden">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-black text-slate-800 tracking-tight uppercase">{faq.q}</span>
                  <ChevronDown className={`transition-transform duration-300 ${activeAccordion === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="bg-slate-50">
                      <p className="p-8 text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 font-black text-[10px] tracking-[0.3em] uppercase italic">
          © 2026 Precious Academy Admissions. Building Global Leaders in Ibadan.
        </p>
      </footer>
    </div>
  );
};

export default Admission;