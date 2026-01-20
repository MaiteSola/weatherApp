import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { WeatherService } from '../../../../core/services/weather.service';
import { RecentSearch } from '../../../../core/models/weather.models';

@Component({
  selector: 'app-recent-searches-list',
  templateUrl: './recent-searches-list.component.html',
  styleUrls: ['./recent-searches-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class RecentSearchesListComponent {
  recentSearches$: Observable<RecentSearch[]>;

  constructor(private weatherService: WeatherService) {
    this.recentSearches$ = this.weatherService.recentSearches$;
  }

  onSearchClick(city: string): void {
    this.weatherService.searchCity(city);
  }
}
