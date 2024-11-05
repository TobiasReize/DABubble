import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private layoutStateSignal = signal<any>({
    isSideNavOpen: true,
    isThreadOpen: false,
    isChatOpen: true,
    isDirectMessageOpen: false
  });
  readonly layoutState = this.layoutStateSignal.asReadonly();

  constructor() { }

  onResize(width: number) {
    if (width >= 1201) {
      this.changeChatVisibility(true);
    }
    if (width < 1200) {
      if (this.layoutState().isThreadOpen) {
        this.changeChatVisibility(false);
      } else {
        this.changeChatVisibility(true);
      }
    }
    if (width < 768) {
      if (this.layoutState().isSideNavOpen) {
        this.changeThreadVisibility(false);
        this.changeChatVisibility(false);
      }
    }
  }

  changeSideNavVisibility(bool: boolean) {
    this.layoutStateSignal.update(layoutState => ({...layoutState, isSideNavOpen: bool}));
  }

  changeThreadVisibility(bool: boolean) {
    this.layoutStateSignal.update(layoutState => ({...layoutState, isThreadOpen: bool}));
  }

  changeChatVisibility(bool: boolean) {
    if (bool) {
      if (this.layoutState().isDirectMessageOpen) {
        this.toggleDirectMessageVisibility();
      }
    }
    this.layoutStateSignal.update(layoutState => ({... layoutState, isChatOpen: bool}));
    console.log(this.layoutState());
  }

  changeDirectMessageVisbility(bool: boolean) {
    if (bool) {
      if (this.layoutState().isChatOpen) {
        this.toggleChatVisibility();
      }
    }
    this.layoutStateSignal.update(layoutState => ({... layoutState, isDirectMessageOpen: bool}));
  }

  toggleSideNavVisbility() {
    this.changeSideNavVisibility(!this.layoutState().isSideNavOpen);
  }

  toggleThreadVisibility() {
    this.changeThreadVisibility(!this.layoutState().isThreadOpen);
  }
  
  toggleChatVisibility() {
    this.changeChatVisibility(!this.layoutState().isChatOpen);
  }

  toggleDirectMessageVisibility() {
    this.changeDirectMessageVisbility(!this.layoutState().isDirectMessageOpen);
  }

}
