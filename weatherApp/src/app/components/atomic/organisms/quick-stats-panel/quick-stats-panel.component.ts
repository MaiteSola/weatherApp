import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { WeatherService } from '../../../../core/services/weather.service';
import { WeatherStats } from '../../../../core/models/weather.models';

@Component({
  selector: 'app-quick-stats-panel',
  templateUrl: './quick-stats-panel.component.html',
  styleUrls: ['./quick-stats-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class QuickStatsPanelComponent {
  stats$: Observable<WeatherStats>;

  constructor(private weatherService: WeatherService) {
    this.stats$ = this.weatherService.weatherStats$;
  }
}
