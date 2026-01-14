import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeatherService } from '../../core/services/weather.service';
import { HourlyForecast } from '../../core/models/weather.models';

@Component({
  selector: 'app-hourly-forecast',
  templateUrl: './hourly-forecast.component.html',
  styleUrls: ['./hourly-forecast.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HourlyForecastComponent implements OnInit {
  hourlyData: HourlyForecast[] = [];

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.hourlyData = this.weatherService.getHourlyForecast();
  }
}
