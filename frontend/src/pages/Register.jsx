import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/forms/RegisterForm';

export const Register = () => {
  const { signup, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (formData) => {
    await signup(formData);
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-xl shadow-sm">
            E
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">
            Create a New Account
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Join NovaMart for seamless ordering, cart syncing, and order tracking
          </p>
        </div>

        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

        <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
