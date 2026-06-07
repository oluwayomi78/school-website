import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios, { AxiosError } from 'axios';
import { 
  GraduationCap, 
  Briefcase, 
  Lock, 
  ArrowRight, 
  ShieldAlert, 
  Key, 
  Settings,
  Loader2
} from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ error: '', success: '' });

    if (!staffId || !password) {
      setFeedback({ error: 'Please enter both Staff ID and Password.', success: '' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post<{ token: string }>('https://school-website-backend-7r1r.onrender.com/api/admin/login', {
         email: staffId,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', 'admin');
        setFeedback({ error: '', success: 'Matrix authorization approved. Accessing root...' });
        
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1500);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Access denied. Security subsystem rejected credentials.';
      console.error('Login error:', err);
      setFeedback({ error: errorMessage, success: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      
      <div className="w-full lg:w-[45%] flex flex-col p-6 sm:p-12 lg:p-20 xl:p-24 justify-center relative">
        <Link to="/" className="absolute top-8 left-6 sm:top-12 sm:left-12 flex items-center gap-3 group">
          <div className="bg-slate-900 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-slate-200">
            <GraduationCap className="text-white" size={20} />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tighter">
            PRECIOUS<span className="text-slate-900">ACADEMY</span>
          </span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto lg:mx-0 mt-20 lg:mt-0"
        >
          <header className="text-center lg:text-left mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <ShieldAlert size={14} /> Restricted Access
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">Staff E-Portal</h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              Log in to manage academic records, student attendance, and institutional resources.
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

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Staff ID Number</label>
              <div className="relative">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="STF-2026-000" 
                  className="w-full pl-12 pr-6 py-3.5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-amber-50 focus:bg-white focus:border-amber-200 font-bold transition-all text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Administrative Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-6 py-3.5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-amber-50 focus:bg-white focus:border-amber-200 font-bold transition-all text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Authorize Session</span>
              </label>
              <a href="#" className="text-xs font-black text-amber-600 hover:underline uppercase tracking-widest">Forgot Credentials?</a>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-amber-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:bg-slate-400 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  Verifying Credentials <Loader2 className="animate-spin" size={18} />
                </>
              ) : (
                <>
                  Secure Login <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 text-center lg:text-left">Security Tip</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed text-center lg:text-left">
              Ensure you are on the official <span className="text-slate-900 font-bold">preciousacademy.edu</span> domain before entering administrative credentials.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex w-[55%] bg-slate-900 relative items-center justify-center overflow-hidden p-12 xl:p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="relative z-20 text-center max-w-lg w-full">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] mb-10 shadow-2xl"
          >
            <Key className="text-amber-400" size={56} />
          </motion.div>
          <h2 className="text-4xl xl:text-5xl font-black text-white mb-8 tracking-tighter leading-tight">
            Institutional <br /> <span className="text-amber-500 italic">Command Center.</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <ShieldAlert size={18} />, text: "End-to-End Encryption" },
              { icon: <Settings size={18} />, text: "Resource Management" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                <span className="text-amber-400">{item.icon}</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-amber-600/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};

export default AdminLogin;