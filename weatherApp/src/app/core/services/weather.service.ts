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
  ForecastApiResponse,
} from '../models/weather.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // Themes definition
  private readonly apiKey = 'e71ee7af24af20959176cd386fa3999d';
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly forecastUrl =
    'https://api.openweathermap.org/data/2.5/forecast';

  // Store current coordinates for forecast requests
  private currentLat: number = 40.4168; // Default: Madrid
  private currentLon: number = -3.7038;

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

  private hourlyForecastSubject = new BehaviorSubject<HourlyForecast[]>([]);
  private dailyForecastSubject = new BehaviorSubject<DailyForecast[]>([]);

  // Observables
  public currentWeather$: Observable<CurrentWeather> =
    this.currentWeatherSubject.asObservable();
  public currentTheme$: Observable<WeatherTheme> =
    this.currentThemeSubject.asObservable();
  public weatherStats$: Observable<WeatherStats> =
    this.weatherStatsSubject.asObservable();
  public recentSearches$: Observable<RecentSearch[]> =
    this.recentSearchesSubject.asObservable();
  public hourlyForecast$: Observable<HourlyForecast[]> =
    this.hourlyForecastSubject.asObservable();
  public dailyForecast$: Observable<DailyForecast[]> =
    this.dailyForecastSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch and update hourly forecast from API with interpolation for every hour
  private fetchHourlyForecast(): void {
    const url = `${this.forecastUrl}?lat=${this.currentLat}&lon=${this.currentLon}&appid=${this.apiKey}&units=metric&lang=es`;

    this.http.get<ForecastApiResponse>(url).subscribe({
      next: (data) => {
        const timezoneOffsetSeconds = data.city.timezone; // Timezone offset in seconds
        const hourlyData: HourlyForecast[] = [];

        // Get current time in the city's timezone
        const nowUtc = new Date();
        const nowInCity = new Date(
          nowUtc.getTime() + timezoneOffsetSeconds * 1000,
        );

        // Get midnight of current day in city's timezone
        const midnightInCity = new Date(nowInCity);
        midnightInCity.setHours(23, 59, 59, 999);

        // Get available forecast data
        const forecasts = data.list;

        if (forecasts.length < 2) {
          // Not enough data to interpolate
          this.hourlyForecastSubject.next(this.getFallbackHourlyForecast());
          return;
        }

        // Generate hourly forecasts from current hour to midnight
        const startHour = nowInCity.getHours();
        const currentDate = new Date(nowInCity);
        currentDate.setMinutes(0, 0, 0);

        for (let hour = startHour; hour <= 23; hour++) {
          const targetTime = new Date(nowInCity);
          targetTime.setHours(hour, 0, 0, 0);
          const targetTimestamp = targetTime.getTime() / 1000;

          // Find the two closest forecast points
          let before: any = null;
          let after: any = null;

          for (let i = 0; i < forecasts.length - 1; i++) {
            if (
              forecasts[i].dt <= targetTimestamp &&
              forecasts[i + 1].dt >= targetTimestamp
            ) {
              before = forecasts[i];
              after = forecasts[i + 1];
              break;
            }
          }

          // If we can't interpolate, use the closest point
          if (!before || !after) {
            const closest = forecasts.reduce((prev, curr) =>
              Math.abs(curr.dt - targetTimestamp) <
              Math.abs(prev.dt - targetTimestamp)
                ? curr
                : prev,
            );

            hourlyData.push({
              time:
                hour === startHour
                  ? 'Ahora'
                  : `${hour.toString().padStart(2, '0')}:00`,
              icon: this.mapIcon(closest.weather[0].icon),
              temperature: Math.round(closest.main.temp),
              isActive: hour === startHour,
            });
            continue;
          }

          // Interpolate temperature between the two points
          const timeDiff = after.dt - before.dt;
          const timeOffset = targetTimestamp - before.dt;
          const ratio = timeOffset / timeDiff;

          const interpolatedTemp =
            before.main.temp + (after.main.temp - before.main.temp) * ratio;

          // Use the icon from the closest point
          const useAfterIcon = ratio > 0.5;
          const weatherIcon = useAfterIcon
            ? after.weather[0].icon
            : before.weather[0].icon;

          hourlyData.push({
            time:
              hour === startHour
                ? 'Ahora'
                : `${hour.toString().padStart(2, '0')}:00`,
            icon: this.mapIcon(weatherIcon),
            temperature: Math.round(interpolatedTemp),
            isActive: hour === startHour,
          });
        }

        this.hourlyForecastSubject.next(hourlyData);
      },
      error: (err) => {
        console.error('Error fetching hourly forecast:', err);
        this.hourlyForecastSubject.next(this.getFallbackHourlyForecast());
      },
    });
  }

  // Fallback data in case API fails
  private getFallbackHourlyForecast(): HourlyForecast[] {
    return [
      { time: 'Ahora', icon: 'light_mode', temperature: 24, isActive: true },
      { time: '14:00', icon: 'light_mode', temperature: 25 },
      { time: '15:00', icon: 'partly_cloudy_day', temperature: 26 },
      { time: '16:00', icon: 'cloud', temperature: 25 },
      { time: '17:00', icon: 'cloud', temperature: 23 },
      { time: '18:00', icon: 'rainy', temperature: 21 },
    ];
  }

  // Fetch and update daily forecast from API
  private fetchDailyForecast(days: 3 | 5 = 5): void {
    const url = `${this.forecastUrl}?lat=${this.currentLat}&lon=${this.currentLon}&appid=${this.apiKey}&units=metric&lang=es`;

    this.http.get<ForecastApiResponse>(url).subscribe({
      next: (data) => {
        // Group forecasts by day
        const dailyMap = new Map<string, any[]>();

        data.list.forEach((forecast) => {
          const date = new Date(forecast.dt * 1000);
          const dayKey = date.toISOString().split('T')[0];

          if (!dailyMap.has(dayKey)) {
            dailyMap.set(dayKey, []);
          }
          dailyMap.get(dayKey)!.push(forecast);
        });

        const dailyForecasts: DailyForecast[] = [];
        const daysArray = Array.from(dailyMap.entries()).slice(0, days);
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        daysArray.forEach(([dateKey, forecasts], index) => {
          const date = new Date(dateKey);
          const temps = forecasts.map((f) => f.main.temp);
          const maxTemp = Math.round(Math.max(...temps));
          const minTemp = Math.round(Math.min(...temps));

          // Get the most common weather condition for the day
          const weatherCounts = new Map<string, number>();
          forecasts.forEach((f) => {
            const icon = f.weather[0].icon;
            weatherCounts.set(icon, (weatherCounts.get(icon) || 0) + 1);
          });
          const mostCommonIcon = Array.from(weatherCounts.entries()).sort(
            (a, b) => b[1] - a[1],
          )[0][0];

          const weatherCondition =
            forecasts.find((f) => f.weather[0].icon === mostCommonIcon)
              ?.weather[0].description || 'Despejado';

          // Calculate precipitation probability
          const avgPop = Math.round(
            (forecasts.reduce((sum, f) => sum + f.pop, 0) / forecasts.length) *
              100,
          );

          dailyForecasts.push({
            day: index === 0 ? 'Hoy' : dayNames[date.getDay()],
            text: this.truncateText(weatherCondition, 8),
            icon: this.mapIcon(mostCommonIcon),
            max: maxTemp,
            min: minTemp,
            start: `${avgPop}%`,
            end: `${Math.max(0, avgPop - 20)}%`,
            color: 'from-cyan-400 to-yellow-400',
          });
        });

        this.dailyForecastSubject.next(dailyForecasts);
      },
      error: (err) => {
        console.error('Error fetching daily forecast:', err);
        this.dailyForecastSubject.next(this.getFallbackDailyForecast(days));
      },
    });
  }

  // Fallback data in case API fails
  private getFallbackDailyForecast(days: 3 | 5): DailyForecast[] {
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

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
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
        // Store coordinates for forecast requests
        this.currentLat = data.coord.lat;
        this.currentLon = data.coord.lon;

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

        // Fetch forecasts with new coordinates
        this.fetchHourlyForecast();
        this.fetchDailyForecast(5);
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
