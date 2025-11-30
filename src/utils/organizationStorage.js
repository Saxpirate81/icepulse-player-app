// LocalStorage-based storage for organizations, teams, coaches, players
// This will be replaced with API calls when backend is ready

const STORAGE_KEYS = {
  ORGANIZATIONS: 'icepulse_organizations',
  TEAMS: 'icepulse_teams',
  COACHES: 'icepulse_coaches',
  PLAYERS: 'icepulse_players',
  INVITATIONS: 'icepulse_invitations',
};

/**
 * Get all organizations
 */
export const getOrganizations = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting organizations:', error);
    return [];
  }
};

/**
 * Get organization by ID
 */
export const getOrganizationById = (id) => {
  const organizations = getOrganizations();
  return organizations.find(org => org.id === id) || null;
};

/**
 * Save organization
 */
export const saveOrganization = (organization) => {
  try {
    const organizations = getOrganizations();
    const existingIndex = organizations.findIndex(org => org.id === organization.id);
    
    if (existingIndex >= 0) {
      organizations[existingIndex] = { ...organizations[existingIndex], ...organization, updatedAt: new Date().toISOString() };
    } else {
      organizations.push({ ...organization, createdAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(organizations));
    return organization;
  } catch (error) {
    console.error('Error saving organization:', error);
    throw error;
  }
};

/**
 * Get teams for organization
 */
export const getTeamsByOrganization = (organizationId) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
    const allTeams = data ? JSON.parse(data) : [];
    return allTeams.filter(team => team.organizationId === organizationId);
  } catch (error) {
    console.error('Error getting teams:', error);
    return [];
  }
};

/**
 * Save team
 */
export const saveTeam = (team) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
    const teams = data ? JSON.parse(data) : [];
    const existingIndex = teams.findIndex(t => t.id === team.id);
    
    if (existingIndex >= 0) {
      teams[existingIndex] = { ...teams[existingIndex], ...team, updatedAt: new Date().toISOString() };
    } else {
      teams.push({ ...team, id: team.id || Date.now(), createdAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    return teams.find(t => t.id === (team.id || Date.now()));
  } catch (error) {
    console.error('Error saving team:', error);
    throw error;
  }
};

/**
 * Delete team
 */
export const deleteTeam = (teamId) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
    const teams = data ? JSON.parse(data) : [];
    const filtered = teams.filter(t => t.id !== teamId);
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};

/**
 * Get coaches for organization/team
 */
export const getCoachesByOrganization = (organizationId, teamId = null) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COACHES);
    const allCoaches = data ? JSON.parse(data) : [];
    return allCoaches.filter(coach => {
      if (teamId) {
        return coach.organizationId === organizationId && coach.teamId === teamId;
      }
      return coach.organizationId === organizationId;
    });
  } catch (error) {
    console.error('Error getting coaches:', error);
    return [];
  }
};

/**
 * Save coach
 */
export const saveCoach = (coach) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COACHES);
    const coaches = data ? JSON.parse(data) : [];
    const existingIndex = coaches.findIndex(c => c.id === coach.id || c.email === coach.email);
    
    if (existingIndex >= 0) {
      coaches[existingIndex] = { ...coaches[existingIndex], ...coach, updatedAt: new Date().toISOString() };
    } else {
      coaches.push({ ...coach, id: coach.id || Date.now(), status: coach.status || 'pending', createdAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(coaches));
    return coaches.find(c => c.id === (coach.id || Date.now()));
  } catch (error) {
    console.error('Error saving coach:', error);
    throw error;
  }
};

/**
 * Get players for organization/team
 */
export const getPlayersByOrganization = (organizationId, teamId = null) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    const allPlayers = data ? JSON.parse(data) : [];
    return allPlayers.filter(player => {
      if (teamId) {
        return player.organizationId === organizationId && player.teamId === teamId;
      }
      return player.organizationId === organizationId;
    });
  } catch (error) {
    console.error('Error getting players:', error);
    return [];
  }
};

/**
 * Save player
 */
export const savePlayer = (player) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    const players = data ? JSON.parse(data) : [];
    const existingIndex = players.findIndex(p => p.id === player.id || p.email === player.email);
    
    if (existingIndex >= 0) {
      players[existingIndex] = { ...players[existingIndex], ...player, updatedAt: new Date().toISOString() };
    } else {
      players.push({ ...player, id: player.id || Date.now(), status: player.status || 'pending', createdAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    return players.find(p => p.id === (player.id || Date.now()));
  } catch (error) {
    console.error('Error saving player:', error);
    throw error;
  }
};

/**
 * Get invitations
 */
export const getInvitations = (organizationId, teamId = null) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
    const allInvitations = data ? JSON.parse(data) : [];
    return allInvitations.filter(inv => {
      if (teamId) {
        return inv.organizationId === organizationId && inv.teamId === teamId;
      }
      return inv.organizationId === organizationId;
    });
  } catch (error) {
    console.error('Error getting invitations:', error);
    return [];
  }
};

/**
 * Save invitation
 */
export const saveInvitation = (invitation) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
    const invitations = data ? JSON.parse(data) : [];
    
    const newInvitation = {
      ...invitation,
      id: invitation.id || Date.now(),
      token: invitation.token || Math.random().toString(36).substring(7) + Date.now(),
      status: invitation.status || 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: invitation.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };
    
    invitations.push(newInvitation);
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
    return newInvitation;
  } catch (error) {
    console.error('Error saving invitation:', error);
    throw error;
  }
};

/**
 * Update invitation status
 */
export const updateInvitationStatus = (invitationId, status, acceptedUserId = null) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
    const invitations = data ? JSON.parse(data) : [];
    const index = invitations.findIndex(inv => inv.id === invitationId);
    
    if (index >= 0) {
      invitations[index] = {
        ...invitations[index],
        status,
        acceptedAt: status === 'accepted' ? new Date().toISOString() : invitations[index].acceptedAt,
        acceptedUserId: acceptedUserId || invitations[index].acceptedUserId,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
      return invitations[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating invitation:', error);
    throw error;
  }
};

