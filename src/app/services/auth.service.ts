import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
    token: string;
    name: string;
    email: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private apiUrl = 'https://promptcenter.runasp.net/api/Auth';

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.apiUrl}/login`,
            {
                email: email,
                password: password
            }
        );
    }

    register(
        name: string,
        email: string,
        password: string
    ): Observable<any> {

        return this.http.post(
            `${this.apiUrl}/register`,
            {
                name: name,
                email: email,
                password: password
            }
        );
    }
    saveLoginData(response: LoginResponse): void {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userName', response.name);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userRole', response.role);
    }
    getUserName(): string {
        return localStorage.getItem('userName') || 'Guest';
    }

    getUserRole(): string {
        return localStorage.getItem('userRole') || 'Guest access';
    }

    getUserInitial(): string {

        const name = this.getUserName();

        return name === 'Guest'
            ? 'G'
            : name.charAt(0).toUpperCase();
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout(): void {

        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
    }

    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, {
            email
        });
    }

    resetPassword(token: string, newPassword: string) {
        return this.http.post(
            `${this.apiUrl}/reset-password`,
            {
                token,
                newPassword
            }
        );
    }
    isAdmin(): boolean {

        const token = localStorage.getItem('token');

        if (!token) {
            return false;
        }

        try {

            const payload = JSON.parse(
                atob(
                    token
                        .split('.')[1]
                        .replace(/-/g, '+')
                        .replace(/_/g, '/')
                )
            );

            const role =
                payload['role'] ||
                payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

            return role === 'Admin';

        } catch {

            return false;
        }
    }
}