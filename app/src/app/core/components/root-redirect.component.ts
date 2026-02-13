import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root-redirect',
  standalone: true,
  template: '',
  styles: []
})
export class RootRedirectComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  async ngOnInit() {
    const user = await firstValueFrom(
      this.authService.authState$.pipe(take(1))
    );

    if (user) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
