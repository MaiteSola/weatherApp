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

export interface WeatherApiResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
  };
  snow?: {
    '1h'?: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
