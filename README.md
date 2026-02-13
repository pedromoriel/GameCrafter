# GameCrafter

**GameCrafter** es una plataforma educativa interactiva para aprender a programar creando videojuegos. Combina un editor de código integrado, niveles de aprendizaje progresivos y ejecución de código en tiempo real con Phaser.

## 🎮 Características Principales

- **Editor de Código Integrado**: Monaco Editor para escritura de código
- **Renderización de Juegos**: Phaser + Capacitor para ejecutar juegos en navegador y dispositivos Android
- **Sistema de Autenticación**: Firebase Auth con Google y Email/Password
- **Niveles de Aprendizaje**: Progresión estructurada (Principiante → Medio → Avanzado)
- **Exportación APK**: Empaquetar proyectos como aplicaciones Android (Premium/PRO)
- **Asset Store**: Marketplace de recursos para usuarios Premium/PRO
- **Offline Coding**: Desarrollo sin conexión con sincronización automática
- **Gamificación**: Logros, insignias, ranking y chat comunitario
- **Sistema de Monetización**: Planes Free, Premium y PRO

## 🚀 Stack Tecnológico

- **Frontend**: Angular 20 + Ionic + SCSS
- **Juegos**: Phaser 3
- **Editor de Código**: Monaco Editor
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **Mobile**: Capacitor para Android
- **Pagos**: Stripe/PayPal integrado con Firebase Functions
- **Calidad de Código**: ESLint, Prettier, Husky
- **Testing**: Jest
- **CI/CD**: GitHub Actions

## 📁 Estructura del Proyecto

```
GameCrafter/
├── app/                          # Aplicación Angular principal
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/            # Servicios core (Auth, Auth Guard)
│   │   │   ├── modules/         # Módulos feature (Editor, Niveles, etc.)
│   │   │   ├── shared/          # Componentes y servicios compartidos
│   │   │   └── app.config.ts
│   │   ├── assets/              # Recursos estáticos
│   │   ├── styles/              # Estilos globales
│   │   └── main.ts
│   ├── capacitor.config.ts      # Configuración de Capacitor
│   ├── angular.json
│   └── package.json
└── README.md
```

## 🛠 Instalación

### Requisitos
- Node.js v20.19+
- npm o yarn
- Xcode (para iOS) o Android Studio (para Android)

### Pasos

1. **Clonar repositorio**
   ```bash
   cd GameCrafter/app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Desarrollar localmente**
   ```bash
   npm start
   ```

4. **Build para Capacitor**
   ```bash
   npm run build
   npx cap add android
   npx cap sync
   ```

## 📋 Fases de Desarrollo

- **Fase 1**: Configuración Inicial (Angular, Ionic, Capacitor, Firebase, Phaser, ESLint)
- **Fase 2**: Autenticación y Gestión de Usuarios
- **Fase 3**: Editor de Código Integrado (Monaco + Phaser)
- **Fase 4**: Niveles de Aprendizaje
- **Fase 5**: Exportación de APK (Premium/PRO)
- **Fase 6**: Asset Store con monetización
- **Fase 7**: Offline Coding
- **Fase 8**: Gamificación y Comunidad
- **Fase 9**: Monetización y Planes
- **Fase 10**: Despliegue y Testing (CI/CD)

## 📄 Licencia

MIT
