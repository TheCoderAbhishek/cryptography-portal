import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [NgIf],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  @Input() message: string = '';
  @Input() isVisible: boolean = false; // Control visibility
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.isVisible = false; // Close modal on confirm
  }

  onCancel() {
    this.cancel.emit();
    this.isVisible = false; // Close modal on cancel
  }
}
