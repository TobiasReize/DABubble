import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private focusEventSignal = signal<boolean>(true);
  readonly focusEvent = this.focusEventSignal.asReadonly();

  constructor() { }

  triggerFocusEvent() {
    this.focusEventSignal.set(false);
    setTimeout(() => {
      this.focusEventSignal.set(true);
    }, 0);
  }
}
