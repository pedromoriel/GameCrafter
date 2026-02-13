import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage$ = new BehaviorSubject<Language>('en');
  private readonly LANGUAGE_KEY = 'gamecrafter_language';
  private readonly DEFAULT_LANGUAGE: Language = 'en';

  constructor(private translateService: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Try to get language from localStorage
    const storedLanguage = localStorage.getItem(this.LANGUAGE_KEY) as Language | null;
    const browserLanguage = this.getBrowserLanguage();
    const initialLanguage = storedLanguage || browserLanguage || this.DEFAULT_LANGUAGE;

    this.setLanguage(initialLanguage);
  }

  private getBrowserLanguage(): Language {
    const browserLang = navigator.language.substring(0, 2);
    return (browserLang === 'es' || browserLang === 'en') ? browserLang as Language : this.DEFAULT_LANGUAGE;
  }

  public setLanguage(lang: Language): void {
    this.currentLanguage$.next(lang);
    this.translateService.use(lang);
    localStorage.setItem(this.LANGUAGE_KEY, lang);
  }

  public getCurrentLanguage(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  public getCurrentLanguageSync(): Language {
    return this.currentLanguage$.value;
  }

  public getAvailableLanguages(): Language[] {
    return ['en', 'es'];
  }

  public toggleLanguage(): void {
    const current = this.currentLanguage$.value;
    const next = current === 'en' ? 'es' : 'en';
    this.setLanguage(next);
  }
}
