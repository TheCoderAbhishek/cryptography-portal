import { NgClass, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { DataTable } from 'simple-datatables';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../user_management/services/message.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../shared/services/loader.service';
import { KeyListService } from './services/key-list.service';

interface Keys {
  id: number;
  keyName: string;
  keyType: string;
  keyAlgorithm: string;
  keySize: number;
  keyOwner: string;
  keyCreatedOn: string;
}

@Component({
  selector: 'app-key-list',
  standalone: true,
  imports: [NgClass, NgIf, NgFor, FormsModule],
  templateUrl: './key-list.component.html',
  styleUrl: './key-list.component.css',
})
export class KeyListComponent implements AfterViewInit, OnDestroy {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  keys: Keys[] = [];
  dataTable: DataTable | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private messageService: MessageService,
    private router: Router,
    private loaderService: LoaderService,
    private keyListService: KeyListService
  ) {}

  ngOnInit() {
    // Subscribe to message service for displaying alerts
    this.messageService.message$.subscribe((message) => {
      if (message) {
        if (message.success) {
          this.successMessage = message.success;
          console.log('Success message:', this.successMessage);
          setTimeout(() => this.clearMessage(), 3000);
        }
        if (message.error) {
          this.errorMessage = message.error;
          console.error('Error message:', this.errorMessage);
          setTimeout(() => this.clearMessage(), 3000);
        }
      }
    });
  }

  clearMessage(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.messageService.clearMessage();
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById('keys-list-table');
    if (tableElement) {
      if (this.dataTable) {
        this.dataTable.destroy();
      }

      // Initialize the DataTable
      this.dataTable = new DataTable(tableElement as HTMLTableElement, {
        searchable: true,
        perPageSelect: [5, 10, 15],
        sortable: true,
        labels: {
          placeholder: 'Search keys...',
          noRows: 'No keys found',
          info: 'Showing {start} to {end} of {rows} entries',
        },
      });
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchKeysList();
    }
  }

  ngOnDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  fetchKeysList(): void {
    this.keyListService.getKeysList().subscribe({
      next: (response) => {
        console.log(response.returnValue.$values);
        if (response.returnValue && response.returnValue.$values) {
          this.keys = response.returnValue.$values.map((keys: Keys) => {
            const createdOn = new Date(keys.keyCreatedOn);
            const formattedDate = `${createdOn.getFullYear()}-${(
              createdOn.getMonth() + 1
            )
              .toString()
              .padStart(2, '0')}-${createdOn
              .getDate()
              .toString()
              .padStart(2, '0')} ${createdOn
              .getHours()
              .toString()
              .padStart(2, '0')}:${createdOn
              .getMinutes()
              .toString()
              .padStart(2, '0')}:${createdOn
              .getSeconds()
              .toString()
              .padStart(2, '0')}`;

            return {
              id: keys.id,
              keyName: keys.keyName,
              keyType: keys.keyType,
              keyAlgorithm: keys.keyAlgorithm,
              keySize: keys.keySize,
              keyOwner: keys.keyOwner,
              keyCreatedOn: formattedDate,
            };
          });

          if (this.keys.length === 0) {
            console.warn('No keys found.');
          } else {
            setTimeout(() => {
              this.initializeDataTable();
            }, 0);
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load keys list';
        console.error('Error fetching keys List:', error);
      },
    });
  }
}
