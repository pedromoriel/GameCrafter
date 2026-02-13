import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
  imports: [CommonModule, CodeEditorComponent, GameCanvasComponent, ModalComponent, InputModalComponent, GamesLimitBarComponent, TranslateModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  programmingLanguage: 'javascript' | 'typescript' = 'javascript';

  gameCode = `// Phaser 3 - Space Shooter Game
class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }

  create() {
    // Crear la nave espacial (triángulo usando gráficos)
    this.ship = this.add.graphics();
    this.ship.fillStyle(0x00d4ff, 1);
    this.ship.beginPath();
    this.ship.moveTo(400, 250); // Punta superior
    this.ship.lineTo(370, 300); // Esquina inferior izquierda
    this.ship.lineTo(430, 300); // Esquina inferior derecha
    this.ship.closePath();
    this.ship.fillPath();
    this.ship.x = 0;
    this.ship.y = 0;

    // Propiedades de la nave
    this.shipX = 400;
    this.shipY = 300;
    this.shipSpeed = 5;

    // Array para almacenar municiones
    this.bullets = this.add.group();

    // Texto de título
    this.add.text(400, 40, 'Space Shooter', {
      color: '#00d4ff',
      fontSize: '28px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Crear controles transparentes
    this.createControls();

    // Propiedades de controles
    this.leftPressed = false;
    this.rightPressed = false;
    this.firePressed = false;

    // Input desde teclado también
    this.input.keyboard.on('keydown-LEFT', () => {
      this.leftPressed = true;
    });
    this.input.keyboard.on('keyup-LEFT', () => {
      this.leftPressed = false;
    });
    this.input.keyboard.on('keydown-RIGHT', () => {
      this.rightPressed = true;
    });
    this.input.keyboard.on('keyup-RIGHT', () => {
      this.rightPressed = false;
    });
    this.input.keyboard.on('keydown-SPACE', () => {
      this.fireProjectile();
    });
  }

  createControls() {
    const controlsY = 520; // Posición en la parte baja
    const buttonWidth = 80;
    const buttonHeight = 80;
    const padding = 20;

    // ===== CONTROLES DE MOVIMIENTO (LADO IZQUIERDO) =====
    
    // Botón flecha izquierda
    const leftButton = this.add.rectangle(60, controlsY, buttonWidth, buttonHeight, 0x666666, 0.5);
    leftButton.setInteractive();
    leftButton.on('pointerdown', () => {
      this.leftPressed = true;
    });
    leftButton.on('pointerup', () => {
      this.leftPressed = false;
    });
    leftButton.on('pointerout', () => {
      this.leftPressed = false;
    });

    // Agregar flecha izquierda visual (más grande)
    this.add.text(60, controlsY, '◀', {
      color: '#00d4ff',
      fontSize: '48px'
    }).setOrigin(0.5).setDepth(1);

    // Botón flecha derecha
    const rightButton = this.add.rectangle(180, controlsY, buttonWidth, buttonHeight, 0x666666, 0.5);
    rightButton.setInteractive();
    rightButton.on('pointerdown', () => {
      this.rightPressed = true;
    });
    rightButton.on('pointerup', () => {
      this.rightPressed = false;
    });
    rightButton.on('pointerout', () => {
      this.rightPressed = false;
    });

    // Agregar flecha derecha visual (más grande)
    this.add.text(180, controlsY, '▶', {
      color: '#00d4ff',
      fontSize: '48px'
    }).setOrigin(0.5).setDepth(1);

    // ===== BOTÓN DE DISPARO (LADO DERECHO - REDONDO) =====
    
    // Crear un círculo para el botón de disparo
    const fireButton = this.add.circle(740, controlsY, 50, 0x00d4ff, 0.6);
    fireButton.setInteractive();
    fireButton.on('pointerdown', () => {
      this.fireProjectile();
    });

    // Agregar texto al botón de disparo
    this.add.text(740, controlsY, 'FIRE', {
      color: '#ffffff',
      fontSize: '18px',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1);
  }

  fireProjectile() {
    // Crear munición
    const bullet = this.add.rectangle(this.shipX, this.shipY - 30, 5, 15, 0x00ff00);
    bullet.setData('velocityY', -7);

    this.bullets.add(bullet);
  }

  update() {
    // Mover la nave a la izquierda
    if (this.leftPressed && this.shipX > 30) {
      this.shipX -= this.shipSpeed;
    }

    // Mover la nave a la derecha
    if (this.rightPressed && this.shipX < 770) {
      this.shipX += this.shipSpeed;
    }

    // Actualizar posición de la nave
    this.ship.clear();
    this.ship.fillStyle(0x00d4ff, 1);
    this.ship.beginPath();
    this.ship.moveTo(this.shipX, this.shipY); // Punta superior
    this.ship.lineTo(this.shipX - 30, this.shipY + 50); // Esquina inferior izquierda
    this.ship.lineTo(this.shipX + 30, this.shipY + 50); // Esquina inferior derecha
    this.ship.closePath();
    this.ship.fillPath();

    // Actualizar municiones
    this.bullets.children.entries.forEach((bullet) => {
      bullet.y += bullet.getData('velocityY');

      // Eliminar munición si sale de pantalla
      if (bullet.y < 0) {
        bullet.destroy();
      }
    });
  }
}

// Configuración de Phaser
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MyScene,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);`;
  
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

  changeProgrammingLanguage(language: 'javascript' | 'typescript'): void {
    this.programmingLanguage = language;
    this.cdr.markForCheck();
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

