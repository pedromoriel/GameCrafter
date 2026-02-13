import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AccordionModule } from 'primeng/accordion';
import { Router } from '@angular/router';

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  videoUrl?: string;
  contentUrl?: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode?: string;
  resourceUrl?: string;
  completed?: boolean;
}

interface Level {
  id: string;
  title: string;
  emoji: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  progress: number;
  lessons: Lesson[];
  exercises: Exercise[];
  locked: boolean;
  purchased: boolean;
  price?: number;
  requiredProgress?: number;
  requiredLevelId?: string;
}

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ScrollPanelModule, AccordionModule],
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit {
  levels: Level[] = [
    {
      id: 'basics-101',
      title: 'JavaScript Fundamentals',
      emoji: '🟢',
      color: '#00ff88',
      difficulty: 'beginner',
      description: 'Learn the basics of JavaScript programming',
      progress: 60,
      locked: false,
      purchased: true,
      lessons: [
        {
          id: 'lesson-1',
          title: 'Variables & Data Types',
          description: 'Understanding variables, constants, and primitive types',
          order: 1,
          videoUrl: 'variables-intro.mp4'
        },
        {
          id: 'lesson-2',
          title: 'Functions & Scope',
          description: 'Creating and using functions in JavaScript',
          order: 2,
          videoUrl: 'functions-scope.mp4'
        },
        {
          id: 'lesson-3',
          title: 'Arrays & Objects',
          description: 'Working with collections of data',
          order: 3,
          videoUrl: 'arrays-objects.mp4'
        }
      ],
      exercises: [
        {
          id: 'ex-1',
          title: 'Hello World',
          description: 'Print your first message to the console',
          difficulty: 'easy',
          completed: true,
          starterCode: '// Write your code here'
        },
        {
          id: 'ex-2',
          title: 'Temperature Converter',
          description: 'Create a function to convert between Celsius and Fahrenheit',
          difficulty: 'easy',
          completed: true,
          starterCode: '// Convert temperature'
        },
        {
          id: 'ex-3',
          title: 'Array Processor',
          description: 'Manipulate arrays with sorting and filtering',
          difficulty: 'medium',
          completed: false,
          starterCode: '// Process array data'
        }
      ]
    },
    {
      id: 'game-dev-201',
      title: 'Game Development Basics',
      emoji: '🟡',
      color: '#ffd700',
      difficulty: 'intermediate',
      description: 'Learn game development concepts with Phaser',
      progress: 30,
      locked: true,
      purchased: false,
      price: 9.99,
      requiredProgress: 75,
      requiredLevelId: 'basics-101',
      lessons: [
        {
          id: 'lesson-4',
          title: 'Game Loop & Update',
          description: 'Understanding the game loop concept',
          order: 1,
          videoUrl: 'game-loop.mp4'
        },
        {
          id: 'lesson-5',
          title: 'Sprites & Animation',
          description: 'Working with sprites and creating animations',
          order: 2,
          videoUrl: 'sprites-animation.mp4'
        },
        {
          id: 'lesson-6',
          title: 'Physics & Collisions',
          description: 'Implementing physics and collision detection',
          order: 3,
          videoUrl: 'physics-collisions.mp4'
        }
      ],
      exercises: [
        {
          id: 'ex-4',
          title: 'Moving Sprite',
          description: 'Create a sprite that responds to keyboard input',
          difficulty: 'medium',
          completed: true,
          starterCode: '// Create and move sprite'
        },
        {
          id: 'ex-5',
          title: 'Collision Detection',
          description: 'Implement collision between game objects',
          difficulty: 'medium',
          completed: false,
          starterCode: '// Detect collisions'
        },
        {
          id: 'ex-6',
          title: 'Simple Game',
          description: 'Build a simple game with score tracking',
          difficulty: 'hard',
          completed: false,
          starterCode: '// Create a simple game'
        }
      ]
    },
    {
      id: 'advanced-301',
      title: 'Advanced Game Mechanics',
      emoji: '🔴',
      color: '#ff6b6b',
      difficulty: 'advanced',
      description: 'Master advanced game development techniques',
      progress: 0,
      locked: true,
      purchased: false,
      price: 19.99,
      requiredProgress: 75,
      requiredLevelId: 'game-dev-201',
      lessons: [
        {
          id: 'lesson-7',
          title: 'AI & Pathfinding',
          description: 'Implement AI behavior and pathfinding algorithms',
          order: 1,
          videoUrl: 'ai-pathfinding.mp4'
        },
        {
          id: 'lesson-8',
          title: 'Particle Systems',
          description: 'Create visual effects with particle systems',
          order: 2,
          videoUrl: 'particles.mp4'
        }
      ],
      exercises: [
        {
          id: 'ex-7',
          title: 'Enemy AI',
          description: 'Create intelligent enemy behavior',
          difficulty: 'hard',
          completed: false,
          starterCode: '// Implement AI'
        }
      ]
    }
  ];

  expandedLevels: Set<string> = new Set();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load levels from Firebase if needed
    // this.loadLevelsFromFirebase();
  }

  toggleLevel(levelId: string): void {
    if (this.expandedLevels.has(levelId)) {
      this.expandedLevels.delete(levelId);
    } else {
      this.expandedLevels.add(levelId);
    }
  }

  isLevelExpanded(levelId: string): boolean {
    return this.expandedLevels.has(levelId);
  }

  getDifficultyBadgeClass(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return 'badge-easy';
      case 'medium':
        return 'badge-medium';
      case 'hard':
        return 'badge-hard';
      default:
        return '';
    }
  }

  isLevelUnlocked(level: Level): boolean {
    // Beginner level is always unlocked
    if (level.id === 'basics-101') {
      return true;
    }

    // If level is purchased, it's unlocked
    if (level.purchased) {
      return true;
    }

    // Check if prerequisite level meets required progress
    if (level.requiredLevelId && level.requiredProgress) {
      const requiredLevel = this.levels.find(l => l.id === level.requiredLevelId);
      if (requiredLevel && requiredLevel.progress >= level.requiredProgress) {
        return true;
      }
    }

    return false;
  }

  getProgressPercentage(level: Level): number {
    if (level.requiredLevelId) {
      const requiredLevel = this.levels.find(l => l.id === level.requiredLevelId);
      if (requiredLevel) {
        return requiredLevel.progress;
      }
    }
    return 0;
  }

  getUnlockMessage(level: Level): string {
    if (level.requiredLevelId && level.requiredProgress) {
      const requiredLevel = this.levels.find(l => l.id === level.requiredLevelId);
      if (requiredLevel) {
        const remaining = level.requiredProgress - requiredLevel.progress;
        if (remaining > 0) {
          return `Complete ${remaining}% more of ${requiredLevel.title}`;
        }
      }
    }
    return 'Complete previous level to unlock';
  }

  startLevel(level: Level): void {
    // Navigate to level detail/editor
    this.router.navigate(['/editor'], { state: { levelId: level.id } });
  }

  startExercise(exercise: Exercise, levelId: string): void {
    // Navigate to exercise editor
    this.router.navigate(['/editor'], { 
      state: { 
        exerciseId: exercise.id,
        levelId: levelId,
        starterCode: exercise.starterCode 
      } 
    });
  }

  purchaseLevel(level: Level): void {
    // TODO: Integrate with payment system (Stripe/PayPal)
    // For now, simulate purchase
    if (level.price) {
      const confirmed = window.confirm(`Purchase "${level.title}" for $${level.price.toFixed(2)}?`);
      if (confirmed) {
        level.purchased = true;
        level.locked = false;
        // TODO: Save to Firestore
        console.log(`Level "${level.title}" purchased successfully!`);
      }
    }
  }
}
