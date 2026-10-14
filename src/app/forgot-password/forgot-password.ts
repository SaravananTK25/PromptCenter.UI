import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPasswordComponent {

 email = ''; emailError = ''; message = ''; errorMessage = ''; submitted = false; loading = false; resetLink = '';

  constructor(public authService: AuthService, private cdr: ChangeDetectorRef) { }

  onSubmit(): void {
debugger
    this.emailError = '';
    this.errorMessage = '';
    this.message = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.loading = true;

    this.authService.forgotPassword(this.email).subscribe({

      next: (response: any) => {

        this.loading = false;
        this.submitted = true;

        this.message =
          response.message ||
          'If an account exists with this email, password reset instructions have been generated.';

        // Development only
        if (response.resetToken) {

          this.resetLink =
            `${window.location.origin}/reset-password?token=${encodeURIComponent(response.resetToken)}`;
          this.cdr.detectChanges();          
        }
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Something went wrong. Please try again.';
      }

    });
  }
  copyResetLink(): void {

    if (!this.resetLink) {
      return;
    }
    this.cdr.detectChanges();
    navigator.clipboard.writeText(this.resetLink);

    this.message = 'Reset link copied.';
  }
}