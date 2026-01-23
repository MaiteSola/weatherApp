import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LanguageService } from 'src/app/core/services/language.service';
import { WeatherService } from 'src/app/core/services/weather.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
})
export class SettingsModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  selectedLanguage = 'es';
  selectedUnit: 'celsius' | 'fahrenheit' = 'celsius';

  languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'eu', name: 'Euskera' },
  ];

  constructor(
    private languageService: LanguageService,
    private weatherService: WeatherService,
  ) {}

  ngOnInit() {
    this.selectedLanguage = this.languageService.getCurrentLanguage();
    this.weatherService.unit$.subscribe((unit) => {
      this.selectedUnit = unit;
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  selectUnit(unit: 'celsius' | 'fahrenheit'): void {
    this.weatherService.setUnit(unit);
  }

  onLanguageChange(event: any): void {
    this.languageService.setLanguage(event.target.value);
    this.weatherService.refetchWeatherData();
  }
}
