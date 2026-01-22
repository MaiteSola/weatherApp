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
  precipitation: number; // % (pop) or mm
  uvIndex: number;
  humidity: number; // %
  pressure: number; // hPa
  visibility: number; // km
  sunrise: string;
  sunset: string;
}

export interface GeoResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CurrentWeather {
  temperature: number;
  condition: string;
  icon: string;
  maxTemp: number;
  minTemp: number;
  feelsLike?: number;
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

// Forecast API Response (5 day / 3 hour)
export interface ForecastApiResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number; // Probability of precipitation
    rain?: {
      '3h'?: number;
    };
    snow?: {
      '3h'?: number;
    };
    sys: {
      pod: string; // Part of day (d/n)
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
