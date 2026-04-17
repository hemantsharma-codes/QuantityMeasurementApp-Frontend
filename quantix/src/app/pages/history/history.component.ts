import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, HistoryItem } from '../../services/api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  historyList: HistoryItem[] = [];
  isLoading = false;
  filterOp  = '';
  filterCat = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.api.getMyHistory(this.filterOp, this.filterCat).subscribe({
      next: (data) => { this.historyList = data; this.isLoading = false; },
      error: ()    => { this.isLoading = false; }
    });
  }

  clearAll(): void {
    if (!confirm('Clear your entire history?')) return;
    this.api.clearMyHistory().subscribe({ next: () => this.load() });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}