import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { Observable } from 'rxjs';
import { LoaderService } from './shared/services/loader.service';
import { FlowbiteService } from './core/services/flowbite.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'AridentRIS';

  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private flowBiteService: FlowbiteService
  ) {
    this.isLoading = this.loaderService.isLoading;
  }

  ngOnInit() {
    this.flowBiteService.loadFlowbite(() => {});
  }
}
