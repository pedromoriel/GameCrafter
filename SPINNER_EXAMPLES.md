/**
 * 🎯 EJEMPLOS AVANZADOS DE USO DEL LOADING SPINNER
 * 
 * Este archivo contiene ejemplos de cómo usar el LoadingService
 * en diferentes escenarios de tu aplicación
 */

// ═══════════════════════════════════════════════════════════════
// EJEMPLO 1: Uso Básico con Peticiones HTTP
// ═══════════════════════════════════════════════════════════════

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from './app/core/services/loading.service';

export class DataFetchComponent {
  data: any;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  // El spinner aparecerá AUTOMÁTICAMENTE gracias al interceptor
  loadUsers() {
    this.http.get('/api/users').subscribe(
      (response) => {
        this.data = response;
        // El spinner se oculta automáticamente
      },
      (error) => {
        console.error('Error:', error);
        // El spinner se oculta automáticamente incluso en errores
      }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO 2: Uso Manual en Operaciones Síncronas
// ═══════════════════════════════════════════════════════════════

export class ProcessingComponent {
  constructor(private loadingService: LoadingService) {}

  processData() {
    this.loadingService.show();

    // Simular procesamiento pesado
    setTimeout(() => {
      // ... tu lógica aquí
      console.log('Procesamiento completado');
      this.loadingService.hide();
    }, 2000);
  }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO 3: Uso en Formularios de Login
// ═══════════════════════════════════════════════════════════════

export class LoginFormComponent {
  constructor(
    private authService: any,
    private loadingService: LoadingService
  ) {}

  async onSubmit(email: string, password: string) {
    // Mostrar spinner
    this.loadingService.show();

    try {
      // Realizar login
      const response = await this.authService.login(email, password);
      // El spinner se ocultará automáticamente si authService usa HTTP

      console.log('Login exitoso');
      // Navegar a home
    } catch (error) {
      console.error('Error de login:', error);
    } finally {
      // Asegurarse de que se oculte si no usó HTTP
      this.loadingService.hide();
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO 4: Uso en Carga de Datos con Múltiples Peticiones
// ═══════════════════════════════════════════════════════════════

import { combineLatest } from 'rxjs';
import { finalize } from 'rxjs/operators';

export class DashboardComponent {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  loadDashboard() {
    this.loadingService.show();

    combineLatest([
      this.http.get('/api/users'),
      this.http.get('/api/games'),
      this.http.get('/api/stats')
    ])
      .pipe(
        finalize(() => this.loadingService.hide())
      )
      .subscribe(
        ([users, games, stats]) => {
          console.log('Datos cargados:', { users, games, stats });
        },
        (error) => {
          console.error('Error al cargar datos:', error);
        }
      );
  }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO 5: Uso en Guardias de Rutas (Route Guards)
// ═══════════════════════════════════════════════════════════════

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: any,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  canActivate(): boolean {
    this.loadingService.show();

    // Verificar autenticación
    const isAuthenticated = this.authService.isLoggedIn();

    if (isAuthenticated) {
      this.loadingService.hide();
      return true;
    } else {
      this.loadingService.hide();
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO 6: Uso con Descarga de Archivos
// ═══════════════════════════════════════════════════════════════

export class FileDownloadComponent {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  downloadFile() {
    this.loadingService.show();

    this.http.get('/api/file', { responseType: 'blob' }).subscribe(
      (blob) => {
        // Crear descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'archivo.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.loadingService.hide();
      },
      (error) => {
        console.error('Error en descarga:', error);
        this.loadingService.hide();
      }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO 7: Uso en Guardado de Datos
// ═══════════════════════════════════════════════════════════════

export class SaveDataComponent {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  saveSettings(settings: any) {
    this.loadingService.show();

    this.http.post('/api/settings', settings).subscribe(
      (response) => {
        console.log('Configuración guardada');
        // Mostrar notificación de éxito
      },
      (error) => {
        console.error('Error al guardar:', error);
        // Mostrar notificación de error
      }
      // El finally o finalize ocultará el spinner
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO 8: Uso con Temporizador Manual
// ═══════════════════════════════════════════════════════════════

export class TimerComponent {
  constructor(private loadingService: LoadingService) {}

  startLongOperation() {
    this.loadingService.show();

    let timeLeft = 5; // segundos
    const timer = setInterval(() => {
      timeLeft--;

      if (timeLeft <= 0) {
        clearInterval(timer);
        this.loadingService.hide();
        console.log('Operación completada');
      }
    }, 1000);
  }
}

// ═══════════════════════════════════════════════════════════════
// CONSEJO FINAL ⭐
// ═══════════════════════════════════════════════════════════════
// 
// La mayoría del tiempo, el interceptor HTTP cuidará de mostrar/ocultar
// el spinner automáticamente. Solo necesitas llamar manualmente a
// loadingService.show()/hide() en:
//
// 1. Operaciones síncronas que tarden tiempo
// 2. Operaciones que NO usan HTTP
// 3. Procesamiento en el navegador
// 4. Guardias de rutas
// 5. Transiciones de página
//
// En todos los demás casos, ¡déjalo en manos del interceptor! 🎉
