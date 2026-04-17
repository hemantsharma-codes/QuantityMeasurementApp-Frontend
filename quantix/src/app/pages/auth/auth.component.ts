import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  activeTab = 'login';

  loginEmail    = '';
  loginPassword = '';

  regUsername = '';
  regEmail    = '';
  regPassword = '';

  isLoading = false;
  message   = '';
  isError   = false;

  constructor(
    private api:  ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.message   = '';
  }

  doLogin(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.setMsg('Please fill in all fields', true); return;
    }
    this.isLoading = true;
    this.api.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: (res) => {
        this.auth.saveSession(res.token, { username: res.username, email: res.email, role: res.role });
        this.isLoading = false;
        this.router.navigate(['/calculator']);
      },
      error: (err) => {
        this.isLoading = false;
        this.setMsg(err?.error?.message || 'Login failed', true);
      }
    });
  }

  doRegister(): void {
    if (!this.regUsername || !this.regEmail || !this.regPassword) {
      this.setMsg('Please fill in all fields', true); return;
    }
    this.isLoading = true;
    this.api.register({ username: this.regUsername, email: this.regEmail, password: this.regPassword }).subscribe({
      next: () => {
        this.isLoading = false;
        this.setMsg('Account created! Please sign in.', false);
        this.switchTab('login');
        this.loginEmail = this.regEmail;
      },
      error: (err) => {
        this.isLoading = false;
        this.setMsg(err?.error?.message || 'Registration failed', true);
      }
    });
  }

  continueAsGuest(): void {
    this.router.navigate(['/calculator']);
  }

  private setMsg(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
  }
}