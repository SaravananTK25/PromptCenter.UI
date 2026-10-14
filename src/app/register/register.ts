import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = ''; email = ''; password = ''; confirmPassword = ''; nameError = ''; emailError = ''; passwordError = ''; confirmPasswordError = ''; message = ''; isSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register(): void {


    this.message = ''; this.nameError = ''; this.emailError = ''; this.passwordError = ''; this.confirmPasswordError = '';

    if (!this.name.trim()) {
      this.nameError = 'Name is required.';
    }
    if (!this.email.trim()) {
      this.emailError = 'Email is required.';
    }
    else if (!this.isValidEmail(this.email)) {
      this.emailError = 'Please enter a valid email address.';
    }
    if (!this.password.trim()) {
      this.passwordError = 'Password is required.';
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters.';
    }
    if (!this.confirmPassword.trim()) {
      this.confirmPasswordError = 'Please confirm your password.';
    }
    else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match.';
    }
    if (this.nameError || this.emailError || this.passwordError || this.confirmPasswordError) {
      return;
    }

    this.authService.register(
      this.name,
      this.email,
      this.password
    ).subscribe({
      next: (response) => {

        this.isSuccess = true;
        this.message = response.message;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },

      error: (error) => {

        this.isSuccess = false;

        this.message =
          error.error?.message || 'Registration failed.';
      }
    });
  }
  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
