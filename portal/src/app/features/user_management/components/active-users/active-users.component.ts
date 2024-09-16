import { NgFor } from '@angular/common';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ActiveUsersService } from './services/active-users.service';

@Component({
  selector: 'app-active-users',
  standalone: true,
  imports: [NgFor],
  templateUrl: './active-users.component.html',
  styleUrl: './active-users.component.css',
})
export class ActiveUsersComponent implements AfterViewInit {
  users: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private activeUsersService: ActiveUsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchActiveUsers();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const tableElement = document.getElementById('active-user-table');
      if (tableElement) {
        new DataTable(tableElement as HTMLTableElement, {
          searchable: true,
          perPageSelect: [5, 10, 15],
          sortable: true,
          labels: {
            placeholder: 'Search...',
            noRows: 'No entries to found',
          },
        });
      }
    }
  }

  fetchActiveUsers(): void {
    this.activeUsersService.getUsersList().subscribe({
      next: (response) => {
        this.users = response.returnValue.$values;
        console.log('Users fetched successfully:', this.users);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }
}
