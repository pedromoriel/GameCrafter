import { Injectable } from '@angular/core';
import Phaser from 'phaser';
import { Observable, Subject } from 'rxjs';

export interface GameConfig {
  canvasId: string;
  width: number;
  height: number;
  backgroundColor?: string;
  debug?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PhaserService {
  private game: Phaser.Game | null = null;
  private gameState$ = new Subject<any>();

  /**
   * Inicializar y crear una instancia del juego Phaser
   */
  initializeGame(config: GameConfig, sceneCode: string): Promise<Phaser.Game> {
    return new Promise((resolve, reject) => {
      try {
        // Compilar y ejecutar el código del usuario
        const userScene = this.createSceneFromCode(sceneCode);

        const gameConfig: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          parent: config.canvasId,
          width: config.width,
          height: config.height,
          backgroundColor: config.backgroundColor || '#1a1a2e',
          scene: userScene,
          physics: {
            default: 'arcade',
            arcade: {
              debug: config.debug || false,
              gravity: { x: 0, y: 200 }
            }
          }
        };

        this.game = new Phaser.Game(gameConfig);
        this.gameState$.next({ status: 'initialized' });
        resolve(this.game);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Crear una escena Phaser a partir de código del usuario
   */
  private createSceneFromCode(code: string): typeof Phaser.Scene {
    try {
      // Ejecutar el código del usuario para obtener la clase de la escena
      const userSceneCode = `
        ${code}
        // Retornar la clase MyScene si existe, sino crear una escena simple
        if (typeof MyScene !== 'undefined') {
          return MyScene;
        }
      `;
      
      // Crear una función que ejecute el código y retorne la clase
      const createScene = new Function('Phaser', userSceneCode);
      const UserSceneClass = createScene(Phaser);
      
      if (UserSceneClass) {
        return UserSceneClass as typeof Phaser.Scene;
      }
      
      // Fallback: crear una escena simple que ejecute el código en create
      const sceneClass = class extends Phaser.Scene {
        constructor() {
          super({ key: 'UserScene' });
        }

        create() {
          try {
            // Ejecutar el código del usuario en el contexto de this
            const userFunction = new Function('Phaser', code);
            userFunction.call(this, Phaser);
          } catch (error) {
          }
        }
      };

      return sceneClass as typeof Phaser.Scene;
    } catch (error) {
      
      // Retornar una escena vacía
      const emptyScene = class extends Phaser.Scene {
        constructor() {
          super({ key: 'UserScene' });
        }
        create() {
          // Initialize scene without logging
        }
      };
      
      return emptyScene as typeof Phaser.Scene;
    }
  }

  /**
   * Destruir la instancia del juego
   */
  destroyGame(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
      this.gameState$.next({ status: 'destroyed' });
    }
  }

  /**
   * Pausar el juego
   */
  pauseGame(): void {
    if (this.game && this.game.scene.isActive('UserScene')) {
      this.game.scene.pause('UserScene');
      this.gameState$.next({ status: 'paused' });
    }
  }

  /**
   * Reanudar el juego
   */
  resumeGame(): void {
    if (this.game && this.game.scene.isSleeping('UserScene')) {
      this.game.scene.resume('UserScene');
      this.gameState$.next({ status: 'resumed' });
    }
  }

  /**
   * Obtener el estado del juego
   */
  getGameState$(): Observable<any> {
    return this.gameState$.asObservable();
  }

  /**
   * Obtener la instancia actual del juego
   */
  getGame(): Phaser.Game | null {
    return this.game;
  }
}
