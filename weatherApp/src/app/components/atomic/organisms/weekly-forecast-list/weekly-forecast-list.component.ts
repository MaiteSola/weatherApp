import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeatherService } from '../../../../core/services/weather.service';
import { DailyForecast } from '../../../../core/models/weather.models';

@Component({
  selector: 'app-weekly-forecast-list',
  templateUrl: './weekly-forecast-list.component.html',
  styleUrls: ['./weekly-forecast-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class WeeklyForecastListComponent implements OnChanges {
  @Input() days: 3 | 5 = 3;

  forecastData: DailyForecast[] = [];

  constructor(private weatherService: WeatherService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['days']) {
      this.updateForecast();
    }
  }

  ngOnInit(): void {
    this.updateForecast();
  }

  private updateForecast(): void {
    this.forecastData = this.weatherService.getDailyForecast(this.days);
  }

  getTitle(): string {
    return `Pronóstico ${this.days} Días`;
  }
}
