import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-button',
  standalone: true,
  templateUrl: './home-button.html',
  styleUrl: './home-button.css'
})
export class HomeButtonComponent {

  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}