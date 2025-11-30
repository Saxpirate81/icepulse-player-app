// Organization and team management service
// Uses localStorage for now, will connect to backend API later

import * as storage from './organizationStorage.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Create a new organization
 * @param {Object} organizationData - Organization and admin data
 * @returns {Promise<Object>} Created organization
 */
export const createOrganization = async (organizationData) => {
  try {
    // TODO: Replace with actual API call when backend is ready
    const organization = {
      id: Date.now(),
      name: organizationData.organization?.name || organizationData.name,
      description: organizationData.organization?.description || organizationData.description,
    };
    
    return storage.saveOrganization(organization);
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};

/**
 * Get organization by ID
 * @param {number} organizationId
 * @returns {Promise<Object>} Organization data
 */
export const getOrganization = async (organizationId) => {
  try {
    return storage.getOrganizationById(organizationId);
  } catch (error) {
    console.error('Error fetching organization:', error);
    throw error;
  }
};

/**
 * Create a new team
 * @param {Object} teamData - Team data
 * @returns {Promise<Object>} Created team
 */
export const createTeam = async (teamData) => {
  try {
    return storage.saveTeam(teamData);
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

/**
 * Get teams for an organization
 * @param {number} organizationId
 * @returns {Promise<Array>} List of teams
 */
export const getOrganizationTeams = async (organizationId) => {
  try {
    return storage.getTeamsByOrganization(organizationId);
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

/**
 * Update a team
 * @param {number} teamId
 * @param {Object} teamData
 * @returns {Promise<Object>} Updated team
 */
export const updateTeam = async (teamId, teamData) => {
  try {
    return storage.saveTeam({ ...teamData, id: teamId });
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

/**
 * Delete a team
 * @param {number} teamId
 * @returns {Promise<boolean>} Success
 */
export const deleteTeam = async (teamId) => {
  try {
    return storage.deleteTeam(teamId);
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};

/**
 * Send invitation to coach or player
 * @param {Object} invitationData - Invitation data
 * @returns {Promise<Object>} Created invitation
 */
export const sendInvitation = async (invitationData) => {
  try {
    const invitation = storage.saveInvitation(invitationData);
    
    // If it's a coach invitation, create a pending coach record
    if (invitationData.type === 'coach') {
      storage.saveCoach({
        email: invitationData.email,
        firstName: invitationData.firstName || '',
        lastName: invitationData.lastName || '',
        organizationId: invitationData.organizationId,
        teamId: invitationData.teamId || null,
        role: invitationData.role || 'assistant_coach',
        status: 'pending',
        invitationId: invitation.id,
      });
    }
    
    // If it's a player invitation, create a pending player record
    if (invitationData.type === 'player') {
      storage.savePlayer({
        email: invitationData.email,
        firstName: invitationData.firstName || '',
        lastName: invitationData.lastName || '',
        organizationId: invitationData.organizationId,
        teamId: invitationData.teamId || null,
        status: 'pending',
        invitationId: invitation.id,
      });
    }
    
    return invitation;
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw error;
  }
};

/**
 * Get invitations for organization/team
 * @param {number} organizationId
 * @param {number} teamId - Optional
 * @returns {Promise<Array>} List of invitations
 */
export const getInvitations = async (organizationId, teamId = null) => {
  try {
    return storage.getInvitations(organizationId, teamId);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    throw error;
  }
};

/**
 * Accept invitation (for coaches/players)
 * @param {string} invitationToken
 * @param {Object} userData - User account data
 * @returns {Promise<Object>} Created user and assignment
 */
export const acceptInvitation = async (invitationToken, userData) => {
  try {
    // TODO: API call
    // const response = await fetch(`${API_BASE_URL}/invitations/${invitationToken}/accept`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData),
    // });
    // return await response.json();
    
    return {
      user: {
        id: Date.now(),
        ...userData,
      },
      assignment: {
        id: Date.now() + 1,
        status: 'active',
      },
    };
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

/**
 * Get coaches for organization/team
 * @param {number} organizationId
 * @param {number} teamId - Optional
 * @returns {Promise<Array>} List of coaches
 */
export const getCoaches = async (organizationId, teamId = null) => {
  try {
    return storage.getCoachesByOrganization(organizationId, teamId);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    throw error;
  }
};

/**
 * Get players for organization/team
 * @param {number} organizationId
 * @param {number} teamId - Optional
 * @returns {Promise<Array>} List of players
 */
export const getPlayers = async (organizationId, teamId = null) => {
  try {
    return storage.getPlayersByOrganization(organizationId, teamId);
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

/**
 * Assign coach to team
 * @param {number} userId - Coach user ID
 * @param {number} teamId
 * @param {string} role - Coach role
 * @returns {Promise<Object>} Created assignment
 */
export const assignCoachToTeam = async (userId, teamId, role = 'assistant_coach') => {
  try {
    // TODO: API call
    // const response = await fetch(`${API_BASE_URL}/coach-assignments`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, teamId, role }),
    // });
    // return await response.json();
    
    return {
      id: Date.now(),
      userId,
      teamId,
      role,
      status: 'active',
    };
  } catch (error) {
    console.error('Error assigning coach:', error);
    throw error;
  }
};

