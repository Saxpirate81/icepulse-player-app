import React, { useState, useEffect, useRef } from 'react';
import { OrganizationSignup, TeamManagement, InvitationManager } from './components/OrganizationOnboarding';
import { SignupView, LoginView, ForgotPasswordView } from './components/AuthView';
import { OrganizationDashboard } from './components/OrganizationDashboard';
import { 
  Activity, 
  Users, 
  MessageSquare, 
  User, 
  Play, 
  Pause, 
  Settings, 
  Plus, 
  MoreVertical, 
  Flame, 
  Trophy, 
  Mic2, 
  CheckCircle,
  ChevronRight,
  Dumbbell, 
  Send,
  Heart, 
  Zap,
  Trash2,
  Mail,
  Target,
  BookOpen,
  Calendar,
  Archive,
  Library,
  X,
  Edit2,
  PlusCircle,
  Layers,
  Thermometer,
  Timer,
  Video,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
  Upload,
  Link as LinkIcon,
  PlayCircle,
  Building2,
  UserPlus
} from 'lucide-react';

// --- Assets ---

const IcePulseLogo = ({ className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg transform -skew-x-12 shadow-lg shadow-cyan-500/20">
      <Activity className="text-white relative z-10" size={20} strokeWidth={3} />
    </div>
    <span className="font-black text-xl tracking-tighter text-white italic">
      ICE<span className="text-cyan-400">PULSE</span>
    </span>
  </div>
);

// --- Mock Data ---
// Note: Only user data (players, coaches) removed. Workout data kept for testing.

const MOCK_ACTIVE_WORKOUT = {
  id: 101,
  title: "Sept 1st-8th: Home Training Plan",
  description: "Off-ice skills and shooting drills to do at home. Use synthetic ice if available (no skates required).",
  dueDate: "Sunday, Nov 14",
  totalXp: 1500,
  currentXp: 850,
  progress: 56, // percentage
  categories: [
    {
      id: 'c1',
      title: 'Warm-Up & Mobility',
      icon: <Zap size={18} className="text-yellow-400" />,
      color: 'yellow',
      items: [
        { id: 't1', title: 'Dynamic Stretching', subtitle: 'Hips and Groin focus', duration: '10m', completed: true, type: 'Mobility', totalSets: 1, autoRepTracking: false },
        { id: 't2', title: 'Ladder Drills', subtitle: 'High knees - 2 in 2 out', duration: '5m', completed: true, type: 'Agility', totalSets: 3, autoRepTracking: false },
      ]
    },
    {
      id: 'c2',
      title: 'Off-Ice Skills (Home Training)',
      icon: <Thermometer size={18} className="text-cyan-400" />,
      color: 'cyan',
      items: [
        { id: 't3', title: 'Cone Stickhandling Figure-8', subtitle: 'Quick hands through tight spaces - Use synthetic ice if available (no skates)', duration: '15m', completed: false, type: 'Stick Handling', totalSets: 5, targetReps: 10, autoRepTracking: true, location: 'home' },
        { id: 't4', title: 'Toe Drag & Shoot', subtitle: 'Deception move into quick release - Home shooting pad or synthetic ice', duration: '20m', completed: false, type: 'Shooting', totalSets: 4, targetReps: 12, autoRepTracking: true, location: 'home' },
        { id: 't6', title: 'Puck Protection Circles', subtitle: 'Use body to shield puck in tight areas - Home training surface', duration: '15m', completed: false, type: 'Stick Handling', totalSets: 3, targetReps: 8, autoRepTracking: true, location: 'home' },
        { id: 't7', title: 'Quick Release Snap Shots', subtitle: 'Fast release from various angles - Off-ice shooting pad', duration: '20m', completed: false, type: 'Shooting', totalSets: 5, targetReps: 10, autoRepTracking: true, location: 'home' },
      ]
    },
    {
      id: 'c3',
      title: 'Strength (Off-Ice)',
      icon: <Dumbbell size={18} className="text-red-400" />,
      color: 'red',
      items: [
        { id: 't5', title: 'Bulgarian Split Squats', subtitle: '3 Sets of 10 (Each Leg)', duration: '15m', completed: false, type: 'Strength', totalSets: 3, targetReps: 10, targetSets: 3, autoRepTracking: true },
      ]
    }
  ]
};

// Mock data removed - using real data from localStorage

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', size = 'md' }) => {
  const base = "rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide select-none";
  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-3 text-sm"
  };
  const variants = {
    primary: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border-t border-cyan-400/20",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    ghost: "text-zinc-400 hover:text-white",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20",
    outline: "border-2 border-zinc-700 text-zinc-300 hover:border-zinc-500"
  };
  return (
    <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, onClick, className = '' }) => (
  <div onClick={onClick} className={`bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-3 md:p-5 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

const ProgressBar = ({ progress, className = "" }) => (
  <div className={`h-2 bg-zinc-800 rounded-full overflow-hidden ${className}`}>
    <div 
      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000" 
      style={{ width: `${progress}%` }}
    />
  </div>
);

// --- Organization Setup Views ---

const OrganizationSetup = ({ setView }) => {
  const [currentStep, setCurrentStep] = useState('signup'); // 'signup', 'teams', 'coaches', 'players', 'complete'
  const [organization, setOrganization] = useState(null);
  const [teams, setTeams] = useState([]);

  const handleOrganizationCreated = (data) => {
    setOrganization(data.organization);
    setCurrentStep('teams');
  };

  const handleAddTeam = async (teamData) => {
    try {
      const { createTeam } = await import('./utils/organizationService.js');
      const newTeam = await createTeam(teamData);
      setTeams([...teams, newTeam]);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team. Please try again.');
    }
  };

  const handleEditTeam = async (teamId, teamData) => {
    try {
      const { updateTeam } = await import('./utils/organizationService.js');
      const updated = await updateTeam(teamId, teamData);
      setTeams(teams.map(t => t.id === teamId ? updated : t));
    } catch (error) {
      console.error('Error updating team:', error);
      alert('Error updating team. Please try again.');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    
    try {
      const { deleteTeam } = await import('./utils/organizationService.js');
      await deleteTeam(teamId);
      setTeams(teams.filter(t => t.id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team. Please try again.');
    }
  };

  const handleSendInvitation = async (invitationData) => {
    try {
      const { sendInvitation } = await import('./utils/organizationService.js');
      await sendInvitation(invitationData);
      // Invitation will show in the list
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Error sending invitation. Please try again.');
    }
  };

  return (
    <div className="space-y-6 pb-32 animate-in fade-in duration-500">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {['signup', 'teams', 'coaches', 'players'].map((step, idx) => {
          const stepNames = {
            signup: 'Organization',
            teams: 'Teams',
            coaches: 'Coaches',
            players: 'Players'
          };
          const isActive = currentStep === step;
          const isCompleted = ['signup', 'teams', 'coaches', 'players'].indexOf(currentStep) > idx;
          
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isActive || isCompleted
                      ? 'bg-cyan-500 text-white'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle size={20} /> : idx + 1}
                </div>
                <span className={`text-xs mt-2 font-bold uppercase ${
                  isActive ? 'text-cyan-400' : 'text-zinc-500'
                }`}>
                  {stepNames[step]}
                </span>
              </div>
              {idx < 3 && (
                <div
                  className={`w-16 h-1 mx-2 transition-all ${
                    isCompleted ? 'bg-cyan-500' : 'bg-zinc-800'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Organization Signup */}
      {currentStep === 'signup' && (
        <div>
          <OrganizationSignup onComplete={handleOrganizationCreated} />
        </div>
      )}

      {/* Step 2: Teams */}
      {currentStep === 'teams' && organization && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black italic text-white uppercase mb-2">
              Set Up Teams
            </h2>
            <p className="text-zinc-400 text-sm">
              Create teams for your organization. You can add more later.
            </p>
          </div>
          <TeamManagement
            organizationId={organization.id}
            teams={teams}
            onAddTeam={handleAddTeam}
            onEditTeam={handleEditTeam}
            onDeleteTeam={handleDeleteTeam}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep('signup')}
              className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-zinc-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep('coaches')}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all"
            >
              Continue to Coaches
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Coaches */}
      {currentStep === 'coaches' && organization && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black italic text-white uppercase mb-2">
              Invite Coaches
            </h2>
            <p className="text-zinc-400 text-sm">
              Invite coaches to your organization. They'll be able to create workout plans and assign them to players.
            </p>
          </div>
          <InvitationManager
            type="coach"
            organizationId={organization.id}
            onSendInvitation={handleSendInvitation}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep('teams')}
              className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-zinc-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep('players')}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all"
            >
              Continue to Players
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Players */}
      {currentStep === 'players' && organization && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black italic text-white uppercase mb-2">
              Recruit Players
            </h2>
            <p className="text-zinc-400 text-sm">
              Invite players to join your organization. They'll receive workout assignments from coaches.
            </p>
          </div>
          
          {/* Team Selection for Player Invites */}
          {teams.length > 0 && (
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 mb-4">
              <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">
                Assign to Team (Optional)
              </label>
              <select className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none">
                <option value="">All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          )}

          <InvitationManager
            type="player"
            organizationId={organization.id}
            onSendInvitation={handleSendInvitation}
          />
          
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep('coaches')}
              className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-zinc-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                setCurrentStep('complete');
                // TODO: Mark onboarding as complete
              }}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all"
            >
              Complete Setup
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Complete */}
      {currentStep === 'complete' && (
        <div className="text-center space-y-6 py-12">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black italic text-white uppercase mb-2">
              Setup Complete!
            </h2>
            <p className="text-zinc-400 text-sm">
              Your organization is ready. Coaches and players will receive invitations.
            </p>
          </div>
          <button
            onClick={() => setView('roster')}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold uppercase text-sm hover:from-cyan-500 hover:to-blue-500 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

// --- Coach Views ---

const CoachRoster = () => {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="space-y-6 pb-32 relative animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black italic text-white uppercase">Team Roster</h2>
        <Button size="sm" onClick={() => setShowInvite(true)}><Plus size={16} /> Add Player</Button>
      </div>

      <div className="grid gap-4">
        {[].map((s) => ( // Empty array - will load real players from storage
          <Card key={s.id} className="flex flex-col gap-4 group">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400 font-bold text-lg shadow-inner">
                        <span className="font-mono">#{Math.floor(Math.random() * 99)}</span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-none">{s.name}</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase mt-1 flex items-center gap-2">
                          <span>{s.position}</span>
                          <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                          <span className={s.status === 'active' ? 'text-green-500' : 'text-yellow-500'}>{s.status === 'active' ? 'Active' : 'Pending'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-zinc-400 hover:text-white"><MessageSquare size={20} /></button>
                </div>
            </div>
            {s.status === 'active' && (
                <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-3">
                      <div className="flex justify-between text-xs mb-1 uppercase font-bold">
                        <span className="text-zinc-500">Current Drill Plan</span>
                        <span className="text-cyan-400">{s.progress}%</span>
                      </div>
                      <p className="text-sm text-white font-medium mb-2">{s.currentDrill}</p>
                      <ProgressBar progress={s.progress} />
                </div>
            )}
          </Card>
        ))}
      </div>
      
      {showInvite && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm bg-zinc-900 border border-zinc-700 shadow-2xl shadow-cyan-900/20">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white uppercase italic">Recruit Player</h3>
                    <button onClick={() => setShowInvite(false)} className="text-zinc-500 hover:text-white"><X size={24}/></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Player Email</label>
                        <input type="email" placeholder="player@team.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white mt-1 focus:outline-none focus:border-cyan-500" />
                    </div>
                    <Button className="w-full mt-4" onClick={() => setShowInvite(false)}>Send Contract</Button>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

const CoachLibrary = ({ setView, setEditingDrill }) => {
    const [publishedDrills, setPublishedDrills] = useState([]);
    const [draftDrills, setDraftDrills] = useState([]);
    const [archivedDrills, setArchivedDrills] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'published', 'drafts', 'archived'
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(null);

    // Initialize stock drills and load drills from storage
    useEffect(() => {
        const loadDrills = async () => {
            try {
                const { initializeStockDrills, getPublishedDrills, getDraftDrills, getArchivedDrills } = await import('./utils/drillStorage.js');
                
                // Initialize stock drills first (only runs once)
                await initializeStockDrills();
                
                // Then load all drills
                const published = getPublishedDrills();
                const drafts = getDraftDrills();
                const archived = getArchivedDrills();
                
                setPublishedDrills(published);
                setDraftDrills(drafts);
                setArchivedDrills(archived);
            } catch (error) {
                console.error('Error loading drills:', error);
            }
        };
        loadDrills();
    }, []);

    const handleEditDrill = (drill) => {
        setEditingDrill(drill);
        setView('builder');
    };

    const handleDeleteDrill = async (id) => {
        try {
            const { deleteDrill } = await import('./utils/drillStorage.js');
            if (deleteDrill(id)) {
                // Reload drills
                const { getPublishedDrills, getDraftDrills, getArchivedDrills } = await import('./utils/drillStorage.js');
                setPublishedDrills(getPublishedDrills());
                setDraftDrills(getDraftDrills());
                setArchivedDrills(getArchivedDrills());
                setShowDeleteConfirm(null);
            }
        } catch (error) {
            console.error('Error deleting drill:', error);
        }
    };

    const handleArchiveDrill = async (id) => {
        try {
            const { archiveDrill } = await import('./utils/drillStorage.js');
            if (archiveDrill(id)) {
                // Reload drills
                const { getPublishedDrills, getDraftDrills, getArchivedDrills } = await import('./utils/drillStorage.js');
                setPublishedDrills(getPublishedDrills());
                setDraftDrills(getDraftDrills());
                setArchivedDrills(getArchivedDrills());
                setShowArchiveConfirm(null);
            }
            } catch (error) {
            console.error('Error archiving drill:', error);
        }
    };

    const handleUnarchiveDrill = async (id) => {
        try {
            const { unarchiveDrill } = await import('./utils/drillStorage.js');
            if (unarchiveDrill(id)) {
                // Reload drills
                const { getPublishedDrills, getDraftDrills, getArchivedDrills } = await import('./utils/drillStorage.js');
                setPublishedDrills(getPublishedDrills());
                setDraftDrills(getDraftDrills());
                setArchivedDrills(getArchivedDrills());
            }
        } catch (error) {
            console.error('Error unarchiving drill:', error);
        }
    };

    const displayedDrills = filter === 'all' 
        ? [...publishedDrills, ...draftDrills]
        : filter === 'published' 
            ? publishedDrills 
            : filter === 'drafts'
                ? draftDrills
                : archivedDrills;

    return (
        <div className="space-y-6 pb-32 animate-in fade-in duration-500">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black italic text-white uppercase">Playbook</h2>
                <Button size="sm" onClick={() => { 
        setEditingDrill(null);
                  setView('builder'); 
                }}>
                    <Plus size={16} /> New Drill
                </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <Badge 
                    color={filter === 'all' ? 'cyan' : 'zinc'} 
                    onClick={() => setFilter('all')}
                    className="cursor-pointer"
                >
                    All
                </Badge>
                <Badge 
                    color={filter === 'published' ? 'green' : 'zinc'} 
                    onClick={() => setFilter('published')}
                    className="cursor-pointer"
                >
                    Active
                </Badge>
                <Badge 
                    color={filter === 'drafts' ? 'yellow' : 'zinc'} 
                    onClick={() => setFilter('drafts')}
                    className="cursor-pointer"
                >
                    Drafts
                </Badge>
                <Badge 
                    color={filter === 'archived' ? 'zinc' : 'zinc'} 
                    onClick={() => setFilter('archived')}
                    className="cursor-pointer"
                >
                    Archived
                </Badge>
                            </div>

            <div className="space-y-4">
                {displayedDrills.length === 0 ? (
                    <Card className="text-center py-12 border-dashed border-zinc-700 bg-transparent">
                        <p className="text-zinc-500 text-sm">No {filter === 'all' ? 'drills' : filter === 'published' ? 'published drills' : 'drafts'} yet.</p>
                        <Button 
                            size="sm" 
                            className="mt-4" 
                            onClick={() => { setEditingDrill(null); setView('builder'); }}
                        >
                            <Plus size={16} /> Create Your First Drill
                        </Button>
                    </Card>
                ) : (
                    displayedDrills.map((drill) => (
                        <Card 
                            key={drill.id} 
                            onClick={() => handleEditDrill(drill)} 
                            className="group cursor-pointer hover:border-cyan-500/50 transition-all active:scale-[0.98]"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <Badge color={drill.status === 'published' ? 'green' : 'yellow'}>
                                        {drill.status === 'published' ? 'Published' : 'Draft'}
                                    </Badge>
                                    {drill.isStock && (
                                        <Badge color="cyan" className="text-[10px]">
                                            Stock
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditDrill(drill);
                                        }}
                                        className="p-1.5 text-zinc-500 hover:text-cyan-400 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    {filter === 'archived' ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnarchiveDrill(drill.id);
                                            }}
                                            className="p-1.5 text-zinc-500 hover:text-green-400 transition-colors"
                                            title="Unarchive"
                                        >
                                            <Archive size={16} />
                                    </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowArchiveConfirm(drill.id);
                                            }}
                                            className="p-1.5 text-zinc-500 hover:text-yellow-400 transition-colors"
                                            title="Archive"
                                        >
                                            <Archive size={16} />
                                    </button>
                                    )}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDeleteConfirm(drill.id);
                                        }}
                                        className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                            </div>
                                </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors uppercase italic">
                                {drill.planTitle || drill.title || 'Untitled Drill'}
                            </h3>
                            {drill.description && (
                                <p className="text-zinc-400 text-sm mb-4">{drill.description}</p>
                            )}
                            {drill.updatedAt && (
                                <p className="text-zinc-600 text-xs">
                                    Updated {new Date(drill.updatedAt).toLocaleDateString()}
                                </p>
                            )}
                                                </Card>
                    ))
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-sm bg-zinc-900 border border-zinc-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold text-sm uppercase">Delete Drill?</h3>
                            <button 
                                onClick={() => setShowDeleteConfirm(null)}
                                className="text-zinc-500 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                                    </div>
                        <p className="text-zinc-400 text-sm mb-6">
                            This will permanently delete this drill. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button 
                                variant="secondary" 
                                className="flex-1"
                                onClick={() => setShowDeleteConfirm(null)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteDrill(showDeleteConfirm)}
                            >
                                Delete
                            </Button>
                                            </div>
                                        </Card>
                                            </div>
            )}

            {/* Archive Confirmation Modal */}
            {showArchiveConfirm && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-sm bg-zinc-900 border border-zinc-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold text-sm uppercase">Archive Drill?</h3>
                            <button 
                                onClick={() => setShowArchiveConfirm(null)}
                                className="text-zinc-500 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                                            </div>
                        <p className="text-zinc-400 text-sm mb-6">
                            This will move the drill to archived. You can restore it later if needed.
                        </p>
                        <div className="flex gap-3">
                            <Button 
                                variant="secondary" 
                                className="flex-1"
                                onClick={() => setShowArchiveConfirm(null)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                                onClick={() => handleArchiveDrill(showArchiveConfirm)}
                            >
                                Archive
                            </Button>
                                            </div>
                                        </Card>
                                            </div>
                            )}
                        </div>
    )
}

// --- Drill Planner / Workout Builder ---
const WorkoutBuilder = ({ setView, editingDrill }) => {
    const [planTitle, setPlanTitle] = useState('New Workout Plan');
    const [categories, setCategories] = useState([
    { id: 1, title: 'Off-Ice Skills (Home)', tasks: [] },
    { 
      id: 2, 
      title: 'Upper Body Strength', 
      tasks: [
        {
          id: 'default-rope-wrist-curls',
          title: 'Rope Wrist Curls',
          description: 'Tie a rope on a pole with a 3-5lb weight. Use both wrists with arms out to pull the weight up by continuously twisting the rope onto the pole which raises the weight, then reversing it until weight goes back down. Full up and down is one rep.',
          drillCategory: 'Strength',
          targetSets: 3,
          targetReps: 10,
          videoUrl: '',
          imageUrl: '',
          isDefault: true, // Editable/deletable by coach
        }
      ]
    },
    { id: 3, title: 'Lower Body Strength', tasks: [] },
    { id: 4, title: 'Stretching & Mobility', tasks: [] },
    { id: 5, title: 'Cardio & Conditioning', tasks: [] },
  ]);

  const addDrillToCategory = (categoryId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
                    ...cat,
              tasks: [
                ...cat.tasks,
                {
                        id: Date.now(),
                  title: 'New Drill',
                  description: '',
                  drillCategory: '',
                  targetSets: 3,
                  targetReps: 10,
                  videoUrl: '',
                  imageUrl: '',
                },
              ],
            }
          : cat
      )
    );
  };

  const removeDrillFromCategory = (categoryId, taskId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, tasks: cat.tasks.filter((t) => t.id !== taskId) }
          : cat
      )
    );
  };

  // Load editing drill data
  useEffect(() => {
    if (editingDrill) {
      setPlanTitle(editingDrill.planTitle || editingDrill.title || 'New Workout Plan');
      if (editingDrill.categories) {
        setCategories(editingDrill.categories);
      }
    } else {
      // Reset to defaults when creating new
      setPlanTitle('New Workout Plan');
      setCategories([
        { id: 1, title: 'Off-Ice Skills (Home)', tasks: [] },
        { 
          id: 2, 
          title: 'Upper Body Strength', 
          tasks: [
            {
              id: 'default-rope-wrist-curls',
              title: 'Rope Wrist Curls',
              description: 'Tie a rope on a pole with a 3-5lb weight. Use both wrists with arms out to pull the weight up by continuously twisting the rope onto the pole which raises the weight, then reversing it until weight goes back down. Full up and down is one rep.',
              drillCategory: 'Strength',
              targetSets: 3,
              targetReps: 10,
              videoUrl: '',
              imageUrl: '',
              isDefault: true,
            }
          ]
        },
        { id: 3, title: 'Lower Body Strength', tasks: [] },
        { id: 4, title: 'Stretching & Mobility', tasks: [] },
        { id: 5, title: 'Cardio & Conditioning', tasks: [] },
      ]);
    }
  }, [editingDrill]);

    return (
        <div className="space-y-6 pb-32 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4 mb-2">
                                    <button 
          onClick={() => setView('library')}
          className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
        >
                    <ChevronRight className="rotate-180" size={20} />
                </button>
        <h2 className="text-2xl font-black italic text-white uppercase">
          {editingDrill ? 'Edit Drill' : 'Drill Planner'}
        </h2>
            </div>

            <Card>
        <div className="space-y-3">
                    <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">
              Plan Title
            </label>
                        <input 
                            type="text" 
                            value={planTitle}
                            onChange={(e) => setPlanTitle(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white font-bold text-lg mt-1 focus:border-cyan-500 outline-none" 
                        />
                    </div>
          <p className="text-zinc-400 text-xs">
            Build a simple drill plan by adding drills to each category. This
            is a lightweight version of the full planner so you can keep moving
            while we iterate.
          </p>
                </div>
            </Card>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
          <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-wider">
            Exercise Categories
          </h3>
                </div>

                {categories.map((cat) => (
          <div
            key={cat.id}
            className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/50"
          >
                        <div className="bg-zinc-800/80 p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                <div className="text-zinc-500">
                  <Layers size={16} />
                </div>
                                <input 
                                    className="bg-transparent text-white font-bold text-sm outline-none uppercase" 
                                    value={cat.title}
                  onChange={(e) =>
                    setCategories((prev) =>
                      prev.map((c) =>
                        c.id === cat.id ? { ...c, title: e.target.value } : c
                      )
                    )
                  }
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                  onClick={() => addDrillToCategory(cat.id)}
                                    className="p-2 text-cyan-400 hover:text-cyan-300"
                  title="Add drill"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-3 space-y-2">
                            {cat.tasks.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-sm">
                  No drills yet. Click + to add one.
                                </div>
                            ) : (
                                cat.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex gap-2 items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800"
                  >
                    <div className="p-1 bg-zinc-800 rounded text-cyan-400">
                      <Activity size={12} />
                                    </div>
                    <div className="flex-1 space-y-2">
                      {/* Drill title */}
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) =>
                          setCategories((prev) =>
                            prev.map((c) =>
                              c.id === cat.id
                                ? {
                                    ...c,
                                    tasks: c.tasks.map((t) =>
                                      t.id === task.id
                                        ? { ...t, title: e.target.value }
                                        : t
                                    ),
                                  }
                                : c
                            )
                          )
                        }
                        className="w-full bg-transparent text-sm text-white font-bold outline-none border-b border-zinc-700/60 focus:border-cyan-500"
                      />

                      {/* Drill category / type */}
                      <div className="flex gap-2 items-center">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">
                          Drill Category
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Shooting, Skating, Stickhandling"
                          value={task.drillCategory || ''}
                          onChange={(e) =>
                            setCategories((prev) =>
                              prev.map((c) =>
                                c.id === cat.id
                                  ? {
                                      ...c,
                                      tasks: c.tasks.map((t) =>
                                        t.id === task.id
                                          ? { ...t, drillCategory: e.target.value }
                                          : t
                                      ),
                                    }
                                  : c
                              )
                            )
                          }
                          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-[11px] text-white placeholder:text-zinc-600 focus:border-cyan-500 outline-none"
                        />
                        </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Coaching notes and key cues for this drill..."
                          value={task.description || ''}
                          onChange={(e) =>
                            setCategories((prev) =>
                              prev.map((c) =>
                                c.id === cat.id
                                  ? {
                                      ...c,
                                      tasks: c.tasks.map((t) =>
                                        t.id === task.id
                                          ? { ...t, description: e.target.value }
                                          : t
                                      ),
                                    }
                                  : c
                              )
                            )
                          }
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 outline-none resize-none"
                        />
                    </div>

                      {/* Sets × reps */}
                      <div className="text-xs text-zinc-500 mt-1">
                        {task.targetSets} sets × {task.targetReps} reps
            </div>

                      {/* Video + visual (image) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">
                            Video URL (YouTube, Vimeo, or uploaded clip)
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/drill-video"
                            value={task.videoUrl || ''}
                            onChange={(e) =>
                              setCategories((prev) =>
                                prev.map((c) =>
                                  c.id === cat.id
                                    ? {
                                        ...c,
                                        tasks: c.tasks.map((t) =>
                                          t.id === task.id
                                            ? { ...t, videoUrl: e.target.value }
                                            : t
                                        ),
                                      }
                                    : c
                                )
                              )
                            }
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 outline-none"
                          />
                          {task.videoUrl && (
                            <a
                              href={task.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase"
                            >
                              <PlayCircle size={10} className="mr-1" />
                              Preview Video
                            </a>
                          )}
                 </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">
                            Visual / Image
                          </label>
                          
                          {/* AI Image Generation */}
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={async (e) => {
                                try {
                                  const { generateExerciseImages, validateDescriptionForImage } = await import('./utils/imageGeneration.js');
                                  
                                  // Validate description
                                  const validation = validateDescriptionForImage(task.description);
                                  if (!validation.isValid) {
                                    alert(`⚠️ ${validation.message}`);
                                    return;
                                  }
                                  
                                  // Show loading
                                  const loadingBtn = e.target;
                                  const originalText = loadingBtn.textContent;
                                  loadingBtn.disabled = true;
                                  loadingBtn.textContent = 'Generating...';
                                  
                                  // Generate images
                                  const imageUrls = await generateExerciseImages(
                                    task.title,
                                    task.description,
                                    task.drillCategory || cat.title,
                                    3
                                  );
                                  
                                  // Store generated images for selection
                                  setCategories((prev) =>
                                    prev.map((c) =>
                                      c.id === cat.id
                                        ? {
                                            ...c,
                                            tasks: c.tasks.map((t) =>
                                              t.id === task.id
                                                ? { ...t, generatedImages: imageUrls, showImageSelector: true }
                                                : t
                                            ),
                                          }
                                        : c
                                    )
                                  );
                                  
                                  loadingBtn.disabled = false;
                                  loadingBtn.textContent = originalText;
                                } catch (error) {
                                  alert(`Error: ${error.message}`);
                                  e.target.disabled = false;
                                }
                              }}
                              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[10px] font-bold uppercase px-3 py-2 rounded-md transition-all"
                            >
                              <Zap size={10} className="inline mr-1" />
                              Generate AI Image
                            </button>
                            
                            {/* Image selector modal */}
                            {task.showImageSelector && task.generatedImages && (
                              <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <Card className="w-full max-w-2xl bg-zinc-900 border border-zinc-700">
                                  <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white font-bold text-sm uppercase">Choose an Image</h3>
                                    <button
                                        onClick={() => {
                                        setCategories((prev) =>
                                          prev.map((c) =>
                                            c.id === cat.id
                                              ? {
                                                  ...c,
                                                  tasks: c.tasks.map((t) =>
                                                    t.id === task.id
                                                      ? { ...t, showImageSelector: false }
                                                      : t
                                                  ),
                                                }
                                              : c
                                          )
                                        );
                                      }}
                                      className="text-zinc-500 hover:text-white"
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-3 gap-3">
                                    {task.generatedImages.map((imgUrl, idx) => (
                                      <div
                                        key={idx}
                                        onClick={() => {
                                          setCategories((prev) =>
                                            prev.map((c) =>
                                              c.id === cat.id
                                                ? {
                                                    ...c,
                                                    tasks: c.tasks.map((t) =>
                                                      t.id === task.id
                                                        ? { ...t, imageUrl: imgUrl, showImageSelector: false, generatedImages: null }
                                                        : t
                                                    ),
                                                  }
                                                : c
                                            )
                                          );
                                        }}
                                        className="cursor-pointer border-2 border-zinc-700 hover:border-cyan-500 rounded-lg overflow-hidden transition-all"
                                      >
                                        <img
                                          src={imgUrl}
                                          alt={`Option ${idx + 1}`}
                                          className="w-full h-32 object-cover"
                                        />
                                        </div>
                                    ))}
                                </div>
                                </Card>
                            </div>
                            )}
                            
                            {/* Manual upload */}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0];
                                if (!file) return;
                                const url = URL.createObjectURL(file);
                                setCategories((prev) =>
                                  prev.map((c) =>
                                    c.id === cat.id
                                      ? {
                                          ...c,
                                          tasks: c.tasks.map((t) =>
                                            t.id === task.id
                                              ? { ...t, imageUrl: url }
                                              : t
                                          ),
                                        }
                                      : c
                                  )
                                );
                              }}
                              className="w-full text-[10px] text-zinc-400 file:mr-2 file:px-2 file:py-1 file:text-[10px] file:font-bold file:uppercase file:rounded-md file:border-0 file:bg-zinc-800 file:text-zinc-100"
                            />
                                                </div>
                          
                          {task.imageUrl && (
                            <div className="mt-1">
                              <img
                                src={task.imageUrl}
                                alt={task.title}
                                className="w-full h-24 object-cover rounded-md border border-zinc-700"
                              />
                                                </div>
                          )}
                        </div>
                            </div>
                    </div>
                                            <button
                      onClick={() => removeDrillFromCategory(cat.id, task.id)}
                      className="p-2 text-zinc-500 hover:text-red-400"
                    >
                      <X size={14} />
                                            </button>
                                    </div>
                ))
                                    )}
                                </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
                                <Button 
                                    variant="secondary" 
                                    className="flex-1" 
            onClick={async () => {
              try {
                const { saveDraftDrill } = await import('./utils/drillStorage.js');
                const drillData = {
                  id: editingDrill?.id,
                  planTitle,
                  categories,
                  description: '', // Can add description field later
                };
                                saveDraftDrill(drillData);
                setEditingDrill(null);
                setView('library');
              } catch (error) {
                console.error('Error saving draft:', error);
                alert('Error saving draft. Please try again.');
              }
            }}
          >
            Save Draft
                                </Button>
                                <Button 
                                    className="flex-1" 
                                    onClick={async () => {
              try {
                const { savePublishedDrill } = await import('./utils/drillStorage.js');
                const drillData = {
                  id: editingDrill?.id,
                  planTitle,
                  categories,
                  description: '', // Can add description field later
                };
                savePublishedDrill(drillData);
                setEditingDrill(null);
                                            setView('library');
                                        } catch (error) {
                console.error('Error publishing drill:', error);
                alert('Error publishing drill. Please try again.');
                                        }
                                    }}
                                >
            {editingDrill ? 'Update Plan' : 'Publish Plan'}
                                </Button>
                            </div>
                        </div>
                </div>
  );
};

// --- Player Views ---

const PlayerHome = ({ setView, setActiveTask }) => {
  const [workout, setWorkout] = useState(MOCK_ACTIVE_WORKOUT);
  const [assignedWorkouts, setAssignedWorkouts] = useState([]);
  const [excludedDates, setExcludedDates] = useState([]);
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'workout'
  const [deletedDefaults, setDeletedDefaults] = useState(new Set());
  const [isFirstDay, setIsFirstDay] = useState(false);

  // Check if this is the player's first day
  const checkFirstDay = () => {
    try {
      // Check if there's any progress data
      const progressData = localStorage.getItem('icepulse_progress_data');
      const streakData = localStorage.getItem('icepulse_streak_data');
      const firstDayFlag = localStorage.getItem('icepulse_first_day_complete');
      
      // If no progress, no streak, and first day not marked as complete, it's the first day
      const hasNoHistory = !progressData && !streakData && !firstDayFlag;
      return hasNoHistory;
    } catch (error) {
      console.error('Error checking first day:', error);
      return false;
    }
  };

  // Mark first day as complete (called after first workout)
  const markFirstDayComplete = () => {
    localStorage.setItem('icepulse_first_day_complete', 'true');
    setIsFirstDay(false);
  };

  // Load assigned workouts, excluded dates, and deleted defaults
  useEffect(() => {
    const loadData = async () => {
      try {
        const { getPlayerWorkouts } = await import('./utils/workoutAssignment.js');
        const { getExcludedDates } = await import('./utils/streakTracking.js');
        
        const workouts = getPlayerWorkouts(1); // Current player ID
        const excluded = getExcludedDates();
        
        // Check if first day (re-check on each load)
        const firstDay = checkFirstDay();
        setIsFirstDay(firstDay);
        
        // Load deleted defaults from localStorage
        const deletedData = localStorage.getItem('icepulse_deleted_defaults');
        if (deletedData) {
          try {
            const deleted = JSON.parse(deletedData);
            setDeletedDefaults(new Set(deleted));
          } catch (e) {
            console.error('Error loading deleted defaults:', e);
          }
        }
        
          setAssignedWorkouts(workouts);
        setExcludedDates(excluded);
        
          // Use the most recent assigned workout, or merge with default if structure differs
        if (workouts.length > 0) {
          const latestWorkout = workouts[0];
          if (latestWorkout && latestWorkout.categories) {
            setWorkout(latestWorkout);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
    
    // Listen for first day completion
    const handleFirstDayComplete = () => {
      setIsFirstDay(false);
      loadData(); // Reload to update assignments
    };
    window.addEventListener('firstDayComplete', handleFirstDayComplete);
    
    // Refresh periodically to catch new assignments
    const interval = setInterval(loadData, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('firstDayComplete', handleFirstDayComplete);
    };
  }, []);

  const handleTaskClick = (task) => {
    setActiveTask(task);
    setView('training');
  };

  const toggleDayExpand = (dateKey) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  };

  const toggleExcludedDate = async (date, reason = null) => {
    try {
      const { addExcludedDate, removeExcludedDate, getExcludedDates, isDateExcluded } = await import('./utils/streakTracking.js');
      const dateKey = new Date(date).toISOString().split('T')[0];
      
      if (isDateExcluded(date)) {
        if (reason === null) {
          // Remove exclusion
          removeExcludedDate(dateKey);
        } else {
          // Change reason (remove old, add new)
          removeExcludedDate(dateKey);
          addExcludedDate(date, reason);
        }
      } else {
        // Add exclusion with reason
        addExcludedDate(date, reason || 'game');
      }
      
      const updated = getExcludedDates();
      setExcludedDates(updated);
    } catch (error) {
      console.error('Error toggling excluded date:', error);
    }
  };

  // Auto-generate assignments based on game/practice days
  const generateAutoAssignments = async (days) => {
    const autoWorkouts = [];
    const today = new Date();
    const todayKey = formatDateKey(today);
    
    // Load workout tracking utilities once
    const { getNextWorkoutType, shouldAlternate } = await import('./utils/workoutTracking.js');
    
    for (let index = 0; index < days.length; index++) {
      const day = days[index];
      const dateKey = formatDateKey(day);
      const isExcluded = isDateExcluded(day);
      const isToday = dateKey === todayKey;
      
      // Check if bike training is deleted for this day
      const bikeWorkoutId = `auto-bike-${dateKey}`;
      const isBikeDeleted = deletedDefaults.has(bikeWorkoutId);
      
      // Check previous days to determine workout type
      let daysSinceGamePractice = 0;
      for (let i = index - 1; i >= 0; i--) {
        if (isDateExcluded(days[i])) {
          daysSinceGamePractice = index - i;
          break;
        }
      }
      
      const dayWorkouts = [];
      
      // FIRST DAY: Always start with Upper Body (even if game/practice day)
      if (isFirstDay && isToday) {
        dayWorkouts.push({
          id: `auto-upper-first-${dateKey}`,
          title: 'Upper Body Strength',
          description: 'Welcome! Start your training journey with upper body strength',
          type: 'auto',
          isFirstDay: true,
          categories: [{
            id: 'upper',
            title: 'Upper Body Strength',
            items: [
              {
                id: `ub-first-${dateKey}`,
                title: 'Push-Ups',
                subtitle: 'Chest and triceps focus',
                duration: '15m',
                type: 'Strength',
                totalSets: 3,
                targetReps: 15,
                completed: false,
                autoRepTracking: true
              },
              {
                id: `ub2-first-${dateKey}`,
                title: 'Pike Push-Ups',
                subtitle: 'Shoulder strength',
                duration: '10m',
                type: 'Strength',
                totalSets: 3,
                targetReps: 12,
                completed: false,
                autoRepTracking: true
              },
              {
                id: `ub3-first-${dateKey}`,
                title: 'Diamond Push-Ups',
                subtitle: 'Tricep focus',
                duration: '10m',
                type: 'Strength',
                totalSets: 3,
                targetReps: 10,
                completed: false,
                autoRepTracking: true
              },
              {
                id: `ub4-first-${dateKey}`,
                title: 'Rope Wrist Curls',
                subtitle: 'Tie rope on pole with 3-5lb weight, twist rope to raise weight, reverse to lower. Full up and down = 1 rep.',
                duration: '15m',
                type: 'Strength',
                totalSets: 3,
                targetReps: 10,
                completed: false,
                autoRepTracking: true,
                isDefault: true, // Editable/deletable by coach
                description: 'Tie a rope on a pole with a 3-5lb weight. Use both wrists with arms out to pull the weight up by continuously twisting the rope onto the pole which raises the weight, then reversing it until weight goes back down. Full up and down is one rep.'
              }
            ]
          }],
          dueDate: dateKey,
          progress: 0
        });
      }
      
      // Skip rest of logic if excluded (unless it's first day)
      if (isExcluded && !(isFirstDay && isToday)) {
        // Still add skills & drills and bike training if not excluded
        // Continue to next iteration
        continue;
      }
      
      // Determine workout type based on alternating logic
      let workoutType = null;
      
      if (isFirstDay && isToday) {
        // First day always upper body
        workoutType = 'upper';
      } else if (daysSinceGamePractice > 0) {
        // After game/practice, use alternating logic
        if (shouldAlternate(dateKey)) {
          workoutType = getNextWorkoutType();
        } else {
          // Default: day 1 = upper, day 2 = lower
          workoutType = daysSinceGamePractice === 1 ? 'upper' : 'lower';
        }
      } else {
        // Regular day - alternate based on last workout
        if (shouldAlternate(dateKey)) {
          workoutType = getNextWorkoutType();
        } else {
          // Default to upper if no history
          workoutType = 'upper';
        }
      }
      
      // Day 1 after game/practice OR alternating = Upper Body
      if (workoutType === 'upper' && !(isFirstDay && isToday)) {
        dayWorkouts.push({
          id: `auto-upper-${dateKey}`,
          title: 'Upper Body Strength',
          description: 'Upper body strength training',
          type: 'auto',
          categories: [{
            id: 'upper',
            title: 'Upper Body Strength',
            items: [
              {
                id: `ub-${dateKey}`,
                title: 'Push-Ups',
                subtitle: 'Chest and triceps focus',
                duration: '15m',
                type: 'Strength',
                totalSets: 3,
                targetReps: 15,
                completed: false,
                autoRepTracking: true
              },
              {
                id: `ub2-${dateKey}`,
                title: 'Pike Push-Ups',
                subtitle: 'Shoulder strength',
                duration: '10m',
                type: 'Strength',
                totalSets: 3,
                targetReps: 12,
                completed: false,
                autoRepTracking: true
              },
              {
                id: `ub3-${dateKey}`,
                title: 'Rope Wrist Curls',
                subtitle: 'Tie rope on pole with 3-5lb weight, twist rope to raise weight, reverse to lower. Full up and down = 1 rep.',
                duration: '15m',
                type: 'Strength',
                totalSets: 3,
                targetReps: 10,
                completed: false,
                autoRepTracking: true,
                isDefault: true, // Editable/deletable by coach
                description: 'Tie a rope on a pole with a 3-5lb weight. Use both wrists with arms out to pull the weight up by continuously twisting the rope onto the pole which raises the weight, then reversing it until weight goes back down. Full up and down is one rep.'
              }
            ]
          }],
          dueDate: dateKey,
          progress: 0
        });
      }
      
      // Day 2 after game/practice OR alternating = Lower Body
      if (workoutType === 'lower') {
        dayWorkouts.push({
          id: `auto-lower-${dateKey}`,
          title: 'Lower Body Strength',
          description: 'Leg strength and power training',
          type: 'auto',
          categories: [{
            id: 'lower',
            title: 'Lower Body Strength',
            items: [
              {
                id: `lb-${dateKey}`,
                title: 'Bulgarian Split Squats',
                subtitle: '3 sets of 10 each leg',
                duration: '15m',
                type: 'Strength',
                totalSets: 3,
                targetReps: 10,
                completed: false,
                autoRepTracking: true
              },
              {
                id: `lb2-${dateKey}`,
                title: 'Glute Bridges',
                subtitle: 'Hip activation',
                duration: '10m',
                type: 'Strength',
                totalSets: 3,
                targetReps: 15,
                completed: false,
                autoRepTracking: true
              }
            ]
          }],
          dueDate: dateKey,
          progress: 0
        });
      }
      
      // Every off day = Skills & Drills (stickhandling, shooting) + Interval Bike Training
      // On first day, include these even if it's a game/practice day
      if (!isExcluded || (isFirstDay && isToday)) {
        // Skills & Drills - every day (and on first day even if excluded)
        dayWorkouts.push({
          id: `auto-skills-${dateKey}`,
          title: 'Skills & Drills',
          description: 'Daily stickhandling and shooting practice',
          type: 'auto',
          isDefault: false,
          categories: [{
            id: 'skills',
            title: 'Skills & Drills',
            items: [
              {
                id: `stick-${dateKey}`,
                title: 'Cone Stickhandling Figure-8',
                subtitle: 'Quick hands through tight spaces',
                duration: '15m',
                type: 'Stick Handling',
                totalSets: 5,
                targetReps: 10,
                completed: false,
                autoRepTracking: true,
                location: 'home'
              },
              {
                id: `shoot-${dateKey}`,
                title: 'Quick Release Snap Shots',
                subtitle: 'Fast release from various angles',
                duration: '20m',
                type: 'Shooting',
                totalSets: 5,
                targetReps: 10,
                completed: false,
                autoRepTracking: true,
                location: 'home'
              }
            ]
          }],
          dueDate: dateKey,
          progress: 0
        });
        
        // Interval Bike Training (default, editable) - only if not deleted
        // On first day, include even if it's a game/practice day
        if (!isBikeDeleted) {
          dayWorkouts.push({
            id: `auto-bike-${dateKey}`,
            title: 'Interval Bike Training',
            description: '20 seconds all out, 20 seconds rest, 10 minutes total',
            type: 'auto',
            isDefault: true, // Mark as default/editable
            categories: [{
              id: 'cardio',
              title: 'Cardio & Conditioning',
              items: [{
                id: `bike-${dateKey}`,
                title: 'Interval Bike Training',
                subtitle: '20s on / 20s off × 10min',
                duration: '10m',
                type: 'Cardio',
                defaultTimer: 20, // 20 seconds work
                defaultRestTime: 20, // 20 seconds rest
                totalRounds: 15, // 10 min = 15 rounds of 40s each
                completed: false,
                autoRepTracking: false
              }]
            }],
            dueDate: dateKey,
            progress: 0
          });
        }
      }
      
      autoWorkouts.push(...dayWorkouts);
    }
    
    return autoWorkouts;
  };

  // Get assignments for a specific date (including auto-generated)
  const [autoGeneratedWorkouts, setAutoGeneratedWorkouts] = useState([]);
  
  // Generate auto-assignments when days or dependencies change
  useEffect(() => {
    const generateAssignments = async () => {
      try {
        const days = getNext7Days();
        const workouts = await generateAutoAssignments(days);
        // Ensure workouts is always an array
        setAutoGeneratedWorkouts(Array.isArray(workouts) ? workouts : []);
      } catch (error) {
        console.error('Error generating auto-assignments:', error);
        setAutoGeneratedWorkouts([]);
      }
    };
    generateAssignments();
  }, [excludedDates, deletedDefaults, isFirstDay]);
  
  const getAssignmentsForDate = (date) => {
    const dateKey = formatDateKey(date);
    
    // Ensure both are arrays before spreading
    const safeAssigned = Array.isArray(assignedWorkouts) ? assignedWorkouts : [];
    const safeAuto = Array.isArray(autoGeneratedWorkouts) ? autoGeneratedWorkouts : [];
    
    // Combine coach-assigned workouts with auto-generated
    const allWorkouts = [...safeAssigned, ...safeAuto];
    
    // Filter by date and exclude deleted defaults
    return allWorkouts.filter(workout => {
      // Skip deleted default workouts
      if (workout.isDefault && deletedDefaults.has(workout.id)) {
        return false;
      }
      
      if (workout.dueDate === dateKey) return true;
      // Also show workouts without specific dueDate on today
      if (!workout.dueDate && dateKey === formatDateKey(new Date())) return true;
      return false;
    });
  };

  // Calculate completion percentage for a day
  const getDayCompletion = (date) => {
    const assignments = getAssignmentsForDate(date);
    if (assignments.length === 0) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    assignments.forEach(workout => {
      workout.categories?.forEach(category => {
        category.items?.forEach(task => {
          totalTasks++;
          if (task.completed) completedTasks++;
        });
      });
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  // Generate next 7 days
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateDisplay = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const dateKey = formatDateKey(date);
    const todayKey = formatDateKey(today);
    const tomorrowKey = formatDateKey(tomorrow);
    
    if (dateKey === todayKey) return 'Today';
    if (dateKey === tomorrowKey) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isDateExcluded = (date) => {
    const dateKey = formatDateKey(date);
    return excludedDates.some(ex => ex.date === dateKey);
  };

  const getExcludedReason = (date) => {
    const dateKey = formatDateKey(date);
    const excluded = excludedDates.find(ex => ex.date === dateKey);
    return excluded?.reason || null;
  };

  const days = getNext7Days();

  return (
    <div className="space-y-4 md:space-y-6 pb-32 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 uppercase">
            Hey, Beckham
          </h1>
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-wide">Your weekly training plan</p>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col items-center bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
            <Flame className="text-red-500 fill-red-500/20" size={20} />
            <span className="text-[10px] font-bold text-red-400 mt-1">12 Days</span>
          </div>
        </div>
      </div>

      {/* Calendar View - Next 7 Days */}
      <div className="space-y-2 md:space-y-3 bg-zinc-900/20 rounded-2xl p-3 md:p-4 -mx-1 md:-mx-0 border border-zinc-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-wider">This Week</h3>
          {assignedWorkouts.length > 0 && (
            <Badge color="cyan">{assignedWorkouts.length} Active Workout{assignedWorkouts.length !== 1 ? 's' : ''}</Badge>
          )}
            </div>

        {days.map((day) => {
          const dateKey = formatDateKey(day);
          const isExcluded = isDateExcluded(day);
          const excludedReason = getExcludedReason(day);
          const isExpanded = expandedDays.has(dateKey);
          const isToday = dateKey === formatDateKey(new Date());
          // On first day, show assignments even if excluded
          const dayAssignments = (isExcluded && !(isFirstDay && isToday)) ? [] : getAssignmentsForDate(day);
          const dayCompletion = (isExcluded && !(isFirstDay && isToday)) ? 0 : getDayCompletion(day);

          return (
            <Card key={dateKey} className={`overflow-hidden transition-all ${isToday ? 'border-cyan-500/50 bg-cyan-900/10' : ''}`}>
              {/* Day Header */}
              <div 
                className="flex items-center justify-between p-3 md:p-4 cursor-pointer"
                onClick={() => toggleDayExpand(dateKey)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm ${isToday ? 'bg-cyan-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                    {day.getDate()}
          </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm uppercase">
                        {formatDateDisplay(day)}
                      </h4>
                      {isFirstDay && isToday && (
                        <Badge color="cyan" className="animate-pulse">
                          First Day
                        </Badge>
                      )}
                      {isExcluded && !(isFirstDay && isToday) && (
                        <Badge color={excludedReason === 'game' ? 'red' : 'yellow'}>
                          {excludedReason === 'game' ? 'Game' : 'Practice'}
                        </Badge>
                      )}
                    </div>
                    {!isExcluded && dayAssignments.length > 0 && (
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-zinc-400 text-xs">
                          {dayAssignments.length} workout{dayAssignments.length !== 1 ? 's' : ''} assigned
                        </p>
                        <div className="flex items-center gap-2 min-w-[80px] justify-end">
                          <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden flex-shrink-0">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                              style={{ width: `${dayCompletion}%` }}
                            />
                          </div>
                          <span className="text-cyan-400 text-xs font-bold tabular-nums min-w-[35px] text-right">{dayCompletion}%</span>
                        </div>
                      </div>
                    )}
                    {!isExcluded && dayAssignments.length === 0 && (
                      <p className="text-zinc-500 text-xs mt-1">No assignments</p>
                    )}
                    {isExcluded && !(isFirstDay && isToday) && (
                      <p className="text-zinc-500 text-xs mt-1 italic">Training disabled</p>
                    )}
                    {isFirstDay && isToday && (
                      <p className="text-cyan-400 text-xs mt-1 font-bold">Welcome! Start with upper body training</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Quick toggle game/practice */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isExcluded) {
                        if (excludedReason === 'game') {
                          // Switch from game to practice
                          toggleExcludedDate(day, 'practice');
                        } else {
                          // Remove practice, back to normal
                          toggleExcludedDate(day);
                        }
                      } else {
                        // Mark as game day
                        toggleExcludedDate(day, 'game');
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isExcluded 
                        ? excludedReason === 'game' 
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-400'
                    }`}
                    title={
                      isExcluded 
                        ? excludedReason === 'game' 
                          ? 'Switch to Practice Day' 
                          : 'Remove Practice Day'
                        : 'Mark as Game Day'
                    }
                  >
                    {isExcluded ? (excludedReason === 'game' ? '🏒' : '⛸️') : <Calendar size={16} />}
                  </button>
                  
                  <ChevronRight 
                    size={18} 
                    className={`text-zinc-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
            </div>
            
              {/* Expanded Content */}
              {isExpanded && (!isExcluded || (isFirstDay && isToday)) && (
                <div className="border-t border-zinc-800 p-3 md:p-4 space-y-3 md:space-y-4">
                  {dayAssignments.length > 0 ? (
                    dayAssignments.map((assignment) => (
                      <div key={assignment.id} className="space-y-2 md:space-y-3 border border-zinc-800 rounded-xl p-3 md:p-4 bg-zinc-900/50">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-white font-bold text-sm uppercase truncate">{assignment.title}</h5>
                              {assignment.isDefault && (
                                <Badge color="yellow" className="text-[10px] flex-shrink-0">Default</Badge>
                              )}
                              {assignment.type === 'auto' && !assignment.isDefault && (
                                <Badge color="cyan" className="text-[10px] flex-shrink-0">Auto</Badge>
                              )}
                </div>
                            {assignment.description && (
                              <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{assignment.description}</p>
                            )}
            </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {assignment.progress !== undefined && (
                              <Badge color="cyan" className="tabular-nums whitespace-nowrap">{assignment.progress}%</Badge>
                            )}
                            {assignment.isDefault && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add to deleted defaults
                                  const newDeleted = new Set(deletedDefaults);
                                  newDeleted.add(assignment.id);
                                  setDeletedDefaults(newDeleted);
                                  
                                  // Save to localStorage
                                  localStorage.setItem('icepulse_deleted_defaults', JSON.stringify(Array.from(newDeleted)));
                                }}
                                className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors flex-shrink-0"
                                title="Remove default workout"
                              >
                                <X size={14} />
                              </button>
                            )}
        </div>
      </div>

                        {assignment.categories && assignment.categories.map((category) => (
                          <div key={category.id} className="space-y-2">
                            <div className="flex items-center gap-2">
                    {category.icon}
                              <h6 className="text-zinc-400 font-bold text-xs uppercase">{category.title}</h6>
                </div>
                            {category.items && category.items.map((task) => (
                        <Card 
                            key={task.id} 
                            onClick={() => handleTaskClick(task)}
                                className="p-2.5 md:p-3 flex items-center gap-2 md:gap-3 cursor-pointer hover:border-cyan-500/50 transition-colors border-l-4 border-l-zinc-800"
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${task.completed ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-400'}`}>
                                  {task.completed ? <CheckCircle size={18} /> : <Activity size={18} />}
                                </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-sm truncate ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                    {task.title}
                                </h4>
                                <div className="flex gap-2 text-[10px] mt-1 text-zinc-500 font-bold uppercase">
                                    {task.duration && <span>{task.duration}</span>}
                                    {task.totalSets && <span>• {task.totalSets} sets</span>}
                                </div>
                            </div>
                                {!task.completed && <ChevronRight size={14} className="text-zinc-600" />}
                        </Card>
                            ))}
                </div>
                        ))}
             </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-zinc-500 text-sm">
                      No workouts assigned for this day
                    </div>
                  )}
                </div>
              )}

              {isExpanded && isExcluded && !(isFirstDay && isToday) && (
                <div className="border-t border-zinc-800 p-3 md:p-4 text-center py-6 md:py-8">
                  <p className="text-zinc-500 text-sm mb-2">
                    {excludedReason === 'game' ? '🏒' : '⛸️'} {excludedReason === 'game' ? 'Game' : 'Practice'} Day
                  </p>
                  <p className="text-zinc-600 text-xs">Training assignments are disabled for this day</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExcludedDate(day);
                    }}
                  >
                    Enable Training
                  </Button>
                </div>
              )}
            </Card>
            );
          })}
      </div>
    </div>
  );
};

const TrainingMode = ({ task, setView }) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [videoStream, setVideoStream] = useState(null);
  const [videoElement, setVideoElement] = useState(null);
  const [canvasElement, setCanvasElement] = useState(null);
  const [poseDetector, setPoseDetector] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({ verified: false, feedback: '', confidence: 0 });
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [videoSaved, setVideoSaved] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    // Use coach-set default timer if available, otherwise default to 45
    return task?.defaultTimer || 45;
  });
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);
  const [lastPoseData, setLastPoseData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const exerciseStartTime = useRef(null);

  const currentTask = task || { title: 'Free Skate', subtitle: 'Work on edges', type: 'Generic', duration: '10m' };
  const totalSets = currentTask.totalSets || currentTask.targetSets || 1;
  const [completedSets, setCompletedSets] = useState(0);

  // Update timer when task changes
  useEffect(() => {
    if (currentTask?.defaultTimer !== undefined) {
      setTimeLeft(currentTask.defaultTimer || 45);
    }
  }, [currentTask?.defaultTimer]);

  // Load how many sets have been completed for this task today (from progress data)
  useEffect(() => {
    const loadCompletedSets = async () => {
      try {
        const { getProgressData } = await import('./utils/progressTracking.js');
        const data = getProgressData();
        const history = data.exercises?.[currentTask.id] || [];
        const todayKey = new Date().toISOString().split('T')[0];
        const todayCount = history.filter(
          (entry) => entry.date && entry.date.startsWith(todayKey)
        ).length;
        setCompletedSets(todayCount);
      } catch (error) {
        console.error('Error loading completed sets:', error);
      }
    };

    if (currentTask?.id) {
      loadCompletedSets();
    } else {
      setCompletedSets(0);
    }
  }, [currentTask?.id]);

  // Auto-start timer when exercise starts
  useEffect(() => {
    if (exerciseStarted && !timerActive && timeLeft > 0) {
      console.log('⏱️ Auto-starting interval timer');
      setTimerActive(true);
    }
  }, [exerciseStarted, timerActive, timeLeft]);

  // Interval timer countdown
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Beep for last 3 seconds
          if (newTime <= 3 && newTime > 0) {
            import('./utils/countdownAudio.js').then(({ playCountdownBeep }) => {
              playCountdownBeep(newTime);
            });
          }
          
          if (newTime <= 0) {
            setTimerActive(false);
            // Final beep when timer reaches 0
            import('./utils/countdownAudio.js').then(({ playCountdownBeep }) => {
              playCountdownBeep(0);
            });
            return 0;
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timeLeft]);

  // Import utilities
  useEffect(() => {
    let fallbackTimeout;
    let waitForVideoInterval;
    let handleLoadedMetadata;
    let handlePlaying;
    
    const initializeCamera = async () => {
      try {
        console.log('🔷 Requesting camera permission...');
        const { requestCameraPermission } = await import('./utils/videoCapture.js');
        const stream = await requestCameraPermission();
        console.log('✅ Camera stream obtained:', stream, 'Active tracks:', stream.getTracks().length);
        setVideoStream(stream);
        
        // Wait for videoRef to be available (retry up to 10 times)
        let retries = 0;
        waitForVideoInterval = setInterval(() => {
        if (videoRef.current) {
            clearInterval(waitForVideoInterval);
          const video = videoRef.current;
            console.log('📹 Video element found! Setting srcObject...');
          video.srcObject = stream;
          setVideoElement(video);
            
            // Ensure video attributes are set for autoplay
            video.setAttribute('autoplay', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
          
          // Wait for video to actually start playing before marking as ready
          handleLoadedMetadata = () => {
              console.log('📹 Video metadata loaded, attempting to play...');
            video.play().then(() => {
                console.log('✅ Video is playing!');
              setCameraReady(true);
            }).catch((error) => {
                console.error('❌ Error playing video:', error);
              // Still mark as ready if play fails (might be autoplay restrictions)
                console.log('⚠️ Marking camera as ready despite play error');
              setCameraReady(true);
            });
          };
          
          handlePlaying = () => {
              console.log('▶️ Video playing event fired');
            setCameraReady(true);
          };
          
          // Check if video is already ready
          if (video.readyState >= 2) {
              console.log('📹 Video already ready, playing immediately...');
            video.play().then(() => {
                console.log('✅ Video playing (already ready)');
              setCameraReady(true);
              }).catch((err) => {
                console.warn('⚠️ Play failed but marking ready:', err);
              setCameraReady(true);
            });
          } else {
              console.log('📹 Waiting for video metadata...');
            video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
            video.addEventListener('playing', handlePlaying, { once: true });
          }
          
            // More aggressive fallback: mark as ready if stream exists
          fallbackTimeout = setTimeout(() => {
              console.log('⏱️ Fallback timeout - checking video state...', {
                readyState: video.readyState,
                srcObject: !!video.srcObject,
                streamActive: stream.getTracks().some(t => t.readyState === 'live')
              });
              if (video.srcObject && stream.getTracks().some(t => t.readyState === 'live')) {
                console.log('✅ Stream is active, marking camera ready');
                setCameraReady(true);
              } else if (video.readyState >= 2) {
                console.log('✅ Video readyState >= 2, marking camera ready');
              setCameraReady(true);
            }
            }, 2000);
          } else {
            retries++;
            if (retries >= 10) {
              clearInterval(waitForVideoInterval);
              console.error('❌ videoRef.current is still null after 10 retries!');
            }
          }
        }, 100);

        // Initialize pose detector (optional - works without it)
        try {
          const { initializePoseDetector } = await import('./utils/poseDetection.js');
          const detector = await initializePoseDetector();
          setPoseDetector(detector);
          console.log('Pose detection initialized successfully');
        } catch (error) {
          console.warn('Pose detection will work in basic mode:', error.message);
          // App continues without pose detection - video recording still works
        }
      } catch (error) {
        alert('Camera access required for video verification. Please enable camera permissions.');
      }
    };

    initializeCamera();

    return () => {
      if (waitForVideoInterval) {
        clearInterval(waitForVideoInterval);
      }
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current && handleLoadedMetadata && handlePlaying) {
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoRef.current.removeEventListener('playing', handlePlaying);
      }
    };
  }, []);

  // Safety check: if we have a stream and video element but cameraReady is false, force it
  useEffect(() => {
    if (videoStream && videoRef.current && !cameraReady) {
      const video = videoRef.current;
      const hasActiveTracks = videoStream.getTracks().some(t => t.readyState === 'live');
      
      if (hasActiveTracks && video.srcObject) {
        console.log('🔧 Safety check: Stream is active but cameraReady is false, forcing it...');
        // Try to play one more time
        video.play().catch(() => {
          // Even if play fails, mark as ready if stream exists
          console.log('🔧 Marking ready despite play failure (stream exists)');
        });
        // Give it a moment then force ready
        setTimeout(() => {
          if (videoStream.getTracks().some(t => t.readyState === 'live')) {
            console.log('✅ Forcing cameraReady = true (stream is live)');
            setCameraReady(true);
          }
        }, 500);
      }
    }
  }, [videoStream, cameraReady]);

  // Pose detection loop
  useEffect(() => {
    if (!exerciseStarted || !videoElement || !poseDetector || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    let animationFrame;

    const detectPose = async () => {
      if (!poseDetector) {
        // Fallback: Basic verification if pose detection not available
        setVerificationStatus({
          verified: true,
          confidence: 0.8,
          feedback: 'Recording in progress - complete the exercise'
        });
        animationFrame = requestAnimationFrame(detectPose);
        return;
      }

      try {
        const { detectPose, verifyExerciseCompletion, drawPoseOnCanvas } = await import('./utils/poseDetection.js');
        const pose = await detectPose(videoElement);
        
        if (pose) {
          const verification = verifyExerciseCompletion(pose, currentTask.type);
          setVerificationStatus(verification);
          setLastPoseData(pose); // Store latest pose for saving
          
          if (canvasRef.current && ctx) {
            drawPoseOnCanvas(canvasRef.current, videoElement, pose, ctx);
          }
        } else {
          setVerificationStatus({
            verified: false,
            confidence: 0,
            feedback: 'Please position yourself in frame'
          });
        }
        
        animationFrame = requestAnimationFrame(detectPose);
      } catch (error) {
        console.warn('Pose detection error, using basic mode:', error);
        // Fallback mode
        setVerificationStatus({
          verified: true,
          confidence: 0.7,
          feedback: 'Recording in progress'
        });
        animationFrame = requestAnimationFrame(detectPose);
      }
    };

    detectPose();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [exerciseStarted, videoElement, poseDetector, currentTask.type]);

  // Start countdown and exercise
  const startExercise = async () => {
    setIsCountdown(true);
    setCountdownNumber(3);

    try {
      const { countdownWithAudio, speakText } = await import('./utils/countdownAudio.js');
      
      // Countdown
      await countdownWithAudio(3, (num) => {
        console.log('🔢 Countdown:', num);
        setCountdownNumber(num);
      }, () => {
        console.log('✅ Countdown complete, starting exercise');
        setIsCountdown(false);
        setExerciseStarted(true);
        setIsRecording(true);
        speakText(`Start ${currentTask.title}`);
        
        // Start recording
        if (videoStream) {
          try {
            const recorder = new MediaRecorder(videoStream, {
              mimeType: 'video/webm;codecs=vp9'
            });
            
            const chunks = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
              const blob = new Blob(chunks, { type: 'video/webm' });
              setRecordedVideoBlob(blob);
              setRecordingComplete(true);
            };
            
            exerciseStartTime.current = Date.now();
            
            mediaRecorderRef.current = recorder;
            recorder.start();
            console.log('🎥 Recording started');
          } catch (error) {
            console.error('Recording error:', error);
          }
        }
      });
    } catch (error) {
      console.error('Countdown error:', error);
      setIsCountdown(false);
    }
  };

  // Complete exercise
  const completeExercise = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setExerciseStarted(false);
    
    // Wait for video blob to be ready
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if verified
    if (verificationStatus.verified && verificationStatus.confidence > 0.6) {
      // Save performance data for progress tracking
      try {
        const { saveExercisePerformance } = await import('./utils/progressTracking.js');
        const { recordActivity, recalculateStreak } = await import('./utils/streakTracking.js');
        
        const duration = exerciseStartTime.current 
          ? Math.round((Date.now() - exerciseStartTime.current) / 1000 / 60) // minutes
          : 0;
        
        const poseData = lastPoseData ? {
          keypoints: lastPoseData.keypoints?.map(kp => ({
            x: kp.x,
            y: kp.y,
            score: kp.score,
          })) || [],
          score: lastPoseData.score,
        } : null;
        
        saveExercisePerformance({
          taskId: currentTask.id,
          taskTitle: currentTask.title,
          taskType: currentTask.type,
          date: new Date().toISOString(),
          duration,
          verificationScore: verificationStatus.confidence,
          poseData: poseData,
          videoBlob: recordedVideoBlob,
          metrics: {
            formScore: verificationStatus.confidence,
            consistency: 85, // Can be calculated from pose data
          },
        });

        // Mark first day as complete if this is the first workout
        const firstDayFlag = localStorage.getItem('icepulse_first_day_complete');
        if (!firstDayFlag) {
          localStorage.setItem('icepulse_first_day_complete', 'true');
          // Trigger a re-render to update assignments
          window.dispatchEvent(new Event('firstDayComplete'));
        }

        // Record workout type for alternating logic
        try {
          const { recordWorkoutType } = await import('./utils/workoutTracking.js');
          // Determine if upper or lower body based on task type or title
          const taskTitle = currentTask.title?.toLowerCase() || '';
          const taskType = currentTask.type?.toLowerCase() || '';
          
          let workoutType = null;
          if (taskTitle.includes('upper') || taskTitle.includes('push') || taskTitle.includes('pull') || 
              taskTitle.includes('chest') || taskTitle.includes('shoulder') || taskTitle.includes('tricep') ||
              taskTitle.includes('bicep') || taskTitle.includes('wrist') || taskType.includes('upper')) {
            workoutType = 'upper';
          } else if (taskTitle.includes('lower') || taskTitle.includes('squat') || taskTitle.includes('lunge') ||
                     taskTitle.includes('leg') || taskTitle.includes('glute') || taskTitle.includes('calf') ||
                     taskType.includes('lower')) {
            workoutType = 'lower';
          }
          
          if (workoutType) {
            recordWorkoutType(workoutType);
            console.log(`📝 Recorded ${workoutType} body workout`);
          }
        } catch (error) {
          console.error('Error recording workout type:', error);
        }

        // Increment completed sets count for this task (capped at totalSets)
        setCompletedSets((prev) => {
          const next = prev + 1;
          return next > totalSets ? totalSets : next;
        });

        // Record activity for streak tracking
        try {
          const { recordActivity, recalculateStreak } = await import('./utils/streakTracking.js');
          recordActivity();
          recalculateStreak(); // Recalculate to ensure accuracy
        } catch (error) {
          console.error('Error recording streak:', error);
        }

        // Post celebratory message to team chat
        try {
          const { postWorkoutCompletion } = await import('./utils/workoutBrag.js');
          postWorkoutCompletion(
            currentTask.title,
            verificationStatus.confidence,
            'Beckham M.',
            'beckham'
          );
        } catch (error) {
          console.error('Error posting workout completion:', error);
        }

        // Save video if subscription allows
        if (recordedVideoBlob) {
          try {
            const { saveVideo } = await import('./utils/videoStorage.js');
            const { canSaveVideo, hasAIAnalysis } = await import('./utils/subscriptionTiers.js');
            const { getCurrentSubscription } = await import('./utils/subscriptionTiers.js');
            
            const subscription = getCurrentSubscription();
            
            if (canSaveVideo()) {
              const saveResult = await saveVideo(recordedVideoBlob, {
                taskId: currentTask.id,
                taskTitle: currentTask.title,
                taskType: currentTask.type,
                duration,
                verificationScore: verificationStatus.confidence,
              }, subscription);
              
              if (saveResult.success) {
                setVideoSaved(true);
                console.log('Video saved successfully');
                
                // Run AI analysis if Premium tier
                if (hasAIAnalysis() && poseData) {
                  try {
                    const { analyzeVideoTechnique } = await import('./utils/videoAnalysis.js');
                    const analysis = await analyzeVideoTechnique(
                      recordedVideoBlob,
                      currentTask.type,
                      { keypoints: poseData.keypoints }
                    );
                    
                    if (analysis.success) {
                      setAiAnalysisComplete(true);
                      console.log('AI analysis completed:', analysis.analysis);
                      // Store analysis result
                      localStorage.setItem(`video_analysis_${saveResult.video.id}`, JSON.stringify(analysis));
                    }
                  } catch (error) {
                    console.error('Error running AI analysis:', error);
                  }
                }
              } else {
                console.log('Video not saved:', saveResult.message);
              }
            }
          } catch (error) {
            console.error('Error saving video:', error);
          }
        }
      } catch (error) {
        console.error('Error saving performance data:', error);
      }
      
      setShowCelebration(true);
      const { playSuccessSound } = await import('./utils/countdownAudio.js');
      playSuccessSound();
    } else {
      alert('Please complete the exercise to verify. Make sure you are visible in frame.');
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-6 animate-in slide-in-from-right duration-300">
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-center">
            <CheckCircle size={120} className="text-green-500 mx-auto animate-pulse mb-6" fill="currentColor" />
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400 uppercase mb-4">
              Complete!
            </h2>
            <p className="text-cyan-400 mb-4">Exercise verified successfully!</p>
            
            {/* Video Save Status */}
            {videoSaved && (
              <div className="mb-4 p-3 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-400 text-sm">
                  <Video size={16} />
                  <span className="font-bold">Video saved to your library</span>
                </div>
              </div>
            )}
            
            {/* AI Analysis Status */}
            {aiAnalysisComplete && (
              <div className="mb-4 p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <Trophy size={16} />
                  <span className="font-bold">AI analysis complete - Check your video library for feedback!</span>
                </div>
              </div>
            )}
            
            <Button onClick={() => {
              setShowCelebration(false);
              setVideoSaved(false);
              setAiAnalysisComplete(false);
              setView('home');
            }}>Continue</Button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setView('home')} className="flex items-center text-zinc-500 text-xs font-bold hover:text-white">
                    <ChevronRight className="rotate-180" size={14}/> Back
                </button>
                <Badge color="cyan">{currentTask.type}</Badge>
            </div>
            <h2 className="text-xl font-black italic text-white leading-tight uppercase">{currentTask.title}</h2>
            <p className="text-zinc-400 text-xs mt-1 font-bold uppercase">{currentTask.subtitle}</p>
        </div>
        <div className="flex gap-2">
            <button className="p-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"><Settings size={20}/></button>
        </div>
      </div>

      {/* Video Preview with Overlay */}
      <div className="bg-black rounded-2xl overflow-hidden aspect-video relative mb-6 border border-zinc-800 shadow-2xl">
        {/* Always render video element so ref is available */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
          className={`w-full h-full object-cover ${cameraReady ? 'block' : 'hidden'}`}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            />
        
        {/* Loading overlay - only show when camera not ready */}
        {!cameraReady && (
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center z-10">
            <div className="text-center">
              <Video size={48} className="text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 text-sm">Requesting camera access...</p>
            </div>
          </div>
        )}
            
            {/* Countdown Overlay */}
            {isCountdown && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
                <div className="text-center">
                  <div className="text-9xl font-black text-cyan-400 animate-pulse">
                    {countdownNumber}
                  </div>
                  <p className="text-white text-lg mt-4 uppercase">Get Ready!</p>
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full flex items-center gap-2 z-20">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase">Recording</span>
              </div>
            )}

            {/* Verification Status */}
            {exerciseStarted && (
              <div className="absolute top-4 right-4 bg-black/80 px-3 py-2 rounded-lg z-20">
                <div className={`text-xs font-bold uppercase ${verificationStatus.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                  {verificationStatus.verified ? '✓ Verified' : 'Positioning...'}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">{verificationStatus.feedback}</div>
              </div>
            )}

            {/* Center Crosshair */}
        {!exerciseStarted && !isCountdown && cameraReady && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500/30"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500/30"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-white/50 text-xs uppercase font-bold">Position yourself in frame</p>
                </div>
              </div>
        )}
      </div>

      {/* Instructions */}
      <Card className="mb-4">
        <div className="flex items-start gap-3">
          <Target className="text-cyan-400 mt-1" size={20} />
          <div className="flex-1">
            <h4 className="text-white font-bold mb-1 uppercase">Video Verification Required</h4>
            <p className="text-zinc-400 text-sm mb-2">
              Place your device on a stand facing you. The AI will verify you complete this exercise correctly.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge color="green">No Equipment Needed</Badge>
              {currentTask.totalSets && <Badge color="cyan">{currentTask.totalSets} Total Sets</Badge>}
              {currentTask.defaultTimer && <Badge color="yellow">{currentTask.defaultTimer}s Timer</Badge>}
            </div>
          </div>
        </div>
        {currentTask.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-zinc-800">
            <img src={currentTask.imageUrl} alt={currentTask.title} className="w-full h-48 object-cover" />
          </div>
        )}
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 mb-6 pb-4">
        {!exerciseStarted && !isCountdown && (
          <Button 
            onClick={startExercise} 
            disabled={!cameraReady}
            className="w-full py-4 text-lg"
          >
            <Play size={24} /> Start with Countdown
          </Button>
        )}

        {exerciseStarted && (
          <Button 
            onClick={completeExercise}
            className="w-full py-4 text-lg bg-gradient-to-r from-green-600 to-cyan-600"
          >
            <CheckCircle size={24} /> Complete & Verify
          </Button>
        )}

        <Card className={`transition-all border-l-4 ${timerActive ? 'border-l-green-500 bg-zinc-900' : 'border-l-zinc-700'}`}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Timer size={18} className={timerActive ? 'text-green-500 animate-pulse' : 'text-zinc-500'} />
                    <span className="font-bold text-white uppercase">Interval Timer</span>
                </div>
                <div 
                    onClick={() => setTimerActive(!timerActive)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${timerActive ? 'bg-green-500' : 'bg-zinc-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${timerActive ? 'translate-x-6' : ''}`}></div>
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 py-2">
                <button className="text-zinc-500 hover:text-white" onClick={() => setTimeLeft(Math.max(0, timeLeft - 5))}>-5s</button>
                <div className={`text-5xl font-black italic text-white tabular-nums tracking-tighter ${timerActive ? 'text-green-400' : 'text-white'}`}>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
                <button className="text-zinc-500 hover:text-white" onClick={() => setTimeLeft(timeLeft + 5)}>+5s</button>
            </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
             <Card className="flex flex-col items-center justify-center py-4">
                 <span className="text-xs text-zinc-500 font-bold uppercase">Verification</span>
                 <div className="flex items-center gap-1 mt-1">
                     <Target size={16} className={verificationStatus.verified ? 'text-green-500' : 'text-yellow-500'} />
                     <span className="text-xl font-black text-white">
                       {Math.round(verificationStatus.confidence * 100)}%
                     </span>
                 </div>
                 {totalSets > 1 && (
                   <div className="mt-1 text-[10px] text-zinc-400 font-bold uppercase">
                     Sets: {Math.min(completedSets, totalSets)}/{totalSets}
                   </div>
                 )}
             </Card>
             <Card className="flex flex-col items-center justify-center py-4">
                 <span className="text-xs text-zinc-500 font-bold uppercase">Status</span>
                 <div className="flex items-center gap-1 mt-1">
                     <Activity size={16} className={exerciseStarted ? 'text-green-500 animate-pulse' : 'text-zinc-500'} />
                     <span className="text-sm font-bold text-white uppercase">
                       {exerciseStarted ? 'Active' : 'Ready'}
                     </span>
                 </div>
             </Card>
        </div>
      </div>
    </div>
  );
};

const ChatView = () => {
    const [message, setMessage] = useState('');
    const [chatMode, setChatMode] = useState('team'); // 'team' or 'direct'
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Load messages including system brags
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const { getMergedChatMessages } = await import('./utils/workoutBrag.js');
                const merged = getMergedChatMessages([]);
                setMessages(merged);
            } catch (error) {
                console.error('Error loading messages:', error);
                setMessages([]);
            }
        };
        loadMessages();
        
        // Refresh messages periodically to catch new brags
        const interval = setInterval(loadMessages, 2000);
        return () => clearInterval(interval);
    }, []);

    const getSenderInitial = (sender) => {
        const senderMap = {
            'coach': 'C',
            'beckham': 'BM',
            'cale': 'CM',
            'sid': 'SC'
        };
        return senderMap[sender] || sender.charAt(0).toUpperCase();
    };

    const getSenderColor = (sender) => {
        const colorMap = {
            'coach': 'bg-cyan-700 text-white',
            'beckham': 'bg-blue-700 text-white',
            'cale': 'bg-purple-700 text-white',
            'sid': 'bg-yellow-600 text-white'
        };
        return colorMap[sender] || 'bg-zinc-800 text-zinc-200';
    };

    // Update messages when switching modes or coaches
    useEffect(() => {
        const updateMessages = async () => {
            if (chatMode === 'team') {
                try {
                    const { getMergedChatMessages } = await import('./utils/workoutBrag.js');
                    const merged = getMergedChatMessages([]);
                    setMessages(merged);
                } catch (error) {
                    setMessages([]);
                }
                setSelectedCoach(null);
            } else if (chatMode === 'direct' && selectedCoach) {
                setMessages([]); // Empty - will load real direct messages
            }
        };
        updateMessages();
    }, [chatMode, selectedCoach]);

    const handleSend = async () => {
        if (!message.trim()) return;
        if (chatMode === 'direct' && !selectedCoach) return;

        const newMessage = {
            id: messages.length + 1,
            sender: 'beckham', // Current user
            senderName: 'Beckham M.',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            liked: false
        };

        setMessages([...messages, newMessage]);
        setMessage('');
        setShowEmojiPicker(false);
        
        // Save to localStorage for team chat
        if (chatMode === 'team') {
            try {
                const { getChatMessages } = await import('./utils/workoutBrag.js');
                const allMessages = getChatMessages();
                allMessages.push(newMessage);
                localStorage.setItem('icepulse_team_chat', JSON.stringify(allMessages));
            } catch (error) {
                console.error('Error saving message:', error);
            }
        }
    };

    const insertEmoji = (emoji) => {
        setMessage(message + emoji);
        setShowEmojiPicker(false);
    };

    // Age-appropriate emojis including hockey-specific ones
    const emojiCategories = {
        hockey: ['🏒', '🥅', '⛸️', '🏆', '🥇', '🥈', '🥉', '🎯', '⚡', '💪', '🔥', '⭐', '🌟'],
        reactions: ['👍', '👏', '🙌', '🎉', '💯', '✅', '👌', '🤝', '🙏', '😊', '😄', '😎'],
        sports: ['🏃', '💨', '⚽', '🏀', '⚾', '🎾', '🏐', '🏈', '🏉', '🎮', '🏋️', '🤸'],
        general: ['💙', '❤️', '💚', '💛', '🧡', '💜', '🤍', '🖤', '💯', '✨', '🎊', '🎈']
    };

    return (
        <div className="flex flex-col h-full pb-4 animate-in fade-in">
            {/* Chat Mode Toggle */}
            <div className="mb-4">
                <div className="bg-zinc-900 rounded-xl p-1 flex gap-1 border border-zinc-800">
                    <button
                        onClick={() => setChatMode('team')}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm uppercase transition-all ${
                            chatMode === 'team'
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Users size={16} />
                            <span>Team</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setChatMode('direct')}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm uppercase transition-all ${
                            chatMode === 'direct'
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <MessageSquare size={16} />
                            <span>Direct</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Chat Header */}
            <div className="border-b border-zinc-800 pb-4 mb-4">
                {chatMode === 'team' ? (
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Users className="w-8 h-8 text-cyan-400" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-950"></span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Team Chat</h3>
                                    <p className="text-green-500 text-xs font-bold uppercase">4 Online</p>
                                </div>
                            </div>
                            <Badge color="cyan">Team</Badge>
                        </div>
                        
                        {/* Team Members Preview */}
                        <div className="flex gap-2 mt-3">
                            {['coach', 'beckham', 'cale', 'sid'].map((member) => (
                                <div key={member} className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                                    {getSenderInitial(member)}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <MessageSquare className="w-8 h-8 text-cyan-400" />
                                    {selectedCoach && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-950"></span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Direct Messages</h3>
                                    <p className="text-zinc-500 text-xs font-bold uppercase">
                                        {selectedCoach ? 'Coach' : 'Select a coach'}
                                    </p>
                                </div>
                            </div>
                            <Badge color="blue">1-on-1</Badge>
                        </div>
                        
                        {/* Coaches List */}
                        {!selectedCoach ? (
                            <div className="mt-3 space-y-2">
                                {[].map((coach) => ( // Empty - will load real coaches
                                    <button
                                        key={coach.id}
                                        onClick={() => setSelectedCoach(coach.id)}
                                        className="w-full p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-cyan-500 transition-colors flex items-center gap-3"
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-cyan-700 flex items-center justify-center text-white font-bold">
                                                {getSenderInitial('coach')}
                                            </div>
                                            {coach.online && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-800"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-white font-bold text-sm">{coach.name}</p>
                                            <p className="text-zinc-400 text-xs">{coach.role}</p>
                                        </div>
                                        {coach.unread > 0 && (
                                            <Badge color="red">{coach.unread}</Badge>
                                        )}
                                        <ChevronRight size={16} className="text-zinc-500" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-3 flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedCoach(null)}
                                    className="text-zinc-400 hover:text-white text-sm font-bold uppercase flex items-center gap-1"
                                >
                                    <ChevronRight className="rotate-180" size={14} />
                                    Back to Coaches
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Messages */}
            {chatMode === 'direct' && !selectedCoach ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <MessageSquare className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-400 text-sm font-bold">Select a coach to start messaging</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    <div className="text-center text-[10px] uppercase font-bold text-zinc-600 my-4">Today</div>
                    {messages.map(msg => {
                    const isCurrentUser = msg.sender === 'beckham';
                    return (
                        <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] ${!isCurrentUser ? 'flex gap-2' : ''}`}>
                                {!isCurrentUser && (
                                    <div className={`w-8 h-8 rounded-full ${getSenderColor(msg.sender)} flex items-center justify-center text-xs font-bold shrink-0 mt-1`}>
                                        {getSenderInitial(msg.sender)}
                                    </div>
                                )}
                                <div>
                                    {!isCurrentUser && (
                                        <p className="text-zinc-400 text-xs font-bold mb-1 ml-1">{msg.senderName}</p>
                                    )}
                                    <div className={`p-4 rounded-2xl ${isCurrentUser ? `${getSenderColor(msg.sender)} rounded-tr-none` : `${getSenderColor(msg.sender)} rounded-tl-none`} ${msg.isSystemBrag ? 'border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-cyan-900/20' : ''}`}>
                                        {msg.isSystemBrag && (
                                            <div className="flex items-center gap-1 mb-1">
                                                <Badge color="yellow" className="text-[8px] px-1.5 py-0.5">Auto</Badge>
                                            </div>
                                        )}
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <div className="flex justify-between items-center mt-2 opacity-50 text-[10px]">
                                            <span>{msg.time}</span>
                                            {msg.liked && (
                                                <Heart size={12} className="fill-red-500 text-red-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            )}

            {/* Input */}
            <div className="pt-4 mt-auto relative">
                {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2 left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl z-10 max-h-64 overflow-y-auto">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-white font-bold text-sm uppercase">Emojis</h4>
                            <button 
                                onClick={() => setShowEmojiPicker(false)}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {Object.entries(emojiCategories).map(([category, emojis]) => (
                                <div key={category}>
                                    <p className="text-zinc-500 text-xs font-bold uppercase mb-2 capitalize">{category}</p>
                                    <div className="grid grid-cols-8 gap-2">
                                        {emojis.map((emoji, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => insertEmoji(emoji)}
                                                className="text-2xl hover:scale-125 transition-transform p-1 rounded hover:bg-zinc-800"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="bg-zinc-900 p-2 rounded-2xl flex items-center gap-2 border border-zinc-800 focus-within:border-cyan-500 transition-colors">
                    <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-zinc-400 hover:text-white"
                        title="Add emoji"
                    >
                        <span className="text-xl">😊</span>
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-white"><Plus size={20}/></button>
                    <input 
                        type="text" 
                        placeholder={chatMode === 'team' ? 'Message team...' : selectedCoach ? 'Message coach...' : 'Select a coach...'} 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        onFocus={() => setShowEmojiPicker(false)}
                        disabled={chatMode === 'direct' && !selectedCoach}
                        className="bg-transparent flex-1 text-white outline-none placeholder:text-zinc-600 disabled:opacity-50" 
                    />
                    <button 
                        onClick={handleSend}
                        className="p-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
                    >
                        <Send size={18}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

// Progress Analytics View
const ProgressAnalyticsView = ({ setView }) => {
    const [improvementSummary, setImprovementSummary] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [exerciseAnalysis, setExerciseAnalysis] = useState(null);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const { getImprovementSummary, analyzeImprovement } = await import('./utils/progressTracking.js');
                const summary = getImprovementSummary();
                setImprovementSummary(summary);
                
                // Auto-select first exercise if available
                if (summary.improvements && summary.improvements.length > 0) {
                    const first = summary.improvements[0];
                    setSelectedExercise(first.taskId);
                    setExerciseAnalysis(first);
                }
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        };
        loadProgress();
    }, []);

    const handleExerciseSelect = async (taskId) => {
        setSelectedExercise(taskId);
        try {
            const { analyzeImprovement } = await import('./utils/progressTracking.js');
            const analysis = analyzeImprovement(taskId);
            setExerciseAnalysis(analysis);
        } catch (error) {
            console.error('Error analyzing exercise:', error);
        }
    };

    return (
        <div className="space-y-6 pb-32 animate-in fade-in">
            <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setView('profile')} className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white">
                    <ChevronRight className="rotate-180" size={20} />
                </button>
                <h2 className="text-2xl font-black italic text-white uppercase">Progress Analytics</h2>
            </div>

            {/* Overall Summary */}
            {improvementSummary && improvementSummary.totalExercises > 0 ? (
                <>
                    <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="text-cyan-400" size={24} />
                                <h3 className="text-white font-bold uppercase">Overall Performance</h3>
                            </div>
                            <Badge color={improvementSummary.overallImprovement > 0 ? 'green' : 'yellow'}>
                                {improvementSummary.overallImprovement > 0 ? 'Improving' : 'Stable'}
                            </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Overall Improvement</p>
                                <p className="text-3xl font-black text-green-400">
                                    {improvementSummary.overallImprovement > 0 ? '+' : ''}{improvementSummary.overallImprovement.toFixed(1)}%
                                </p>
                            </div>
                            <div>
                                <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Consistency</p>
                                <p className="text-3xl font-black text-cyan-400">
                                    {improvementSummary.averageConsistency}%
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-zinc-800">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                                    <TrendingUp size={16} />
                                    <span className="text-xl font-black">{improvementSummary.improvingExercises}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Improving</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
                                    <Minus size={16} />
                                    <span className="text-xl font-black">{improvementSummary.stableExercises}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Stable</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                                    <TrendingDown size={16} />
                                    <span className="text-xl font-black">{improvementSummary.decliningExercises}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Needs Work</p>
                            </div>
                        </div>
                    </Card>

                    {/* Exercise List */}
                    <div>
                        <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">Exercise Progress</h3>
                        <div className="space-y-2">
                            {improvementSummary.improvements.map((improvement) => {
                                if (!improvement.hasData) return null;
                                
                                const TrendIcon = improvement.trend === 'improving' ? TrendingUp : 
                                                   improvement.trend === 'declining' ? TrendingDown : Minus;
                                const trendColor = improvement.trend === 'improving' ? 'text-green-400' :
                                                    improvement.trend === 'declining' ? 'text-red-400' : 'text-zinc-400';
                                
                                return (
                                    <Card
                                        key={improvement.taskId}
                                        onClick={() => handleExerciseSelect(improvement.taskId)}
                                        className={`cursor-pointer transition-all hover:border-cyan-500/50 ${
                                            selectedExercise === improvement.taskId ? 'border-cyan-500 bg-zinc-900' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold text-sm mb-1">{improvement.taskTitle}</h4>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="text-zinc-500">{improvement.totalAttempts} attempts</span>
                                                    <span className="text-zinc-600">•</span>
                                                    <span className={trendColor + ' font-bold uppercase'}>{improvement.trend}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`flex items-center gap-1 ${trendColor} mb-1`}>
                                                    <TrendIcon size={16} />
                                                    <span className="text-lg font-black">
                                                        {improvement.scoreImprovementPercent > 0 ? '+' : ''}
                                                        {improvement.scoreImprovementPercent.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-zinc-500">improvement</p>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detailed Exercise Analysis */}
                    {exerciseAnalysis && exerciseAnalysis.hasData && (
                        <Card className="bg-zinc-900/50">
                            <h3 className="text-white font-bold text-lg mb-4 uppercase">{exerciseAnalysis.taskTitle}</h3>
                            
                            {/* Progress Chart */}
                            {exerciseAnalysis.history && exerciseAnalysis.history.length > 1 && (
                                <div className="mb-6">
                                    <h4 className="text-zinc-400 text-xs font-bold uppercase mb-3">Progress Over Time</h4>
                                    <div className="relative h-32 bg-zinc-950 rounded-lg p-4">
                                        <svg width="100%" height="100%" className="overflow-visible">
                                            {exerciseAnalysis.history.map((point, i) => {
                                                if (i === 0) return null;
                                                const prevPoint = exerciseAnalysis.history[i - 1];
                                                const x1 = ((i - 1) / (exerciseAnalysis.history.length - 1)) * 100;
                                                const x2 = (i / (exerciseAnalysis.history.length - 1)) * 100;
                                                const y1 = 100 - (prevPoint.score || 0);
                                                const y2 = 100 - (point.score || 0);
                                                
                                                return (
                                                    <line
                                                        key={i}
                                                        x1={`${x1}%`}
                                                        y1={`${y1}%`}
                                                        x2={`${x2}%`}
                                                        y2={`${y2}%`}
                                                        stroke="rgb(6, 182, 212)"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                    />
                                                );
                                            })}
                                            {exerciseAnalysis.history.map((point, i) => {
                                                const x = (i / (exerciseAnalysis.history.length - 1 || 1)) * 100;
                                                const y = 100 - (point.score || 0);
                                                return (
                                                    <circle
                                                        key={i}
                                                        cx={`${x}%`}
                                                        cy={`${y}%`}
                                                        r="4"
                                                        fill="rgb(6, 182, 212)"
                                                    />
                                                );
                                            })}
                                        </svg>
                                    </div>
                                </div>
                            )}
                            
                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-zinc-400 text-xs uppercase font-bold mb-1">First Score</p>
                                    <p className="text-2xl font-black text-zinc-300">{exerciseAnalysis.firstScore?.toFixed(1) || 0}%</p>
                                </div>
                                <div>
                                    <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Latest Score</p>
                                    <p className="text-2xl font-black text-green-400">{exerciseAnalysis.latestScore?.toFixed(1) || 0}%</p>
                                </div>
                                <div>
                                    <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Consistency</p>
                                    <p className="text-2xl font-black text-cyan-400">{exerciseAnalysis.consistency}%</p>
                                </div>
                                <div>
                                    <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Total Attempts</p>
                                    <p className="text-2xl font-black text-white">{exerciseAnalysis.totalAttempts}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </>
            ) : (
                <Card className="text-center py-12">
                    <BarChart3 className="text-zinc-600 mx-auto mb-4" size={48} />
                    <h3 className="text-white font-bold mb-2">No Progress Data Yet</h3>
                    <p className="text-zinc-400 text-sm mb-6">Complete some exercises with video verification to see your progress!</p>
                    <Button onClick={() => setView('home')}>Start Training</Button>
                </Card>
            )}
        </div>
    );
};

// Subscription Management View
const SubscriptionView = ({ setView }) => {
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [savedVideosCount, setSavedVideosCount] = useState(0);

    useEffect(() => {
        const loadSubscription = async () => {
            try {
                const { getCurrentSubscription } = await import('./utils/subscriptionTiers.js');
                const { getSavedVideos } = await import('./utils/videoStorage.js');
                const sub = getCurrentSubscription();
                const videos = getSavedVideos();
                setCurrentSubscription(sub);
                setSavedVideosCount(videos.length);
            } catch (error) {
                console.error('Error loading subscription:', error);
            }
        };
        loadSubscription();
    }, []);

    const handleUpgrade = async (tierId) => {
        try {
            const { setSubscription, SUBSCRIPTION_TIERS } = await import('./utils/subscriptionTiers.js');
            const tier = setSubscription(tierId);
            setCurrentSubscription(tier);
            alert(`Upgraded to ${tier.name} subscription!`);
        } catch (error) {
            console.error('Error upgrading subscription:', error);
        }
    };

    return (
        <div className="space-y-6 pb-32 animate-in fade-in">
            <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setView('profile')} className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white">
                    <ChevronRight className="rotate-180" size={20} />
                </button>
                <h2 className="text-2xl font-black italic text-white uppercase">Subscription Plans</h2>
            </div>

            {/* Current Plan */}
            {currentSubscription && (
                <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-white font-bold text-lg uppercase">Current Plan</h3>
                            <p className="text-cyan-400 text-2xl font-black mt-1">{currentSubscription.name}</p>
                        </div>
                        <Badge color={currentSubscription.id === 'premium' ? 'yellow' : currentSubscription.id === 'video_save' ? 'cyan' : 'blue'}>
                            {currentSubscription.priceDisplay}
                        </Badge>
                    </div>
                    {currentSubscription.id === 'video_save' && (
                        <p className="text-zinc-400 text-sm">
                            {savedVideosCount} / {currentSubscription.limitations.maxSavedVideos} videos saved
                        </p>
                    )}
                </Card>
            )}

            {/* Subscription Tiers */}
            <div className="space-y-4">
                {/* Basic Tier */}
                <Card className={`${currentSubscription?.id === 'basic' ? 'border-cyan-500/50 bg-zinc-900' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-white font-bold text-lg uppercase">Basic</h3>
                            <p className="text-3xl font-black text-white mt-2">Free</p>
                        </div>
                        {currentSubscription?.id === 'basic' && (
                            <Badge color="green">Current</Badge>
                        )}
                    </div>
                    <ul className="space-y-2 mb-4">
                        {currentSubscription?.id === 'basic' ? (
                            currentSubscription.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-zinc-300 text-sm">
                                    <CheckCircle size={16} className="text-green-400" />
                                    {feature}
                                </li>
                            ))
                        ) : (
                            <>
                                <li className="flex items-center gap-2 text-zinc-300 text-sm">
                                    <CheckCircle size={16} className="text-zinc-500" />
                                    Video verification for drills
                                </li>
                                <li className="flex items-center gap-2 text-zinc-300 text-sm">
                                    <CheckCircle size={16} className="text-zinc-500" />
                                    Progress tracking
                                </li>
                                <li className="flex items-center gap-2 text-zinc-300 text-sm">
                                    <CheckCircle size={16} className="text-zinc-500" />
                                    Team chat
                                </li>
                            </>
                        )}
                    </ul>
                    {currentSubscription?.id !== 'basic' && (
                        <Button variant="outline" className="w-full" onClick={() => handleUpgrade('BASIC')}>
                            Switch to Basic
                        </Button>
                    )}
                </Card>

                {/* Video Save Tier */}
                <Card className={`${currentSubscription?.id === 'video_save' ? 'border-cyan-500/50 bg-zinc-900' : 'border-cyan-500/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-white font-bold text-lg uppercase">Video Save</h3>
                            <p className="text-3xl font-black text-cyan-400 mt-2">$9.99<span className="text-lg text-zinc-400">/month</span></p>
                        </div>
                        {currentSubscription?.id === 'video_save' && (
                            <Badge color="green">Current</Badge>
                        )}
                    </div>
                    <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-cyan-400" />
                            Everything in Basic
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-cyan-400" />
                            <span className="font-bold text-white">Save practice videos</span>
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-cyan-400" />
                            <span className="font-bold text-white">Share videos with coach/team</span>
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-cyan-400" />
                            Video library access
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-cyan-400" />
                            Up to 50 saved videos
                        </li>
                    </ul>
                    {currentSubscription?.id === 'video_save' ? (
                        <Button variant="secondary" className="w-full" disabled>
                            Current Plan
                        </Button>
                    ) : (
                        <Button className="w-full" onClick={() => handleUpgrade('VIDEO_SAVE')}>
                            Upgrade to Video Save
                        </Button>
                    )}
                </Card>

                {/* Premium Tier */}
                <Card className={`${currentSubscription?.id === 'premium' ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-cyan-900/20' : 'border-yellow-500/30 bg-gradient-to-br from-yellow-900/10 to-cyan-900/10'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-bold text-lg uppercase">Premium</h3>
                                <Badge color="yellow">Best Value</Badge>
                            </div>
                            <p className="text-3xl font-black text-yellow-400 mt-2">$19.99<span className="text-lg text-zinc-400">/month</span></p>
                        </div>
                        {currentSubscription?.id === 'premium' && (
                            <Badge color="green">Current</Badge>
                        )}
                    </div>
                    <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-yellow-400" />
                            Everything in Video Save
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-yellow-400" />
                            <span className="font-bold text-white">AI video analysis</span>
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-yellow-400" />
                            <span className="font-bold text-white">Technique feedback</span>
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-yellow-400" />
                            <span className="font-bold text-white">Balance analysis</span>
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-yellow-400" />
                            <span className="font-bold text-white">Form corrections</span>
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-yellow-400" />
                            Personalized recommendations
                        </li>
                        <li className="flex items-center gap-2 text-zinc-300 text-sm">
                            <CheckCircle size={16} className="text-yellow-400" />
                            <span className="font-bold text-white">Unlimited saved videos</span>
                        </li>
                    </ul>
                    {currentSubscription?.id === 'premium' ? (
                        <Button variant="secondary" className="w-full" disabled>
                            Current Plan
                        </Button>
                    ) : (
                        <Button className="w-full bg-gradient-to-r from-yellow-600 to-cyan-600 hover:from-yellow-700 hover:to-cyan-700" onClick={() => handleUpgrade('PREMIUM')}>
                            Upgrade to Premium
                        </Button>
                    )}
                </Card>
            </div>
        </div>
    );
};

const ProfileView = ({ setView }) => {
    const [improvementSummary, setImprovementSummary] = useState(null);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [showExcludedDates, setShowExcludedDates] = useState(false);
    const [excludedDates, setExcludedDates] = useState([]);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const { getImprovementSummary } = await import('./utils/progressTracking.js');
                const summary = getImprovementSummary();
                setImprovementSummary(summary);
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        };
        const loadSubscription = async () => {
            try {
                const { getCurrentSubscription } = await import('./utils/subscriptionTiers.js');
                const sub = getCurrentSubscription();
                setCurrentSubscription(sub);
            } catch (error) {
                console.error('Error loading subscription:', error);
            }
        };
        const loadStreak = async () => {
            try {
                const { recalculateStreak, getExcludedDates } = await import('./utils/streakTracking.js');
                const streak = recalculateStreak();
                const excluded = getExcludedDates();
                setCurrentStreak(streak);
                setExcludedDates(excluded);
            } catch (error) {
                console.error('Error loading streak:', error);
            }
        };
        loadProgress();
        loadSubscription();
        loadStreak();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in pb-32">
            <div className="text-center relative">
                 <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-black italic text-3xl mb-4 border-4 border-zinc-900 shadow-xl shadow-cyan-900/20">
                    97
                 </div>
                 <div className="absolute top-0 right-1/3 translate-x-4">
                    <Badge color="yellow">Capt</Badge>
                 </div>
                 <h2 className="text-2xl font-black uppercase italic text-white">Beckham M.</h2>
                 <p className="text-zinc-400 text-sm font-bold">Center • Varsity A</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
                <Card className="py-4 px-2 bg-zinc-900/50 relative">
                    <div className="text-2xl font-black text-white">{currentStreak}</div>
                    <div className="text-[10px] uppercase text-zinc-500 font-bold mt-1">Day Streak</div>
                    <button 
                        onClick={() => setShowExcludedDates(true)}
                        className="absolute top-1 right-1 text-zinc-600 hover:text-cyan-400 text-xs"
                        title="Manage game/practice days"
                    >
                        <Settings size={12} />
                    </button>
                </Card>
                <Card className="py-4 px-2 bg-zinc-900/50">
                    <div className="text-2xl font-black text-white">15h</div>
                    <div className="text-[10px] uppercase text-zinc-500 font-bold mt-1">Ice Time</div>
                </Card>
                 <Card className="py-4 px-2 bg-zinc-900/50">
                    <div className="text-2xl font-black text-white">{improvementSummary?.totalExercises || 0}</div>
                    <div className="text-[10px] uppercase text-zinc-500 font-bold mt-1">Workouts</div>
                </Card>
            </div>

            {/* Current Subscription Badge */}
            {currentSubscription && (
                <Card className={`${currentSubscription.id === 'premium' ? 'bg-gradient-to-br from-yellow-900/20 to-cyan-900/20 border-yellow-500/30' : currentSubscription.id === 'video_save' ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Current Plan</p>
                            <p className="text-white font-bold text-lg">{currentSubscription.name}</p>
                        </div>
                        <Badge color={currentSubscription.id === 'premium' ? 'yellow' : currentSubscription.id === 'video_save' ? 'cyan' : 'blue'}>
                            {currentSubscription.priceDisplay}
                        </Badge>
                    </div>
                </Card>
            )}

            {/* Improvement Overview */}
            {improvementSummary && improvementSummary.totalExercises > 0 && (
                <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="text-cyan-400" size={20} />
                        <h3 className="text-white font-bold uppercase text-sm">Overall Improvement</h3>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-green-400">
                            {improvementSummary.overallImprovement > 0 ? '+' : ''}{improvementSummary.overallImprovement.toFixed(1)}%
                        </span>
                        <span className="text-zinc-400 text-xs">improvement rate</span>
                    </div>
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="text-green-400" size={12} />
                            <span className="text-zinc-400">{improvementSummary.improvingExercises} improving</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Minus className="text-zinc-400" size={12} />
                            <span className="text-zinc-400">{improvementSummary.stableExercises} stable</span>
                        </div>
                    </div>
                </Card>
            )}

            <div className="space-y-2">
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider ml-2">Analytics</h3>
                <button 
                    onClick={() => setView('progress')}
                    className="w-full flex justify-between items-center p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-white border border-zinc-800 group"
                >
                    <div className="flex items-center gap-3">
                        <BarChart3 className="text-cyan-400" size={20} />
                        <span className="group-hover:text-cyan-400 transition-colors">Progress & Analytics</span>
                    </div>
                    <ChevronRight size={16} className="text-zinc-600" />
                </button>
                
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider ml-2 mt-4">Preferences</h3>
                {['My Account', 'Notifications', 'Linked Devices', 'Team Settings'].map(item => (
                     <button key={item} className="w-full flex justify-between items-center p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-white border border-zinc-800 group">
                        <span className="group-hover:text-cyan-400 transition-colors">{item}</span>
                        <ChevronRight size={16} className="text-zinc-600" />
                    </button>
                ))}
                <button 
                    onClick={() => setView('subscription')}
                    className="w-full flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-cyan-900/30 to-blue-900/30 hover:from-cyan-900/50 hover:to-blue-900/50 transition-colors text-white border border-cyan-500/30 group"
                >
                    <div className="flex items-center gap-3">
                        <Trophy className="text-cyan-400" size={20} />
                        <span className="group-hover:text-cyan-400 transition-colors font-bold">Subscription</span>
                    </div>
                    <ChevronRight size={16} className="text-cyan-400" />
                </button>
                 <button className="w-full flex justify-center items-center p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500 font-bold mt-4 uppercase text-sm tracking-widest">
                    Sign Out
                </button>
            </div>

            {/* Excluded Dates Modal */}
            {showExcludedDates && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white uppercase">Manage Streak Exclusions</h3>
                            <button onClick={() => setShowExcludedDates(false)} className="text-zinc-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-zinc-400 text-sm mb-4">
                            Mark game days or practice days to exclude them from your streak. These days won't break your consecutive day streak.
                        </p>
                        
                        <ExcludedDatesManager 
                            excludedDates={excludedDates}
                            setExcludedDates={setExcludedDates}
                            onClose={() => {
                                setShowExcludedDates(false);
                                // Recalculate streak after changes
                                import('./utils/streakTracking.js').then(({ recalculateStreak, getExcludedDates }) => {
                                    const streak = recalculateStreak();
                                    const excluded = getExcludedDates();
                                    setCurrentStreak(streak);
                                    setExcludedDates(excluded);
                                });
                            }}
                        />
                    </Card>
                </div>
            )}
        </div>
    );
};

// Component to manage excluded dates
const ExcludedDatesManager = ({ excludedDates, setExcludedDates, onClose }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedReason, setSelectedReason] = useState('game');

    const handleAddDate = async () => {
        if (!selectedDate) return;
        
        const { addExcludedDate, getExcludedDates } = await import('./utils/streakTracking.js');
        addExcludedDate(new Date(selectedDate), selectedReason);
        const updated = getExcludedDates();
        setExcludedDates(updated);
        setSelectedDate('');
    };

    const handleRemoveDate = async (dateStr) => {
        const { removeExcludedDate, getExcludedDates } = await import('./utils/streakTracking.js');
        removeExcludedDate(dateStr);
        const updated = getExcludedDates();
        setExcludedDates(updated);
    };

    const formatDateDisplay = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-4">
            {/* Add new excluded date */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Add Game or Practice Day</label>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:border-cyan-500 outline-none"
                    />
                    <select
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:border-cyan-500 outline-none"
                    >
                        <option value="game">Game</option>
                        <option value="practice">Practice</option>
                        <option value="other">Other</option>
                    </select>
                    <Button onClick={handleAddDate} className="px-4">
                        <Plus size={16} />
                    </Button>
                </div>
            </div>

            {/* List of excluded dates */}
            {excludedDates.length > 0 ? (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Excluded Dates</label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {excludedDates.map((excluded, idx) => (
                            <Card key={idx} className="p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-white font-bold text-sm">{formatDateDisplay(excluded.date)}</div>
                                    <div className="text-zinc-400 text-xs capitalize">{excluded.reason}</div>
                                </div>
                                <button
                                    onClick={() => handleRemoveDate(excluded.date)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <X size={16} />
                                </button>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <Card className="p-4 text-center text-zinc-500 text-sm">
                    No excluded dates. Add game or practice days to protect your streak.
                </Card>
            )}

            <Button onClick={onClose} className="w-full">
                Done
            </Button>
        </div>
    );
};

// --- Main App Shell ---

export default function App() {
  const [userRole, setUserRole] = useState('student'); // 'coach' or 'student'
  const [currentView, setCurrentView] = useState('home'); // Default to home
  const [activeTask, setActiveTask] = useState(null); 
  const [editingDrill, setEditingDrill] = useState(null);

  // Hide browser toolbar on mobile and set proper viewport height
  useEffect(() => {
    // Set viewport height CSS variable for mobile browsers
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Prevent zoom on double tap (helps keep toolbar hidden)
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };
    document.addEventListener('touchend', preventDoubleTapZoom, false);
    
    // Scroll to top on load to help hide toolbar
    window.scrollTo(0, 1);
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
      document.removeEventListener('touchend', preventDoubleTapZoom, false);
    };
  }, []);
  
  // Authentication state
  const [authView, setAuthView] = useState('login'); // 'login', 'signup', 'forgot-password', null
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Loading auth check

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated: authCheck, getCurrentUser, getCurrentOrganization } = await import('./utils/authService.js');
        const authenticated = authCheck();
        if (authenticated) {
          setIsAuthenticated(true);
          setCurrentUser(getCurrentUser());
          setCurrentOrganization(getCurrentOrganization());
          setAuthView(null);
        } else {
          setIsAuthenticated(false);
          setAuthView('login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setAuthView('login');
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Handle signup
  const handleSignup = async (signupData) => {
    try {
      const { signupOrganization } = await import('./utils/authService.js');
      const { organization, user } = await signupOrganization(signupData);
      setCurrentUser(user);
      setCurrentOrganization(organization);
      setIsAuthenticated(true);
      setAuthView(null);
      setCurrentView('organization-dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Error creating organization. Please try again.');
    }
  };

  // Handle login
  const handleLogin = async (loginData) => {
    try {
      const { login } = await import('./utils/authService.js');
      const { user, organization } = await login(loginData.email, loginData.password);
      setCurrentUser(user);
      setCurrentOrganization(organization);
      setIsAuthenticated(true);
      setAuthView(null);
      setCurrentView('organization-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid email or password. Please try again.');
    }
  };

  // Handle password reset
  const handlePasswordReset = async (email) => {
    try {
      const { requestPasswordReset } = await import('./utils/authService.js');
      const link = await requestPasswordReset(email);
      return link; // Return link to show in notification
    } catch (error) {
      console.error('Password reset error:', error);
      alert('Error generating password reset link. Please try again.');
      return null;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const { logout } = await import('./utils/authService.js');
    logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentOrganization(null);
    setAuthView('login');
    setCurrentView('home');
  };

  useEffect(() => {
    // If switching roles, reset view safely
    if (userRole === 'coach') setCurrentView('roster');
    if (userRole === 'student' && currentView === 'roster') setCurrentView('home');
  }, [userRole]);

  const renderView = () => {
    // Show loading state while checking auth
    if (authLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading...</p>
          </div>
        </div>
      );
    }

    // Show auth views if not authenticated
    if (!isAuthenticated) {
      switch(authView) {
        case 'signup':
          return <SignupView onSignup={handleSignup} onSwitchToLogin={() => setAuthView('login')} />;
        case 'forgot-password':
          return <ForgotPasswordView onReset={handlePasswordReset} onBack={() => setAuthView('login')} />;
        case 'login':
        default:
          return <LoginView onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} onForgotPassword={() => setAuthView('forgot-password')} />;
      }
    }

    // Show organization dashboard if authenticated as admin
    if (isAuthenticated && currentUser?.role === 'organization_admin' && currentView === 'organization-dashboard') {
      if (!currentOrganization?.id) {
        return (
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="text-center">
              <p className="text-zinc-400 mb-4">No organization found. Please sign up first.</p>
              <button
                onClick={() => setAuthView('signup')}
                className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm hover:bg-cyan-500 transition-colors"
              >
                Create Organization
              </button>
            </div>
          </div>
        );
      }
      return <OrganizationDashboard organizationId={currentOrganization.id} setView={setCurrentView} />;
    }

    // If org admin switches to player/coach view, allow normal navigation
    if (isAuthenticated && currentUser?.role === 'organization_admin' && currentView !== 'organization-dashboard') {
      // Allow normal player/coach views
    }

    // Regular app views
    switch(currentView) {
        case 'home': return <PlayerHome setView={setCurrentView} setActiveTask={setActiveTask} />;
        case 'training': return <TrainingMode task={activeTask} setView={setCurrentView} />;
        case 'roster': return <CoachRoster />;
        case 'library': return <CoachLibrary setView={setCurrentView} setEditingDrill={setEditingDrill} />;
        case 'builder': return <WorkoutBuilder setView={setCurrentView} editingDrill={editingDrill} />;
        case 'chat': return <ChatView />;
        case 'profile': return <ProfileView setView={setCurrentView} />;
        case 'progress': return <ProgressAnalyticsView setView={setCurrentView} />;
        case 'subscription': return <SubscriptionView setView={setCurrentView} />;
        case 'organization-setup': return <OrganizationSetup setView={setCurrentView} />;
        default: return <PlayerHome setView={setCurrentView} setActiveTask={setActiveTask} />;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-200 font-sans selection:bg-cyan-500/30 p-0 md:p-8" style={{ margin: 0, padding: 0 }}>
      
      {/* Mobile Device Frame for Web App View */}
      <div className="w-full h-screen md:h-[850px] md:w-[400px] bg-zinc-950 md:rounded-[3rem] relative shadow-2xl overflow-hidden border-[8px] border-zinc-900 md:ring-4 ring-zinc-400/20 max-w-full overflow-x-hidden" style={{ margin: 0, padding: 0 }}>
        
        {/* Top App Bar - Fixed at top */}
        <div className="fixed top-0 left-0 right-0 z-40 px-2 md:px-4 h-14 flex justify-between items-center bg-zinc-950 border-b border-zinc-800/50 shadow-lg">
            <IcePulseLogo />
            <div className="flex items-center gap-2">
              {/* Organization Dashboard Button (for admins) */}
              {isAuthenticated && currentUser?.role === 'organization_admin' && (
            <button 
                  onClick={() => {
                    setCurrentView('organization-dashboard');
                    setUserRole('coach'); // Default to coach view when in org dashboard
                  }}
                  className={`text-[10px] font-bold uppercase bg-zinc-800/80 px-3 py-1.5 rounded-full border transition-colors flex items-center gap-2 backdrop-blur-sm ${
                    currentView === 'organization-dashboard'
                      ? 'border-cyan-500 text-cyan-400 bg-cyan-500/20'
                      : 'border-zinc-700/50 text-zinc-400 hover:border-cyan-500'
                  }`}
                >
                  <Building2 size={14} />
                  Org
                </button>
              )}
              
              {/* Player/Coach Toggle (show if not in org dashboard, or if org admin can also be coach) */}
              {(!isAuthenticated || currentView !== 'organization-dashboard' || (currentUser?.role === 'organization_admin' && currentUser?.isCoach)) && (
                <button 
                  onClick={() => {
                    if (userRole === 'student') {
                      setUserRole('coach');
                      setCurrentView('roster');
                    } else {
                      setUserRole('student');
                      setCurrentView('home');
                    }
                  }}
                className="text-[10px] font-bold uppercase bg-zinc-800/80 px-3 py-1.5 rounded-full border border-zinc-700/50 hover:border-cyan-500 transition-colors flex items-center gap-2 text-zinc-400 backdrop-blur-sm">
                <span className={`w-1.5 h-1.5 rounded-full ${userRole === 'student' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`}></span>
                {userRole === 'student' ? 'Player' : 'Coach'}
            </button>
              )}
            </div>
        </div>

        {/* Scrollable Content Area */}
        <main className="absolute top-14 left-0 right-0 px-1 md:px-4 overflow-y-auto overflow-x-hidden no-scrollbar bg-gradient-to-b from-zinc-950 to-zinc-900" style={{ zIndex: 10, bottom: 'calc(5rem + max(1rem, env(safe-area-inset-bottom)))', paddingBottom: '1rem' }}>
            <div className="max-w-full overflow-x-hidden" style={{ paddingBottom: '2rem' }}>
                {renderView()}
            </div>
        </main>

        {/* Bottom Navigation - Fixed at bottom */}
        {(!isAuthenticated || currentView !== 'organization-dashboard') && (
        <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 pt-2 z-40 shadow-lg" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))', height: 'calc(5rem + env(safe-area-inset-bottom))' }}>
            <div className="flex justify-around items-center px-1 md:px-2 h-full" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            
            {userRole === 'student' ? (
                <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentView === 'home' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    <Activity size={24} strokeWidth={currentView === 'home' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Train</span>
                </button>
            ) : (
                <button onClick={() => setCurrentView('roster')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentView === 'roster' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    <Users size={24} strokeWidth={currentView === 'roster' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Team</span>
                </button>
            )}

            {userRole === 'student' && (
                <button onClick={() => setCurrentView('training')} className={`flex flex-col items-center gap-1 w-16 group`}>
                    <div className={`p-3 rounded-full -mt-8 border-[6px] border-zinc-950 transition-all duration-300 group-active:scale-95 ${currentView === 'training' ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'}`}>
                        <Play size={24} fill="currentColor" className={currentView === 'training' ? 'ml-1' : ''} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase mt-1 transition-colors ${currentView === 'training' ? 'text-cyan-400' : 'text-zinc-500'}`}>Start</span>
                </button>
            )}

            {userRole === 'coach' && (
                <button onClick={() => setCurrentView('library')} className={`flex flex-col items-center gap-1 w-16 group`}>
                    <div className={`p-3 rounded-full -mt-8 border-[6px] border-zinc-950 transition-all duration-300 group-active:scale-95 ${['library', 'builder'].includes(currentView) ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'}`}>
                        {currentView === 'builder' ? <Plus size={24} /> : <Library size={24} />}
                    </div>
                    <span className={`text-[10px] font-bold uppercase mt-1 transition-colors ${['library', 'builder'].includes(currentView) ? 'text-cyan-400' : 'text-zinc-500'}`}>Drills</span>
                </button>
            )}

            <button onClick={() => setCurrentView('chat')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentView === 'chat' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <div className="relative">
                    <MessageSquare size={24} strokeWidth={currentView === 'chat' ? 2.5 : 2} />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950 animate-pulse"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide">Chat</span>
            </button>

            <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentView === 'profile' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <User size={24} strokeWidth={currentView === 'profile' ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-wide">Me</span>
            </button>

            </div>
        </nav>
        )}

        {/* Home Indicator (iOS Style) */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-800 rounded-full z-50"></div>
      </div>
      
      {/* Desktop Context Note */}
      <div className="hidden md:block fixed bottom-8 right-8 text-zinc-400 text-xs font-mono">
         ICEPULSE.APP • WEB PREVIEW • v1.0
      </div>
    </div>
  );
}

