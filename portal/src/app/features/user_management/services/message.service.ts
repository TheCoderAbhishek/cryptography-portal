// message.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageSubject = new BehaviorSubject<{
    success?: string;
    error?: string;
  } | null>(null);
  message$ = this.messageSubject.asObservable();

  setMessage(success?: string, error?: string) {
    this.messageSubject.next({ success, error });
  }

  clearMessage() {
    this.messageSubject.next(null);
  }
}
