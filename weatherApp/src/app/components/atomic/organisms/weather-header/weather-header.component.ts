import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { WeatherService } from '../../../../core/services/weather.service';
import { CurrentWeather } from '../../../../core/models/weather.models';

@Component({
  selector: 'app-weather-header',
  templateUrl: './weather-header.component.html',
  styleUrls: ['./weather-header.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class WeatherHeaderComponent {
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  currentWeather$: Observable<CurrentWeather>;

  constructor(private weatherService: WeatherService) {
    this.currentWeather$ = this.weatherService.currentWeather$;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery);
      this.weatherService.searchCity(this.searchQuery);
      this.searchQuery = '';
    }
  }

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
  }

  onMenuClick(): void {
    // Puede ser usado para mostrar un menú contextual o más opciones
    console.log('Menu clicked');
  }
}
