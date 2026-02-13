import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaserService, GameConfig } from '../services/phaser.service';

@Component({
  selector: 'app-game-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-canvas.component.html',
  styleUrls: ['./game-canvas.component.scss']
})
export class GameCanvasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() gameCode!: string;
  @Input() gameConfig: GameConfig = {
    canvasId: 'game-canvas',
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2e',
    debug: false
  };

  @ViewChild('gameCanvas') gameCanvas!: ElementRef;

  constructor(private phaserService: PhaserService) {}

  ngOnInit(): void {
    if (this.gameCode) {
      this.initializeGame();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reinitialize the game when the code changes
    if (changes['gameCode'] && !changes['gameCode'].firstChange) {
      this.phaserService.destroyGame();
      // Use setTimeout to allow DOM to update
      setTimeout(() => {
        this.initializeGame();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.phaserService.destroyGame();
  }

  private initializeGame(): void {
    if (!this.gameCode) {
      return;
    }
    this.phaserService.initializeGame(this.gameConfig, this.gameCode).then(
      () => {
        // Game initialized successfully
      }
    ).catch(() => {
      // Handle game initialization error silently
    });
  }

  onPlayClick(): void {
    this.phaserService.resumeGame();
  }

  onPauseClick(): void {
    this.phaserService.pauseGame();
  }

  onResetClick(): void {
    this.phaserService.destroyGame();
    this.initializeGame();
  }
}
