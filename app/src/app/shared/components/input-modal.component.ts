import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface InputModalConfig {
  title: string;
  placeholder?: string;
  defaultValue?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-input-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss']
})
export class InputModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() config: InputModalConfig | null = null;
  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('inputField') inputField!: ElementRef;

  inputValue = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if (this.isOpen && this.config) {
      this.inputValue = this.config.defaultValue || '';
      // Focus input after view updates
      setTimeout(() => {
        this.inputField?.nativeElement?.focus();
        this.inputField?.nativeElement?.select();
      }, 100);
    }
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
        return '✎';
    }
  }

  onConfirm(): void {
    if (this.inputValue.trim()) {
      this.confirmed.emit(this.inputValue);
      this.inputValue = '';
    }
  }

  onCancel(): void {
    this.inputValue = '';
    this.cancelled.emit();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onConfirm();
    }
  }
}
