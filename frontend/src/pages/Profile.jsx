import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Edit3, Trash2, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { getErrorMessage } from '../utils/errorHandler';
import ErrorMessage from '../components/common/ErrorMessage';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateUser, deleteAccount, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    full_name: user?.full_name || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await updateUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal credentials, contact details, and session settings
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left: Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-3xl shadow-xs">
            {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">{user?.full_name}</h2>
          <p className="text-xs text-slate-500">@{user?.username}</p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5" />
            Role: {user?.role || 'user'}
          </div>

          <div className="mt-6 w-full space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <div className="flex justify-between py-1">
              <span>Account ID</span>
              <span className="font-bold text-slate-800">#{user?.id}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Status</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Member Since</span>
              <span className="font-bold text-slate-800">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active Member'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>

        {/* Right: Profile Details & Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user?.username || '',
                      email: user?.email || '',
                      full_name: user?.full_name || '',
                    });
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60 transition"
                  >
                    {isSaving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-slate-400 uppercase">Full Name</dt>
                  <dd className="mt-1 font-semibold text-slate-800">{user?.full_name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-400 uppercase">Username</dt>
                  <dd className="mt-1 font-semibold text-slate-800">{user?.username}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold text-slate-400 uppercase">Email Address</dt>
                  <dd className="mt-1 font-semibold text-slate-800">{user?.email}</dd>
                </div>
              </dl>
            )}
          </div>

          {/* User Carts on Record */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">
              Saved Carts on Record
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              Your account currently has{' '}
              <span className="font-bold text-slate-800">{user?.carts?.length || 0}</span> cart session(s)
              synchronized with the backend database.
            </p>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
            <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider">Danger Zone</h3>
            <p className="mt-1 text-xs text-red-700">
              Permanently delete your user account and all associated carts from the database.
            </p>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Account?"
        message="Are you sure you want to permanently delete your account? All your data, carts, and records will be deleted immediately from the database."
        confirmText="Delete Account"
        isDestructive={true}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
