export interface WeatherTheme {
  condition: string;
  icon: string;
  bgGradient: string;
  textColor: string;
  glowColor: string;
}

export interface HourlyForecast {
  time: string;
  icon: string;
  temperature: number;
  isActive?: boolean;
}

export interface DailyForecast {
  day: string;
  text: string;
  icon: string;
  max: number;
  min: number;
  start: string;
  end: string;
  color: string;
}

export interface WeatherStats {
  wind: number; // km/h
  precipitation: number; // %
  uvIndex: number;
}

export interface CurrentWeather {
  temperature: number;
  condition: string;
  icon: string;
  maxTemp: number;
  minTemp: number;
  location: string;
  country: string;
}

export interface RecentSearch {
  city: string;
}
