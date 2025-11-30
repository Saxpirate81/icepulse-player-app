# IcePulse Player App - Database Tables Summary

All tables are prefixed with `playerapp_`

## 📊 Complete Table List (16 Tables)

### 1. **playerapp_users**
**Purpose**: User accounts and authentication
**Key Fields**: 
- `person_id` (FK to existing persons - nullable for now)
- `email`, `password_hash`, `role`, `subscription_tier`
**Relationships**: Referenced by most other tables

---

### 2. **playerapp_organizations**
**Purpose**: Organizations/clubs
**Key Fields**: 
- `organizer_id` (FK to existing organizers - nullable for now)
- `name`, `description`, `logo_url`
**Relationships**: 
- Has many `playerapp_teams`
- Has many `playerapp_coach_assignments`
- Has many `playerapp_player_memberships`

---

### 3. **playerapp_teams**
**Purpose**: Teams within organizations
**Key Fields**: 
- `team_id` (FK to existing teams - nullable for now)
- `organization_id` (FK to playerapp_organizations)
- `name`, `description`
**Relationships**: 
- Belongs to `playerapp_organizations`
- Has many `playerapp_coach_assignments`
- Has many `playerapp_player_memberships`

---

### 4. **playerapp_coach_assignments**
**Purpose**: Coaches assigned to organizations/teams
**Key Fields**: 
- `user_id` (FK to playerapp_users)
- `organization_id` OR `team_id` (one must exist)
- `role` (head_coach, assistant_coach, trainer)
**Relationships**: 
- Belongs to `playerapp_users`
- Belongs to `playerapp_organizations` OR `playerapp_teams`

---

### 5. **playerapp_player_memberships**
**Purpose**: Players belonging to organizations/teams
**Key Fields**: 
- `user_id` (FK to playerapp_users)
- `organization_id` OR `team_id` (one must exist)
- `status`, `joined_at`, `left_at`
**Relationships**: 
- Belongs to `playerapp_users`
- Belongs to `playerapp_organizations` OR `playerapp_teams`

---

### 6. **playerapp_workout_plans**
**Purpose**: Workout/drill plans created by coaches
**Key Fields**: 
- `plan_title`, `description`
- `created_by_user_id` (coach who created it)
- `organization_id` OR `team_id` (scope of plan)
- `status` (draft, published, archived)
- `is_stock` (default stock drills)
**Relationships**: 
- Has many `playerapp_workout_categories`
- Has many `playerapp_workout_assignments`

---

### 7. **playerapp_workout_categories**
**Purpose**: Categories within workout plans (e.g., "Upper Body", "Skills")
**Key Fields**: 
- `workout_plan_id` (FK to playerapp_workout_plans)
- `title`, `display_order`
**Relationships**: 
- Belongs to `playerapp_workout_plans`
- Has many `playerapp_workout_exercises`

---

### 8. **playerapp_workout_exercises**
**Purpose**: Individual exercises/drills
**Key Fields**: 
- `category_id` (FK to playerapp_workout_categories)
- `title`, `description`, `drill_category`
- `target_sets`, `target_reps`, `default_timer`
- `video_url`, `image_url`
- `is_default` (editable/deletable by coach)
**Relationships**: 
- Belongs to `playerapp_workout_categories`
- Has many `playerapp_exercise_progress`

---

### 9. **playerapp_workout_assignments**
**Purpose**: Assign workouts to users/teams/organizations
**Key Fields**: 
- `workout_plan_id` (FK to playerapp_workout_plans)
- `assigned_to_type` (user, team, organization, all)
- `assigned_to_id` (user_id, team_id, or organization_id)
- `assigned_by_user_id` (coach)
- `due_date`, `status`
**Relationships**: 
- Belongs to `playerapp_workout_plans`
- References `playerapp_users`, `playerapp_teams`, or `playerapp_organizations`

---

### 10. **playerapp_exercise_progress**
**Purpose**: Track player completion of exercises
**Key Fields**: 
- `user_id` (FK to playerapp_users)
- `exercise_id` (FK to playerapp_workout_exercises)
- `completion_date`, `duration`, `verification_score`
- `sets_completed`, `reps_completed`, `completed`
- `video_blob_url`, `pose_data` (JSONB), `metrics` (JSONB)
**Relationships**: 
- Belongs to `playerapp_users`
- Belongs to `playerapp_workout_exercises`
- Optional: `workout_plan_id`, `workout_assignment_id`

---

### 11. **playerapp_streak_data**
**Purpose**: Daily streak tracking
**Key Fields**: 
- `user_id` (FK to playerapp_users - UNIQUE)
- `current_streak`, `longest_streak`
- `last_activity_date`
**Relationships**: 
- One-to-one with `playerapp_users`

---

### 12. **playerapp_excluded_dates**
**Purpose**: Game/practice days that don't break streaks
**Key Fields**: 
- `user_id` (FK to playerapp_users)
- `excluded_date`, `reason` (game, practice, other)
- UNIQUE(user_id, excluded_date)
**Relationships**: 
- Belongs to `playerapp_users`

---

### 13. **playerapp_chat_messages**
**Purpose**: Team/organization/direct chat
**Key Fields**: 
- `sender_user_id` (FK to playerapp_users)
- `chat_type` (team, organization, direct)
- `chat_target_id` (team_id, organization_id, or recipient_user_id)
- `recipient_user_id` (for direct messages)
- `message_text`, `liked`
**Relationships**: 
- Belongs to `playerapp_users` (sender and recipient)

---

### 14. **playerapp_saved_videos**
**Purpose**: Saved practice videos (Video Save & Premium tiers)
**Key Fields**: 
- `user_id` (FK to playerapp_users)
- `exercise_id` (FK to playerapp_workout_exercises)
- `video_storage_url`, `video_blob_id`
- `subscription_tier`, `ai_analysis` (JSONB for Premium)
**Relationships**: 
- Belongs to `playerapp_users`
- Optional: `exercise_id`, `progress_id`

---

### 15. **playerapp_deleted_defaults**
**Purpose**: User preferences for deleted default workouts/exercises
**Key Fields**: 
- `user_id` (FK to playerapp_users)
- `workout_plan_id` OR `exercise_id` (one must exist)
- UNIQUE constraints to prevent duplicates
**Relationships**: 
- Belongs to `playerapp_users`
- References `playerapp_workout_plans` OR `playerapp_workout_exercises`

---

### 16. **playerapp_workout_tracking**
**Purpose**: Track last workout type for alternating upper/lower body
**Key Fields**: 
- `user_id` (FK to playerapp_users - UNIQUE)
- `last_workout_type` (upper, lower)
- `last_workout_date`
**Relationships**: 
- One-to-one with `playerapp_users`

---

### 17. **playerapp_user_first_day**
**Purpose**: Track if user completed first day workout
**Key Fields**: 
- `user_id` (FK to playerapp_users - UNIQUE)
- `first_day_complete` (boolean)
- `completed_at`
**Relationships**: 
- One-to-one with `playerapp_users`

---

## 🔗 Key Relationships Summary

```
playerapp_users (core)
  ├── playerapp_coach_assignments
  ├── playerapp_player_memberships
  ├── playerapp_exercise_progress
  ├── playerapp_streak_data
  ├── playerapp_excluded_dates
  ├── playerapp_chat_messages
  ├── playerapp_saved_videos
  ├── playerapp_deleted_defaults
  ├── playerapp_workout_tracking
  └── playerapp_user_first_day

playerapp_organizations
  ├── playerapp_teams
  ├── playerapp_coach_assignments
  ├── playerapp_player_memberships
  └── playerapp_workout_plans

playerapp_teams
  ├── playerapp_coach_assignments
  ├── playerapp_player_memberships
  └── playerapp_workout_plans

playerapp_workout_plans
  ├── playerapp_workout_categories
  │     └── playerapp_workout_exercises
  └── playerapp_workout_assignments
```

## 📝 Notes

- All tables use `BIGSERIAL` for primary keys (supports large datasets)
- Foreign keys use `ON DELETE CASCADE` or `ON DELETE SET NULL` appropriately
- Indexes created on all foreign keys and frequently queried fields
- JSONB fields used for flexible data (pose_data, metrics, ai_analysis)
- Timestamps use `TIMESTAMP` type (timezone-aware)
- Unique constraints where needed (e.g., user_id in streak_data)
- Check constraints for data validation (e.g., coach must have org OR team)

## 🚀 Next Steps

1. Run the SQL schema file to create all tables
2. Create API/service layer to interact with these tables
3. Update frontend to use real data instead of localStorage
4. Add foreign key constraints to existing tables when ready:
   - `playerapp_users.person_id` → `persons.id`
   - `playerapp_organizations.organizer_id` → `organizers.id`
   - `playerapp_teams.team_id` → `teams.id`

