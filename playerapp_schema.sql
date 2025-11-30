-- =====================================================
-- IcePulse Player App Database Schema
-- All tables prefixed with 'playerapp_'
-- =====================================================

-- =====================================================
-- 1. USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE playerapp_users (
    id BIGSERIAL PRIMARY KEY,
    person_id BIGINT, -- FK to existing persons table (nullable for now)
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'player', -- 'player', 'coach', 'admin'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'pending'
    subscription_tier VARCHAR(50) DEFAULT 'basic', -- 'basic', 'video_save', 'premium'
    subscription_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL
);

CREATE INDEX idx_playerapp_users_person_id ON playerapp_users(person_id);
CREATE INDEX idx_playerapp_users_email ON playerapp_users(email);
CREATE INDEX idx_playerapp_users_role ON playerapp_users(role);
CREATE INDEX idx_playerapp_users_status ON playerapp_users(status);

-- =====================================================
-- 2. ORGANIZATIONS & TEAMS
-- =====================================================

CREATE TABLE playerapp_organizations (
    id BIGSERIAL PRIMARY KEY,
    organizer_id BIGINT, -- FK to existing organizers table (nullable for now)
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_organizations_organizer_id ON playerapp_organizations(organizer_id);

CREATE TABLE playerapp_teams (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT, -- FK to existing teams table (nullable for now)
    organization_id BIGINT REFERENCES playerapp_organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_teams_team_id ON playerapp_teams(team_id);
CREATE INDEX idx_playerapp_teams_organization_id ON playerapp_teams(organization_id);

-- =====================================================
-- 3. COACH ASSIGNMENTS
-- =====================================================

CREATE TABLE playerapp_coach_assignments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES playerapp_users(id) ON DELETE CASCADE,
    organization_id BIGINT REFERENCES playerapp_organizations(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES playerapp_teams(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'coach', -- 'head_coach', 'assistant_coach', 'trainer'
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_coach_assignment_scope CHECK (
        (organization_id IS NOT NULL) OR (team_id IS NOT NULL)
    )
);

CREATE INDEX idx_playerapp_coach_assignments_user_id ON playerapp_coach_assignments(user_id);
CREATE INDEX idx_playerapp_coach_assignments_organization_id ON playerapp_coach_assignments(organization_id);
CREATE INDEX idx_playerapp_coach_assignments_team_id ON playerapp_coach_assignments(team_id);

-- =====================================================
-- 4. PLAYER MEMBERSHIPS
-- =====================================================

CREATE TABLE playerapp_player_memberships (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES playerapp_users(id) ON DELETE CASCADE,
    organization_id BIGINT REFERENCES playerapp_organizations(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES playerapp_teams(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'pending'
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_player_membership_scope CHECK (
        (organization_id IS NOT NULL) OR (team_id IS NOT NULL)
    )
);

CREATE INDEX idx_playerapp_player_memberships_user_id ON playerapp_player_memberships(user_id);
CREATE INDEX idx_playerapp_player_memberships_organization_id ON playerapp_player_memberships(organization_id);
CREATE INDEX idx_playerapp_player_memberships_team_id ON playerapp_player_memberships(team_id);

-- =====================================================
-- 5. WORKOUT PLANS
-- =====================================================

CREATE TABLE playerapp_workout_plans (
    id BIGSERIAL PRIMARY KEY,
    plan_title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_user_id BIGINT NOT NULL REFERENCES playerapp_users(id) ON DELETE SET NULL,
    organization_id BIGINT REFERENCES playerapp_organizations(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES playerapp_teams(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    is_stock BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_workout_plans_created_by ON playerapp_workout_plans(created_by_user_id);
CREATE INDEX idx_playerapp_workout_plans_organization_id ON playerapp_workout_plans(organization_id);
CREATE INDEX idx_playerapp_workout_plans_team_id ON playerapp_workout_plans(team_id);
CREATE INDEX idx_playerapp_workout_plans_status ON playerapp_workout_plans(status);

-- =====================================================
-- 6. WORKOUT CATEGORIES
-- =====================================================

CREATE TABLE playerapp_workout_categories (
    id BIGSERIAL PRIMARY KEY,
    workout_plan_id BIGINT NOT NULL REFERENCES playerapp_workout_plans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_workout_categories_plan_id ON playerapp_workout_categories(workout_plan_id);
CREATE INDEX idx_playerapp_workout_categories_order ON playerapp_workout_categories(workout_plan_id, display_order);

-- =====================================================
-- 7. WORKOUT EXERCISES
-- =====================================================

CREATE TABLE playerapp_workout_exercises (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES playerapp_workout_categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    drill_category VARCHAR(100), -- 'Strength', 'Shooting', 'Stick Handling', etc.
    target_sets INTEGER NOT NULL DEFAULT 3,
    target_reps INTEGER,
    default_timer INTEGER, -- seconds, nullable
    default_rest_time INTEGER, -- seconds, nullable
    total_rounds INTEGER, -- for interval training
    video_url VARCHAR(500),
    image_url VARCHAR(500),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_workout_exercises_category_id ON playerapp_workout_exercises(category_id);
CREATE INDEX idx_playerapp_workout_exercises_order ON playerapp_workout_exercises(category_id, display_order);

-- =====================================================
-- 8. WORKOUT ASSIGNMENTS
-- =====================================================

CREATE TABLE playerapp_workout_assignments (
    id BIGSERIAL PRIMARY KEY,
    workout_plan_id BIGINT NOT NULL REFERENCES playerapp_workout_plans(id) ON DELETE CASCADE,
    assigned_to_type VARCHAR(50) NOT NULL, -- 'user', 'team', 'organization', 'all'
    assigned_to_id BIGINT, -- user_id, team_id, or organization_id (nullable if 'all')
    assigned_by_user_id BIGINT NOT NULL REFERENCES playerapp_users(id) ON DELETE SET NULL,
    due_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_workout_assignments_plan_id ON playerapp_workout_assignments(workout_plan_id);
CREATE INDEX idx_playerapp_workout_assignments_assigned_to ON playerapp_workout_assignments(assigned_to_type, assigned_to_id);
CREATE INDEX idx_playerapp_workout_assignments_assigned_by ON playerapp_workout_assignments(assigned_by_user_id);
CREATE INDEX idx_playerapp_workout_assignments_status ON playerapp_workout_assignments(status);
CREATE INDEX idx_playerapp_workout_assignments_due_date ON playerapp_workout_assignments(due_date);

-- =====================================================
-- 9. EXERCISE PROGRESS
-- =====================================================

CREATE TABLE playerapp_exercise_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES playerapp_users(id) ON DELETE CASCADE,
    exercise_id BIGINT NOT NULL REFERENCES playerapp_workout_exercises(id) ON DELETE CASCADE,
    workout_plan_id BIGINT REFERENCES playerapp_workout_plans(id) ON DELETE SET NULL,
    workout_assignment_id BIGINT REFERENCES playerapp_workout_assignments(id) ON DELETE SET NULL,
    completion_date DATE NOT NULL,
    duration INTEGER, -- minutes
    verification_score DECIMAL(5,2), -- 0-100
    sets_completed INTEGER,
    reps_completed INTEGER,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    video_blob_url VARCHAR(500),
    video_blob_id VARCHAR(255),
    pose_data JSONB,
    metrics JSONB, -- form_score, consistency, etc.
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_exercise_progress_user_id ON playerapp_exercise_progress(user_id);
CREATE INDEX idx_playerapp_exercise_progress_exercise_id ON playerapp_exercise_progress(exercise_id);
CREATE INDEX idx_playerapp_exercise_progress_plan_id ON playerapp_exercise_progress(workout_plan_id);
CREATE INDEX idx_playerapp_exercise_progress_date ON playerapp_exercise_progress(user_id, completion_date);
CREATE INDEX idx_playerapp_exercise_progress_completed ON playerapp_exercise_progress(user_id, completed, completion_date);

-- =====================================================
-- 10. STREAK TRACKING
-- =====================================================

CREATE TABLE playerapp_streak_data (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES playerapp_users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_streak_data_user_id ON playerapp_streak_data(user_id);
CREATE INDEX idx_playerapp_streak_data_last_activity ON playerapp_streak_data(last_activity_date);

-- =====================================================
-- 11. EXCLUDED DATES (Game/Practice Days)
-- =====================================================

CREATE TABLE playerapp_excluded_dates (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES playerapp_users(id) ON DELETE CASCADE,
    excluded_date DATE NOT NULL,
    reason VARCHAR(50) NOT NULL DEFAULT 'game', -- 'game', 'practice', 'other'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, excluded_date)
);

CREATE INDEX idx_playerapp_excluded_dates_user_id ON playerapp_excluded_dates(user_id);
CREATE INDEX idx_playerapp_excluded_dates_date ON playerapp_excluded_dates(user_id, excluded_date);

-- =====================================================
-- 12. CHAT MESSAGES
-- =====================================================

CREATE TABLE playerapp_chat_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_user_id BIGINT NOT NULL REFERENCES playerapp_users(id) ON DELETE CASCADE,
    chat_type VARCHAR(50) NOT NULL, -- 'team', 'organization', 'direct'
    chat_target_id BIGINT, -- team_id, organization_id, or recipient_user_id
    recipient_user_id BIGINT REFERENCES playerapp_users(id) ON DELETE CASCADE, -- for direct messages
    message_text TEXT NOT NULL,
    liked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_chat_messages_sender ON playerapp_chat_messages(sender_user_id);
CREATE INDEX idx_playerapp_chat_messages_chat_type ON playerapp_chat_messages(chat_type, chat_target_id);
CREATE INDEX idx_playerapp_chat_messages_recipient ON playerapp_chat_messages(recipient_user_id);
CREATE INDEX idx_playerapp_chat_messages_created_at ON playerapp_chat_messages(created_at DESC);

-- =====================================================
-- 13. SAVED VIDEOS
-- =====================================================

CREATE TABLE playerapp_saved_videos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES playerapp_users(id) ON DELETE CASCADE,
    exercise_id BIGINT REFERENCES playerapp_workout_exercises(id) ON DELETE SET NULL,
    progress_id BIGINT REFERENCES playerapp_exercise_progress(id) ON DELETE SET NULL,
    video_storage_url VARCHAR(500) NOT NULL,
    video_blob_id VARCHAR(255),
    video_filename VARCHAR(255),
    file_size BIGINT, -- bytes
    duration INTEGER, -- seconds
    subscription_tier VARCHAR(50) NOT NULL, -- 'video_save', 'premium'
    ai_analysis JSONB, -- AI analysis results (for premium)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_saved_videos_user_id ON playerapp_saved_videos(user_id);
CREATE INDEX idx_playerapp_saved_videos_exercise_id ON playerapp_saved_videos(exercise_id);
CREATE INDEX idx_playerapp_saved_videos_progress_id ON playerapp_saved_videos(progress_id);
CREATE INDEX idx_playerapp_saved_videos_created_at ON playerapp_saved_videos(user_id, created_at DESC);

-- =====================================================
-- 14. DELETED DEFAULTS (User Preferences)
-- =====================================================

CREATE TABLE playerapp_deleted_defaults (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES playerapp_users(id) ON DELETE CASCADE,
    workout_plan_id BIGINT REFERENCES playerapp_workout_plans(id) ON DELETE CASCADE,
    exercise_id BIGINT REFERENCES playerapp_workout_exercises(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, workout_plan_id),
    UNIQUE(user_id, exercise_id),
    CONSTRAINT chk_deleted_default_scope CHECK (
        (workout_plan_id IS NOT NULL) OR (exercise_id IS NOT NULL)
    )
);

CREATE INDEX idx_playerapp_deleted_defaults_user_id ON playerapp_deleted_defaults(user_id);
CREATE INDEX idx_playerapp_deleted_defaults_plan_id ON playerapp_deleted_defaults(workout_plan_id);
CREATE INDEX idx_playerapp_deleted_defaults_exercise_id ON playerapp_deleted_defaults(exercise_id);

-- =====================================================
-- 15. WORKOUT TRACKING (Last Workout Type)
-- =====================================================

CREATE TABLE playerapp_workout_tracking (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES playerapp_users(id) ON DELETE CASCADE,
    last_workout_type VARCHAR(50), -- 'upper', 'lower'
    last_workout_date DATE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_workout_tracking_user_id ON playerapp_workout_tracking(user_id);
CREATE INDEX idx_playerapp_workout_tracking_date ON playerapp_workout_tracking(last_workout_date);

-- =====================================================
-- 16. FIRST DAY FLAG
-- =====================================================

CREATE TABLE playerapp_user_first_day (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES playerapp_users(id) ON DELETE CASCADE,
    first_day_complete BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_user_first_day_user_id ON playerapp_user_first_day(user_id);

-- =====================================================
-- 17. INVITATIONS
-- =====================================================

CREATE TABLE playerapp_invitations (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    invitation_type VARCHAR(50) NOT NULL, -- 'coach', 'player'
    organization_id BIGINT REFERENCES playerapp_organizations(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES playerapp_teams(id) ON DELETE CASCADE,
    role VARCHAR(50), -- 'head_coach', 'assistant_coach', 'trainer' (for coaches)
    invited_by_user_id BIGINT REFERENCES playerapp_users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'cancelled'
    expires_at TIMESTAMP,
    accepted_at TIMESTAMP,
    accepted_user_id BIGINT REFERENCES playerapp_users(id) ON DELETE SET NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_invitation_scope CHECK (
        (organization_id IS NOT NULL) OR (team_id IS NOT NULL)
    )
);

CREATE INDEX idx_playerapp_invitations_token ON playerapp_invitations(invitation_token);
CREATE INDEX idx_playerapp_invitations_email ON playerapp_invitations(email);
CREATE INDEX idx_playerapp_invitations_organization_id ON playerapp_invitations(organization_id);
CREATE INDEX idx_playerapp_invitations_team_id ON playerapp_invitations(team_id);
CREATE INDEX idx_playerapp_invitations_status ON playerapp_invitations(status);
CREATE INDEX idx_playerapp_invitations_type ON playerapp_invitations(invitation_type);

CREATE TABLE playerapp_user_first_day (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES playerapp_users(id) ON DELETE CASCADE,
    first_day_complete BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playerapp_user_first_day_user_id ON playerapp_user_first_day(user_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_playerapp_users_updated_at BEFORE UPDATE ON playerapp_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playerapp_organizations_updated_at BEFORE UPDATE ON playerapp_organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playerapp_teams_updated_at BEFORE UPDATE ON playerapp_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playerapp_coach_assignments_updated_at BEFORE UPDATE ON playerapp_coach_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playerapp_workout_plans_updated_at BEFORE UPDATE ON playerapp_workout_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playerapp_workout_exercises_updated_at BEFORE UPDATE ON playerapp_workout_exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playerapp_streak_data_updated_at BEFORE UPDATE ON playerapp_streak_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playerapp_workout_tracking_updated_at BEFORE UPDATE ON playerapp_workout_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE playerapp_users IS 'User accounts for IcePulse Player App. Links to existing persons table.';
COMMENT ON TABLE playerapp_organizations IS 'Organizations/clubs. Links to existing organizers table.';
COMMENT ON TABLE playerapp_teams IS 'Teams within organizations. Links to existing teams table.';
COMMENT ON TABLE playerapp_coach_assignments IS 'Coaches assigned to organizations or teams.';
COMMENT ON TABLE playerapp_player_memberships IS 'Players belonging to organizations or teams.';
COMMENT ON TABLE playerapp_workout_plans IS 'Workout/drill plans created by coaches.';
COMMENT ON TABLE playerapp_workout_categories IS 'Categories within workout plans (e.g., Upper Body, Skills).';
COMMENT ON TABLE playerapp_workout_exercises IS 'Individual exercises/drills within categories.';
COMMENT ON TABLE playerapp_workout_assignments IS 'Assignments of workout plans to users/teams/organizations.';
COMMENT ON TABLE playerapp_exercise_progress IS 'Player completion and progress tracking for exercises.';
COMMENT ON TABLE playerapp_streak_data IS 'Daily streak tracking for players.';
COMMENT ON TABLE playerapp_excluded_dates IS 'Game/practice days that dont break streaks.';
COMMENT ON TABLE playerapp_chat_messages IS 'Team/organization/direct chat messages.';
COMMENT ON TABLE playerapp_saved_videos IS 'Saved practice videos (Video Save and Premium tiers).';
COMMENT ON TABLE playerapp_deleted_defaults IS 'User preferences for deleted default workouts/exercises.';
COMMENT ON TABLE playerapp_workout_tracking IS 'Tracks last workout type for alternating upper/lower body.';
COMMENT ON TABLE playerapp_user_first_day IS 'Tracks if user has completed their first day workout.';
COMMENT ON TABLE playerapp_invitations IS 'Invitations sent to coaches and players to join organization/team.';

