import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService, CurrentUser } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: CurrentUser | null = null;

  currentPassword    = '';
  newPassword        = '';
  confirmNewPassword = '';

  message   = '';
  isError   = false;
  isLoading = false;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
  }

  getInitial(): string {
    return this.user?.username?.[0]?.toUpperCase() || 'U';
  }

  updatePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      this.setMsg('Please fill in all fields', true); return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.setMsg('New passwords do not match', true); return;
    }
    if (this.newPassword.length < 6) {
      this.setMsg('Password must be at least 6 characters', true); return;
    }
    this.isLoading = true;
    this.api.updatePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmNewPassword,
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.setMsg('Password updated successfully!', false);
        this.currentPassword = this.newPassword = this.confirmNewPassword = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.setMsg(err?.error?.message || 'Failed to update', true);
      }
    });
  }

  private setMsg(msg: string, isError: boolean): void {
    this.message = msg; this.isError = isError;
    setTimeout(() => this.message = '', 4000);
  }
}