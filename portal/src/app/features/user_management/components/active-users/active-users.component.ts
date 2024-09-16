import { NgFor } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-active-users',
  standalone: true,
  imports: [NgFor],
  templateUrl: './active-users.component.html',
  styleUrl: './active-users.component.css',
})
export class ActiveUsersComponent implements AfterViewInit {
  users = [
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      downloads: 269000,
      growth: '49%',
    },
    {
      name: 'Tailwind CSS',
      releaseDate: '2021/25/09',
      downloads: 269000,
      growth: '49%',
    },
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      downloads: 269000,
      growth: '49%',
    },
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      downloads: 269000,
      growth: '49%',
    },
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      downloads: 269000,
      growth: '49%',
    },
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      downloads: 269000,
      growth: '49%',
    },
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      downloads: 269000,
      growth: '49%',
    },
    // Add other user data or fetch dynamically
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

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
}
