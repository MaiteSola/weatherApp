import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature',
  standalone: true,
})
export class TemperaturePipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    unit: 'celsius' | 'fahrenheit' | null = 'celsius',
  ): string {
    if (value === null || value === undefined) return '';

    // API always returns Celsius based on our WeatherService configuration
    // So value is assumed to be in Celsius

    if (unit === 'fahrenheit') {
      const fahrenheit = (value * 9) / 5 + 32;
      return `${Math.round(fahrenheit)}°`;
    }

    return `${Math.round(value)}°`;
  }
}
