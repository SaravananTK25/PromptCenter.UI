import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromptService } from '../services/prompt';
import { Prompt } from '../models/prompt.model';
import { HomeButtonComponent } from '../shared/home-button/home-button';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HomeButtonComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  prompts: Prompt[] = [];

  message = '';
  errorMessage = '';

  // Delete confirmation
  showDeleteModal = false;
  selectedPromptId: number | null = null;
  selectedPromptTitle = '';

  // Success popup
  showSuccessPopup = false;

  newPrompt = {
    title: '',
    type: 'image',
    category: '',
    description: '',
    promptText: '',
    negativePrompt: '',
    tags: '',
    imageUrl: ''
  };

  constructor(private promptService: PromptService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    debugger
    this.loadPrompts();
  }

  loadPrompts(): void {

  this.promptService.getPrompts().subscribe({

    next: (data: Prompt[]) => {

      this.prompts = data;

      this.cdr.detectChanges();
    },

    error: () => {

      this.errorMessage = 'Could not load prompts.';

      this.cdr.detectChanges();
    }

  });
}

  addPrompt(): void {

    this.message = '';
    this.errorMessage = '';

    const prompt = {
      ...this.newPrompt,
      tags: this.newPrompt.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .join(', ')
    };

    this.promptService.addPrompt(prompt).subscribe({
      next: () => {

        this.message = 'Prompt added successfully!';

        this.newPrompt = {
          title: '',
          type: 'image',
          category: '',
          description: '',
          promptText: '',
          negativePrompt: '',
          tags: '',
          imageUrl: ''
        };

        this.loadPrompts();
      },

      error: () => {
        this.errorMessage = 'Could not add prompt.';
      }
    });
  }

  // Open custom delete confirmation
  deletePrompt(id: number): void {

    const prompt = this.prompts.find(p => p.id === id);

    if (!prompt) {
      return;
    }

    this.selectedPromptId = id;
    this.selectedPromptTitle = prompt.title;

    this.showDeleteModal = true;
  }

  // Cancel delete
  cancelDelete(): void {

    this.showDeleteModal = false;
    this.selectedPromptId = null;
    this.selectedPromptTitle = '';
  }

  // Confirm delete
  confirmDelete(): void {

    if (this.selectedPromptId === null) {
      return;
    }

    const id = this.selectedPromptId;

    this.promptService.deletePrompt(id).subscribe({

      next: () => {

        this.showDeleteModal = false;

        this.selectedPromptId = null;
        this.selectedPromptTitle = '';

        this.loadPrompts();

        // Show success popup
        this.showSuccessPopup = true;

      },

      error: () => {

        this.showDeleteModal = false;

        this.errorMessage = 'Could not delete prompt.';
      }
    });
  }

  // Close success popup
  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    window.location.reload();
  }
}