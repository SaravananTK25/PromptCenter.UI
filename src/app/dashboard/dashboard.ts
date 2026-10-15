import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { PromptService } from '../services/prompt';
import { Prompt } from '../models/prompt.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
showCopySuccess = false;
  userName = '';
  userRole = '';
  userInitial = '';
  prompts: Prompt[] = [];
  filteredPrompts: Prompt[] = [];
  favoritePrompts: number[] = [];
  selectedCategory: string = 'All';
  selectedPrompt: Prompt | null = null;
  showFavorites: boolean = false;
  isLoggedIn = false;
  showLoginRequired = false;
  showLogoutModal = false;
  selectedDemoImageUrl: string = '';

  constructor(
    private promptService: PromptService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userName = this.authService.getUserName();
    this.userRole = this.authService.getUserRole();
    this.userRole = this.authService.getUserRole();
    this.userInitial = this.authService.getUserInitial();

    this.loadPrompts();
    if (this.isLoggedIn) {
      this.loadFavorites();
    }
  }
  loadFavorites(): void {

    this.promptService.getFavorites().subscribe({

      next: (favorites: any[]) => {

        this.favoritePrompts =
          favorites.map(favorite => favorite.promptId);

        this.applyFilters();

        this.cdr.detectChanges();
      },

      error: (error) => {    
      }

    });
  }
  showFavoritePrompts(): void {

    if (!this.authService.isLoggedIn()) {

      this.showLoginRequired = true;

      return;
    }

    this.showFavorites = true;

    this.applyFilters();
  }
  applyFilters(searchText: string = ''): void {

    const search = searchText.toLowerCase().trim();

    this.filteredPrompts = this.prompts.filter(prompt => {

      const matchesSearch =
        !search ||
        prompt.title.toLowerCase().includes(search) ||
        prompt.promptText.toLowerCase().includes(search) ||
        prompt.category.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        prompt.category.toLowerCase() ===
        this.selectedCategory.toLowerCase();

      const matchesFavorites =
        !this.showFavorites ||
        this.favoritePrompts.includes(prompt.id);

      return matchesSearch &&
        matchesCategory &&
        matchesFavorites;
    });
  }

  showDashboard(): void {
    this.showFavorites = false;
    this.applyFilters();
  }

  copyPrompt(): void {

    if (!this.selectedPrompt) {
      return;
    }

    navigator.clipboard.writeText(
      this.selectedPrompt.promptText
    );

   this.showCopySuccess = true;

setTimeout(() => {
  this.showCopySuccess = false;
}, 2500);
  }

  toggleFavorite(prompt: Prompt): void {

    if (!this.authService.isLoggedIn()) {

      this.showLoginRequired = true;

      return;
    }

    if (this.favoritePrompts.includes(prompt.id)) {

      this.promptService
        .removeFavorite(prompt.id)
        .subscribe({

          next: () => {
            this.favoritePrompts =
              this.favoritePrompts.filter(
                id => id !== prompt.id
              );

            this.applyFilters();
          },

          error: (error) => {
           
          }

        });

    } else {

      this.promptService
        .addFavorite(prompt.id)
        .subscribe({

          next: () => {
            this.favoritePrompts.push(prompt.id);

            this.applyFilters();
          },

          error: (error) => {          
          }

        });
    }
  }
  closeLoginRequired(): void {
    this.showLoginRequired = false;
  }
  goToLogin(): void {
    this.showLoginRequired = false;
    this.router.navigate(['/login']);
  }
  goToRegister(): void {
    this.showLoginRequired = false;
    this.router.navigate(['/register']);
  }
  selectPrompt(prompt: Prompt): void {

    this.selectedPrompt = prompt;
  }

  closePrompt(): void {

    this.selectedPrompt = null;
  }

  searchPrompts(searchText: string): void {

    this.applyFilters(searchText);
  }

  filterByCategory(category: string): void {

    this.selectedCategory = category;

    this.applyFilters();
  }

  loadPrompts(): void {

    this.promptService.getPrompts().subscribe({

      next: (data: Prompt[]) => {

        this.prompts = [...data];

        this.filteredPrompts = [...data];

        this.cdr.detectChanges();
      },

      error: (error) => {        
      }

    });
  }
  logout(): void {
    this.showLogoutModal = true;
  }

  confirmLogout(): void {

    this.showLogoutModal = false;

    this.authService.logout();

    this.router.navigate(['/login']);
  }
  cancelLogout(): void {
    this.showLogoutModal = false;
  }
  goToAboutUs(): void {
    this.router.navigate(['/about']);
  }
}