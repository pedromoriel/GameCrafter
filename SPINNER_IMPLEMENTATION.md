# 🎯 Loading Spinner - Guía Completa

## Descripción

Se ha añadido un sistema global de loading spinner que se muestra automáticamente cuando:
- Hay peticiones HTTP en curso (gracias al interceptor)
- Se llama manualmente a `loadingService.show()`

## 📦 Archivos Creados

### 1. **LoadingService** (`src/app/core/services/loading.service.ts`)
Servicio que maneja el estado del spinner usando RxJS BehaviorSubject.

```typescript
// Métodos disponibles:
loadingService.show()  // Muestra el spinner
loadingService.hide()  // Oculta el spinner
loadingService.loading$ // Observable del estado (para templates)
```

### 2. **LoadingComponent** (`src/app/shared/components/loading.component.ts`)
Componente visualmente bonito con:
- Spinner animado (PrimeNG ProgressSpinner)
- Overlay oscuro semi-transparente
- Efecto blur de fondo
- Texto "Cargando..." personalizable
- Alto z-index (9999) para aparecer encima de todo

### 3. **LoadingInterceptor** (`src/app/core/interceptors/loading.interceptor.ts`)
Interceptor HTTP que:
- Muestra automáticamente el spinner con cada petición HTTP
- Oculta el spinner cuando termina la petición
- Funciona con cualquier error o éxito

### 4. **Configuración** (`src/app/app.config.ts`)
- Interceptor registrado como proveedor HTTP
- LoadingComponent integrado en app.ts

## 🚀 Uso

### Opción 1: Automático con Peticiones HTTP
```typescript
// Sin hacer nada especial, el spinner aparece automáticamente

this.http.get('/api/users').subscribe(data => {
  // El spinner se oculta automáticamente al terminar
});
```

### Opción 2: Manual en Componentes
```typescript
import { LoadingService } from '../core/services/loading.service';

export class MyComponent {
  constructor(private loadingService: LoadingService) {}

  doSomething() {
    this.loadingService.show();
    
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }
}
```

### Opción 3: En Formularios
```typescript
onSubmit() {
  if (this.form.valid) {
    this.loadingService.show();
    
    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loadingService.hide();
        this.showError('Login failed');
      }
    });
  }
}
```

## 🎨 Personalización

### Cambiar el Spinner
Edita [loading.component.ts](../app/src/app/shared/components/loading.component.ts):
```typescript
<p-progressSpinner 
  [style]="{ width: '80px', height: '80px' }"
  strokeWidth="4"
  fill="transparent"
  animationDuration=".9s">
</p-progressSpinner>
```

### Cambiar el Texto
Modifica el template:
```typescript
<p class="loading-text">{{ loadingMessage }}</p>
```

### Cambiar los Estilos
Edita el CSS en el componente:
```typescript
.loading-overlay {
  background-color: rgba(0, 0, 0, 0.5); // Opacidad del fondo
  // ... más estilos
}
```

## 🔍 Estados

- ✅ **Activo**: El spinner se muestra cuando `loading$` es true
- ❌ **Inactivo**: Se oculta cuando `loading$` es false
- **Z-index**: 9999 (sobre cualquier otro elemento)
- **Backdrop**: Semifondo oscuro con blur

## ⚡ Rendimiento

- Usa OnPush change detection strategy
- BehaviorSubject para estado reactivo
- Interceptor sin overhead significativo
- CSS optimizado para animaciones suaves

## 📋 Checklist de Integración

- [x] LoadingService creado en core/services
- [x] LoadingComponent creado en shared/components  
- [x] LoadingInterceptor creado en core/interceptors
- [x] HttpClient configurado con interceptor
- [x] LoadingComponent agregado a app.ts
- [x] LoadingComponent agregado a app.html
- [x] Build compila sin errores
- [x] Spinner visible en la aplicación globalmente

## 🎭 Características Visuales

- **Overlay**: Fondo negro semi-transparente (rgba(0, 0, 0, 0.5))
- **Blur**: Efecto blur en el fondo (backdrop-filter)
- **Spinner**: Animación suave de 0.9s
- **Tamaño**: 80×80px (personalizable)
- **Color**: Cyan (#00d4ff) - según tu tema
- **Texto**: "Cargando..." centrado

## 🐛 Troubleshooting

### El spinner no aparece
1. Verifica que LoadingComponent esté en app.html
2. Comprueba que LoadingService esté en providers
3. Revisa la consola del navegador

### El spinner nunca se oculta
1. Asegúrate de llamar a `loadingService.hide()`
2. Si usas HTTP, verifica el interceptor está registrado
3. Revisa que no haya errores en la consola

### Estilos no se aplican correctamente
1. Revisa que ProgressSpinnerModule esté importado
2. Verifica que los estilos globales no conflictúen
3. Comprueba que PrimeNG CSS esté cargado
