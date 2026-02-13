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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule, CardModule, ProgressSpinnerModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  displayName = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async onRegister(): Promise<void> {
    if (!this.displayName || !this.email || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.isLoading = true;
    try {
      const result = await this.authService.signUpWithEmail(this.email, this.password);
      
      // Create user profile in Firestore
      try {
        await this.userService.createUserProfile(
          result.user.uid,
          this.email,
          this.displayName
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

      // Redirect to plan selection
      this.router.navigate(['/select-plan']);
    } catch (error) {
      alert('Registration failed: ' + (error as any).message);
      this.isLoading = false;
    }
  }
}
