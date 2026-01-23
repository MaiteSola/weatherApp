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
  GeoResponse,
} from '../models/weather.models';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // Themes definition
  private readonly apiKey = 'e71ee7af24af20959176cd386fa3999d';
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly forecastUrl =
    'https://api.openweathermap.org/data/2.5/forecast';
  private readonly geoUrl = 'https://api.openweathermap.org/geo/1.0/direct';

  // Store current coordinates for forecast requests
  private currentLat: number = 40.4168; // Default: Madrid
  private currentLon: number = -3.7038;

  // Temperature Unit State
  private unitSubject = new BehaviorSubject<'celsius' | 'fahrenheit'>(
    'celsius',
  );
  public unit$ = this.unitSubject.asObservable();

  // Themes definition
  private readonly themes: Record<string, WeatherTheme> = {
    sunny: {
      condition: 'WEATHER.CONDITION.CLEAR',
      icon: 'light_mode',
      bgGradient:
        'radial-gradient(circle at center, rgba(249, 115, 22, 0.5) 0%, rgba(249, 115, 22, 0.1) 40%, transparent 80%)',
      textColor: 'text-orange-400',
      glowColor: 'rgba(249, 115, 22, 0.4)',
    },
    cloudy: {
      condition: 'WEATHER.CONDITION.CLOUDY',
      icon: 'cloud',
      bgGradient:
        'radial-gradient(circle at center, rgba(156, 163, 175, 0.5) 0%, rgba(156, 163, 175, 0.1) 40%, transparent 80%)',
      textColor: 'text-gray-300',
      glowColor: 'rgba(156, 163, 175, 0.4)',
    },
    rainy: {
      condition: 'WEATHER.CONDITION.RAIN',
      icon: 'rainy',
      bgGradient:
        'radial-gradient(circle at center, rgba(37, 99, 235, 0.5) 0%, rgba(37, 99, 235, 0.1) 40%, transparent 80%)',
      textColor: 'text-blue-400',
      glowColor: 'rgba(37, 99, 235, 0.4)',
    },
    stormy: {
      condition: 'WEATHER.CONDITION.THUNDERSTORM',
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
    condition: 'WEATHER.CONDITION.CLEAR',
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
    precipitation: 0,
    uvIndex: 0,
    humidity: 45,
    pressure: 1012,
    visibility: 10,
    sunrise: '07:00',
    sunset: '20:30',
  });

  private recentSearchesSubject = new BehaviorSubject<RecentSearch[]>([
    { city: 'Barcelona' },
    { city: 'London' },
    { city: 'New York' },
  ]);

  private hourlyForecastSubject = new BehaviorSubject<HourlyForecast[]>([]);
  private dailyForecastSubject = new BehaviorSubject<DailyForecast[]>([]);

  // Coordinates subject to share with map
  private currentCoordinatesSubject = new BehaviorSubject<{
    lat: number;
    lon: number;
  }>({
    lat: 40.4168,
    lon: -3.7038,
  });

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
  public currentCoordinates$: Observable<{ lat: number; lon: number }> =
    this.currentCoordinatesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private languageService: LanguageService,
  ) {}

  // Fetch and update hourly forecast from API with interpolation for every hour
  private fetchHourlyForecast(): void {
    const lang = this.languageService.getCurrentLanguage();
    const url = `${this.forecastUrl}?lat=${this.currentLat}&lon=${this.currentLon}&appid=${this.apiKey}&units=metric&lang=${lang}`;

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

        // Generate hourly forecasts for the next 12 hours from current time
        const startHour = nowInCity.getHours();
        const currentDate = new Date(nowInCity);
        currentDate.setMinutes(0, 0, 0);

        for (let i = 0; i < 12; i++) {
          const targetTime = new Date(nowInCity);
          targetTime.setHours(startHour + i, 0, 0, 0);
          const targetTimestamp = targetTime.getTime() / 1000;

          // Find the two closest forecast points
          let before: any = null;
          let after: any = null;

          for (let j = 0; j < forecasts.length - 1; j++) {
            if (
              forecasts[j].dt <= targetTimestamp &&
              forecasts[j + 1].dt >= targetTimestamp
            ) {
              before = forecasts[j];
              after = forecasts[j + 1];
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

            const displayHour = (startHour + i) % 24;
            hourlyData.push({
              time:
                i === 0
                  ? 'Ahora'
                  : `${displayHour.toString().padStart(2, '0')}:00`,
              icon: this.mapIcon(closest.weather[0].icon),
              temperature: Math.round(closest.main.temp),
              isActive: i === 0,
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

          const displayHour = (startHour + i) % 24;
          hourlyData.push({
            time:
              i === 0
                ? 'Ahora'
                : `${displayHour.toString().padStart(2, '0')}:00`,
            icon: this.mapIcon(weatherIcon),
            temperature: Math.round(interpolatedTemp),
            isActive: i === 0,
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
    const lang = this.languageService.getCurrentLanguage();
    const url = `${this.forecastUrl}?lat=${this.currentLat}&lon=${this.currentLon}&appid=${this.apiKey}&units=metric&lang=${lang}`;

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
        const dayNames = [
          'DAYS.SUN',
          'DAYS.MON',
          'DAYS.TUE',
          'DAYS.WED',
          'DAYS.THU',
          'DAYS.FRI',
          'DAYS.SAT',
        ];

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

          const weatherConditionId =
            forecasts.find((f) => f.weather[0].icon === mostCommonIcon)
              ?.weather[0].id || 800;

          const weatherConditionKey =
            this.getTranslationKeyForWeatherId(weatherConditionId);

          // Calculate precipitation probability
          const avgPop = Math.round(
            (forecasts.reduce((sum, f) => sum + f.pop, 0) / forecasts.length) *
              100,
          );

          dailyForecasts.push({
            day: index === 0 ? 'FORECAST.TODAY' : dayNames[date.getDay()],
            text: weatherConditionKey,
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
        day: 'FORECAST.TODAY',
        text: 'Soleado',
        icon: 'light_mode',
        max: 28,
        min: 16,
        start: '50%',
        end: '0',
        color: 'from-cyan-400 to-yellow-400',
      },
      {
        day: 'FORECAST.TOMORROW', // Ensure this key exists or use logic
        text: 'Parcial',
        icon: 'partly_cloudy_day',
        max: 26,
        min: 15,
        start: '40%',
        end: '10%',
        color: 'from-cyan-400 to-yellow-400',
      },
      {
        day: 'DAYS.WED',
        text: 'Lluvia',
        icon: 'rainy',
        max: 22,
        min: 14,
        start: '30%',
        end: '30%',
        color: 'from-cyan-400 to-yellow-400',
      },
      {
        day: 'DAYS.THU',
        text: 'Nublado',
        icon: 'cloud',
        max: 21,
        min: 13,
        start: '20%',
        end: '40%',
        color: 'from-cyan-400 to-yellow-400',
      },
      {
        day: 'DAYS.FRI',
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

  // Set temperature unit
  setUnit(unit: 'celsius' | 'fahrenheit'): void {
    this.unitSubject.next(unit);
  }

  getCurrentUnit(): 'celsius' | 'fahrenheit' {
    return this.unitSubject.value;
  }

  // Search by coordinates (Reverse Geocoding)
  searchByCoordinates(lat: number, lon: number): void {
    this.currentLat = lat;
    this.currentLon = lon;

    // Emit new coordinates for map to update
    this.currentCoordinatesSubject.next({ lat, lon });

    const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`;

    this.http.get<GeoResponse[]>(reverseGeoUrl).subscribe({
      next: (geoData) => {
        if (!geoData || geoData.length === 0) {
          console.warn('No location found for coordinates:', lat, lon);
          return;
        }

        const location = geoData[0];
        const lang = this.languageService.getCurrentLanguage();
        // Use local name if available, otherwise default name
        const displayName = location.local_names?.[lang] || location.name;

        // Reuse the logic to fetch weather data
        this.fetchWeatherData(displayName, location.country);
      },
      error: (err) => {
        console.error('Error fetching location name:', err);
      },
    });
  }

  // Method to refresh weather data when language changes
  refetchWeatherData(): void {
    const lang = this.languageService.getCurrentLanguage();

    // Refresh weather data and ensure city name is translated
    this.searchByCoordinates(this.currentLat, this.currentLon);
  }

  // Refactored method to fetch weather data (shared by searchCity and searchByCoordinates)
  private fetchWeatherData(displayName: string, country: string): void {
    const lang = this.languageService.getCurrentLanguage();
    // Call Weather API with coordinates
    const weatherUrl = `${this.apiUrl}?lat=${this.currentLat}&lon=${this.currentLon}&appid=${this.apiKey}&units=metric&lang=${lang}`;

    this.http.get<WeatherApiResponse>(weatherUrl).subscribe({
      next: (data) => {
        // Fetch forecast data to get accurate min/max for today
        const forecastUrl = `${this.forecastUrl}?lat=${this.currentLat}&lon=${this.currentLon}&appid=${this.apiKey}&units=metric&lang=${lang}`;

        this.http.get<ForecastApiResponse>(forecastUrl).subscribe({
          next: (forecastData) => {
            // Use the city's timezone offset to determine "today"
            const timezoneOffset = forecastData.city.timezone; // seconds
            const now = new Date();
            const cityTime = new Date(now.getTime() + timezoneOffset * 1000);
            const todayInCity = cityTime.toISOString().split('T')[0];

            // Filter forecast entries for today in the city's timezone
            const todayForecasts = forecastData.list.filter((f) => {
              const forecastTime = new Date((f.dt + timezoneOffset) * 1000);
              const forecastDate = forecastTime.toISOString().split('T')[0];
              return forecastDate === todayInCity;
            });

            // Calculate actual min/max from today's forecast data
            let maxTemp = data.main.temp_max;
            let minTemp = data.main.temp_min;

            if (todayForecasts.length > 0) {
              const temps = todayForecasts.map((f) => f.main.temp);
              maxTemp = Math.max(...temps);
              minTemp = Math.min(...temps);
            }

            // Map to CurrentWeather with correct min/max
            const current: CurrentWeather = {
              temperature: Math.round(data.main.temp),
              condition: this.getTranslationKeyForWeatherId(data.weather[0].id),
              icon: this.mapIcon(data.weather[0].icon),
              maxTemp: Math.round(maxTemp),
              minTemp: Math.round(minTemp),
              feelsLike: Math.round(data.main.feels_like),
              location: displayName,
              country: country,
            };
            this.currentWeatherSubject.next(current);

            // Update Theme based on weather id
            const themeName = this.getThemeNameFromCondition(
              data.weather[0].id,
            );
            this.setTheme(themeName);

            // Update Stats
            const stats: WeatherStats = {
              wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
              precipitation: data.rain ? data.rain['1h'] || 0 : 0, // Rain volume in last hour
              uvIndex: 0, // Not available in standard API
              humidity: data.main.humidity,
              pressure: data.main.pressure,
              visibility: Math.round(data.visibility / 100) / 10, // meters to km (with 1 decimal)
              sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(
                'es-ES',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                },
              ),
              sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(
                'es-ES',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                },
              ),
            };
            this.weatherStatsSubject.next(stats);

            // Fetch forecasts with new coordinates
            this.fetchHourlyForecast();
            this.fetchDailyForecast(5);
          },
          error: (err) => {
            console.error('Error fetching forecast for min/max:', err);
            // Fallback to current weather min/max if forecast fails
            const current: CurrentWeather = {
              temperature: Math.round(data.main.temp),
              condition: data.weather[0].description,
              icon: this.mapIcon(data.weather[0].icon),
              maxTemp: Math.round(data.main.temp_max),
              minTemp: Math.round(data.main.temp_min),
              location: displayName,
              country: country,
            };
            this.currentWeatherSubject.next(current);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching weather:', err);
      },
    });
  }

  // Search for a city
  searchCity(city: string): void {
    this.internalSearchCity(city, city);
  }

  private internalSearchCity(city: string, originalQuery: string): void {
    const geoUrl = `${this.geoUrl}?q=${city}&limit=5&appid=${this.apiKey}`;

    this.http.get<GeoResponse[]>(geoUrl).subscribe({
      next: (geoData) => {
        if (!geoData || geoData.length === 0) {
          // If not found and query is long enough, try "fuzzy" search by removing last char
          if (city.length > 3) {
            this.internalSearchCity(city.slice(0, -1), originalQuery);
          } else {
            console.warn('No location found for:', originalQuery);
          }
          return;
        }

        // Found a location
        const location = geoData[0];
        this.currentLat = location.lat;
        this.currentLon = location.lon;

        // Emit new coordinates for map to update
        this.currentCoordinatesSubject.next({
          lat: location.lat,
          lon: location.lon,
        });

        const lang = this.languageService.getCurrentLanguage();
        // Use local name if available, otherwise default name
        const displayName = location.local_names?.[lang] || location.name;

        // Add found city to recent searches (use display name or original query if preferred)
        // Here we use the actual found name for better UX
        const searches = this.recentSearchesSubject.value;
        const newSearches = [
          { city: displayName },
          ...searches.filter((s) => s.city !== displayName),
        ].slice(0, 3);
        this.recentSearchesSubject.next(newSearches);

        // Call common weather fetch logic
        this.fetchWeatherData(displayName, location.country);
      },
      error: (err) => {
        console.error('Error fetching coordinates:', err);
      },
    });
  }

  private mapIcon(apiIcon: string): string {
    const iconMap: Record<string, string> = {
      '01d': 'wb_sunny', // Clear sky - day
      '01n': 'nights_stay', // Clear sky - night
      '02d': 'partly_cloudy_day', // Few clouds - day
      '02n': 'nights_stay', // Few clouds - night (usando nights con clouds)
      '03d': 'cloud', // Scattered clouds
      '03n': 'cloud',
      '04d': 'cloud', // Broken clouds
      '04n': 'cloud',
      '09d': 'grain', // Shower rain
      '09n': 'grain',
      '10d': 'rainy', // Rain
      '10n': 'rainy',
      '11d': 'thunderstorm', // Thunderstorm
      '11n': 'thunderstorm',
      '13d': 'ac_unit', // Snow
      '13n': 'ac_unit',
      '50d': 'foggy', // Mist/Fog
      '50n': 'foggy',
    };
    return iconMap[apiIcon] || 'help_outline';
  }

  private getTranslationKeyForWeatherId(id: number): string {
    if (id >= 200 && id < 300) return 'WEATHER.CONDITION.THUNDERSTORM';
    if (id >= 300 && id < 500) return 'WEATHER.CONDITION.DRIZZLE';
    if (id >= 500 && id < 600) return 'WEATHER.CONDITION.RAIN';
    if (id >= 600 && id < 700) return 'WEATHER.CONDITION.SNOW';
    if (id >= 700 && id < 800) return 'WEATHER.CONDITION.ATMOSPHERE';
    if (id === 800) return 'WEATHER.CONDITION.CLEAR';
    if (id === 801) return 'WEATHER.CONDITION.FEW_CLOUDS';
    if (id === 802) return 'WEATHER.CONDITION.SCATTERED_CLOUDS';
    if (id === 803) return 'WEATHER.CONDITION.BROKEN_CLOUDS';
    if (id === 804) return 'WEATHER.CONDITION.OVERCAST_CLOUDS';
    return 'WEATHER.CONDITION.UNKNOWN';
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
