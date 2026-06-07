import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios, { AxiosError } from 'axios';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  Loader2
} from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    course: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ error: '', success: '' });

    if (!formData.fullName || !formData.email || !formData.password || !formData.course) {
      setFeedback({ error: 'Please populate all entry fields.', success: '' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('https://school-website-backend-7r1r.onrender.com/api/users/register', {
        fullname: formData.fullName,
        email: formData.email,
        password: formData.password,
        course: formData.course
      });

      if (response.status === 201 || response.status === 200) {
        setFeedback({ error: '', success: 'Account created! Rerouting to authorization matrix...' });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Registration structural failure. Server unreached.';
      setFeedback({ error: errorMessage, success: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      <div className="w-full lg:w-[45%] flex flex-col p-6 sm:p-12 lg:p-20 xl:p-24 justify-center relative">
        <Link to="/" className="absolute top-8 left-6 sm:top-12 sm:left-12 flex items-center gap-3 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-100">
            <GraduationCap className="text-white" size={20} />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tighter">
            PRECIOUS<span className="text-blue-600">ACADEMY</span>
          </span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto lg:mx-0 mt-20 lg:mt-0"
        >
          <header className="mb-8 sm:mb-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              Join thousands of students and start your digital academic journey today.
            </p>
          </header>

          {feedback.error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-black uppercase tracking-widest text-center">
              {feedback.error}
            </div>
          )}

          {feedback.success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-black uppercase tracking-widest text-center animate-pulse">
              {feedback.success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Precious Enoch" 
                  className="w-full pl-12 pr-6 py-3.5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 font-bold transition-all text-sm"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Academic Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email" 
                  placeholder="hello@example.com" 
                  className="w-full pl-12 pr-6 py-3.5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 font-bold transition-all text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Intended Course</label>
              <div className="relative">
                <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 font-bold transition-all text-sm appearance-none text-slate-700 cursor-pointer"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  disabled={isSubmitting}
                >
                  <option value="">Select a Course</option>
                  <option value="software">Software Engineering</option>
                  <option value="business">Business Management</option>
                  <option value="linguistics">Modern Linguistics</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ArrowRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-6 py-3.5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 font-bold transition-all text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-6 disabled:bg-slate-400 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  Processing Data <Loader2 className="animate-spin" size={18} />
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <footer className="mt-8 text-center text-sm font-bold text-slate-500">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
          </footer>
        </motion.div>
      </div>

      <div className="hidden lg:flex w-[55%] bg-slate-50 relative items-center justify-center overflow-hidden p-12 xl:p-20">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-100/40 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        
        <div className="relative z-20 max-w-lg w-full">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 xl:p-12 rounded-[3.5rem] shadow-3xl shadow-blue-100/50 border border-white"
          >
            <div className="inline-flex p-4 bg-blue-50 rounded-2xl mb-8">
              <Sparkles className="text-blue-600" size={28} />
            </div>
            <h2 className="text-3xl xl:text-4xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
              Unlock Your <br /> <span className="text-blue-600 italic">Academic Potential</span>
            </h2>
            
            <div className="space-y-5">
              {[
                "Personalized Learning Path",
                "Access to 200+ Digital Resources",
                "Direct Mentorship from Experts",
                "Verified Digital Certificates"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="text-green-500" size={14} />
                  </div>
                  <span className="text-xs xl:text-sm font-black text-slate-600 uppercase tracking-widest leading-none">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] xl:text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Live</span>
            </div>
            <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <span className="text-[9px] xl:text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolling for 2026</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-5%] left-[-5%] opacity-[0.03] pointer-events-none">
          <GraduationCap size={400} className="text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default Signup;