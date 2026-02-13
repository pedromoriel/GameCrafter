# 📚 Índice de Documentación - GameCrafter

> Guía rápida para encontrar información sobre el proyecto GameCrafter

## 🎯 Empezar aquí

Si es tu primera vez con este proyecto, comienza aquí:

1. **[README.md](README.md)** - Descripción general y características principales
2. **[PHASE1_SUMMARY.md](PHASE1_SUMMARY.md)** - Resumen completo de lo que se ha hecho
3. **[app/SETUP.md](app/SETUP.md)** - Cómo setup y ejecutar el proyecto

## 📖 Documentación por Tema

### 🚀 Setup e Instalación

| Documento | Descripción |
|-----------|-------------|
| [app/SETUP.md](app/SETUP.md) | Instrucciones detalladas para setup inicial |
| [app/.env.example](app/.env.example) | Variables de entorno necesarias |
| [app/package.json](app/package.json) | Dependencias del proyecto |

### 👨‍💻 Desarrollo

| Documento | Descripción |
|-----------|-------------|
| [FASES.md](FASES.md) | Documentación detallada de Fase 1 (lo que se hizo) |
| [NEXT_STEPS.md](NEXT_STEPS.md) | Próximas fases y tareas a implementar |
| [app/PHASE1_SUMMARY.md](PHASE1_SUMMARY.md) | Resumen ejecutivo de Fase 1 |

### 🏗️ Arquitectura y Estructura

**Ubicación de componentes:**
- **Auth**: [app/src/app/modules/auth/](app/src/app/modules/auth/)
- **Home**: [app/src/app/modules/home/](app/src/app/modules/home/)
- **Editor**: [app/src/app/modules/editor/](app/src/app/modules/editor/)
- **Servicios**: [app/src/app/core/services/](app/src/app/core/services/)
- **Shared Components**: [app/src/app/shared/components/](app/src/app/shared/components/)

### 🔐 Autenticación y Usuarios

**Servicios principales:**
- [AuthService](app/src/app/core/services/auth.service.ts) - Gestión de autenticación
- [UserService](app/src/app/core/services/user.service.ts) - Perfiles y roles de usuario
- [AuthGuard](app/src/app/core/guards/auth.guard.ts) - Protección de rutas

**Componentes:**
- [LoginComponent](app/src/app/modules/auth/pages/login.component.ts) - Página de login
- [RegisterComponent](app/src/app/modules/auth/pages/register.component.ts) - Página de registro

### 💻 Desarrollo de Juegos

**Servicios:**
- [PhaserService](app/src/app/shared/services/phaser.service.ts) - Motor Phaser

**Componentes:**
- [CodeEditorComponent](app/src/app/shared/components/code-editor.component.ts) - Editor de código
- [GameCanvasComponent](app/src/app/shared/components/game-canvas.component.ts) - Canvas para juegos

**Módulo:**
- [EditorComponent](app/src/app/modules/editor/editor.component.ts) - Página de editor principal

### 🎨 Base de Firebase

**Servicio:**
- [FirebaseService](app/src/app/core/services/firebase.service.ts) - Operaciones Firestore/Storage

**Configuración:**
- [environment.ts](app/src/environments/environment.ts) - Config desarrollo
- [environment.prod.ts](app/src/environments/environment.prod.ts) - Config producción

### 🔧 Configuración y Herramientas

| Config | Descripción |
|--------|-------------|
| [.eslintrc.json](app/.eslintrc.json) | Reglas de linting |
| [.prettierrc.json](app/.prettierrc.json) | Configuración de formateo |
| [.lintstagedrc.json](app/.lintstagedrc.json) | Pre-commit hooks |
| [.husky/](app/.husky/) | Git hooks automáticos |
| [angular.json](app/angular.json) | Configuración de Angular CLI |
| [capacitor.config.ts](app/capacitor.config.ts) | Configuración de Capacitor |

### 🎯 Rotas de la Aplicación

Configuradas en [app.routes.ts](app/src/app/app.routes.ts):

```
/                            → /home (redirección)
/auth/login                  → Página de login
/auth/register               → Página de registro
/home                        → Página principal
/editor                      → Editor de código
/levels                      → Niveles de aprendizaje
/asset-store                 → Store de assets (Premium)
/community                   → Comunidad
/profile                     → Perfil de usuario
/forbidden                   → Acceso denegado
```

## 🎓 Guías por Tarea

### Cómo ejecutar el proyecto

```bash
cd app
npm install
npm start
# Abre http://localhost:4200
```

### Cómo agregar un nuevo módulo

```bash
ng generate component modules/mi-modulo/mi-componente --standalone
```

### Cómo agregar un nuevo servicio

```bash
ng generate service core/services/mi-servicio
```

### Cómo verificar calidad de código

```bash
npm run lint              # Verificar
npm run lint:fix         # Arreglar automáticamente
npm run format           # Formatear con Prettier
```

### Cómo compilar para producción

```bash
npm run build
```

### Cómo preparar para Android

```bash
npm run build
npx cap add android
npx cap sync
npx cap open android
```

## 📊 Estado del Proyecto

### ✅ Fase 1 - Completada

- [x] Angular + Ionic + Capacitor
- [x] Firebase Integration
- [x] Phaser + Monaco Editor
- [x] ESLint + Prettier + Husky

**Documentación:** [FASES.md](FASES.md) y [PHASE1_SUMMARY.md](PHASE1_SUMMARY.md)

### 🔄 Fase 2 - Próxima

- [ ] Mejorar componentes Auth
- [ ] Dashboard de usuario
- [ ] Gestión de suscripciones
- [ ] Sistemas de roles avanzado

**Roadmap:** [NEXT_STEPS.md](Documentos](NEXT_STEPS.md)

## 🔗 Enlaces Importantes

### Recursos Oficiales

- [Angular Documentation](https://angular.io)
- [Ionic Documentation](https://ionicframework.com/docs)
- [Capacitor Documentation](https://capacitorjs.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Phaser Documentation](https://phaser.io/docs)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)

### Configuración

- **Firebase Project**: `gamecrafter-app`
- **Node.js**: v20.19+ (actual: v20.20.0)
- **npm**: 10.8.2+

## 💡 Tips Útiles

### Usar servicios en componentes

```typescript
constructor(
  private authService: AuthService,
  private userService: UserService
) {}
```

### Proteger una ruta por rol

```typescript
{
  path: 'admin',
  component: AdminComponent,
  data: { role: UserRole.PRO }
}
```

### Ejecutar código en Phaser

Los componentes `CodeEditorComponent` y `GameCanvasComponent` ya están integrados.
Ver [EditorComponent](app/src/app/modules/editor/editor.component.ts) para ejemplo.

### Pre-commit hooks

Los hooks se ejecutan automáticamente con `git commit`. Husky ejecuta:
1. ESLint - Verifica código
2. Prettier - Formatea código
3. Lint-staged - Solo archivos modificados

## 📝 Notas Importantes

1. **Firebase**: Actualiza `environment.ts` con tus credenciales reales
2. **Node.js**: Requiere v20.19 o superior (ya actualizado)
3. **Git**: Los hooks de Husky se ejecutan automáticamente
4. **Build**: Usa `ng build --configuration production` para build final

## 🆘 Soporte y Ayuda

### Problemas Comunes

**Error: "Cannot find module..."**
```bash
npm install
```

**Error: "Port already in use"**
```bash
npm start -- --port 4300
```

**Error: "ESLint issues"**
```bash
npm run lint:fix
```

### Contacto

Para preguntas sobre desarrollo:
- Ver [NEXT_STEPS.md](NEXT_STEPS.md) para próximas tareas
- Revisar comentarios en código
- Consultar documentación oficial de cada librería

---

## 📄 Mapa de Documentación

```
GameCrafter/
├─ README.md                    ← Descripción general
├─ PHASE1_SUMMARY.md            ← Resumen visual Fase 1
├─ FASES.md                     ← Detalle de implementación
├─ NEXT_STEPS.md                ← Próximas tareas
├─ DOCUMENTACION.md             ← Este archivo
│
└─ app/
   ├─ SETUP.md                  ← Instrucciones setup
   ├─ README.md                 ← Info específica app
   ├─ .env.example              ← Variables de entorno
   └─ src/
      └─ [código fuente]
```

---

**Última actualización:** Feb 12, 2026  
**Versión:** 1.0 - Fase 1 Completada  
**Status:** ✅ Listo para Fase 2
