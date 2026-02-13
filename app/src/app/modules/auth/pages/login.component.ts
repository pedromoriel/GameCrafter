import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule, CardModule, ProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    try {
      const result = await this.authService
        .signInWithEmail(this.email, this.password);
      
      // Check if user profile exists in Firestore
      const userExists = await this.userService.userExists(result.user.uid);
      
      if (!userExists) {
        // New user (rare case, but handle it) - redirect to plan selection
        this.router.navigate(['/select-plan']);
      } else {
        // Existing user - redirect to home
        this.router.navigate(['/home']);
      }
    } catch (error) {
      alert('Login failed: ' + (error as any).message);
    } finally {
      this.isLoading = false;
    }
  }

  async onGoogleLogin(): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.authService.signInWithGoogle();
      
      // Check if user exists in Firestore
      const userExists = await this.userService.userExists(result.user.uid);
      
      const photoURL = result.user.photoURL || undefined;
      
      if (!userExists) {
        // New user - create profile and redirect to plan selection
        try {
          await this.userService.createUserProfile(
            result.user.uid,
            result.user.email || '',
            result.user.displayName || 'Google User',
            photoURL
          ).toPromise();
          
          // Verify profile was created by reading it back from Firestore
          let profileLoaded = false;
          let attempts = 0;
          const maxAttempts = 5;
          
          while (!profileLoaded && attempts < maxAttempts) {
            try {
              const profile = await this.userService.getUserProfile(result.user.uid)
                .toPromise();
              if (profile) {
                profileLoaded = true;
              } else {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 200));
              }
            } catch (err) {
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          }
          
          if (!profileLoaded) {
            throw new Error('Profile failed to load. Please try again.');
          }
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error('Failed to create user profile. Please try again.');
        }
        
        this.router.navigate(['/select-plan']);
      } else {
        // Existing user - redirect to home
        this.router.navigate(['/home']);
      }
    } catch (error) {
      alert('Google login failed: ' + (error as any).message);
      this.isLoading = false;
    }
  }
}
