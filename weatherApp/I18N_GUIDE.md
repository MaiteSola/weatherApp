# Internacionalización (i18n) - Weather App

## 📋 Configuración

La aplicación está configurada para soportar múltiples idiomas usando `@ngx-translate/core`.

### Idiomas disponibles actualmente:

- 🇪🇸 **Español** (es) - Idioma por defecto
- 🇬🇧 **Inglés** (en)

## 🚀 Cómo usar traducciones en componentes

### 1. Importar TranslateModule

En tu componente standalone, importa `TranslateModule`:

```typescript
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
  // ...
})
```

### 2. Usar traducciones en templates

Usa el pipe `translate` en tus templates:

```html
<!-- Traducción simple -->
<h1>{{ 'APP.TITLE' | translate }}</h1>

<!-- Con parámetros -->
<p>{{ 'WEATHER.TEMP_WITH_UNIT' | translate:{ temp: 25 } }}</p>

<!-- En atributos -->
<input [placeholder]="'HEADER.SEARCH_PLACEHOLDER' | translate" />
```

### 3. Usar traducciones en TypeScript

Inyecta `TranslateService` o usa `Language Service`:

```typescript
import { LanguageService } from './core/services/language.service';

constructor(private languageService: LanguageService) {}

someMethod() {
  const translation = this.languageService.getTranslation('FORECAST.NOW');
  console.log(translation); // Output: "Ahora" (if language is ES)
}
```

## 📁 Estructura de archivos de traducción

Los archivos de traducción están en `src/assets/i18n/`:

```
src/assets/i18n/
├── es.json  (Español)
├── en.json  (Inglés)
└── ... (otros idiomas)
```

### Estructura del JSON:

```json
{
  "SECTION": {
    "KEY": "Valor traducido",
    "NESTED": {
      "KEY": "Otro valor"
    }
  }
}
```

## 🎨 Componente de Selector de Idioma

Ya existe un componente `<app-language-selector>` que puedes usar:

```html
<app-language-selector></app-language-selector>
```

Este componente se puede integrar en el modal de settings u otra ubicación.

## ➕ Añadir un nuevo idioma

### 1. Crear archivo de traducción

Crea `src/assets/i18n/[codigo].json` (ej: `fr.json` para francés):

```json
{
  "APP": {
    "TITLE": "Application Météo"
  }
  // ... resto de traducciones
}
```

### 2. Actualizar el servicio

Edita `src/app/core/services/language.service.ts`:

```typescript
private availableLanguages = ['es', 'en', 'fr']; // Añade 'fr'
```

### 3. Actualizar el selector

Edita `language-selector.component.ts`:

```typescript
languages: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' } // Nuevo idioma
];
```

## 🔧 Métodos del LanguageService

```typescript
// Obtener idioma actual
getCurrentLanguage(): string

// Obtener lista de idiomas disponibles
getAvailableLanguages(): string[]

// Cambiar idioma
setLanguage(lang: string): void

// Obtener traducción específica
getTranslation(key: string): string
```

## 💡 Ejemplo completo

```typescript
import { Component, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "./core/services/language.service";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h1>{{ "APP.TITLE" | translate }}</h1>
    <button (click)="changeToEnglish()">English</button>
    <button (click)="changeToSpanish()">Español</button>
  `,
})
export class ExampleComponent {
  constructor(private languageService: LanguageService) {}

  changeToEnglish() {
    this.languageService.setLanguage("en");
  }

  changeToSpanish() {
    this.languageService.setLanguage("es");
  }
}
```

## 📝 Notas importantes

1. El idioma se guarda en `localStorage`, por lo que persiste entre sesiones
2. Por defecto, la app intenta usar el idioma del navegador
3. Si el idioma del navegador no está disponible, usa español como fallback
4. Todas las claves deben existir en todos los archivos de traducción

## 🌐 Idiomas sugeridos para agregar

- 🇫🇷 Francés (fr)
- 🇩🇪 Alemán (de)
- 🇮🇹 Italiano (it)
- 🇵🇹 Portugués (pt)
- 🇨🇳 Chino (zh)
- 🇯🇵 Japonés (ja)
