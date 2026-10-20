import { Component } from '@angular/core';
import { HomeButtonComponent } from '../shared/home-button/home-button';

@Component({
  selector: 'app-about',
  standalone: true,
   imports: [HomeButtonComponent],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
}