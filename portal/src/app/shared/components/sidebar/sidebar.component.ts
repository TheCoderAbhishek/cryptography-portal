import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() collapsed = false;

  isDropdownOpen: { [key: string]: boolean } = {
    profile: false,
  };

  toggleDropdown(menu: string) {
    this.isDropdownOpen[menu] = !this.isDropdownOpen[menu];
  }
}
