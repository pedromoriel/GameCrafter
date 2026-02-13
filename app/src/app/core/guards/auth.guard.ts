import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService, UserRole } from '../services/user.service';
import { firstValueFrom } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    // Wait for auth state to load
    const user = await firstValueFrom(
      this.authService.authState$.pipe(take(1))
    );

    if (!user) {

      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRole = route.data?.['role'] as UserRole | undefined;

    if (requiredRole) {
      try {
        const userProfile = await firstValueFrom(this.userService.getUserProfile(user.uid));

        if (!userProfile) {

          this.router.navigate(['/forbidden']);
          return false;
        }

        if (!this.hasRequiredRole(userProfile.role as UserRole, requiredRole)) {

          this.router.navigate(['/forbidden']);
          return false;
        }
      } catch (error) {

        this.router.navigate(['/auth/login']);
        return false;
      }
    }

    return true;
  }

  private hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.FREE]: 0,
      [UserRole.PREMIUM]: 1,
      [UserRole.PRO]: 2
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
}

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authGuardService = inject(AuthGuardService);
  return authGuardService.canActivate(route);
};
