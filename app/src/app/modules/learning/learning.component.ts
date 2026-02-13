import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { ReplaceLineBreaksPipe } from '../../shared/pipes/replace-line-breaks.pipe';

interface ContentItem {
  id: string;
  type: 'text' | 'video' | 'image' | 'exercise';
  title: string;
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
  exerciseCode?: string;
  duration?: number;
  order: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  contentItems: ContentItem[];
  completed: boolean;
  order: number;
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
  locked: boolean;
  purchased: boolean;
  price?: number;
  requiredProgress?: number;
  requiredLevelId?: string;
}

interface TreeNode {
  key: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  data?: {
    type: 'level' | 'lesson' | 'content';
    levelId?: string;
    lessonId?: string;
    contentId?: string;
    lesson?: Lesson;
    content?: ContentItem;
  };
}

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [CommonModule, TreeModule, ButtonModule, CardModule, ProgressBarModule, BadgeModule, SafeUrlPipe, ReplaceLineBreaksPipe],
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss']
})
export class LearningComponent implements OnInit, OnDestroy {
  levels: Level[] = [];
  treeNodes: TreeNode[] = [];
  selectedContent: ContentItem | null = null;
  selectedLesson: Lesson | null = null;
  selectedLevel: Level | null = null;
  currentContentIndex: number = 0;
  completionProgress: number = 0;
  expandedKeys: { [key: string]: boolean } = {};
  viewMode: 'levels' | 'learning' = 'levels';
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router) {
    this.initializeData();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const levelId = params.get('levelId');
      const lessonId = params.get('lessonId');

      if (levelId) {
        const level = this.levels.find(l => l.id === levelId);
        if (level) {
          this.selectLevelForLearning(level);
          this.viewMode = 'learning';
          if (lessonId) {
            const lesson = level.lessons.find(l => l.id === lessonId);
            if (lesson) {
              setTimeout(() => this.selectLesson(lesson, level), 100);
            }
          }
        }
      }
    });

    this.buildTreeNodes();
    this.expandTreeNodes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.levels = [
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
            id: 'lesson-var',
            title: 'Variables & Data Types',
            description: 'Learn about variables, constants, and data types',
            order: 1,
            completed: false,
            contentItems: [
              {
                id: 'content-intro',
                type: 'text',
                title: 'Introduction to Variables',
                content: `In JavaScript, variables are containers for storing data values. There are three ways to declare variables:

• var - Function-scoped (legacy)
• let - Block-scoped (recommended)
• const - Block-scoped, cannot be reassigned (recommended for most cases)

Example:
let age = 25;
const name = 'John';
var score = 100;`,
                order: 1
              },
              {
                id: 'content-video-var',
                type: 'video',
                title: 'Variable Declaration Video',
                videoUrl: 'https://www.youtube.com/embed/u0Mq7ZifXsw',
                duration: 8,
                order: 2
              },
              {
                id: 'content-types',
                type: 'text',
                title: 'Data Types in JavaScript',
                content: `JavaScript has several data types:

Primitive Types:
• String - Text values ("hello", 'world')
• Number - Integers and decimals (42, 3.14)
• Boolean - true or false
• undefined - Variable declared but not assigned
• null - Intentional absence of value
• Symbol - Unique identifiers
• BigInt - Large integers

Reference Types:
• Object - Collections of key-value pairs
• Array - Ordered collections
• Function - Reusable blocks of code`,
                order: 3
              }
            ]
          },
          {
            id: 'lesson-ops',
            title: 'Operators & Expressions',
            description: 'Master operators and expressions in JavaScript',
            order: 2,
            completed: false,
            contentItems: [
              {
                id: 'content-ops-intro',
                type: 'text',
                title: 'Introduction to Operators',
                content: `Operators are symbols that perform operations on values.

Arithmetic Operators:
+ (addition), - (subtraction), * (multiplication), / (division)
% (modulo), ** (exponentiation)

Comparison Operators:
== (loose equality), === (strict equality)
!= (not equal), < (less than), > (greater than)

Logical Operators:
&& (AND), || (OR), ! (NOT)`,
                order: 1
              },
              {
                id: 'content-ops-exercise',
                type: 'exercise',
                title: 'Practice: Basic Operations',
                exerciseCode: `// Complete these operations:
let x = 10;
let y = 5;

// Add x and y, store in sum
let sum = 0; // TODO: Fix this

// Multiply x and y, store in product
let product = 0; // TODO: Fix this

// Check if x > y using comparison
let isGreater = false; // TODO: Fix this`,
                order: 2
              }
            ]
          },
          {
            id: 'lesson-func',
            title: 'Functions & Scope',
            description: 'Understand functions and variable scope',
            order: 3,
            completed: false,
            contentItems: [
              {
                id: 'content-func-text',
                type: 'text',
                title: 'Function Basics',
                content: `Functions are reusable blocks of code that perform specific tasks.

Declaring Functions:
function greet(name) {
  return 'Hello, ' + name + '!';
}

Arrow Functions (ES6):
const greet = (name) => {
  return 'Hello, ' + name + '!';
};

// Or shorter:
const greet = name => 'Hello, ' + name + '!';

Function Scope:
• Global Scope - Accessible everywhere
• Function Scope - Accessible within the function
• Block Scope - Accessible within { }`,
                order: 1
              },
              {
                id: 'content-func-video',
                type: 'video',
                title: 'Functions Deep Dive',
                videoUrl: 'https://www.youtube.com/embed/N8ap4k_1QEQ',
                duration: 12,
                order: 2
              }
            ]
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
            id: 'lesson-gameloop',
            title: 'Understanding the Game Loop',
            description: 'Core concept of game development',
            order: 1,
            completed: false,
            contentItems: [
              {
                id: 'content-gameloop-intro',
                type: 'text',
                title: 'What is a Game Loop?',
                content: `The game loop is the heart of every game. It runs continuously, typically 60 times per second.

Core Cycle:
1. Input - Handle player input (keyboard, mouse, controller)
2. Update - Update game state based on input and time
3. Render - Draw everything to the screen

This cycle repeats endlessly while the game is running.

Benefits:
• Smooth animation
• Real-time response to player input
• Consistent frame rate`,
                order: 1
              },
              {
                id: 'content-gameloop-img',
                type: 'image',
                title: 'Game Loop Diagram',
                imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect x=%2250%22 y=%2250%22 width=%22300%22 height=%22200%22 fill=%22%231a1a2e%22 stroke=%22%2300d4ff%22 stroke-width=%222%22 rx=%2210%22/%3E%3Ctext x=%22200%22 y=%2280%22 text-anchor=%22middle%22 fill=%22%2300d4ff%22 font-size=%2220%22 font-weight=%22bold%22%3EGame Loop%3C/text%3E%3Ccircle cx=%22100%22 cy=%22150%22 r=%2230%22 fill=%22%2300ff88%22/%3E%3Ctext x=%22100%22 y=%22160%22 text-anchor=%22middle%22 fill=%22%23000%22 font-weight=%22bold%22%3EInput%3C/text%3E%3Ccircle cx=%22200%22 cy=%22150%22 r=%2230%22 fill=%22%23ffd700%22/%3E%3Ctext x=%22200%22 y=%22160%22 text-anchor=%22middle%22 fill=%22%23000%22 font-weight=%22bold%22%3EUpdate%3C/text%3E%3Ccircle cx=%22300%22 cy=%22150%22 r=%2230%22 fill=%22%23ff6b6b%22/%3E%3Ctext x=%22300%22 y=%22160%22 text-anchor=%22middle%22 fill=%22%23fff%22 font-weight=%22bold%22%3ERender%3C/text%3E%3Cpath d=%22M 130 150 L 170 150%22 stroke=%22%2300d4ff%22 stroke-width=%222%22 marker-end=%22url(%23arrowhead)%22/%3E%3Cpath d=%22M 230 150 L 270 150%22 stroke=%22%2300d4ff%22 stroke-width=%222%22 marker-end=%22url(%23arrowhead)%22/%3E%3Cpath d=%22M 300 180 Q 200 220 100 180%22 stroke=%22%2300d4ff%22 stroke-width=%222%22 fill=%22none%22 marker-end=%22url(%23arrowhead)%22/%3E%3Cdefs%3E%3CmarkerPath id=%22arrowhead%22 markerWidth=%2210%22 markerHeight=%2210%22 refX=%229%22 refY=%223%22 orient=%22auto%22%3E%3Cpolygon points=%220 0, 10 3, 0 6%22 fill=%22%2300d4ff%22 /%3E%3C/marker%3E%3C/defs%3E%3C/svg%3E',
                order: 2
              }
            ]
          },
          {
            id: 'lesson-sprites',
            title: 'Sprites & Animation',
            description: 'Working with sprites and animations',
            order: 2,
            completed: false,
            contentItems: [
              {
                id: 'content-sprites-intro',
                type: 'text',
                title: 'What are Sprites?',
                content: `Sprites are 2D images or animations used to represent objects in games.

Creating Sprites in Phaser:
const player = this.add.sprite(200, 300, 'player');

Animating Sprites:
this.anims.create({
  key: 'walk',
  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
  frameRate: 10,
  repeat: -1
});

player.play('walk');

Key Properties:
• x, y - Position on screen
• scale - Size multiplier
• rotation - Rotation in radians
• alpha - Transparency (0-1)
• tint - Color overlay`,
                order: 1
              }
            ]
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
            id: 'lesson-ai',
            title: 'AI & Pathfinding',
            description: 'Implement AI behavior and pathfinding algorithms',
            order: 1,
            completed: false,
            contentItems: [
              {
                id: 'content-ai-intro',
                type: 'text',
                title: 'Introduction to Game AI',
                content: `Artificial Intelligence in games makes non-player characters behave intelligently.

Common AI Techniques:
• Pathfinding (A*, Dijkstra) - Find optimal routes
• State Machines - Define character behaviors
• Behavior Trees - Hierarchical decision systems
• Decision Making - React to game events
• Steering Behaviors - Movement and avoidance

AI enhances gameplay by:
• Creating challenging opponents
• Making NPCs feel alive
• Improving immersion
• Adapting to player actions`,
                order: 1
              },
              {
                id: 'content-ai-pathfinding',
                type: 'text',
                title: 'A* Pathfinding Algorithm',
                content: `The A* algorithm finds the shortest path between nodes.

How it works:
1. Start at the initial node
2. Evaluate neighboring nodes with cost = distance + heuristic
3. Choose the node with lowest cost
4. Repeat until destination is reached

Advantages:
• Efficient and fast
• Guarantees shortest path
• Works on grid or graph systems
• Widely used in games

Implementation in Phaser:
Use pathfinding plugins or implement custom algorithms
based on your game's needs.`,
                order: 2
              }
            ]
          },
          {
            id: 'lesson-particles',
            title: 'Particle Systems',
            description: 'Create visual effects with particle systems',
            order: 2,
            completed: false,
            contentItems: [
              {
                id: 'content-particles-intro',
                type: 'text',
                title: 'What are Particle Systems?',
                content: `Particle systems create visual effects using many small moving objects.

Common Effects:
• Explosions - Burst of particles outward
• Fire & Smoke - Rising or spreading particles
• Rain & Snow - Falling precipitation
• Magic Effects - Glowing or colored trails
• Dust - Environmental detail particles

Benefits:
• Realistic visual effects
• Better game feel
• Atmospheric depth
• Can be optimized for performance`,
                order: 1
              },
              {
                id: 'content-particles-exercise',
                type: 'exercise',
                title: 'Create Explosion Effect',
                exerciseCode: `// Create a particle emitter for explosions
const particles = this.add.particles(0xffffff);
const emitter = particles.createEmitter({
  speed: { min: -200, max: 200 },
  angle: { min: 240, max: 300 },
  scale: { start: 1, end: 0 },
  lifespan: 600,
  gravityY: 300
});

// Emit particles at position (x, y)
// emitter.emitParticleAt(x, y, 20);`,
                order: 2
              }
            ]
          }
        ]
      }
    ];
  }

  private buildTreeNodes(): void {
    this.treeNodes = this.levels.map(level => ({
      key: `level-${level.id}`,
      label: `${level.title}`,
      icon: 'pi pi-folder',
      data: {
        type: 'level',
        levelId: level.id
      },
      children: level.lessons.map(lesson => ({
        key: `lesson-${lesson.id}`,
        label: `📚 ${lesson.title}`,
        icon: 'pi pi-book',
        data: {
          type: 'lesson',
          levelId: level.id,
          lessonId: lesson.id,
          lesson: lesson
        },
        children: lesson.contentItems.map(content => ({
          key: `content-${content.id}`,
          label: `${this.getContentIcon(content.type)} ${content.title}`,
          icon: this.getContentPiIcon(content.type),
          data: {
            type: 'content',
            levelId: level.id,
            lessonId: lesson.id,
            contentId: content.id,
            content: content
          }
        }))
      }))
    }));
  }

  private expandTreeNodes(): void {
    this.treeNodes.forEach(node => {
      this.expandedKeys[node.key] = true;
      node.children?.forEach(child => {
        this.expandedKeys[child.key] = true;
      });
    });
  }

  selectLevel(level: Level): void {
    this.selectedLevel = level;
    this.calculateProgress();
  }

  selectLesson(lesson: Lesson, level: Level): void {
    this.selectedLesson = lesson;
    this.selectedLevel = level;
    this.currentContentIndex = 0;

    if (lesson.contentItems.length > 0) {
      this.selectedContent = lesson.contentItems[0];
    }

    this.calculateProgress();
  }

  onNodeSelect(event: any): void {
    const node = event.node;
    if (node.data) {
      if (node.data.type === 'lesson') {
        this.selectLesson(node.data.lesson, this.selectedLevel!);
      } else if (node.data.type === 'content' && node.data.content) {
        this.selectContent(node.data.content);
      }
    }
  }

  selectContent(content: ContentItem): void {
    this.selectedContent = content;
    if (this.selectedLesson) {
      this.currentContentIndex = this.selectedLesson.contentItems.findIndex(
        c => c.id === content.id
      );
    }
  }

  nextContent(): void {
    if (this.selectedLesson && this.currentContentIndex < this.selectedLesson.contentItems.length - 1) {
      this.currentContentIndex++;
      this.selectedContent = this.selectedLesson.contentItems[this.currentContentIndex];
    }
  }

  previousContent(): void {
    if (this.currentContentIndex > 0) {
      this.currentContentIndex--;
      this.selectedContent = this.selectedLesson!.contentItems[this.currentContentIndex];
    }
  }

  markAsCompleted(): void {
    if (this.selectedLesson) {
      this.selectedLesson.completed = true;
      this.calculateProgress();
    }
  }

  calculateProgress(): void {
    if (this.selectedLevel) {
      const total = this.selectedLevel.lessons.length;
      const completed = this.selectedLevel.lessons.filter(l => l.completed).length;
      this.completionProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
    }
  }

  getContentIcon(type: string): string {
    switch (type) {
      case 'text': return '📝';
      case 'video': return '🎬';
      case 'image': return '🖼️';
      case 'exercise': return '💪';
      default: return '📄';
    }
  }

  getContentPiIcon(type: string): string {
    switch (type) {
      case 'text': return 'pi pi-file-text';
      case 'video': return 'pi pi-video';
      case 'image': return 'pi pi-image';
      case 'exercise': return 'pi pi-code';
      default: return 'pi pi-file';
    }
  }

  hasNextContent(): boolean {
    return this.selectedLesson ? this.currentContentIndex < this.selectedLesson.contentItems.length - 1 : false;
  }

  hasPreviousContent(): boolean {
    return this.currentContentIndex > 0;
  }

  getContentProgress(): number {
    if (!this.selectedLesson) return 0;
    return Math.round(((this.currentContentIndex + 1) / this.selectedLesson.contentItems.length) * 100);
  }

  navigateToEditor(): void {
    if (this.selectedContent && this.selectedContent.type === 'exercise') {
      this.router.navigate(['/editor'], {
        state: {
          exerciseId: this.selectedContent.id,
          levelId: this.selectedLevel?.id,
          lessonId: this.selectedLesson?.id,
          starterCode: this.selectedContent.exerciseCode
        }
      });
    }
  }

  selectLevelForLearning(level: Level): void {
    this.selectedLevel = level;
    this.viewMode = 'learning';
    this.currentContentIndex = 0;
    
    if (level.lessons.length > 0) {
      const firstLesson = level.lessons[0];
      this.selectLesson(firstLesson, level);
    }
    this.calculateProgress();
  }

  isLevelUnlocked(level: Level): boolean {
    if (level.id === 'basics-101') return true;
    if (level.purchased) return true;
    if (level.requiredLevelId && level.requiredProgress) {
      const requiredLevel = this.levels.find(l => l.id === level.requiredLevelId);
      if (requiredLevel && requiredLevel.progress >= level.requiredProgress) {
        return true;
      }
    }
    return false;
  }

  getLevelButtonLabel(level: Level): string {
    if (!this.isLevelUnlocked(level)) {
      return 'Locked';
    }
    if (level.progress > 0) {
      return 'Continue Level';
    }
    return 'Start Level';
  }

  startLevel(level: Level): void {
    if (this.isLevelUnlocked(level)) {
      this.selectLevelForLearning(level);
    }
  }

  canPurchaseLevel(level: Level): boolean {
    // Can only purchase if level has a price and is not already unlocked
    if (!level.price || this.isLevelUnlocked(level)) {
      return false;
    }
    // If level has a required level, it must be unlocked before purchase
    if (level.requiredLevelId) {
      const requiredLevel = this.levels.find(l => l.id === level.requiredLevelId);
      if (requiredLevel && !this.isLevelUnlocked(requiredLevel)) {
        return false;
      }
    }
    return true;
  }

  goBackToLevels(): void {
    this.viewMode = 'levels';
    this.selectedLevel = null;
    this.selectedLesson = null;
    this.selectedContent = null;
  }

  purchaseLevel(level: Level): void {
    // Check if required level is unlocked before allowing purchase
    if (level.requiredLevelId) {
      const requiredLevel = this.levels.find(l => l.id === level.requiredLevelId);
      if (requiredLevel && !this.isLevelUnlocked(requiredLevel)) {
        alert(`You must unlock "${requiredLevel.title}" before purchasing this level`);
        return;
      }
    }

    if (level.price) {
      const confirmed = window.confirm(`Purchase "${level.title}" for $${level.price.toFixed(2)}?`);
      if (confirmed) {
        level.purchased = true;
        level.locked = false;
        console.log(`Level "${level.title}" purchased successfully!`);
      }
    }
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
}
