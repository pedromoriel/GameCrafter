import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, UserRole, UserProfile } from '../../../core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

interface Plan {
  name: UserRole;
  title: string;
  price: string;
  description: string;
  games: string;
  features: string[];
  highlighted: boolean;
}

@Component({
  selector: 'app-select-plan',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    RouterModule,
    RouterLink
  ],
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent implements OnInit, OnDestroy {
  plans: Plan[] = [
    {
      name: UserRole.FREE,
      title: '🚀 Free',
      price: 'Free',
      description: 'Perfect for beginners',
      games: '3 games',
      features: [
        'Create up to 3 games',
        'Basic code editor',
        'Phaser integration',
        'Community access',
        'Email support'
      ],
      highlighted: false
    },
    {
      name: UserRole.PREMIUM,
      title: '⭐ Premium',
      price: '$9.99/mo',
      description: 'For aspiring developers',
      games: '10 games',
      features: [
        'Create up to 10 games',
        'Advanced code editor',
        'Phaser integration',
        'Priority support',
        'Game templates',
        'Asset store access'
      ],
      highlighted: true
    },
    {
      name: UserRole.PRO,
      title: '🔥 Pro',
      price: '$29.99/mo',
      description: 'For professional developers',
      games: 'Unlimited',
      features: [
        'Unlimited games',
        'Pro code editor',
        'Full Phaser integration',
        '24/7 priority support',
        'Premium templates',
        'Asset store access',
        'Custom domain support',
        'Team collaboration'
      ],
      highlighted: false
    }
  ];

  isLoading = false;
  selectedPlan: Plan | null = null;
  isUserAuthenticated = false;
  userProfile: UserProfile | null = null;
  currentRole: UserRole | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if we need to reload to ensure data is properly cached
    const hasReloaded = sessionStorage.getItem('select-plan-reloaded');
    
    // Monitor auth state changes in real-time
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.isUserAuthenticated = !!user;

        if (user) {
          // If user just logged in and we haven't reloaded yet, do it now
          if (!hasReloaded) {
            sessionStorage.setItem('select-plan-reloaded', 'true');
            window.location.reload();
            return;
          }
          
          this.loadUserProfile(user.uid);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up reload flag when leaving select-plan
    sessionStorage.removeItem('select-plan-reloaded');
  }

  private loadUserProfile(uid: string): void {
    this.userService
      .getUserProfile(uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          if (profile) {
            this.userProfile = profile;
            this.currentRole = profile.role;

            // If user is already PRO, redirect to home
            if (profile.role === UserRole.PRO) {
              this.router.navigate(['/home']);
            }
          }
        },
        error: (err) => {
          // Handle error silently
        }
      });
  }

  getButtonLabel(plan: Plan): string {
    // If user is starting fresh (no profile)
    if (!this.currentRole) {
      return 'Select Plan';
    }

    // If selecting the same plan they already have
    if (this.currentRole === plan.name) {
      return 'Current Plan';
    }

    // If upgrading to a higher tier
    if (this.isUpgradePrivate(plan.name)) {
      return 'Upgrade Now';
    }

    // If downgrading
    return 'Downgrade Plan';
  }

  isButtonDisabled(plan: Plan): boolean {
    // Disable if loading
    if (this.isLoading) {
      return true;
    }

    // Disable if selecting the current plan
    if (this.currentRole === plan.name) {
      return true;
    }

    // Disable if not authenticated
    if (!this.isUserAuthenticated) {
      return true;
    }

    return false;
  }

  isUpgrade(planName: UserRole): boolean {
    if (!this.currentRole) {
      return false;
    }

    const roleHierarchy = {
      [UserRole.FREE]: 0,
      [UserRole.PREMIUM]: 1,
      [UserRole.PRO]: 2
    };

    return roleHierarchy[planName] > roleHierarchy[this.currentRole];
  }

  private isUpgradePrivate(planName: UserRole): boolean {
    if (!this.currentRole) {
      return false;
    }

    const roleHierarchy = {
      [UserRole.FREE]: 0,
      [UserRole.PREMIUM]: 1,
      [UserRole.PRO]: 2
    };

    return roleHierarchy[planName] > roleHierarchy[this.currentRole];
  }

  selectPlan(plan: Plan): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      alert('Please log in or register first to select a plan');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isLoading = true;
    this.selectedPlan = plan;

    // Update user role in Firestore
    this.userService.updateUserProfile(currentUser.uid, { role: plan.name })
      .subscribe({
        next: () => {
          this.isLoading = false;
          // Clean up reload flag before navigating away
          sessionStorage.removeItem('select-plan-reloaded');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          alert('Error selecting plan: ' + err.message);
          this.isLoading = false;
        }
      });
  }
}
