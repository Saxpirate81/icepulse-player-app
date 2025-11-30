import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  UserPlus, 
  Mail, 
  CheckCircle, 
  X, 
  ChevronRight,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';

// Organization Signup Component
export const OrganizationSignup = ({ onComplete }) => {
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
    // TODO: API call to create organization and admin user
    console.log('Creating organization:', formData);
    if (onComplete) {
      onComplete({
        organization: {
          name: formData.organizationName,
          description: formData.organizationDescription,
        },
        admin: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }
      });
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
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
            <h2 className="text-2xl font-black italic text-white uppercase mb-2">
              Create Your Organization
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
            <h2 className="text-2xl font-black italic text-white uppercase mb-2">
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

      {/* Step 3: Review & Complete */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black italic text-white uppercase mb-2">
              Review & Complete
            </h2>
            <p className="text-zinc-400 text-sm">
              Review your information and complete setup
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
          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
        >
          {step === 3 ? 'Create Organization' : 'Next'}
        </button>
      </div>
    </div>
  );
};

// Team Management Component
export const TeamManagement = ({ organizationId, teams = [], onAddTeam, onEditTeam, onDeleteTeam }) => {
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = () => {
    if (editingTeam) {
      onEditTeam(editingTeam.id, teamForm);
    } else {
      onAddTeam({ ...teamForm, organizationId });
    }
    setTeamForm({ name: '', description: '' });
    setShowAddTeam(false);
    setEditingTeam(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black italic text-white uppercase">Teams</h3>
        <button
          onClick={() => setShowAddTeam(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold text-sm uppercase hover:bg-cyan-500 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Team
        </button>
      </div>

      {/* Teams List */}
      <div className="space-y-3">
        {teams.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800 border-dashed">
            <Users size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-sm">No teams yet. Create your first team!</p>
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center justify-between"
            >
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm uppercase">{team.name}</h4>
                {team.description && (
                  <p className="text-zinc-400 text-xs mt-1">{team.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingTeam(team);
                    setTeamForm({ name: team.name, description: team.description || '' });
                    setShowAddTeam(true);
                  }}
                  className="p-2 text-zinc-500 hover:text-cyan-400 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDeleteTeam(team.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Team Modal */}
      {showAddTeam && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white uppercase">
                {editingTeam ? 'Edit Team' : 'Add Team'}
              </h3>
              <button
                onClick={() => {
                  setShowAddTeam(false);
                  setEditingTeam(null);
                  setTeamForm({ name: '', description: '' });
                }}
                className="text-zinc-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, name: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                  placeholder="e.g., U18 Elite"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                  Description (Optional)
                </label>
                <textarea
                  value={teamForm.description}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none resize-none"
                  placeholder="Team description..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddTeam(false);
                    setEditingTeam(null);
                    setTeamForm({ name: '', description: '' });
                  }}
                  className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!teamForm.name.trim()}
                  className="flex-1 bg-cyan-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingTeam ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Invitation Component (for coaches and players)
export const InvitationManager = ({ 
  type, // 'coach' or 'player'
  organizationId,
  teamId,
  onSendInvitation,
  initialInvitations = [] // Pass invitations from parent
}) => {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: type === 'coach' ? 'assistant_coach' : 'player',
  });
  const [invitations, setInvitations] = useState(initialInvitations);
  
  // Update invitations when prop changes
  useEffect(() => {
    if (initialInvitations) {
      setInvitations(initialInvitations.filter(inv => inv.type === type || inv.invitation_type === type));
    }
  }, [initialInvitations, type]);

  const handleSendInvitation = async () => {
    if (!inviteForm.email.trim()) return;

    try {
      // Create invitation
      const invitation = {
        id: Date.now(),
        email: inviteForm.email,
        firstName: inviteForm.firstName,
        lastName: inviteForm.lastName,
        role: inviteForm.role,
        status: 'pending',
        sentAt: new Date().toISOString(),
      };

      // Call parent handler (which will create invitation and send email)
      if (onSendInvitation) {
        await onSendInvitation({
          ...invitation,
          organizationId,
          teamId,
          type,
        });
      }

      // Add to local list
      setInvitations([...invitations, invitation]);
      setInviteForm({ email: '', firstName: '', lastName: '', role: inviteForm.role });
      setShowInvite(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Error sending invitation. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black italic text-white uppercase">
          {type === 'coach' ? 'Coaches' : 'Players'}
        </h3>
        <button
          onClick={() => setShowInvite(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold text-sm uppercase hover:bg-cyan-500 transition-colors flex items-center gap-2"
        >
          <UserPlus size={16} /> Invite {type === 'coach' ? 'Coach' : 'Player'}
        </button>
      </div>

      {/* Invitations List */}
      <div className="space-y-2">
        {invitations.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800 border-dashed">
            <Mail size={32} className="text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-500 text-xs">
              No {type === 'coach' ? 'coaches' : 'players'} invited yet
            </p>
          </div>
        ) : (
          invitations.map((inv) => (
            <div
              key={inv.id}
              className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-white font-bold text-sm">
                  {inv.firstName} {inv.lastName}
                </p>
                <p className="text-zinc-400 text-xs">{inv.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-xs uppercase">{inv.status}</span>
                {inv.status === 'pending' && (
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white uppercase">
                Invite {type === 'coach' ? 'Coach' : 'Player'}
              </h3>
              <button
                onClick={() => {
                  setShowInvite(false);
                  setInviteForm({ email: '', firstName: '', lastName: '', role: inviteForm.role });
                }}
                className="text-zinc-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                  placeholder="coach@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={inviteForm.firstName}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, firstName: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={inviteForm.lastName}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, lastName: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              {type === 'coach' && (
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                    Role
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, role: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="head_coach">Head Coach</option>
                    <option value="assistant_coach">Assistant Coach</option>
                    <option value="trainer">Trainer</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowInvite(false);
                    setInviteForm({ email: '', firstName: '', lastName: '', role: inviteForm.role });
                  }}
                  className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvitation}
                  disabled={!inviteForm.email.trim()}
                  className="flex-1 bg-cyan-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

