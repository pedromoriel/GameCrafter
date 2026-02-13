import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AssetItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: 'mechanics' | 'effects' | 'ui' | 'gameplay' | 'physics';
  price: number;
  isPremium: boolean;
  isProOnly: boolean;
  rating: number;
  downloads: number;
  preview: string; // URL or base64
  previewCode: string;
  tags: string[];
  author: string;
  version: string;
  lastUpdated: Date;
  includesInPremium?: boolean;
  includesInPro?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AssetStoreService {
  private assets$ = new BehaviorSubject<AssetItem[]>([
    {
      id: 'spaceship-shooter-pro',
      name: 'Advanced Spaceship Shooter',
      description: 'Professional-grade spaceship with advanced mechanics',
      longDescription: 'Complete spaceship system with AI enemies, power-ups, collision detection, and particle effects. Perfect for arcade-style games.',
      category: 'mechanics',
      price: 2.99,
      isPremium: true,
      isProOnly: false,
      rating: 4.8,
      downloads: 1250,
      preview: 'https://via.placeholder.com/320x240?text=Spaceship+Shooter',
      previewCode: `class AdvancedSpaceship {
  constructor(scene, x, y) {
    this.scene = scene;
    this.health = 100;
    this.weaponLevel = 1;
  }
  
  powerUp(type) {
    this.weaponLevel++;
    this.playPowerUpEffect();
  }
}`,
      tags: ['spaceship', 'shooter', 'arcade', 'weapons'],
      author: 'GameCrafter Team',
      version: '1.2.0',
      lastUpdated: new Date('2026-02-10'),
      includesInPremium: true,
      includesInPro: true
    },
    {
      id: 'particle-system-deluxe',
      name: 'Particle System Pro',
      description: 'Advanced particle effects with multiple emitter types',
      longDescription: 'Create stunning visual effects with customizable particle emitters. Includes fire, smoke, water, magic, and explosion presets.',
      category: 'effects',
      price: 3.99,
      isPremium: false,
      isProOnly: true,
      rating: 4.9,
      downloads: 2840,
      preview: 'https://via.placeholder.com/320x240?text=Particles+Pro',
      previewCode: `const fireEmitter = this.particleSystem.createEmitter({
  type: 'fire',
  intensity: 0.8,
  color: { start: 0xff6600, end: 0xffcc00 }
});`,
      tags: ['effects', 'particles', 'visual', 'premium'],
      author: 'FX Studios',
      version: '2.1.0',
      lastUpdated: new Date('2026-02-12'),
      includesInPremium: false,
      includesInPro: true
    },
    {
      id: 'ui-framework-complete',
      name: 'Complete UI Framework',
      description: 'Full-featured UI system with buttons, menus, dialogs',
      longDescription: 'Professional UI framework with responsive design. Includes buttons, panels, menus, dialogs, tooltips, and animations.',
      category: 'ui',
      price: 4.99,
      isPremium: true,
      isProOnly: false,
      rating: 4.7,
      downloads: 1890,
      preview: 'https://via.placeholder.com/320x240?text=UI+Framework',
      previewCode: `const uiPanel = new UIPanel(scene, 'main');
uiPanel.add('button', 'Play', () => startGame());
uiPanel.add('slider', 'Volume', 0, 1);`,
      tags: ['ui', 'menus', 'buttons', 'responsive'],
      author: 'UI Masters',
      version: '3.0.0',
      lastUpdated: new Date('2026-02-05'),
      includesInPremium: true,
      includesInPro: true
    },
    {
      id: 'collision-advanced',
      name: 'Advanced Collision System',
      description: 'Enhanced collision detection with complex shapes',
      longDescription: 'Advanced collision system supporting polygons, circles, and complex shapes. Includes optimization for thousands of objects.',
      category: 'physics',
      price: 2.49,
      isPremium: true,
      isProOnly: false,
      rating: 4.6,
      downloads: 3120,
      preview: 'https://via.placeholder.com/320x240?text=Collision+System',
      previewCode: `const collider = this.physics.add.collider(player, enemies);
collider.on('collision', (a, b) => handleCollision(a, b));`,
      tags: ['physics', 'collision', 'optimization'],
      author: 'Physics Lab',
      version: '1.5.0',
      lastUpdated: new Date('2026-02-08'),
      includesInPremium: true,
      includesInPro: true
    },
    {
      id: 'enemy-ai-pack',
      name: 'Enemy AI Pack',
      description: 'Complete enemy behavior system with pathfinding',
      longDescription: 'Professional enemy AI with pathfinding, behavior trees, and difficulty scaling. Includes multiple enemy types.',
      category: 'gameplay',
      price: 5.99,
      isPremium: false,
      isProOnly: true,
      rating: 4.9,
      downloads: 1560,
      preview: 'https://via.placeholder.com/320x240?text=Enemy+AI',
      previewCode: `const enemy = new AIEnemy(scene, x, y);
enemy.setBehavior('patrol');
enemy.setAggression(difficulty);`,
      tags: ['ai', 'enemies', 'pathfinding', 'pro'],
      author: 'AI Advanced',
      version: '2.0.0',
      lastUpdated: new Date('2026-02-11'),
      includesInPremium: false,
      includesInPro: true
    },
    {
      id: 'camera-follow-advanced',
      name: 'Advanced Camera System',
      description: 'Smooth camera tracking with effects',
      longDescription: 'Professional camera system with smooth following, screen shake, zoom effects, and parallax scrolling.',
      category: 'mechanics',
      price: 1.99,
      isPremium: true,
      isProOnly: false,
      rating: 4.5,
      downloads: 2100,
      preview: 'https://via.placeholder.com/320x240?text=Camera+System',
      previewCode: `this.camera.smoothFollow(player, 0.1);
this.camera.shake(500, 0.02);
this.camera.zoom(1.5);`,
      tags: ['camera', 'effects', 'movement', 'smooth'],
      author: 'Camera Pro',
      version: '1.3.0',
      lastUpdated: new Date('2026-02-09'),
      includesInPremium: true,
      includesInPro: true
    },
    {
      id: 'sound-system-pro',
      name: 'Professional Sound Manager',
      description: 'Complete audio system with mixer and effects',
      longDescription: 'Full audio management system with sound effects, music, 3D audio, and mixing capabilities.',
      category: 'effects',
      price: 3.49,
      isPremium: false,
      isProOnly: true,
      rating: 4.8,
      downloads: 980,
      preview: 'https://via.placeholder.com/320x240?text=Sound+Manager',
      previewCode: `this.soundManager.play('explosion', { volume: 0.8 });
this.soundManager.playMusic('background', { fade: 1000 });`,
      tags: ['audio', 'sound', 'music', 'pro'],
      author: 'Audio Labs',
      version: '1.8.0',
      lastUpdated: new Date('2026-02-07'),
      includesInPremium: false,
      includesInPro: true
    },
    {
      id: 'power-up-system',
      name: 'Power-Up System',
      description: 'Complete power-up mechanics with customizable effects',
      longDescription: 'Ready-to-use power-up system with multiple power types, visual effects, and duration management.',
      category: 'gameplay',
      price: 1.49,
      isPremium: true,
      isProOnly: false,
      rating: 4.4,
      downloads: 1750,
      preview: 'https://via.placeholder.com/320x240?text=Power+Ups',
      previewCode: `const powerUp = new PowerUp(scene, 'shield', x, y);
powerUp.apply(player);
powerUp.onExpire(() => removeBuff(player));`,
      tags: ['gameplay', 'power-ups', 'mechanics'],
      author: 'Game Mechanics',
      version: '1.1.0',
      lastUpdated: new Date('2026-02-06'),
      includesInPremium: true,
      includesInPro: true
    }
  ]);

  private searchQuery$ = new BehaviorSubject<string>('');
  private selectedCategory$ = new BehaviorSubject<string | null>(null);

  constructor() {}

  getAssets(): Observable<AssetItem[]> {
    return this.filterAssets();
  }

  private filterAssets(): Observable<AssetItem[]> {
    return new Observable(observer => {
      const subscription = this.searchQuery$.subscribe(query => {
        const category = this.selectedCategory$.value;
        let filtered = this.assets$.value;

        if (category) {
          filtered = filtered.filter(asset => asset.category === category);
        }

        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(
            asset =>
              asset.name.toLowerCase().includes(q) ||
              asset.description.toLowerCase().includes(q) ||
              asset.tags.some(tag => tag.toLowerCase().includes(q))
          );
        }

        observer.next(filtered);
      });

      return () => subscription.unsubscribe();
    });
  }

  setSearchQuery(query: string): void {
    this.searchQuery$.next(query);
  }

  setCategory(category: string | null): void {
    this.selectedCategory$.next(category);
  }

  getCategories(): string[] {
    return ['mechanics', 'effects', 'ui', 'gameplay', 'physics'];
  }

  getAssetById(id: string): AssetItem | undefined {
    return this.assets$.value.find(asset => asset.id === id);
  }

  purchaseAsset(id: string): Promise<boolean> {
    // Mock purchase
    return Promise.resolve(true);
  }

  downloadAsset(id: string): Promise<string> {
    // Mock download - returns code snippet
    const asset = this.getAssetById(id);
    return Promise.resolve(asset?.previewCode || '');
  }
}
