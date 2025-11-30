// Stock/Default drills and workouts for coaches
// These are pre-populated and can be archived or deleted by coaches

export const STOCK_DRILLS = [
  {
    id: 'stock-1',
    planTitle: 'Sept 1st-8th: Explosive Starts',
    description: 'Focus on first three strides and puck protection. Build explosive power and quick acceleration.',
    status: 'published',
    isStock: true,
    categories: [
      {
        id: 1,
        title: 'Warm-Up & Mobility',
        tasks: [
          {
            id: 'warm-1',
            title: 'Dynamic Stretching',
            description: 'Hips and groin focus. Include leg swings, hip circles, and walking lunges.',
            drillCategory: 'Mobility',
            targetSets: 1,
            targetReps: 10,
            videoUrl: '',
            imageUrl: '',
          },
          {
            id: 'warm-2',
            title: 'Ladder Drills',
            description: 'High knees - 2 in 2 out pattern. Focus on quick feet and coordination.',
            drillCategory: 'Agility',
            targetSets: 3,
            targetReps: 5,
            videoUrl: '',
            imageUrl: '',
          }
        ]
      },
      {
        id: 2,
        title: 'Off-Ice Skills (Home Training)',
        tasks: [
          {
            id: 'skill-1',
            title: 'Cone Stickhandling Figure-8',
            description: 'Quick hands through tight spaces. Use synthetic ice if available (no skates required).',
            drillCategory: 'Stick Handling',
            targetSets: 5,
            targetReps: 10,
            videoUrl: '',
            imageUrl: '',
          },
          {
            id: 'skill-2',
            title: 'Toe Drag & Shoot',
            description: 'Deception move into quick release. Use home shooting pad or synthetic ice.',
            drillCategory: 'Shooting',
            targetSets: 4,
            targetReps: 12,
            videoUrl: '',
            imageUrl: '',
          },
          {
            id: 'skill-3',
            title: 'Quick Release Snap Shots',
            description: 'Fast release from various angles. Off-ice shooting pad recommended.',
            drillCategory: 'Shooting',
            targetSets: 5,
            targetReps: 10,
            videoUrl: '',
            imageUrl: '',
          }
        ]
      },
      {
        id: 3,
        title: 'Strength (Off-Ice)',
        tasks: [
          {
            id: 'strength-1',
            title: 'Bulgarian Split Squats',
            description: '3 sets of 10 each leg. Focus on depth and control.',
            drillCategory: 'Strength',
            targetSets: 3,
            targetReps: 10,
            videoUrl: '',
            imageUrl: '',
          }
        ]
      }
    ],
    publishedAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'stock-2',
    planTitle: 'Sept 9th-16th: Shooting Accuracy',
    description: 'Improve shot placement and accuracy from various positions. Focus on quick release and target precision.',
    status: 'published',
    isStock: true,
    categories: [
      {
        id: 1,
        title: 'Shooting Drills',
        tasks: [
          {
            id: 'shoot-1',
            title: 'Target Practice',
            description: 'Shoot at specific targets on net. 5 targets, 10 shots each.',
            drillCategory: 'Shooting',
            targetSets: 5,
            targetReps: 10,
            videoUrl: '',
            imageUrl: '',
          },
          {
            id: 'shoot-2',
            title: 'One-Timer Practice',
            description: 'Quick one-timer shots from pass. Focus on timing and power.',
            drillCategory: 'Shooting',
            targetSets: 4,
            targetReps: 8,
            videoUrl: '',
            imageUrl: '',
          }
        ]
      },
      {
        id: 2,
        title: 'Upper Body Strength',
        tasks: [
          {
            id: 'upper-1',
            title: 'Push-Ups',
            description: 'Chest and triceps focus. 3 sets of 15 reps.',
            drillCategory: 'Strength',
            targetSets: 3,
            targetReps: 15,
            videoUrl: '',
            imageUrl: '',
          },
          {
            id: 'upper-2',
            title: 'Pike Push-Ups',
            description: 'Shoulder strength and stability. 3 sets of 12 reps.',
            drillCategory: 'Strength',
            targetSets: 3,
            targetReps: 12,
            videoUrl: '',
            imageUrl: '',
          }
        ]
      }
    ],
    publishedAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'stock-3',
    planTitle: 'Power Play Systems',
    description: 'Off-ice practice for power play positioning and puck movement. Focus on quick decision making.',
    status: 'draft',
    isStock: true,
    categories: [
      {
        id: 1,
        title: 'Stickhandling',
        tasks: [
          {
            id: 'stick-1',
            title: 'Puck Protection Circles',
            description: 'Use body to shield puck in tight areas. Home training surface.',
            drillCategory: 'Stick Handling',
            targetSets: 3,
            targetReps: 8,
            videoUrl: '',
            imageUrl: '',
          }
        ]
      }
    ],
    publishedAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'stock-4',
    planTitle: 'Sept 17th-24th: Speed & Agility Training',
    description: 'Build explosive speed and quick direction changes. Essential for breakaways and defensive play.',
    status: 'published',
    isStock: true,
    categories: [
      {
        id: 1,
        title: 'Agility Drills',
        tasks: [
          {
            id: 'agility-1',
            title: 'Lateral Shuffles',
            description: 'Quick side-to-side movement. Stay low and maintain balance.',
            drillCategory: 'Agility',
            targetSets: 3,
            targetReps: 20,
            videoUrl: '',
            imageUrl: '',
          },
          {
            id: 'agility-2',
            title: 'Carioca (Grapevine)',
            description: 'Improve hip mobility and coordination. Cross legs front and back.',
            drillCategory: 'Agility',
            targetSets: 3,
            targetReps: 10,
            videoUrl: '',
            imageUrl: '',
          }
        ]
      },
      {
        id: 2,
        title: 'Lower Body Strength',
        tasks: [
          {
            id: 'lower-1',
            title: 'Jump Squats',
            description: 'Explosive leg power. 3 sets of 12 reps.',
            drillCategory: 'Strength',
            targetSets: 3,
            targetReps: 12,
            videoUrl: '',
            imageUrl: '',
          },
          {
            id: 'lower-2',
            title: 'Glute Bridges',
            description: 'Hip activation and glute strength. 3 sets of 15 reps.',
            drillCategory: 'Strength',
            targetSets: 3,
            targetReps: 15,
            videoUrl: '',
            imageUrl: '',
          }
        ]
      }
    ],
    publishedAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'stock-5',
    planTitle: 'Sept 25th-30th: Core Strength & Stability',
    description: 'Build core strength for better balance, shot power, and injury prevention.',
    status: 'published',
    isStock: true,
    categories: [
      {
        id: 1,
        title: 'Core Exercises',
        tasks: [
          {
            id: 'core-1',
            title: 'Plank Hold',
            description: 'Hold plank position for 45 seconds. 3 sets.',
            drillCategory: 'Strength',
            targetSets: 3,
            targetReps: 1,
            videoUrl: '',
            imageUrl: '',
          },
          {
            id: 'core-2',
            title: 'Russian Twists',
            description: 'Rotational core strength. 3 sets of 20 reps.',
            drillCategory: 'Strength',
            targetSets: 3,
            targetReps: 20,
            videoUrl: '',
            imageUrl: '',
          }
        ]
      }
    ],
    publishedAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  }
];

