import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Mail, UserPlus } from 'lucide-react';

// Component for accepting invitations (coaches and players)
export const InvitationAcceptance = ({ invitationToken, onComplete }) => {
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('verify'); // 'verify', 'signup', 'complete'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  // Load invitation details
  useEffect(() => {
    const loadInvitation = async () => {
      try {
        // TODO: API call to verify invitation token
        // const response = await fetch(`/api/invitations/${invitationToken}`);
        // const data = await response.json();
        
        // Mock data for now
        setInvitation({
          id: 1,
          email: 'coach@example.com',
          type: 'coach', // or 'player'
          organizationName: 'Edmonton Oilers',
          teamName: 'U18 Elite',
          role: 'assistant_coach',
          status: 'pending',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading invitation:', error);
        setLoading(false);
      }
    };
    
    if (invitationToken) {
      loadInvitation();
    }
  }, [invitationToken]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccept = async () => {
    if (!validateForm()) return;
    
    try {
      const { acceptInvitation } = await import('../utils/organizationService.js');
      const result = await acceptInvitation(invitationToken, {
        ...formData,
        email: invitation.email,
      });
      
      setStep('complete');
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('Error accepting invitation. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-800 max-w-md">
          <X size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white uppercase mb-2">Invalid Invitation</h2>
          <p className="text-zinc-400 text-sm">
            This invitation link is invalid or has expired. Please contact your organization administrator.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-800 max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase mb-2">Welcome!</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Your account has been created. You can now access the app.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all"
          >
            Go to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-md border border-zinc-800">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-cyan-400" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase mb-2">
            You're Invited!
          </h2>
          <p className="text-zinc-400 text-sm">
            {invitation.type === 'coach' ? 'Join as a coach' : 'Join as a player'} for{' '}
            <span className="text-cyan-400 font-bold">{invitation.organizationName}</span>
            {invitation.teamName && (
              <>
                {' '}• <span className="text-cyan-400 font-bold">{invitation.teamName}</span>
              </>
            )}
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Invitation Details</p>
            <p className="text-white text-sm">{invitation.email}</p>
            {invitation.role && (
              <p className="text-zinc-400 text-xs mt-1 capitalize">
                Role: {invitation.role.replace('_', ' ')}
              </p>
            )}
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
              Create Password *
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
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            onClick={handleAccept}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all"
          >
            Accept Invitation & Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

