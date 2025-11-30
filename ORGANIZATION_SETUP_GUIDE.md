# Organization Setup & Management Guide

## 🎯 Complete Onboarding Flow

### For New Organizations

1. **Organization Signup** (`/organization-setup`)
   - Admin creates organization account
   - Sets organization name and description
   - Creates admin user account
   - Gets organization ID

2. **Team Setup**
   - Create teams within organization
   - Edit/delete teams as needed
   - Teams can be assigned coaches and players

3. **Coach Invitations**
   - Send invitations to coaches via email
   - Specify role (Head Coach, Assistant Coach, Trainer)
   - Assign to organization or specific team
   - Coaches receive email with invitation link

4. **Player Recruitment**
   - Send invitations to players via email
   - Assign to organization or specific team
   - Players receive email with invitation link

5. **Complete Setup**
   - Review all created teams, coaches, and players
   - Mark onboarding as complete
   - Redirect to dashboard

---

## 📋 Component Structure

### 1. OrganizationSignup Component
**Location**: `src/components/OrganizationOnboarding.jsx`

**Steps**:
- Step 1: Organization name, description, admin email, password
- Step 2: Admin first name, last name, phone (optional)
- Step 3: Review and confirm

**Output**: Creates organization and admin user

---

### 2. TeamManagement Component
**Location**: `src/components/OrganizationOnboarding.jsx`

**Features**:
- Add new teams
- Edit existing teams
- Delete teams
- View all teams

**Team Data**:
- Name (required)
- Description (optional)
- Organization ID (auto-set)

---

### 3. InvitationManager Component
**Location**: `src/components/OrganizationOnboarding.jsx`

**Types**:
- `type="coach"` - For inviting coaches
- `type="player"` - For inviting players

**Features**:
- Send invitations via email
- Track invitation status (pending, accepted, expired)
- View all sent invitations
- Resend invitations if needed

**Invitation Data**:
- Email (required)
- First name (optional)
- Last name (optional)
- Role (for coaches: head_coach, assistant_coach, trainer)
- Organization ID
- Team ID (optional)

---

### 4. InvitationAcceptance Component
**Location**: `src/components/InvitationAcceptance.jsx`

**Flow**:
1. User clicks invitation link (with token)
2. Verify invitation token
3. Show invitation details
4. User creates account (first name, last name, password)
5. Accept invitation
6. User is assigned to organization/team
7. Redirect to app

---

## 🔗 Service Layer

### organizationService.js
**Location**: `src/utils/organizationService.js`

**Functions**:
- `createOrganization()` - Create new organization
- `createTeam()` - Create team
- `updateTeam()` - Update team
- `deleteTeam()` - Delete team
- `sendInvitation()` - Send coach/player invitation
- `acceptInvitation()` - Accept invitation and create account
- `getCoaches()` - Get coaches for org/team
- `getPlayers()` - Get players for org/team
- `assignCoachToTeam()` - Assign coach to team

**Note**: Currently uses mock data. Replace with actual API calls when backend is ready.

---

## 🗄️ Database Tables

### New Table: `playerapp_invitations`
**Purpose**: Track all invitations sent to coaches and players

**Key Fields**:
- `email` - Invitation recipient
- `invitation_token` - Unique token for invitation link
- `invitation_type` - 'coach' or 'player'
- `organization_id` - Organization being invited to
- `team_id` - Team being invited to (optional)
- `role` - Coach role (if type is 'coach')
- `status` - pending, accepted, expired, cancelled
- `expires_at` - Invitation expiration
- `accepted_user_id` - User who accepted (if accepted)

---

## 🚀 How to Use

### For Organization Admin:

1. **Start Setup**:
   ```javascript
   // Navigate to organization setup
   setView('organization-setup');
   ```

2. **Complete Steps**:
   - Fill out organization signup form
   - Create teams
   - Invite coaches
   - Invite players

3. **Access Dashboard**:
   - After setup complete, redirect to roster/library

### For Coaches/Players:

1. **Receive Invitation**:
   - Email with invitation link
   - Link format: `/invite/{token}`

2. **Accept Invitation**:
   - Click link
   - Verify invitation
   - Create account
   - Auto-assigned to organization/team

---

## 📧 Invitation Email Template

**Subject**: You're Invited to Join [Organization Name] on IcePulse

**Body**:
```
Hi [Name],

You've been invited to join [Organization Name] as a [Coach/Player].

Click here to accept: [Invitation Link]

This invitation expires in 7 days.

If you didn't expect this invitation, you can safely ignore this email.
```

---

## 🔐 Security Considerations

1. **Invitation Tokens**:
   - Generate unique, secure tokens
   - Set expiration (e.g., 7 days)
   - One-time use tokens

2. **Email Verification**:
   - Verify email matches invitation
   - Prevent duplicate accounts

3. **Role Permissions**:
   - Coaches can create workouts
   - Players can only view assigned workouts
   - Admins can manage everything

---

## 🎨 UI Features

- **Step Indicator**: Visual progress through setup
- **Form Validation**: Real-time error checking
- **Modal Dialogs**: For adding/editing teams and invitations
- **Status Badges**: Show invitation status
- **Responsive Design**: Works on mobile and desktop

---

## 📝 Next Steps

1. **Connect to Backend**:
   - Replace mock API calls in `organizationService.js`
   - Add authentication/authorization
   - Implement email sending

2. **Add Features**:
   - Bulk invitation import (CSV)
   - Invitation resend
   - Invitation cancellation
   - Team member management UI
   - Coach assignment to teams

3. **Testing**:
   - Test full onboarding flow
   - Test invitation acceptance
   - Test role permissions
   - Test team assignments

