import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { WeatherService } from '../../../../core/services/weather.service';
import { CurrentWeather } from '../../../../core/models/weather.models';

@Component({
  selector: 'app-weather-header',
  templateUrl: './weather-header.component.html',
  styleUrls: ['./weather-header.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
})
export class WeatherHeaderComponent implements OnInit {
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  currentWeather$: Observable<CurrentWeather>;

  constructor(private weatherService: WeatherService) {
    this.currentWeather$ = this.weatherService.currentWeather$;
  }

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.weatherService.searchByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        (error) => {
          console.warn('Geolocation denied or error:', error);
          // If geolocation fails, defaults (Madrid) are already loaded by the service
        },
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
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
