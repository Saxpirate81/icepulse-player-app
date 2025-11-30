# Data Schema Proposal for IcePulse Player App Integration

## 🎯 Goal
Integrate with existing app's data structure without modifying existing tables. Create new datasets that reference existing data.

## 📊 Existing Tables (From Your Other App)
Based on the schema you showed:
- `persons` - Base person data (will use for players)
- `organizers` - Organizations
- `teams` - Teams
- `organizer_memberships` - Links persons to organizations
- `team_memberships` - Links persons to teams
- `players` - Player-specific data
- `users` - User accounts
- `profiles` - User profiles

## 🆕 Proposed New Datasets for IcePulse Webapp

### 1. `icepulse_workout_plans`
**Purpose**: Store workout/drill plans created by coaches
**Relationships**: 
- Links to `organizers` (organization-level plans)
- Links to `teams` (team-specific plans)
- Links to `persons` (coach who created it)

**Fields**:
- `id` (primary key)
- `plan_title` (e.g., "Sept 1st-8th: Explosive Starts")
- `description`
- `organizer_id` (FK to organizers) - nullable
- `team_id` (FK to teams) - nullable
- `created_by_person_id` (FK to persons - the coach)
- `status` (published/draft/archived)
- `is_stock` (boolean - default stock drills)
- `created_at`
- `updated_at`
- `published_at` - nullable

**Notes**: 
- If `organizer_id` set → organization-wide plan
- If `team_id` set → team-specific plan
- If both null → personal coach plan

---

### 2. `icepulse_workout_categories`
**Purpose**: Categories within a workout plan (e.g., "Upper Body", "Skills & Drills")

**Fields**:
- `id` (primary key)
- `workout_plan_id` (FK to icepulse_workout_plans)
- `title` (e.g., "Upper Body Strength")
- `order` (display order)
- `created_at`

---

### 3. `icepulse_workout_exercises`
**Purpose**: Individual exercises/drills within a category

**Fields**:
- `id` (primary key)
- `category_id` (FK to icepulse_workout_categories)
- `title` (e.g., "Push-Ups")
- `description`
- `drill_category` (e.g., "Strength", "Shooting")
- `target_sets`
- `target_reps`
- `default_timer` (seconds) - nullable
- `video_url` - nullable
- `image_url` - nullable
- `is_default` (boolean - editable/deletable)
- `order` (display order)
- `created_at`
- `updated_at`

---

### 4. `icepulse_workout_assignments`
**Purpose**: Assign workouts to players/teams/organizations

**Fields**:
- `id` (primary key)
- `workout_plan_id` (FK to icepulse_workout_plans)
- `assigned_to_type` (enum: 'person', 'team', 'organizer', 'all')
- `assigned_to_id` (FK - can be person_id, team_id, or organizer_id)
- `assigned_by_person_id` (FK to persons - the coach)
- `due_date` - nullable
- `status` (active/inactive)
- `assigned_at`
- `created_at`

**Notes**:
- If `assigned_to_type = 'all'` → all players in organization/team
- Links to existing `persons` table for players

---

### 5. `icepulse_exercise_progress`
**Purpose**: Track player completion of exercises

**Fields**:
- `id` (primary key)
- `person_id` (FK to persons - the player)
- `exercise_id` (FK to icepulse_workout_exercises)
- `workout_plan_id` (FK to icepulse_workout_plans)
- `date` (date of completion)
- `duration` (minutes)
- `verification_score` (0-100)
- `sets_completed`
- `reps_completed`
- `completed` (boolean)
- `video_blob_url` - nullable (reference to video storage)
- `pose_data` (JSON) - nullable
- `metrics` (JSON) - nullable
- `created_at`

**Notes**: 
- Links to `persons` table (not `players` table) to keep it simple
- Can aggregate by person_id to show progress

---

### 6. `icepulse_streak_data`
**Purpose**: Track player streaks

**Fields**:
- `id` (primary key)
- `person_id` (FK to persons)
- `current_streak` (integer)
- `longest_streak` (integer)
- `last_activity_date` (date)
- `updated_at`

---

### 7. `icepulse_excluded_dates`
**Purpose**: Game/practice days that don't break streaks

**Fields**:
- `id` (primary key)
- `person_id` (FK to persons)
- `date` (date)
- `reason` (enum: 'game', 'practice', 'other')
- `created_at`

---

### 8. `icepulse_chat_messages`
**Purpose**: Team/organization chat messages

**Fields**:
- `id` (primary key)
- `sender_person_id` (FK to persons)
- `chat_type` (enum: 'team', 'organizer', 'direct')
- `chat_target_id` (FK - team_id, organizer_id, or recipient_person_id)
- `message_text`
- `liked` (boolean)
- `created_at`

**Notes**:
- Links to `persons` for sender
- Can link to `teams` or `organizers` for group chats

---

### 9. `icepulse_coach_assignments`
**Purpose**: Track which coaches belong to which organizations/teams

**Fields**:
- `id` (primary key)
- `person_id` (FK to persons - the coach)
- `organizer_id` (FK to organizers) - nullable
- `team_id` (FK to teams) - nullable
- `role` (enum: 'head_coach', 'assistant_coach', 'trainer')
- `status` (active/inactive)
- `created_at`

**Notes**:
- Links to existing `organizers` and `teams` tables
- Coach can belong to multiple teams/organizations
- Uses `persons` table (coaches are persons too)

---

### 10. `icepulse_saved_videos`
**Purpose**: Reference to saved practice videos (if stored separately)

**Fields**:
- `id` (primary key)
- `person_id` (FK to persons - the player)
- `exercise_id` (FK to icepulse_workout_exercises)
- `video_storage_url` (reference to actual video)
- `video_blob_id` - nullable
- `subscription_tier` (enum: 'basic', 'video_save', 'premium')
- `ai_analysis` (JSON) - nullable
- `created_at`

---

## 🔗 Key Relationships

```
persons (existing)
  ├── icepulse_coach_assignments (coaches)
  ├── icepulse_exercise_progress (players)
  ├── icepulse_streak_data (players)
  └── icepulse_chat_messages (all users)

organizers (existing)
  ├── icepulse_workout_plans (org-level plans)
  ├── icepulse_coach_assignments (coaches in org)
  └── icepulse_workout_assignments (assign to org)

teams (existing)
  ├── icepulse_workout_plans (team-level plans)
  ├── icepulse_coach_assignments (coaches on team)
  └── icepulse_workout_assignments (assign to team)

icepulse_workout_plans
  ├── icepulse_workout_categories
  │     └── icepulse_workout_exercises
  └── icepulse_workout_assignments
```

## ❓ Questions Before Implementation

1. **Coaches**: 
   - Are coaches in the `persons` table? 
   - Do we need a separate `coaches` table or can we use `organizer_memberships`/`team_memberships` with a role field?

2. **Player Identification**:
   - Should we use `persons.id` directly, or do we need to join through `players` table?
   - What's the relationship between `persons` and `players`?

3. **Organization/Team Hierarchy**:
   - Can a team belong to multiple organizations?
   - Can a person belong to multiple teams?
   - Should workout assignments cascade (org → team → player)?

4. **Permissions**:
   - Can coaches see all players in their organization?
   - Can coaches only see players on their specific teams?
   - Do we need role-based permissions (head coach vs assistant)?

5. **Data Migration**:
   - Do you want to seed initial data from existing tables?
   - Should we create default workout plans for existing teams?

## 🚀 Next Steps

Once you provide answers to the questions above, I can:
1. Create the exact schema with proper foreign keys
2. Build API/service layer to interact with these tables
3. Update the frontend to use real data instead of mocks
4. Ensure no conflicts with existing data structure

