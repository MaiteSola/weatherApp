import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  WeatherTheme,
  HourlyForecast,
  DailyForecast,
  WeatherStats,
  CurrentWeather,
  RecentSearch,
  WeatherApiResponse,
} from '../models/weather.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // Themes definition
  private readonly apiKey = 'e71ee7af24af20959176cd386fa3999d';
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // Themes definition
  private readonly themes: Record<string, WeatherTheme> = {
    sunny: {
      condition: 'Despejado',
      icon: 'light_mode',
      bgGradient:
        'radial-gradient(circle at center, rgba(249, 115, 22, 0.5) 0%, rgba(249, 115, 22, 0.1) 40%, transparent 80%)',
      textColor: 'text-orange-400',
      glowColor: 'rgba(249, 115, 22, 0.4)',
    },
    cloudy: {
      condition: 'Nublado',
      icon: 'cloud',
      bgGradient:
        'radial-gradient(circle at center, rgba(156, 163, 175, 0.5) 0%, rgba(156, 163, 175, 0.1) 40%, transparent 80%)',
      textColor: 'text-gray-300',
      glowColor: 'rgba(156, 163, 175, 0.4)',
    },
    rainy: {
      condition: 'Lluvia',
      icon: 'rainy',
      bgGradient:
        'radial-gradient(circle at center, rgba(37, 99, 235, 0.5) 0%, rgba(37, 99, 235, 0.1) 40%, transparent 80%)',
      textColor: 'text-blue-400',
      glowColor: 'rgba(37, 99, 235, 0.4)',
    },
    stormy: {
      condition: 'Tormenta',
      icon: 'thunderstorm',
      bgGradient:
        'radial-gradient(circle at center, rgba(147, 51, 234, 0.5) 0%, rgba(147, 51, 234, 0.1) 40%, transparent 80%)',
      textColor: 'text-purple-400',
      glowColor: 'rgba(147, 51, 234, 0.4)',
    },
  };

  // Observable subjects
  private currentWeatherSubject = new BehaviorSubject<CurrentWeather>({
    temperature: 24,
    condition: 'Despejado',
    icon: 'light_mode',
    maxTemp: 28,
    minTemp: 16,
    location: 'Madrid',
    country: 'ES',
  });

  private currentThemeSubject = new BehaviorSubject<WeatherTheme>(
    this.themes['sunny'],
  );
  private weatherStatsSubject = new BehaviorSubject<WeatherStats>({
    wind: 12,
    precipitation: 10,
    uvIndex: 3,
  });

  private recentSearchesSubject = new BehaviorSubject<RecentSearch[]>([
    { city: 'Barcelona' },
    { city: 'London' },
    { city: 'New York' },
  ]);

  // Observables
  public currentWeather$: Observable<CurrentWeather> =
    this.currentWeatherSubject.asObservable();
  public currentTheme$: Observable<WeatherTheme> =
    this.currentThemeSubject.asObservable();
  public weatherStats$: Observable<WeatherStats> =
    this.weatherStatsSubject.asObservable();
  public recentSearches$: Observable<RecentSearch[]> =
    this.recentSearchesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get hourly forecast data
  getHourlyForecast(): HourlyForecast[] {
    return [
      { time: 'Ahora', icon: 'light_mode', temperature: 24, isActive: true },
      { time: '14:00', icon: 'light_mode', temperature: 25 },
      { time: '15:00', icon: 'partly_cloudy_day', temperature: 26 },
      { time: '16:00', icon: 'cloud', temperature: 25 },
      { time: '17:00', icon: 'cloud', temperature: 23 },
      { time: '18:00', icon: 'rainy', temperature: 21 },
      { time: '19:00', icon: 'thunderstorm', temperature: 20 },
      { time: '20:00', icon: 'thunderstorm', temperature: 19 },
      { time: '21:00', icon: 'cloudy_snowing', temperature: 18 },
      { time: '22:00', icon: 'cloudy_snowing', temperature: 17 },
      { time: '23:00', icon: 'bedtime', temperature: 16 },
    ];
  }

  // Get daily forecast data
  getDailyForecast(days: 3 | 5): DailyForecast[] {
    const allForecasts: DailyForecast[] = [
      {
        day: 'Hoy',
        text: 'Soleado',
        icon: 'light_mode',
        max: 28,
        min: 16,
        start: '50%',
        end: '0',
        color: 'from-cyan-400 to-yellow-400',
      },
      {
        day: 'Mañ',
        text: 'Parcial',
        icon: 'partly_cloudy_day',
        max: 26,
        min: 15,
        start: '40%',
        end: '10%',
        color: 'from-cyan-400 to-yellow-400',
      },
      {
        day: 'Mié',
        text: 'Lluvia',
        icon: 'rainy',
        max: 22,
        min: 14,
        start: '30%',
        end: '30%',
        color: 'from-cyan-400 to-yellow-400',
      },
      {
        day: 'Jue',
        text: 'Nublado',
        icon: 'cloud',
        max: 21,
        min: 13,
        start: '20%',
        end: '40%',
        color: 'from-cyan-400 to-yellow-400',
      },
      {
        day: 'Vie',
        text: 'Tormenta',
        icon: 'thunderstorm',
        max: 19,
        min: 12,
        start: '10%',
        end: '50%',
        color: 'from-cyan-400 to-yellow-400',
      },
    ];

    return allForecasts.slice(0, days);
  }

  // Get all available themes
  getThemes(): Record<string, WeatherTheme> {
    return this.themes;
  }

  // Get theme by name
  getTheme(name: string): WeatherTheme | undefined {
    return this.themes[name];
  }

  // Set current theme
  setTheme(themeName: string): void {
    const theme = this.themes[themeName];
    if (theme) {
      this.currentThemeSubject.next(theme);
      // Also update current weather condition
      const currentWeather = this.currentWeatherSubject.value;
      this.currentWeatherSubject.next({
        ...currentWeather,
        condition: theme.condition,
        icon: theme.icon,
      });
    }
  }

  // Cycle to next theme
  cycleTheme(): void {
    const themeKeys = Object.keys(this.themes);
    const currentTheme = this.currentThemeSubject.value;
    const currentIndex = themeKeys.findIndex(
      (key) => this.themes[key] === currentTheme,
    );
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    this.setTheme(themeKeys[nextIndex]);
  }

  // Search for a city
  searchCity(city: string): void {
    // Add to recent searches
    const searches = this.recentSearchesSubject.value;
    const newSearches = [
      { city },
      ...searches.filter((s) => s.city !== city),
    ].slice(0, 3);
    this.recentSearchesSubject.next(newSearches);

    // Call API
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;

    this.http.get<WeatherApiResponse>(url).subscribe({
      next: (data) => {
        // Map to CurrentWeather
        const current: CurrentWeather = {
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].description,
          icon: this.mapIcon(data.weather[0].icon),
          maxTemp: Math.round(data.main.temp_max),
          minTemp: Math.round(data.main.temp_min),
          location: data.name,
          country: data.sys.country,
        };
        this.currentWeatherSubject.next(current);

        // Update Theme based on weather id
        const themeName = this.getThemeNameFromCondition(data.weather[0].id);
        this.setTheme(themeName);

        // Update Stats
        const stats: WeatherStats = {
          wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          precipitation: data.main.humidity, // Using humidity as precipitation/moisture proxy
          uvIndex: 0, // Not available in current weather endpoint
        };
        this.weatherStatsSubject.next(stats);
      },
      error: (err) => {
        console.error('Error fetching weather:', err);
      },
    });
  }

  private mapIcon(apiIcon: string): string {
    const iconMap: Record<string, string> = {
      '01d': 'light_mode',
      '01n': 'bedtime',
      '02d': 'partly_cloudy_day',
      '02n': 'partly_cloudy_day',
      '03d': 'cloud',
      '03n': 'cloud',
      '04d': 'cloud',
      '04n': 'cloud',
      '09d': 'rainy',
      '09n': 'rainy',
      '10d': 'rainy',
      '10n': 'rainy',
      '11d': 'thunderstorm',
      '11n': 'thunderstorm',
      '13d': 'ac_unit',
      '13n': 'ac_unit',
      '50d': 'foggy',
      '50n': 'foggy',
    };
    return iconMap[apiIcon] || 'question_mark';
  }

  private getThemeNameFromCondition(id: number): string {
    if (id >= 200 && id < 300) return 'stormy';
    if (id >= 300 && id < 600) return 'rainy';
    if (id >= 600 && id < 700) return 'rainy'; // Snow
    if (id >= 700 && id < 800) return 'cloudy'; // Atmosphere
    if (id === 800) return 'sunny';
    if (id > 800) return 'cloudy';
    return 'sunny';
  }

  // Get recent searches
  getRecentSearches(): RecentSearch[] {
    return this.recentSearchesSubject.value;
  }
}
