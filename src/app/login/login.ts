import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  emailError = '';
  passwordError = '';
  loginMessage = '';
  showErrorPopup = false;
  errorPopupMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  login(): void {
    // Clear previous validation messages 
    this.emailError = '';
    this.passwordError = '';
    // Close previous popup
    this.showErrorPopup = false;
    this.loginMessage = '';
    // Validate email
    if (!this.email.trim()) {
      this.emailError = 'Email is required.';
    }

    // Validate password 
    if (!this.password.trim()) {
      this.passwordError = 'Password is required.';
    }

    // Stop here if validation failed 
    if (this.emailError || this.passwordError) {
      return;
    }

    this.authService.login(
      this.email,
      this.password
    ).subscribe({

      next: (response) => {

        this.authService.saveLoginData(response);

        this.loginMessage = 'Login successful!';

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      },

      error: (error) => {
      

        this.errorPopupMessage =
          'Incorrect email or password. Please try again.';

        this.showErrorPopup = true;        

        // Force Angular to update the UI
        this.cdr.detectChanges();        
      }
    });
  }

  closeErrorPopup(): void {
    this.showErrorPopup = false;
    this.cdr.detectChanges();
  }

  skipLogin(): void {
    this.router.navigate(['/dashboard']);
  }
}