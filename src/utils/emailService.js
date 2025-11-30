// Email service for sending invitations, password resets, etc.
// This will connect to your email service (SendGrid, AWS SES, etc.)

const EMAIL_API_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3000/api/email';

/**
 * Send invitation email to coach or player
 * @param {Object} invitationData - Invitation details
 * @returns {Promise<boolean>} Success
 */
export const sendInvitationEmail = async (invitationData) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${EMAIL_API_URL}/invitation`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(invitationData),
    // });
    // return response.ok;
    
    console.log('📧 Sending invitation email:', {
      to: invitationData.email,
      type: invitationData.type,
      organization: invitationData.organizationName,
      team: invitationData.teamName,
      link: `${window.location.origin}/invite/${invitationData.token}`,
    });
    
    // Mock: In production, this would send an actual email
    return true;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} resetToken - Password reset token
 * @returns {Promise<boolean>} Success
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${EMAIL_API_URL}/password-reset`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, resetToken }),
    // });
    // return response.ok;
    
    const resetLink = `${window.location.origin}/reset-password/${resetToken}`;
    
    console.log('📧 Sending password reset email:', {
      to: email,
      link: resetLink,
    });
    
    // Mock: In production, this would send an actual email
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send welcome email to new user
 * @param {Object} userData - User details
 * @returns {Promise<boolean>} Success
 */
export const sendWelcomeEmail = async (userData) => {
  try {
    // TODO: Replace with actual API call
    console.log('📧 Sending welcome email:', userData);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Email template for invitations
 */
export const getInvitationEmailTemplate = (invitationData) => {
  const roleText = invitationData.type === 'coach' ? 'coach' : 'player';
  const teamText = invitationData.teamName ? ` for ${invitationData.teamName}` : '';
  
  return {
    subject: `You're Invited to Join ${invitationData.organizationName} on IcePulse`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're Invited!</h1>
            </div>
            <div class="content">
              <p>Hi ${invitationData.firstName || 'there'},</p>
              <p>You've been invited to join <strong>${invitationData.organizationName}</strong>${teamText} as a ${roleText}.</p>
              ${invitationData.role ? `<p><strong>Role:</strong> ${invitationData.role.replace('_', ' ')}</p>` : ''}
              <p>Click the button below to accept your invitation and create your account:</p>
              <a href="${window.location.origin}/invite/${invitationData.token}" class="button">Accept Invitation</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #06b6d4;">${window.location.origin}/invite/${invitationData.token}</p>
              <p>This invitation expires in 7 days.</p>
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} IcePulse. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      You're Invited!
      
      Hi ${invitationData.firstName || 'there'},
      
      You've been invited to join ${invitationData.organizationName}${teamText} as a ${roleText}.
      
      ${invitationData.role ? `Role: ${invitationData.role.replace('_', ' ')}` : ''}
      
      Accept your invitation: ${window.location.origin}/invite/${invitationData.token}
      
      This invitation expires in 7 days.
      
      If you didn't expect this invitation, you can safely ignore this email.
    `,
  };
};

/**
 * Email template for password reset
 */
export const getPasswordResetEmailTemplate = (email, resetToken) => {
  const resetLink = `${window.location.origin}/reset-password/${resetToken}`;
  
  return {
    subject: 'Reset Your IcePulse Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hi,</p>
              <p>We received a request to reset your password for your IcePulse account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #06b6d4;">${resetLink}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} IcePulse. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset Your Password
      
      Hi,
      
      We received a request to reset your password for your IcePulse account.
      
      Reset your password: ${resetLink}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
    `,
  };
};

