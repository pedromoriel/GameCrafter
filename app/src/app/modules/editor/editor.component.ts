import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CodeEditorComponent } from '../../shared/components/code-editor.component';
import { GameCanvasComponent } from '../../shared/components/game-canvas.component';
import { ModalComponent, ModalConfig, ModalButton } from '../../shared/components/modal.component';
import { InputModalComponent, InputModalConfig } from '../../shared/components/input-modal.component';
import { GamesLimitBarComponent } from '../../shared/components/games-limit-bar.component';
import { FirebaseService, GameCode } from '../../core/services/firebase.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService, UserRole, UserProfile } from '../../core/services/user.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, CodeEditorComponent, GameCanvasComponent, ModalComponent, InputModalComponent, GamesLimitBarComponent],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  gameCode = `
// Example: Simple Phaser Game
class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }

  create() {
    // Add a sprite
    this.add.rectangle(400, 300, 100, 100, 0x00d4ff);

    // Add text
    this.add.text(400, 100, 'Hello GameCrafter!', {
      color: '#00d4ff',
      fontSize: '24px'
    }).setOrigin(0.5);
  }
}
  `;
  
  public displayedCode = '';
  userProfile: UserProfile | null = null;
  gameCount = 0;
  gameLimit = 3; // Default to Free tier

  // Modal properties
  modalIsOpen = false;
  modalConfig: ModalConfig | null = null;
  
  // Input modal properties
  inputModalIsOpen = false;
  inputModalConfig: InputModalConfig | null = null;
  pendingCode: string = '';

  // Cleanup
  private destroy$ = new Subject<void>();

  gameConfig = {
    canvasId: 'game-canvas',
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2e',
    debug: false
  };

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.userService.getUserProfile(currentUser.uid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (profile) => {
            if (profile) {
              this.userProfile = profile;
              this.setGameLimitByRole(profile.role);
              this.countUserGames(currentUser.uid);
            }
          }
        );
    }
  }

  private setGameLimitByRole(role: UserRole): void {
    switch (role) {
      case UserRole.FREE:
        this.gameLimit = 3;
        break;
      case UserRole.PREMIUM:
        this.gameLimit = 10;
        break;
      case UserRole.PRO:
        this.gameLimit = Infinity;
        break;
    }
  }

  private countUserGames(userId: string): void {
    this.firebaseService.countUserGameCodes(userId).then(count => {
      this.gameCount = count;
      this.cdr.markForCheck();
    }).catch(error => {
      // Handle error silently
    });
  }

  onRunCode(code: string): void {
    this.displayedCode = code;
  }

  onSaveCode(code: string): void {
    // Check limit BEFORE asking for name
    if (this.gameCount >= this.gameLimit) {
      this.showModal('save-limit', {
        title: 'Game Limit Reached',
        message: `You have reached the limit of ${this.gameLimit} games for your ${this.userProfile?.role.toUpperCase()} plan. Please delete a game or upgrade your plan.`,
        type: 'warning',
        buttons: [
          {
            label: 'Understand',
            action: () => {}
          }
        ]
      });
      return;
    }

    // Show input modal to get project name
    this.pendingCode = code;
    this.showInputModal({
      title: 'Save Your Game Project',
      placeholder: 'Enter project name...',
      defaultValue: 'My Game',
      type: 'info'
    });
  }

  private showModal(id: string, config: ModalConfig): void {
    this.modalConfig = config;
    this.modalIsOpen = true;
    this.cdr.markForCheck();
  }

  private showInputModal(config: InputModalConfig): void {
    this.inputModalConfig = config;
    this.inputModalIsOpen = true;
    this.cdr.markForCheck();
  }

  onInputModalConfirmed(projectName: string): void {
    this.inputModalIsOpen = false;
    this.inputModalConfig = null;
    this.saveGameWithName(projectName, this.pendingCode);
  }

  onInputModalCancelled(): void {
    this.inputModalIsOpen = false;
    this.inputModalConfig = null;
    this.pendingCode = '';
  }

  private saveGameWithName(projectName: string, code: string): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.showModal('not-logged-in', {
        title: 'Not Logged In',
        message: 'You must be logged in to save code',
        type: 'error',
        buttons: [
          {
            label: 'Understood',
            action: () => {}
          }
        ]
      });
      return;
    }

    const gameCodeData: GameCode = {
      name: projectName,
      code: code,
      userId: currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: `Game project created with GameCrafter`
    };

    this.firebaseService.saveGameCode(gameCodeData).then(
      (docId) => {
        this.showModal('save-success', {
          title: 'Code Saved Successfully',
          message: `Your game "${projectName}" has been saved! (ID: ${docId})`,
          type: 'success',
          buttons: [
            {
              label: 'Great!',
              action: () => {
                // Reload game count to reflect the new save
                const userId = this.authService.getCurrentUser()?.uid;
                if (userId) {
                  this.countUserGames(userId);
                }
              }
            }
          ]
        });
      }
    ).catch((error) => {
      this.showModal('save-error', {
        title: 'Save Error',
        message: `Error saving code: ${error.message}`,
        type: 'error',
        buttons: [
          {
            label: 'Retry',
            action: () => {}
          }
        ]
      });
    });
  }

  onModalClosed(): void {
    this.modalIsOpen = false;
    this.modalConfig = null;
  }
}

