import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, HistoryItem, UserInfo } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users:          UserInfo[]    = [];
  historyList:    HistoryItem[] = [];
  usersLoading   = false;
  histLoading    = false;
  histTitle      = 'All Measurement Records';
  filterOp       = '';
  filterCat      = '';
  roleEmail      = '';
  roleSelect     = 'User';
  message        = '';
  isError        = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadHistory();
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.api.getAllUsers().subscribe({
      next: (data) => { this.users = data; this.usersLoading = false; },
      error: ()    => { this.usersLoading = false; }
    });
  }

  loadHistory(): void {
    this.histLoading = true;
    this.histTitle   = 'All Measurement Records';
    this.api.getAllHistory(this.filterOp, this.filterCat).subscribe({
      next: (data) => { this.historyList = data; this.histLoading = false; },
      error: ()    => { this.histLoading = false; }
    });
  }

  viewUserHistory(userId: number, username: string): void {
    this.histLoading = true;
    this.histTitle   = `${username}'s History`;
    this.api.getHistoryByUser(userId).subscribe({
      next: (data) => { this.historyList = data; this.histLoading = false; },
      error: ()    => { this.histLoading = false; }
    });
  }

  deleteRecord(id: number): void {
    if (!confirm(`Delete record #${id}?`)) return;
    this.api.deleteRecord(id).subscribe({
      next: () => { this.setMsg(`Record #${id} deleted`, false); this.loadHistory(); },
      error: (err) => this.setMsg(err?.error?.message || 'Failed', true)
    });
  }

  clearAll(): void {
    if (!confirm('Delete ALL records? This cannot be undone.')) return;
    this.api.clearAllHistory().subscribe({
      next: () => { this.setMsg('All records cleared', false); this.loadHistory(); },
      error: (err) => this.setMsg(err?.error?.message || 'Failed', true)
    });
  }

  updateRole(): void {
    if (!this.roleEmail) { this.setMsg('Enter user email', true); return; }
    this.api.updateRole({ email: this.roleEmail, newRole: this.roleSelect }).subscribe({
      next: () => {
        this.setMsg(`Role updated to ${this.roleSelect}`, false);
        this.roleEmail = '';
        this.loadUsers();
      },
      error: (err) => this.setMsg(err?.error?.message || 'Failed', true)
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  private setMsg(msg: string, isError: boolean): void {
    this.message = msg; this.isError = isError;
    setTimeout(() => this.message = '', 4000);
  }
}