import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { ResetPasswordComponent } from './reset-password/reset-password';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { About } from './about/about';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent
    },
    {
        path: 'login',
        component: Login
    },

    {
        path: 'register',
        component: Register
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },
    {
        path: 'about',
        component: About
    }
];