# GameCrafter - Application Setup

## 📋 Configuración Inicial Completada

Se ha completado exitosamente la **Fase 1: Configuración Inicial** del proyecto GameCrafter.

### ✅ Lo que se ha instalado:

1. **Angular 20** - Framework principal
2. **Ionic 8** - Framework mobile UI
3. **Capacitor 5** - Build y empaquetamiento para Android/iOS
4. **Firebase** - Auth, Firestore, Storage, Hosting
5. **Phaser 3** - Motor de juegos
6. **Monaco Editor** - Editor de código integrado
7. **ESLint, Prettier, Husky** - Herramientas de calidad de código

## 🚀 Primeros Pasos

### 1. Configurar Firebase

Actualiza `src/environments/environment.ts` con tus credenciales de Firebase:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'gamecrafter-app',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

### 2. Instalar Dependencias (si no está hecho)

```bash
npm install
```

### 3. Ejecutar en Desarrollo

```bash
npm start
# O
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### 4. Build para Producción

```bash
npm run build
# O
ng build --configuration production
```

## 📱 Preparar para Android

### 1. Agregar Plataforma Android

```bash
npx cap add android
```

### 2. Sincronizar Código

```bash
ng build
npx cap sync
```

### 3. Abrir en Android Studio

```bash
npx cap open android
```

## 🎮 Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── firebase.service.ts
│   │   └── guards/
│   │       └── auth.guard.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── editor/
│   │   ├── levels/
│   │   ├── asset-store/
│   │   ├── community/
│   │   ├── profile/
│   │   └── forbidden/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── code-editor.component.ts
│   │   │   └── game-canvas.component.ts
│   │   └── services/
│   │       └── phaser.service.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles/
│   └── global.scss
└── styles.scss
```

## 🛠️ Comandos Principales

```bash
# Desarrollo
npm start

# Build
npm run build

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format

# Testing
npm test

# Android
npx cap add android
npx cap sync
npx cap open android

# iOS (solo macOS)
npx cap add ios
npx cap open ios
```

## 📚 Próximas Fases

- **Fase 2**: Autenticación y Gestión de Usuarios
- **Fase 3**: Editor de Código Integrado (Monaco + Phaser)
- **Fase 4**: Niveles de Aprendizaje
- **Fase 5**: Exportación de APK
- **Fase 6**: Asset Store
- **Fase 7**: Offline Coding
- **Fase 8**: Gamificación y Comunidad
- **Fase 9**: Monetización y Planes
- **Fase 10**: Despliegue y Testing (CI/CD)

## 📝 Notas Importantes

- La imagen preview está completamente del lado del cliente en fase de desarrollo
- Recuerda configurar tus credenciales de Firebase antes de ejecutar la aplicación
- Usa `--legacy-peer-deps` si encuentras problemas de dependencias durante la instalación
- Husky está configurado para ejecutar lint-staged en pre-commit

## 🤝 Soporte

Para más información, consulta la documentación oficial:

- [Angular](https://angular.io)
- [Ionic](https://ionicframework.com)
- [Capacitor](https://capacitorjs.com)
- [Firebase](https://firebase.google.com)
- [Phaser](https://phaser.io)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
