import { computed, Injectable, signal } from '@angular/core';
import { LayoutStateSignal } from '../../models/layout-state-signal.interface';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  
  selectedCollection = signal<string>('channels');
  isThreadSelected = signal<boolean>(false);
  isSideNavSelected = signal<boolean>(true);

  constructor() { }

  winWidth = signal<number>(1920);
  isDesktop = computed(() => this.winWidth() > 1200);
  isTablet = computed(() => this.winWidth() <= 1200 && this.winWidth() >= 768);
  isMobile = computed(() => this.winWidth() < 768);

  selectChat() {
    this.selectedCollection.set('channels');
  }

  selectDirectMessage() {
    this.selectedCollection.set('directMessageChannels');
  }

  selectThread() {
    this.isThreadSelected.set(true);
  }

  deselectThread() {
    this.isThreadSelected.set(false);
  }

  adaptLayoutToDesktop(signal: LayoutStateSignal) {
    if (this.selectedCollection() === 'channels') {
      signal.isChatOpen = true;
    } else if (this.selectedCollection() === 'directMessageChannels') { signal.isDirectMessageOpen = true;}
    if (this.isSideNavSelected()) { signal.isSideNavOpen = true; }
    if (this.isThreadSelected()) { signal.isThreadOpen = true; }
  }

  adaptLayoutToTablet(signal: LayoutStateSignal) {
    if (this.isThreadSelected()) {
      signal.isThreadOpen = true;
    } else {
      if (this.selectedCollection() === 'channels') {
        signal.isChatOpen = true;
      } else if (this.selectedCollection() === 'directMessageChannels') { signal.isDirectMessageOpen = true;}
    }
    if (this.isSideNavSelected()) { signal.isSideNavOpen = true; }
  }

  adaptLayoutToMobile(signal: LayoutStateSignal) {
    if (this.isSideNavSelected()) { 
      signal.isSideNavOpen = true;
    } else if (this.isThreadSelected()) {
      signal.isThreadOpen = true;
    } else if (this.selectedCollection() === 'channels') {
      signal.isChatOpen = true;
    } else if (this.selectedCollection() === 'directMessageChannels') { signal.isDirectMessageOpen = true;}
  }

  readonly layoutState = computed(() => {
    const signal: LayoutStateSignal = {
      isSideNavOpen: false,
      isThreadOpen: false,
      isChatOpen: false,
      isDirectMessageOpen: false
    };
    if (this.isDesktop()) {
      this.adaptLayoutToDesktop(signal);
    } else if (this.isTablet()) {
      this.adaptLayoutToTablet(signal);
    } else if (this.isMobile()) {
      this.adaptLayoutToMobile(signal);
    }
    return signal;
  })

  onResize(width: number) {
    this.winWidth.set(width);
  }

  toggleSideNavVisbility() {
    this.isSideNavSelected.set(!this.isSideNavSelected());
  }

  toggleThreadVisibility() {
    this.isThreadSelected.set(!this.isThreadSelected());
  }
}
