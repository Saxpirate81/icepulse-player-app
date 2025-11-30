import React, { useState } from 'react';
import { Mail, Lock, User, Building2, ArrowRight, X, CheckCircle } from 'lucide-react';
import { EmailNotification } from './EmailNotification';

// Signup Component
export const SignupView = ({ onSignup, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationDescription: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.organizationName.trim()) {
        newErrors.organizationName = 'Organization name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (currentStep === 2) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (onSignup) {
      await onSignup(formData);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black italic text-white uppercase mb-2">
          Create Organization
        </h1>
        <p className="text-zinc-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-cyan-400 hover:text-cyan-300 font-bold"
          >
            Sign In
          </button>
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= s
                  ? 'bg-cyan-500 text-white'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {step > s ? <CheckCircle size={20} /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-2 transition-all ${
                  step > s ? 'bg-cyan-500' : 'bg-zinc-800'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Organization & Account */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black italic text-white uppercase mb-2">
              Organization Details
            </h2>
            <p className="text-zinc-400 text-sm">
              Set up your organization and admin account
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                placeholder="e.g., Edmonton Oilers Hockey Club"
              />
              {errors.organizationName && (
                <p className="text-red-400 text-xs mt-1">{errors.organizationName}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                Description (Optional)
              </label>
              <textarea
                value={formData.organizationDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organizationDescription: e.target.value,
                  })
                }
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none resize-none"
                placeholder="Tell us about your organization..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                Admin Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                placeholder="admin@organization.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Admin Details */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black italic text-white uppercase mb-2">
              Admin Information
            </h2>
            <p className="text-zinc-400 text-sm">
              Your account details as organization admin
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black italic text-white uppercase mb-2">
              Review & Complete
            </h2>
            <p className="text-zinc-400 text-sm">
              Review your information and create your organization
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 space-y-4 border border-zinc-800">
            <div>
              <h3 className="text-zinc-500 text-xs font-bold uppercase mb-2">
                Organization
              </h3>
              <p className="text-white font-bold">{formData.organizationName}</p>
              {formData.organizationDescription && (
                <p className="text-zinc-400 text-sm mt-1">
                  {formData.organizationDescription}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-zinc-500 text-xs font-bold uppercase mb-2">
                Admin Account
              </h3>
              <p className="text-white">
                {formData.firstName} {formData.lastName}
              </p>
              <p className="text-zinc-400 text-sm">{formData.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-zinc-700 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          {step === 3 ? 'Create Organization' : 'Next'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Login Component
export const LoginView = ({ onLogin, onSwitchToSignup, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      if (onLogin) {
        await onLogin(formData);
      }
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black italic text-white uppercase mb-2">
          Sign In
        </h1>
        <p className="text-zinc-400 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-cyan-400 hover:text-cyan-300 font-bold"
          >
            Create Organization
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 pl-11 text-white focus:border-cyan-500 outline-none"
              placeholder="admin@organization.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 pl-11 text-white focus:border-cyan-500 outline-none"
              placeholder="Enter your password"
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-bold"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? 'Signing In...' : 'Sign In'}
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
};

// Forgot Password Component
export const ForgotPasswordView = ({ onReset, onBack }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setError('');
    
    if (onReset) {
      await onReset(email);
    }
    
    setSent(true);
  };

  if (sent) {
    return (
      <>
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-black italic text-white uppercase mb-2">
              Password Reset Link Generated
            </h1>
            <p className="text-zinc-400 text-sm mb-6">
              A password reset link has been generated for <span className="text-cyan-400 font-bold">{email}</span>
            </p>
            <button
              onClick={() => setResetLink(`${window.location.origin}/reset-password/token_${Date.now()}`)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all mb-4"
            >
              Show Reset Link
            </button>
            <button
              onClick={onBack}
              className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm hover:bg-zinc-700 transition-all"
            >
              Back to Sign In
            </button>
          </div>
        </div>
        {resetLink && (
          <EmailNotification
            type="password-reset"
            email={email}
            link={resetLink}
            onClose={() => setResetLink(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black italic text-white uppercase mb-2">
          Reset Password
        </h1>
        <p className="text-zinc-400 text-sm">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 pl-11 text-white focus:border-cyan-500 outline-none"
              placeholder="admin@organization.com"
            />
          </div>
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-zinc-700 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            Send Reset Link
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

