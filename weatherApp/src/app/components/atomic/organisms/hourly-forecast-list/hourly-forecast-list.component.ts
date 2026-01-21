import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeatherService } from '../../../../core/services/weather.service';
import { HourlyForecast } from '../../../../core/models/weather.models';

@Component({
  selector: 'app-hourly-forecast-list',
  templateUrl: './hourly-forecast-list.component.html',
  styleUrls: ['./hourly-forecast-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HourlyForecastListComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  hourlyData: HourlyForecast[] = [];

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    // Subscribe to hourly forecast updates
    this.weatherService.hourlyForecast$.subscribe({
      next: (data) => {
        this.hourlyData = data;
      },
      error: (err) => {
        console.error('Error loading hourly forecast:', err);
      },
    });
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  }
}
