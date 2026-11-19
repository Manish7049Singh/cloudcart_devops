import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, LogIn } from 'lucide-react';
import { getErrorMessage } from '../../utils/errorHandler';
import ErrorMessage from '../common/ErrorMessage';

export const LoginForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password) {
      setError('Please provide both username and password.');
      return;
    }
    try {
      await onSubmit(formData.username, formData.password);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleQuickFill = (u, p) => {
    setFormData({ username: u, password: p });
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      {/* Username */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Username
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            placeholder="Enter your username"
            required
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Password
          </label>
        </div>
        <div className="relative mt-1">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60 transition"
      >
        <LogIn className="h-4 w-4" />
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>

      {/* Examination Quick-Fill Helper */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-700 mb-1.5">Demo Credentials for Evaluation:</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('admin', 'AdminPass123!')}
            className="rounded bg-brand-100 px-2 py-1 font-medium text-brand-700 hover:bg-brand-200 transition"
          >
            Fill Admin (admin / AdminPass123!)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('demouser', 'UserPass123!')}
            className="rounded bg-slate-200 px-2 py-1 font-medium text-slate-700 hover:bg-slate-300 transition"
          >
            Fill Customer (demouser / UserPass123!)
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
