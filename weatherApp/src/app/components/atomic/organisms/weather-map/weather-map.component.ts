import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeatherService } from '../../../../core/services/weather.service';
import * as L from 'leaflet';

interface MapLayerOption {
  id: 'temp' | 'precipitation' | 'clouds' | 'wind';
  label: string;
  icon: string;
}

@Component({
  selector: 'app-weather-map',
  templateUrl: './weather-map.component.html',
  styleUrls: ['./weather-map.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class WeatherMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private weatherLayer!: L.TileLayer;
  private apiKey = 'e71ee7af24af20959176cd386fa3999d';

  selectedLayer: 'temp' | 'precipitation' | 'clouds' | 'wind' = 'temp';

  layerOptions: MapLayerOption[] = [
    { id: 'temp', label: 'Temperatura', icon: 'thermostat' },
    { id: 'precipitation', label: 'Precipitación', icon: 'rainy' },
    { id: 'clouds', label: 'Nubes', icon: 'cloud' },
    { id: 'wind', label: 'Viento', icon: 'air' },
  ];

  private currentLat = 40.4168;
  private currentLon = -3.7038;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    // Subscribe to current weather to get coordinates
    this.weatherService.currentWeather$.subscribe((weather) => {
      // The service stores currentLat/Lon internally, but we can approximate from city
      // For now we'll use the default and update when map is ready
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Fix Leaflet Default Icon Issue
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;

    // Ensure DOM is ready
    setTimeout(() => {
      if (this.map) {
        this.map.remove();
      }

      // Create map centered on current location
      this.map = L.map('weather-map', {
        center: [this.currentLat, this.currentLon],
        zoom: 6,
        zoomControl: true,
      });

      // Add base tile layer (dark theme to match app)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        },
      ).addTo(this.map);

      // Add initial weather layer
      this.updateWeatherLayer();

      // Try to get current location and center map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentLat = position.coords.latitude;
            this.currentLon = position.coords.longitude;
            this.map.setView([this.currentLat, this.currentLon], 8);
          },
          (error) => {
            console.warn('Could not get location for map:', error);
          },
        );
      }
    }, 100);
  }

  private updateWeatherLayer(): void {
    // Remove existing weather layer if present
    if (this.weatherLayer) {
      this.map.removeLayer(this.weatherLayer);
    }

    // Map layer IDs to OpenWeatherMap layer names
    const layerMap: Record<string, string> = {
      temp: 'temp_new',
      precipitation: 'precipitation_new',
      clouds: 'clouds_new',
      wind: 'wind_new',
    };

    const layerName = layerMap[this.selectedLayer];

    // Add OpenWeatherMap tile layer
    this.weatherLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${this.apiKey}`,
      {
        maxZoom: 19,
        opacity: 0.7,
      },
    );

    this.weatherLayer.addTo(this.map);
  }

  onLayerChange(layerId: 'temp' | 'precipitation' | 'clouds' | 'wind'): void {
    this.selectedLayer = layerId;
    this.updateWeatherLayer();
  }

  centerOnLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.map.setView(
          [position.coords.latitude, position.coords.longitude],
          10,
        );
      });
    }
  }
}
