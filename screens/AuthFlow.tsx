
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';
import { Role } from '../types';
import { Bridge } from '../components/Shared';
import { Globe, ArrowLeft, ArrowRight, User as UserIcon, School, GraduationCap, Users } from 'lucide-react';

export const AuthFlow: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedRole) return;

    setIsSubmitting(true);
    // Simulate a brief delay for effect
    setTimeout(() => {
      login(name.trim(), selectedRole);
      setIsSubmitting(false);
    }, 800);
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-500 flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-3xl flex items-center justify-center mb-6 text-3xl font-black text-white shadow-lg rotate-3 overflow-hidden">
              <Bridge className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">SchoolBridge</h1>
            <p className="text-slate-500 text-sm mt-3 text-center">Quick Access: Select your role</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'student', label: 'Student', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
              { id: 'teacher', label: 'Teacher', icon: <School className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
              { id: 'parent', label: 'Parent', icon: <Users className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
            ].map(r => (
              <button 
                key={r.id}
                onClick={() => setSelectedRole(r.id as Role)}
                className="w-full bg-white border border-slate-100 p-4 rounded-3xl text-left hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center gap-4 group shadow-sm"
              >
                <span className={`text-xl w-10 h-10 rounded-2xl flex items-center justify-center ${r.color} group-hover:scale-110 transition-transform`}>{r.icon}</span>
                <span className="font-bold text-slate-700">{r.label}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={() => navigate('/supabase-test')}
              className="w-full py-3 px-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" />
              Test Supabase Connection
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-md relative">
        <button 
          onClick={() => setSelectedRole(null)}
          className="absolute -top-12 left-0 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to roles
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
              {selectedRole} Access
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              Welcome
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Enter your name to access your {selectedRole} dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Your Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Salim Al-Rawahi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-700"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isSubmitting || !name.trim() ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                 <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entering...
                 </>
              ) : (
                <>Enter Dashboard</>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              This is a demo access mode. Your session will be saved locally.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
