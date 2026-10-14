import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Prompt } from '../models/prompt.model';

@Injectable({
    providedIn: 'root'
})

export class PromptService {

    private apiUrl = 'https://promptcenter.runasp.net/api/Prompts';
    private favoritesUrl = 'https://promptcenter.runasp.net/api/Favorites';

    constructor(private http: HttpClient) { }

    getPrompts(): Observable<Prompt[]> {
        return this.http.get<Prompt[]>(this.apiUrl);
    }
    getFavorites() {
        return this.http.get<number[]>(
            `${this.apiUrl.replace('/Prompts', '/Favorites')}`
        );
    }

    addFavorite(promptId: number) {
        return this.http.post(
            `${this.apiUrl.replace('/Prompts', '/Favorites')}/${promptId}`,
            {}
        );
    }

    removeFavorite(promptId: number) {
        return this.http.delete(
            `${this.apiUrl.replace('/Prompts', '/Favorites')}/${promptId}`
        );
    }
    addPrompt(prompt: any) {
        return this.http.post<Prompt>(this.apiUrl, prompt);
    }

    deletePrompt(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}