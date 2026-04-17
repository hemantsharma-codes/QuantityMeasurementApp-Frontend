import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, CurrentUser } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: CurrentUser | null = null;
  isLoggedIn = false;
  isAdmin    = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.refresh();
    // Refresh navbar on every route change (handles login/logout)
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.refresh());
  }

  refresh(): void {
    this.user      = this.authService.getUser();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin    = this.authService.isAdmin();
  }

  logout(): void {
    this.authService.clearSession();
    this.refresh();
    this.router.navigate(['/auth']);
  }

  getInitial(): string {
    return this.user?.username?.[0]?.toUpperCase() || 'U';
  }
}