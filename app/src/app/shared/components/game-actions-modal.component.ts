import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

export interface GameAction {
  type: 'edit' | 'delete' | 'clone' | 'upgrade';
  label: string;
  icon: string;
  severity?: 'success' | 'secondary' | 'info' | 'help' | 'danger';
}

@Component({
  selector: 'app-game-actions-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonModule, DialogModule],
  template: `
    <p-dialog
      [(visible)]="isOpen"
      [header]="modalTitle"
      [modal]="true"
      [style]="{ width: '100%', maxWidth: '600px' }"
      [showHeader]="true"
      styleClass="adoc-modal"
      [baseZIndex]="1000"
      (onHide)="onClose()">
      
      <!-- Game Actions List -->
      <div *ngIf="!upgradeLimitReached" class="game-actions-list">
        <button
          *ngFor="let action of availableActions"
          pButton
          [label]="action.label"
          [icon]="action.icon"
          [severity]="action.severity || 'info'"
          class="w-full game-action-btn"
          (click)="onActionClick(action.type)">
        </button>
      </div>

      <!-- Upgrade Message -->
      <div *ngIf="upgradeLimitReached" class="upgrade-message">
        <div class="upgrade-icon">📦</div>
        <h3>Game Limit Reached</h3>
        <p>You've reached the maximum number of games for your current plan.</p>
        <p class="limit-info">{{ limitMessage }}</p>
        <button
          pButton
          label="View Plans"
          icon="pi pi-arrow-up-right"
          class="w-full upgrade-btn"
          (click)="onUpgrade()">
        </button>
      </div>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep {
      .adoc-modal {
        .p-dialog-mask {
          background-color: rgba(0, 0, 0, 0.8);
        }

        .p-dialog-header {
          background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
          border-bottom: 1px solid rgba(0, 212, 255, 0.2);
          padding: 28px;

          .p-dialog-title {
            color: #e0e0e0;
            font-weight: 600;
            font-size: 22px;
            letter-spacing: 0.5px;
          }
        }

        .p-dialog-content {
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(26, 26, 46, 0.95) 100%);
          padding: 35px;
          color: #e0e0e0;
          border: 1px solid rgba(0, 212, 255, 0.15);
        }
      }

      .game-actions-list {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .game-action-btn {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #e0e0e0;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 13px 28px !important;
          font-size: 16px !important;
          height: 48px;

          &:hover {
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 212, 255, 0.1) 100%);
            border-color: rgba(0, 212, 255, 0.5);
            transform: translateY(-2px);
          }

          &.p-button-danger {
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);
            border-color: rgba(255, 107, 107, 0.3);
            color: #ff9999;

            &:hover {
              background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%);
              border-color: rgba(255, 107, 107, 0.5);
            }
          }
        }
      }

      .upgrade-message {
        text-align: center;
        padding: 40px 0;

        .upgrade-icon {
          font-size: 64px;
          margin-bottom: 25px;
          opacity: 0.95;
        }

        h3 {
          font-size: 24px;
          color: #e0e0e0;
          margin: 25px 0;
          font-weight: 600;
        }

        p {
          font-size: 16px;
          color: #888;
          margin: 14px 0;
          line-height: 1.7;
        }

        .limit-info {
          color: #00d4ff;
          font-weight: 600;
          margin: 25px 0 35px 0;
          font-size: 17px;
        }

        .upgrade-btn {
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
          border: none;
          color: #0f0f1e;
          font-weight: 600;
          margin-top: 25px;
          padding: 13px 35px !important;
          font-size: 16px !important;
          height: 48px;

          &:hover {
            background: linear-gradient(135deg, #1aff99 0%, #1ae6ff 100%);
          }
        }
      }
    }
  `]
})
export class GameActionsModalComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Input() gameName: string = '';
  @Input() upgradeLimitReached = false;
  @Input() limitMessage: string = '';
  @Input() availableActions: GameAction[] = [
    { type: 'edit', label: 'Edit', icon: 'pi pi-pencil', severity: 'info' },
    { type: 'clone', label: 'Clone & Edit', icon: 'pi pi-copy', severity: 'info' },
    { type: 'delete', label: 'Delete', icon: 'pi pi-trash', severity: 'danger' }
  ];

  @Output() actionTriggered = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();
  @Output() upgradeClicked = new EventEmitter<void>();

  get modalTitle(): string {
    return this.upgradeLimitReached ? 'Upgrade Your Plan' : `${this.gameName}`;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  onActionClick(action: string): void {
    this.actionTriggered.emit(action);
    this.onClose();
  }

  onUpgrade(): void {
    this.upgradeClicked.emit();
    this.onClose();
  }

  onClose(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.closed.emit();
  }
}
