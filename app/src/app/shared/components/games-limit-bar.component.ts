import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../core/services/user.service';

@Component({
  selector: 'app-games-limit-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games-limit-bar.component.html',
  styleUrls: ['./games-limit-bar.component.scss']
})
export class GamesLimitBarComponent {
  @Input() gameCount = 0;
  @Input() gameLimit = 3;
  @Input() userRole = 'free';
  
  // Expose Infinity to template
  readonly Infinity = Number.POSITIVE_INFINITY;

  getProgressPercentage(): number {
    if (this.gameLimit === Infinity) {
      return 0;
    }
    return (this.gameCount / this.gameLimit) * 100;
  }

  getProgressClass(): string {
    const percentage = this.getProgressPercentage();
    if (percentage < 60) return 'low';
    if (percentage < 85) return 'medium';
    return 'high';
  }
}
