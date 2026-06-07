import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios, { AxiosError } from 'axios';
import {
  GraduationCap,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  Globe,
  Loader2
} from 'lucide-react';

interface ErrorResponse {
  message: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://school-website-backend-7r1r.onrender.com/api/users/login', {
        email,
        password,
      });
      if (response.data.user.role !== 'student') {
        setError('Please enter valid email and password');
        setLoading(false);
        return;
      }

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/portal');
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(
        axiosError.response?.data?.message ||
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
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
          <header className="text-center lg:text-left mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">Student E-Portal</h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed px-4 lg:px-0">
              Enter your credentials to access your academic dashboard and resources.
            </p>
          </header>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl text-center"
            >
              {error}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Student Email</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@preciousacademy.edu"
                  className="w-full pl-12 pr-6 py-3.5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 font-bold transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Access Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-3.5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 font-bold transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember device</span>
              </label>
              <a href="#" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">Reset Password?</a>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <footer className="mt-8 text-center text-sm font-bold text-slate-500">
            Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Create Account</Link>
          </footer>
        </motion.div>
      </div>

      <div className="hidden lg:flex w-[55%] bg-slate-900 relative items-center justify-center overflow-hidden p-12 xl:p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <div className="relative z-20 text-center max-w-lg w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] mb-10 shadow-2xl"
          >
            <ShieldCheck className="text-blue-400" size={56} />
          </motion.div>
          <h2 className="text-4xl xl:text-5xl font-black text-white mb-8 tracking-tighter leading-tight">
            Security. Stability. <br /> <span className="text-blue-500 italic">Excellence.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-hover hover:bg-white/10 text-white">
              <span className="text-blue-400"><Fingerprint size={18} /></span>
              <span className="text-[10px] font-black uppercase tracking-widest ml-2">Biometric Auth</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-hover hover:bg-white/10 text-white">
              <span className="text-blue-400"><Globe size={18} /></span>
              <span className="text-[10px] font-black uppercase tracking-widest ml-2">Global Access</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/15 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};

export default Login;