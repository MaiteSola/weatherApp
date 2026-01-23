import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeatherService } from '../../../../core/services/weather.service';
import { DailyForecast } from '../../../../core/models/weather.models';
import { TranslateModule } from '@ngx-translate/core';
import { TemperaturePipe } from 'src/app/core/pipes/temperature.pipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weekly-forecast-list',
  templateUrl: './weekly-forecast-list.component.html',
  styleUrls: ['./weekly-forecast-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule, TemperaturePipe],
})
export class WeeklyForecastListComponent implements OnChanges {
  @Input() days: 3 | 5 = 3;

  forecastData: DailyForecast[] = [];
  unit$: Observable<'celsius' | 'fahrenheit'>;

  constructor(private weatherService: WeatherService) {
    this.unit$ = this.weatherService.unit$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['days']) {
      this.updateForecast();
    }
  }

  ngOnInit(): void {
    this.updateForecast();
  }

  private updateForecast(): void {
    // Subscribe to daily forecast updates and filter by requested days
    this.weatherService.dailyForecast$.subscribe({
      next: (data) => {
        // Filter to show only the requested number of days
        this.forecastData = data.slice(0, this.days);
      },
      error: (err) => {
        console.error('Error loading daily forecast:', err);
      },
    });
  }

  getTitleKey(): string {
    return this.days === 3
      ? 'NAVIGATION.FORECAST_3_DAYS'
      : 'NAVIGATION.FORECAST_5_DAYS';
  }
}
