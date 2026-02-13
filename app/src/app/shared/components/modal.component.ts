import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

export interface ModalConfig {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  buttons?: ModalButton[];
}

export interface ModalButton {
  label: string;
  action: () => void;
  color?: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() config: ModalConfig | null = null;
  @Output() closed = new EventEmitter<void>();

  closeIcon = close;

  constructor(private cdr: ChangeDetectorRef) {
    addIcons({ close });
  }

  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  getIcon(): string {
    switch (this.config?.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  onButtonClick(button: ModalButton): void {
    button.action();
    this.onClose();
  }

  onClose(): void {
    this.isOpen = false;
    this.closed.emit();
  }
}
