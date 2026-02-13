import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { UserService, UserRole, UserProfile } from '../../core/services/user.service';
import { LanguageService } from '../../core/services/language.service';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil, filter, shareReplay, startWith, retry } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AvatarModule,
    MenuModule,
    ButtonModule,
    TagModule,
    RippleModule,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userProfile$: Observable<UserProfile | null> = of(null);
  profileMenuItems: MenuItem[] = [];
  currentLanguage$: Observable<string>;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.currentLanguage$ = this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.loadUserInfo();
    this.initializeMenus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserInfo(): void {
    // Monitor auth state changes and load user profile
    // Use shareReplay to cache the profile data for all subscribers
    this.userProfile$ = this.authService.authState$.pipe(
      filter(user => !!user),
      switchMap(user => 
        this.userService.getUserProfile(user!.uid).pipe(
          retry({
            count: 3,
            delay: 500
          })
        )
      ),
      startWith(null),
      shareReplay(1),
      takeUntil(this.destroy$)
    );
  }

  private initializeMenus(): void {
    this.profileMenuItems = [
      {
        label: 'Profile Settings',
        icon: 'pi pi-cog',
        routerLink: ['/profile']
      },
      {
        label: 'My Games',
        icon: 'pi pi-gamepad',
        routerLink: ['/editor']
      },
      {
        separator: true
      },
      {
        label: 'Language',
        icon: 'pi pi-globe',
        items: [
          {
            label: 'English',
            command: () => this.changeLanguage('en')
          },
          {
            label: 'Español',
            command: () => this.changeLanguage('es')
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout()
      }
    ];
  }

  getInitials(displayName?: string): string {
    if (!displayName) return '?';
    return displayName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }

  getRoleSeverity(role?: UserRole | undefined): 'success' | 'info' | 'secondary' | 'warn' | 'danger' | 'contrast' | null | undefined {
    if (!role) return 'info';
    if (role === UserRole.FREE) return 'secondary';
    if (role === UserRole.PREMIUM) return 'warn';
    if (role === UserRole.PRO) return 'success';
    return 'info';
  }

  onLogout(): void {
    // Clean up session storage flags
    sessionStorage.removeItem('select-plan-reloaded');
    
    this.authService.signOut().then(() => {
      this.router.navigate(['/auth/login']);
    }).catch(() => {
      // Handle logout error silently
    });
  }

  changeLanguage(lang: 'en' | 'es'): void {
    this.languageService.setLanguage(lang);
    
    // Update user profile language preference
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userService.updateUserProfile(currentUser.uid, { language: lang })
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.cdr.markForCheck();
          },
          () => {
            // Handle error silently - language is changed even if profile update fails
          }
        );
    }
  }
}
