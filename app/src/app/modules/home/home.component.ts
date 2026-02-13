import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService, GameCode } from '../../core/services/firebase.service';
import { UserService, UserProfile, UserRole } from '../../core/services/user.service';
import { GameActionsModalComponent } from '../../shared/components/game-actions-modal.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Level {
  id: string;
  title: string;
  emoji: string;
  progress: number;
  color: string;
}

interface Game {
  id: string;
  name: string;
  createdAt: Date;
  thumbnail?: string;
}

interface RecentLesson {
  id: string;
  title: string;
  levelTitle: string;
  lastAccessed: Date;
  emoji: string;
}

// Game limits by subscription tier
const GAME_LIMITS: Record<UserRole, number> = {
  [UserRole.FREE]: 3,
  [UserRole.PREMIUM]: 10,
  [UserRole.PRO]: Infinity
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule, GameActionsModalComponent, DialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  levels: Level[] = [];
  games: Game[] = [];
  recentLesson: RecentLesson | null = null;
  userProfile: UserProfile | null = null;
  userId: string | null = null;
  hasGames = false;
  hasRecentLesson = false;
  isLoading = true;

  // Modal properties
  gameActionsModalOpen = false;
  selectedGame: Game | null = null;
  gameUpgradeLimitReached = false;
  limitMessage = '';
  gameLimit = 3;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDashboardData();
  }

  private initializeDashboardData(): void {
    this.userId = this.authService.getCurrentUserId();
    
    if (!this.userId) {
      this.isLoading = false;
      this.setDefaultData();
      return;
    }

    // Load user profile
    this.userService.getUserProfile(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          if (profile) {
            this.setGameLimitByRole(profile.role);
          }
          this.loadLevelProgress();
        },
        error: (err) => {
          console.error('Error loading user profile:', err);
          this.setDefaultData();
        }
      });

    // Load games
    this.firebaseService.getUserGameCodes(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (gameCodes) => {
          if (gameCodes && gameCodes.length > 0) {
            this.games = gameCodes.map(game => ({
              id: game.id || '',
              name: game.name,
              createdAt: new Date(game.createdAt),
              thumbnail: '🎮'
            }));
            this.hasGames = true;
          } else {
            this.hasGames = false;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading games:', err);
          this.hasGames = false;
          this.isLoading = false;
        }
      });

    // Load recent lesson (mock for now)
    this.loadRecentLesson();
  }

  private setGameLimitByRole(role: UserRole): void {
    this.gameLimit = GAME_LIMITS[role];
  }

  private loadLevelProgress(): void {
    // Initialize levels with default 0% progress
    this.levels = [
      {
        id: 'basics-101',
        title: 'Beginner',
        emoji: '🟢',
        progress: 0,
        color: '#00ff88'
      },
      {
        id: 'game-dev-201',
        title: 'Intermediate',
        emoji: '🟡',
        progress: 0,
        color: '#ffd700'
      },
      {
        id: 'advanced-301',
        title: 'Advanced',
        emoji: '🔴',
        progress: 0,
        color: '#ff6b6b'
      }
    ];

    // TODO: Load real progress from user data
    // For now, levels default to 0% progress
  }

  private loadRecentLesson(): void {
    // TODO: Load from Firestore recent lesson access history
    // For now, we show null which triggers "Start Learning" view
    this.hasRecentLesson = false;
    this.recentLesson = null;
  }

  private setDefaultData(): void {
    this.gameLimit = GAME_LIMITS[UserRole.FREE];
    this.levels = [
      {
        id: 'basics-101',
        title: 'Beginner',
        emoji: '🟢',
        progress: 0,
        color: '#00ff88'
      },
      {
        id: 'game-dev-201',
        title: 'Intermediate',
        emoji: '🟡',
        progress: 0,
        color: '#ffd700'
      },
      {
        id: 'advanced-301',
        title: 'Advanced',
        emoji: '🔴',
        progress: 0,
        color: '#ff6b6b'
      }
    ];
    this.hasGames = false;
    this.hasRecentLesson = false;
  }

  // Game Actions Modal Methods
  openGameActionsModal(game: Game, action?: string): void {
    this.selectedGame = game;
    this.gameUpgradeLimitReached = false;

    // Check if we're at the limit for clone or new game creation
    if ((action === 'clone' || action === 'new') && this.games.length >= this.gameLimit) {
      this.gameUpgradeLimitReached = true;
      this.limitMessage = `Your ${this.userProfile?.role || 'Free'} plan allows up to ${this.gameLimit} games. Upgrade to create more!`;
    }

    this.gameActionsModalOpen = true;
  }

  onGameActionTriggered(action: string): void {
    if (!this.selectedGame) return;

    switch (action) {
      case 'edit':
        this.editGame(this.selectedGame);
        break;
      case 'delete':
        this.deleteGame(this.selectedGame);
        break;
      case 'clone':
        if (this.games.length < this.gameLimit) {
          this.cloneGame(this.selectedGame);
        } else {
          this.openGameActionsModal(this.selectedGame, 'clone');
        }
        break;
    }
  }

  private editGame(game: Game): void {
    this.router.navigate(['/editor', game.id]);
  }

  private deleteGame(game: Game): void {
    if (!this.userId) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${game.name}"?`);
    if (confirmed && game.id) {
      this.firebaseService.deleteGameCode(game.id).then(() => {
        // Remove from local list
        this.games = this.games.filter(g => g.id !== game.id);
        this.hasGames = this.games.length > 0;
        console.log(`Game "${game.name}" deleted successfully`);
      }).catch(error => {
        console.error('Error deleting game:', error);
      });
    }
  }

  private cloneGame(game: Game): void {
    if (!this.userId || this.games.length >= this.gameLimit) {
      this.openGameActionsModal(game, 'clone');
      return;
    }

    const cloneName = `${game.name} (Clone)`;
    const confirmed = window.confirm(`Clone "${game.name}" as "${cloneName}"?`);
    
    if (confirmed) {
      // Fetch the original game code first
      // For now, create a simple clone with a new name
      const newGame: GameCode = {
        name: cloneName,
        code: `// Cloned from: ${game.name}\n// Write your game code here...`,
        userId: this.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: `Clone of ${game.name}`
      };

      this.firebaseService.saveGameCode(newGame).then((gameId) => {
        // Add to local list
        this.games.push({
          id: gameId,
          name: cloneName,
          createdAt: new Date(),
          thumbnail: '🎮'
        });
        this.hasGames = true;
        console.log(`Game cloned successfully as "${cloneName}"`);
        // Navigate to editor with the new game
        this.router.navigate(['/editor', gameId]);
      }).catch(error => {
        console.error('Error cloning game:', error);
      });
    }
  }

  onGameActionModalUpgrade(): void {
    this.router.navigate(['/select-plan']);
  }

  continueLesson(): void {
    if (this.recentLesson) {
      console.log('Continuing lesson:', this.recentLesson);
    }
  }

  getFormattedDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    const days = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days ago`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
