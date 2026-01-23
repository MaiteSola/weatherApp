import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private availableLanguages = ['es', 'en', 'eu'];
  private defaultLanguage = 'es';

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage(): void {
    // Set available languages
    this.translate.addLangs(this.availableLanguages);

    // Set default language
    this.translate.setDefaultLang(this.defaultLanguage);

    // Try to use browser language or fallback to default
    const browserLang = this.translate.getBrowserLang();
    const langToUse = this.availableLanguages.includes(browserLang || '')
      ? browserLang
      : this.defaultLanguage;

    this.translate.use(langToUse || this.defaultLanguage);

    // Save to localStorage
    localStorage.setItem('language', langToUse || this.defaultLanguage);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }

  getAvailableLanguages(): string[] {
    return this.availableLanguages;
  }

  setLanguage(lang: string): void {
    if (this.availableLanguages.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('language', lang);
    }
  }

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }
}
