/**
 * LOADING SERVICE - Guía de Uso
 * 
 * El LoadingService proporciona un spinne global que se muestra mientras 
 * las páginas o peticiones tardan en cargar.
 * 
 * INSTALACIÓN:
 * El LoadingComponent ya está integrado en app.ts y app.html
 * 
 * USO BÁSICO:
 * 
 * En cualquier componente que lo necesite:
 * 
 * import { LoadingService } from '../core/services/loading.service';
 * 
 * export class MyComponent {
 *   constructor(private loadingService: LoadingService) {}
 * 
 *   ngOnInit() {
 *     this.loadingService.show();
 *     // Simulamos una petición HTTP
 *     someHttpRequest.subscribe({
 *       next: (data) => {
 *         // Procesar datos
 *         this.loadingService.hide();
 *       },
 *       error: (error) => {
 *         this.loadingService.hide();
 *       }
 *     });
 *   }
 * }
 * 
 * MEJOR PRÁCTICA CON HTTPCLIENT:
 * También puedes usar un interceptor HTTP para mostrar/ocultar automáticamente
 * 
 * EJEMPLO EN FORMS:
 * 
 * onSubmit() {
 *   if (this.form.valid) {
 *     this.loadingService.show();
 *     this.authService.login(this.form.value).subscribe({
 *       next: (response) => {
 *         this.loadingService.hide();
 *         // Navigate...
 *       },
 *       error: (error) => {
 *         this.loadingService.hide();
 *         // Show error...
 *       }
 *     });
 *   }
 * }
 */
