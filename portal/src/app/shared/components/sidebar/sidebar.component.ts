import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private router: Router) {}

  @Input() collapsed = false;

  isDropdownOpen: { [key: string]: boolean } = {
    profile: false,
  };

  toggleDropdown(menu: string) {
    this.isDropdownOpen[menu] = !this.isDropdownOpen[menu];
  }

  fetchActiveUsers(): void {
    this.router.navigate(['/user-management/active-users']);
  }

  fetchInactiveUsers(): void {
    this.router.navigate(['/user-management/inactive-users']);
  }
}
