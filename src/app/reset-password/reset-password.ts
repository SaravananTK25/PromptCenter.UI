import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent implements OnInit {

  token = '';

  newPassword = '';
  confirmPassword = '';

  newPasswordError = '';
  confirmPasswordError = '';
  tokenError = '';

  message = '';
  errorMessage = '';

  isLoading = false;
  passwordReset = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.token = params['token'] || '';

      if (!this.token) {
        this.errorMessage = 'Invalid or missing password reset link.';
      }

    });
  }

  resetPassword(): void {
debugger
    this.tokenError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';
    this.errorMessage = '';
    this.message = '';

    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token.';
      return;
    }
    // Validate confirmation
    if (!this.confirmPassword.trim()) { 
      this.confirmPasswordError = 'Please confirm your password.'; 
    }

    if (!this.newPassword.trim()) {
      this.newPasswordError = 'Password is required.';
    }
    
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please enter your new password.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(
      this.token,
      this.newPassword
    ).subscribe({

      next: (response: any) => {

        this.isLoading = false;
        this.passwordReset = true;

        this.message =
          response.message ||
          'Password reset successfully.';
      },

      error: (error) => {

        this.isLoading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to reset password. Please try again.';
      }

    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}