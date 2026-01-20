import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SettingsModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  selectedLanguage = 'Español';
  notificationsEnabled = true;
  selectedUnit = 'celsius';

  languages = ['Español', 'English', 'Français', 'Deutsch'];

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  toggleNotifications(): void {
    this.notificationsEnabled = !this.notificationsEnabled;
  }

  selectUnit(unit: 'celsius' | 'fahrenheit'): void {
    this.selectedUnit = unit;
  }

  onLanguageChange(event: any): void {
    this.selectedLanguage = event.target.value;
  }
}
