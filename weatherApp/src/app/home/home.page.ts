import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { WeatherHeaderComponent } from '../components/weather-header/weather-header.component';
import { RecentSearchesComponent } from '../components/recent-searches/recent-searches.component';
import { CurrentWeatherComponent } from '../components/current-weather/current-weather.component';
import { HourlyForecastComponent } from '../components/hourly-forecast/hourly-forecast.component';
import { QuickStatsComponent } from '../components/quick-stats/quick-stats.component';
import { WeeklyForecastComponent } from '../components/weekly-forecast/weekly-forecast.component';
import {
  BottomNavigationComponent,
  NavigationOption,
} from '../components/bottom-navigation/bottom-navigation.component';
import { SettingsModalComponent } from '../components/settings-modal/settings-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    WeatherHeaderComponent,
    RecentSearchesComponent,
    CurrentWeatherComponent,
    HourlyForecastComponent,
    QuickStatsComponent,
    WeeklyForecastComponent,
    BottomNavigationComponent,
    SettingsModalComponent,
  ],
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
