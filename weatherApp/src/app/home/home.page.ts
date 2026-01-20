import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherPageTemplateComponent } from '../components/atomic/templates/weather-page-template/weather-page-template.component';
import { NavigationOption } from '../components/atomic/organisms/bottom-navigation/bottom-navigation.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, WeatherPageTemplateComponent],
})
export class HomePage {
  forecastDays: 3 | 5 = 3;
  settingsModalOpen = false;

  constructor() {}

  onNavigationChange(option: NavigationOption): void {
    if (option === 'settings') {
      this.settingsModalOpen = true;
    } else if (option === '3-days') {
      this.forecastDays = 3;
      this.settingsModalOpen = false;
    } else if (option === '5-days') {
      this.forecastDays = 5;
      this.settingsModalOpen = false;
    }
  }

  onSettingsClose(): void {
    this.settingsModalOpen = false;
  }
}
