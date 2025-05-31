'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isLogin ? '/api/login' : '/api/signup';

    // Prepare payload, exclude name on login
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
      } else {
        toast.success(`${isLogin ? 'Logged in' : 'Signed up'} successfully!`);
        // Redirect after short delay so toast shows
        setTimeout(() => {
          router.push('/social');
        }, 1500);
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
  {/* Background decoration */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
  <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
  <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
  
  <ToastContainer position="top-center" />

  {/* Branding Header with enhanced styling */}
  <div className="mb-12 text-center relative z-10">
   
    <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3 tracking-tight">
      Synq
    </h1>
    <p className="text-slate-400 text-lg font-medium">
      Where people sync together
    </p>
    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-4"></div>
  </div>

  {/* Auth Card with enhanced design */}
  <div className="w-full max-w-md bg-gradient-to-b from-slate-800/90 to-slate-700/90 backdrop-blur-xl p-8 rounded-2xl border border-slate-600/50 shadow-2xl relative z-10">
    {/* Card header */}
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">
        {isLogin ? 'Welcome Back' : 'Join Synq'}
      </h2>
      <p className="text-slate-400 text-sm">
        {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
      </p>
    </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {!isLogin && (
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            <span className="text-sm">👤</span>
          </div>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-slate-700/80 border border-slate-600/50 pl-12 pr-4 py-4 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
          />
        </div>
      )}
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
          <span className="text-sm">📧</span>
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-slate-700/80 border border-slate-600/50 pl-12 pr-4 py-4 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
        />
      </div>
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
          <span className="text-sm">🔒</span>
        </div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-slate-700/80 border border-slate-600/50 pl-12 pr-4 py-4 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
          loading ? 'opacity-60 cursor-not-allowed hover:scale-100' : ''
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Please wait...
          </>
        ) : (
          <>
            <span className="text-sm"></span>
            {isLogin ? 'Sign In' : 'Create Account'}
          </>
        )}
      </button>
    </form>

    {/* Divider */}
    <div className="flex items-center my-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      <span className="px-4 text-slate-400 text-sm">or</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
    </div>

    {/* Toggle auth mode */}
    <button
      onClick={() => setIsLogin(!isLogin)}
      className="w-full text-center py-3 px-4 rounded-xl border border-slate-600/50 text-blue-400 hover:text-blue-300 hover:bg-slate-700/30 transition-all duration-200 font-medium backdrop-blur-sm"
      disabled={loading}
    >
      {isLogin ? (
        <>
          <span className="mr-2">🆕</span>
          Don't have an account? Sign Up
        </>
      ) : (
        <>
          <span className="mr-2">👋</span>
          Already have an account? Sign In
        </>
      )}
    </button>
  </div>

  {/* Footer */}
  <div className="mt-8 text-center text-slate-500 text-sm relative z-10">
    <p>© 2025 Synq. Connect, Share, Sync.</p>
  </div>
</div>
  );
}
