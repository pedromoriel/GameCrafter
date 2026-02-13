import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicGuardService {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // Wait for auth state to load
    const user = await firstValueFrom(
      this.authService.authState$.pipe(take(1))
    );

    if (user) {

      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}

export const publicGuard: CanActivateFn = async () => {
  const publicGuardService = inject(PublicGuardService);
  return publicGuardService.canActivate();
};
