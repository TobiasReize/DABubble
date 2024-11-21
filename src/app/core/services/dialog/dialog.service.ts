import { computed, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor() { }

  private defaultEmojis: string[] = ['2705.svg', '1f64c.svg'];

  private lastEmojisSignal = signal<string[]>(this.defaultEmojis);
  readonly lastEmojis = this.lastEmojisSignal.asReadonly();

  private openEditChannelSignal = signal<boolean>(false);
  readonly openEditChannel = this.openEditChannelSignal.asReadonly();

  private openAddPeopleSignal = signal<boolean>(false);
  readonly openAddPeople = this.openAddPeopleSignal.asReadonly();

  private openMembersSignal = signal<boolean>(false);
  readonly openMembers = this.openMembersSignal.asReadonly();

  private openAtSignal = signal<boolean>(false);
  readonly opentAt = this.openAtSignal.asReadonly();

  private openAtForThreadSignal = signal<boolean>(false);
  readonly openAtForThread = this.openAtForThreadSignal.asReadonly();

  private openEmojiPickerSignal = signal<boolean>(false);
  readonly openEmojiPicker = this.openEmojiPickerSignal.asReadonly();

  private openEmojiPickerForThreadSignal = signal<boolean>(false);
  readonly openEmojiPickerForThread =
    this.openEmojiPickerForThreadSignal.asReadonly();

  private openEmojiPickerForEditingSignal = signal<boolean>(false);
  readonly openEmojiPickerForEditing =
    this.openEmojiPickerForEditingSignal.asReadonly();

  private openUploadErrorSignal = signal<boolean>(false);
  readonly openUploadError =
    this.openUploadErrorSignal.asReadonly();

    private uploadErrorTypeSignal = signal<string>('');
  readonly uploadErrorType =
    this.uploadErrorTypeSignal.asReadonly();

    toggleVisibilitySignal(visibilitySignal: WritableSignal<boolean>) {
      const visibilitySignals = [
        this.openAddPeopleSignal,
        this.openEditChannelSignal,
        this.openMembersSignal,
        this.openAtSignal,
        this.openAtForThreadSignal,
        this.openEmojiPickerSignal,
        this.openEmojiPickerForThreadSignal,
        this.openEmojiPickerForEditingSignal,
      ];
      visibilitySignals.forEach((s) =>
        s != visibilitySignal ? s.set(false) : null
      );
      visibilitySignal.set(!visibilitySignal());
    }
  
    toggleEditChannelVisibility() {
      this.toggleVisibilitySignal(this.openEditChannelSignal);
    }
  
    toggleAddPeopleVisibility() {
      this.toggleVisibilitySignal(this.openAddPeopleSignal);
    }
  
    toggleMembersVisibility() {
      this.toggleVisibilitySignal(this.openMembersSignal);
    }
  
    toggleAtVisibility() {
      this.toggleVisibilitySignal(this.openAtSignal);
    }
  
    toggleAtForThreadVisibility() {
      this.toggleVisibilitySignal(this.openAtForThreadSignal);
    }
  
    toggleEmojiPickerVisibility() {
      this.toggleVisibilitySignal(this.openEmojiPickerSignal);
    }
  
    toggleEmojiPickerForThreadVisibility() {
      this.toggleVisibilitySignal(this.openEmojiPickerForThreadSignal);
    }
  
    toggleEmojiPickerForEditingVisibility() {
      this.toggleVisibilitySignal(this.openEmojiPickerForEditingSignal);
    }
  
    toggleUploadErrorVisibility() {
      this.openUploadErrorSignal.set(!this.openUploadErrorSignal())
    }
  
    showUploadError(info: string) {
      this.uploadErrorTypeSignal.set(info);
      this.toggleUploadErrorVisibility();
    }

    saveLastEmoji(emoji: string) {
      const emojis = this.lastEmojis();
      if (!emojis.includes(emoji)) {
        this.lastEmojisSignal.update((values) => [emoji, values[0]]);
      }
    }
}
