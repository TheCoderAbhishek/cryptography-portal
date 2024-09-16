import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActiveUsersComponent } from '../../../features/user_management/components/active-users/active-users.component';
import { ActiveUsersService } from '../../../features/user_management/components/active-users/services/active-users.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private activeUsersService: ActiveUsersService) {}

  @Input() collapsed = false;

  isDropdownOpen: { [key: string]: boolean } = {
    profile: false,
  };

  toggleDropdown(menu: string) {
    this.isDropdownOpen[menu] = !this.isDropdownOpen[menu];
  }

  fetchActiveUsers(): void {
    this.activeUsersService.getUsersList().subscribe({
      next: (response) => {
        console.log('Users fetched successfully:', response);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }
}
