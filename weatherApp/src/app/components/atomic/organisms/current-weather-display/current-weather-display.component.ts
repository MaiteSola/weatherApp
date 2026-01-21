import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherService } from '../../../../core/services/weather.service';
import {
  CurrentWeather,
  WeatherTheme,
} from '../../../../core/models/weather.models';

@Component({
  selector: 'app-current-weather-display',
  templateUrl: './current-weather-display.component.html',
  styleUrls: ['./current-weather-display.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class CurrentWeatherDisplayComponent implements OnInit, OnDestroy {
  currentWeather$: Observable<CurrentWeather>;
  currentTheme$: Observable<WeatherTheme>;

  currentTheme: WeatherTheme | null = null;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {
    this.currentWeather$ = this.weatherService.currentWeather$;
    this.currentTheme$ = this.weatherService.currentTheme$;
  }

  ngOnInit(): void {
    // Subscribe to theme changes to apply dynamic styles
    this.currentTheme$.pipe(takeUntil(this.destroy$)).subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getBackgroundStyle(): any {
    if (!this.currentTheme) return {};
    return {
      background: this.currentTheme.bgGradient,
    };
  }

  getIconShadow(): any {
    if (!this.currentTheme) return {};
    return {
      'text-shadow': `0 0 60px ${this.currentTheme.glowColor}`,
    };
  }
}
