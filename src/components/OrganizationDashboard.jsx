import React, { useState, useEffect } from 'react';
import { EmailNotification } from './EmailNotification';
import {
  Building2,
  Users,
  UserPlus,
  Mail,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Edit2,
  Archive,
  Activity,
  MessageSquare,
  Dumbbell,
  Target,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  ArrowRight,
  BarChart3,
  Clock,
  Flame
} from 'lucide-react';
import { TeamManagement, InvitationManager } from './OrganizationOnboarding';

// Organization Dashboard Component
export const OrganizationDashboard = ({ organizationId, setView }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'teams', 'coaches', 'players'
  const [teams, setTeams] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [activity, setActivity] = useState({
    recentChats: [],
    recentWorkouts: [],
    recentSkills: [],
    stats: {
      totalWorkouts: 0,
      activePlayers: 0,
      messagesToday: 0,
      skillsCompleted: 0,
    }
  });
  const [userFilter, setUserFilter] = useState('all'); // 'all', 'active', 'pending', 'archived'
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [emailNotification, setEmailNotification] = useState(null); // { type, email, link }

  useEffect(() => {
    if (organizationId) {
      loadDashboardData();
    }
  }, [organizationId]);

  const loadDashboardData = async () => {
    if (!organizationId) {
      console.warn('OrganizationDashboard: No organizationId provided');
      return;
    }
    
    try {
      const { getOrganizationTeams, getCoaches, getPlayers, getInvitations } = await import('../utils/organizationService.js');
      const { getChatMessages } = await import('../utils/workoutBrag.js');
      
      // Load teams, coaches, players, invitations
      const [teamsData, coachesData, playersData, invitationsData] = await Promise.all([
        getOrganizationTeams(organizationId),
        getCoaches(organizationId),
        getPlayers(organizationId),
        getInvitations(organizationId),
      ]);

      setTeams(teamsData);
      setCoaches(coachesData);
      setPlayers(playersData);
      setInvitations(invitationsData);
      
      // Update stats
      setActivity(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          activePlayers: playersData.filter(p => p.status === 'active').length,
        }
      }));

      // Load activity data
      const chatMessages = getChatMessages();
      const recentChats = chatMessages.slice(-5).reverse();
      
      // Mock activity data (replace with actual API calls)
      setActivity({
        recentChats,
        recentWorkouts: [
          { id: 1, player: 'Beckham M.', workout: 'Upper Body Strength', completed: '2 hours ago', progress: 85 },
          { id: 2, player: 'Alex T.', workout: 'Interval Bike Training', completed: '3 hours ago', progress: 100 },
        ],
        recentSkills: [
          { id: 1, player: 'Beckham M.', skill: 'Shooting Accuracy', completed: '1 hour ago', score: 92 },
          { id: 2, player: 'Sarah K.', skill: 'Speed & Agility', completed: '4 hours ago', score: 88 },
        ],
        stats: {
          totalWorkouts: 47,
          activePlayers: 12,
          messagesToday: 23,
          skillsCompleted: 15,
        }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleAddTeam = async (teamData) => {
    try {
      const { createTeam } = await import('../utils/organizationService.js');
      const newTeam = await createTeam({ ...teamData, organizationId });
      setTeams([...teams, newTeam]);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team. Please try again.');
    }
  };

  const handleEditTeam = async (teamId, teamData) => {
    try {
      const { updateTeam } = await import('../utils/organizationService.js');
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
      const { deleteTeam } = await import('../utils/organizationService.js');
      await deleteTeam(teamId);
      setTeams(teams.filter(t => t.id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team. Please try again.');
    }
  };

  const handleSendInvitation = async (invitationData) => {
    try {
      const { sendInvitation } = await import('../utils/organizationService.js');
      const { sendInvitationEmail } = await import('../utils/emailService.js');
      
      const invitation = await sendInvitation({
        ...invitationData,
        type: invitationData.type,
        organizationName: 'Your Organization', // TODO: Get from organization data
        teamName: teams.find(t => t.id === invitationData.teamId)?.name,
      });
      
      // Show email notification with link (since email service not configured)
      const invitationLink = `${window.location.origin}/invite/${invitation.token}`;
      setEmailNotification({
        type: 'invitation',
        email: invitationData.email,
        link: invitationLink,
      });
      
      // Also log to console
      console.log('📧 Invitation created:', {
        to: invitationData.email,
        link: invitationLink,
      });
      
      // Refresh lists
      await loadDashboardData();
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Error sending invitation. Please try again.');
    }
  };

  const filteredUsers = (users) => {
    if (userFilter === 'all') return users;
    return users.filter(u => u.status === userFilter);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic text-white uppercase mb-1">
            Organization Dashboard
          </h1>
          <p className="text-zinc-400 text-sm">
            Manage teams, coaches, and players
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('library')}
            className="bg-zinc-800 text-white px-4 py-2 rounded-xl font-bold text-sm uppercase hover:bg-zinc-700 transition-colors flex items-center gap-2"
          >
            <Dumbbell size={16} /> Workouts
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'teams', label: 'Teams', icon: Users },
          { id: 'coaches', label: 'Coaches', icon: UserPlus },
          { id: 'players', label: 'Players', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-bold text-sm uppercase transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <Dumbbell className="text-cyan-400" size={20} />
                <TrendingUp className="text-green-500" size={16} />
              </div>
              <p className="text-3xl font-black text-white">{activity.stats.totalWorkouts}</p>
              <p className="text-zinc-500 text-xs uppercase font-bold">Total Workouts</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-cyan-400" size={20} />
                <Flame className="text-orange-500" size={16} />
              </div>
              <p className="text-3xl font-black text-white">{activity.stats.activePlayers}</p>
              <p className="text-zinc-500 text-xs uppercase font-bold">Active Players</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="text-cyan-400" size={20} />
                <Clock className="text-blue-500" size={16} />
              </div>
              <p className="text-3xl font-black text-white">{activity.stats.messagesToday}</p>
              <p className="text-zinc-500 text-xs uppercase font-bold">Messages Today</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <Target className="text-cyan-400" size={20} />
                <CheckCircle className="text-green-500" size={16} />
              </div>
              <p className="text-3xl font-black text-white">{activity.stats.skillsCompleted}</p>
              <p className="text-zinc-500 text-xs uppercase font-bold">Skills Completed</p>
            </div>
          </div>

          {/* Activity Sections */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Recent Chats */}
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold uppercase text-sm flex items-center gap-2">
                  <MessageSquare size={16} /> Recent Chats
                </h3>
                <button
                  onClick={() => setView('chat')}
                  className="text-cyan-400 text-xs font-bold hover:text-cyan-300"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {activity.recentChats.length === 0 ? (
                  <p className="text-zinc-500 text-xs text-center py-4">No recent messages</p>
                ) : (
                  activity.recentChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="bg-zinc-950 rounded-lg p-3 border border-zinc-800 cursor-pointer hover:border-cyan-500/50 transition-colors"
                      onClick={() => setView('chat')}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-white text-xs font-bold">{chat.player || 'Player'}</p>
                        <span className="text-zinc-500 text-xs">{chat.time || 'Just now'}</span>
                      </div>
                      <p className="text-zinc-400 text-xs line-clamp-2">{chat.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Workouts */}
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold uppercase text-sm flex items-center gap-2">
                  <Dumbbell size={16} /> Recent Workouts
                </h3>
                <button
                  onClick={() => setView('progress')}
                  className="text-cyan-400 text-xs font-bold hover:text-cyan-300"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {activity.recentWorkouts.length === 0 ? (
                  <p className="text-zinc-500 text-xs text-center py-4">No recent workouts</p>
                ) : (
                  activity.recentWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="bg-zinc-950 rounded-lg p-3 border border-zinc-800 cursor-pointer hover:border-cyan-500/50 transition-colors"
                      onClick={() => setView('progress')}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white text-xs font-bold">{workout.player}</p>
                          <p className="text-zinc-400 text-xs">{workout.workout}</p>
                        </div>
                        <span className="text-zinc-500 text-xs">{workout.completed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div
                            className="bg-cyan-500 h-2 rounded-full"
                            style={{ width: `${workout.progress}%` }}
                          />
                        </div>
                        <span className="text-cyan-400 text-xs font-bold">{workout.progress}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Skills */}
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold uppercase text-sm flex items-center gap-2">
                  <Target size={16} /> Recent Skills
                </h3>
                <button
                  onClick={() => setView('progress')}
                  className="text-cyan-400 text-xs font-bold hover:text-cyan-300"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {activity.recentSkills.length === 0 ? (
                  <p className="text-zinc-500 text-xs text-center py-4">No recent skills</p>
                ) : (
                  activity.recentSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-zinc-950 rounded-lg p-3 border border-zinc-800 cursor-pointer hover:border-cyan-500/50 transition-colors"
                      onClick={() => setView('progress')}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-white text-xs font-bold">{skill.player}</p>
                          <p className="text-zinc-400 text-xs">{skill.skill}</p>
                        </div>
                        <span className="text-zinc-500 text-xs">{skill.completed}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${skill.score}%` }}
                          />
                        </div>
                        <span className="text-green-400 text-xs font-bold">{skill.score}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          <TeamManagement
            organizationId={organizationId}
            teams={teams}
            onAddTeam={handleAddTeam}
            onEditTeam={handleEditTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        </div>
      )}

      {/* Coaches Tab */}
      {activeTab === 'coaches' && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {['all', 'active', 'pending', 'archived'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setUserFilter(filter)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase transition-colors ${
                    userFilter === filter
                      ? 'bg-cyan-600 text-white border border-cyan-500'
                      : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Coaches List */}
          <div className="space-y-3">
            {filteredUsers(coaches).length === 0 ? (
              <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800 border-dashed">
                <UserPlus size={48} className="text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">No coaches found</p>
              </div>
            ) : (
              filteredUsers(coaches).map((coach) => (
                <div
                  key={coach.id}
                  className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <UserPlus className="text-cyan-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm">
                        {coach.firstName} {coach.lastName}
                      </h4>
                      <p className="text-zinc-400 text-xs">{coach.email}</p>
                      {coach.role && (
                        <span className="text-cyan-400 text-xs uppercase font-bold mt-1 inline-block">
                          {coach.role.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          coach.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : coach.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-zinc-500/20 text-zinc-400'
                        }`}
                      >
                        {coach.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-zinc-500 hover:text-cyan-400 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Invite Coach */}
          <InvitationManager
            type="coach"
            organizationId={organizationId}
            teamId={selectedTeam}
            onSendInvitation={handleSendInvitation}
          />
        </div>
      )}

      {/* Players Tab */}
      {activeTab === 'players' && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {['all', 'active', 'pending', 'archived'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setUserFilter(filter)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase transition-colors ${
                    userFilter === filter
                      ? 'bg-cyan-600 text-white border border-cyan-500'
                      : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Players List */}
          <div className="space-y-3">
            {filteredUsers(players).length === 0 ? (
              <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800 border-dashed">
                <Users size={48} className="text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">No players found</p>
              </div>
            ) : (
              filteredUsers(players).map((player) => (
                <div
                  key={player.id}
                  className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Users className="text-cyan-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm">
                        {player.firstName} {player.lastName}
                      </h4>
                      <p className="text-zinc-400 text-xs">{player.email}</p>
                      {player.teamName && (
                        <span className="text-cyan-400 text-xs uppercase font-bold mt-1 inline-block">
                          {player.teamName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          player.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : player.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-zinc-500/20 text-zinc-400'
                        }`}
                      >
                        {player.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-zinc-500 hover:text-cyan-400 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Invite Player */}
          <InvitationManager
            type="player"
            organizationId={organizationId}
            teamId={selectedTeam}
            onSendInvitation={handleSendInvitation}
            initialInvitations={invitations}
          />
        </div>
      )}

      {/* Email Notification Modal */}
      {emailNotification && (
        <EmailNotification
          type={emailNotification.type}
          email={emailNotification.email}
          link={emailNotification.link}
          onClose={() => setEmailNotification(null)}
          onCopy={() => console.log('Link copied to clipboard')}
        />
      )}
    </div>
  );
};

