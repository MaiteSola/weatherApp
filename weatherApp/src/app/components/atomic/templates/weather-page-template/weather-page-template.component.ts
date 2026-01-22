import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeatherHeaderComponent } from '../../organisms/weather-header/weather-header.component';
import { RecentSearchesListComponent } from '../../organisms/recent-searches-list/recent-searches-list.component';
import { CurrentWeatherDisplayComponent } from '../../organisms/current-weather-display/current-weather-display.component';
import { HourlyForecastListComponent } from '../../organisms/hourly-forecast-list/hourly-forecast-list.component';
import { QuickStatsPanelComponent } from '../../organisms/quick-stats-panel/quick-stats-panel.component';
import { WeeklyForecastListComponent } from '../../organisms/weekly-forecast-list/weekly-forecast-list.component';
import {
  BottomNavigationComponent,
  NavigationOption,
} from '../../organisms/bottom-navigation/bottom-navigation.component';
import { SettingsModalComponent } from '../../organisms/settings-modal/settings-modal.component';
import { WeatherMapComponent } from '../../organisms/weather-map/weather-map.component';

@Component({
  selector: 'app-weather-page-template',
  templateUrl: './weather-page-template.component.html',
  styleUrls: ['./weather-page-template.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    WeatherHeaderComponent,
    RecentSearchesListComponent,
    CurrentWeatherDisplayComponent,
    HourlyForecastListComponent,
    QuickStatsPanelComponent,
    WeeklyForecastListComponent,
    BottomNavigationComponent,
    SettingsModalComponent,
    WeatherMapComponent,
  ],
})
export class WeatherPageTemplateComponent {
  @Input() forecastDays: 3 | 5 = 3;
  @Input() settingsModalOpen = false;
  @Input() showMap = false;
  @Output() navigationChange = new EventEmitter<NavigationOption>();
  @Output() settingsClose = new EventEmitter<void>();

  onNavigationChange(option: NavigationOption): void {
    this.navigationChange.emit(option);
  }

  onSettingsClose(): void {
    this.settingsClose.emit();
  }
}
