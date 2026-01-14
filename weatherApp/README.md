# Weather App - Ionic + Angular + Tailwind CSS

Una aplicación moderna del clima desarrollada con Ionic, Angular y Tailwind CSS, con diseño responsive y dark mode.

## 🎨 Características

- ✅ Diseño moderno con dark mode
- ✅ Arquitectura de componentes separados y reutilizables
- ✅ Responsive design (móvil y desktop)
- ✅ Animaciones fluidas y transiciones
- ✅ Temas dinámicos del clima (soleado, nublado, lluvioso, tormenta)
- ✅ Pronóstico por horas (scroll horizontal)
- ✅ Pronóstico de 3 o 5 días
- ✅ Estadísticas rápidas (viento, precipitación, índice UV)
- ✅ Modal de configuración
- ✅ Búsquedas recientes

## 📁 Estructura de Componentes

El proyecto está organizado en componentes lógicos:

```
src/app/
├── components/
│   ├── weather-header/          # Cabecera con búsqueda y ubicación
│   ├── recent-searches/          # Chips de búsquedas recientes
│   ├── current-weather/          # Clima actual con animación de temas
│   ├── hourly-forecast/          # Pronóstico por horas
│   ├── quick-stats/              # Estadísticas (viento, precipitación, UV)
│   ├── weekly-forecast/          # Pronóstico semanal (3 o 5 días)
│   ├── bottom-navigation/        # Navegación inferior
│   └── settings-modal/           # Modal de configuración
├── core/
│   ├── models/
│   │   └── weather.models.ts     # Interfaces TypeScript
│   └── services/
│       └── weather.service.ts    # Servicio central con RxJS
└── home/
    └── home.page.ts              # Página principal que integra componentes
```

## 🛠️ Tecnologías Utilizadas

- **Ionic 8**: Framework para aplicaciones móviles híbridas
- **Angular 20**: Framework JavaScript para SPAs
- **Tailwind CSS 3**: Framework CSS utility-first
- **RxJS**: Programación reactiva con Observables
- **TypeScript**: JavaScript con tipado estático
- **Standalone Components**: Arquitectura moderna de Angular

## 🚀 Instalación y Ejecución

### Pre-requisitos

- Node.js (versión 18 o superior)
- npm

### Instalación

```bash
# Navegar a la carpeta del proyecto
cd weatherApp

# Instalar dependencias
npm install
```

### Ejecutar en desarrollo

```bash
# Servidor de desarrollo
npm start

# O alternativamente
ng serve
```

La aplicación estará disponible en `http://localhost:8100`

### Build de producción

```bash
# Compilar para producción
npm run build
```

## 📱 Integración con Capacitor (Opcional)

Para ejecutar en dispositivos móviles:

```bash
# Sincronizar con Capacitor
npx cap sync

# Abrir en Android Studio
npx cap open android

# Abrir en Xcode
npx cap open ios
```

## 🎯 Funcionalidades Clave

### Weather Service

El servicio central (`weather.service.ts`) maneja:

- **Temas dinámicos**: 4 temas del clima (sunny, cloudy, rainy, stormy)
- **Observables**: Estado reactivo con RxJS
- **Pronósticos**: Datos de pronóstico por horas y días
- **Búsquedas**: Gestión de búsquedas recientes

### Componentes Standalone

Todos los componentes son **standalone** (sin módulos), siguiendo las mejores prácticas de Angular moderno:

- Más fáciles de mantener
- Mejor tree-shaking
- Carga más rápida
- Menos boilerplate

### Diseño Responsive

- **Móvil**: Layout de una columna con scroll vertical
- **Desktop**: Grid de 2 columnas (8/4) con mejor aprovechamiento del espacio

## 🎨 Personalización

### Colores

Los colores se definen en `tailwind.config.js`:

```javascript
colors: {
  primary: "#007a8a",
  "background-light": "#f6f9f9",
  "background-dark": "#121212",
  "surface-dark": "#1e1e1e",
  "border-dark": "#2d2d2d",
}
```

### Temas del Clima

Los temas se configuran en `weather.service.ts` en el objeto `themes`.

## 📚 Próximas Mejoras

- [ ] Integración con API real de clima (OpenWeatherMap, WeatherAPI, etc.)
- [ ] Persistencia de configuración (LocalStorage)
- [ ] Internacionalización (i18n) completa
- [ ] Gráficos de temperatura
- [ ] Notificaciones push para alertas meteorológicas
- [ ] Geolocalización automática
- [ ] PWA (Progressive Web App)

## 👨‍💻 Autor

Desarrollado como proyecto educativo para el curso de Desarrollo de Interfaces.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.
