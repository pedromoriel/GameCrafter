import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AssetStoreService, AssetItem } from '../../core/services/asset-store.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService, UserRole, UserProfile } from '../../core/services/user.service';

@Component({
  selector: 'app-asset-store',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './asset-store.component.html',
  styleUrls: ['./asset-store.component.scss']
})
export class AssetStoreComponent implements OnInit, OnDestroy {
  assets: AssetItem[] = [];
  filteredAssets: AssetItem[] = [];
  categories = ['mechanics', 'effects', 'ui', 'gameplay', 'physics'];
  selectedCategory: string | null = null;
  searchQuery = '';
  userProfile: UserProfile | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private assetStoreService: AssetStoreService,
    private authService: AuthService,
    private userService: UserService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadAssets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userService
        .getUserProfile(currentUser.uid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(profile => {
          this.userProfile = profile;
        });
    }
  }

  private loadAssets(): void {
    this.assetStoreService
      .getAssets()
      .pipe(takeUntil(this.destroy$))
      .subscribe(assets => {
        this.assets = assets;
        this.applyFilters();
      });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.assetStoreService.setSearchQuery(query);
    this.applyFilters();
  }

  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.assetStoreService.setCategory(category);
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.assets;

    if (this.selectedCategory) {
      filtered = filtered.filter(a => a.category === this.selectedCategory);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    this.filteredAssets = filtered;
  }

  canPurchase(asset: AssetItem): boolean {
    if (!this.userProfile) return false;
    if (asset.isProOnly) {
      return this.userProfile.role === UserRole.PRO;
    }
    if (asset.isPremium) {
      return (
        this.userProfile.role === UserRole.PREMIUM ||
        this.userProfile.role === UserRole.PRO
      );
    }
    return true;
  }

  canDownload(asset: AssetItem): boolean {
    if (!this.userProfile) return false;

    if (!asset.isPremium && !asset.isProOnly) {
      return true;
    }

    if (asset.isPremium && asset.includesInPremium) {
      return (
        this.userProfile.role === UserRole.PREMIUM ||
        this.userProfile.role === UserRole.PRO
      );
    }

    if (asset.isProOnly && asset.includesInPro) {
      return this.userProfile.role === UserRole.PRO;
    }

    return false;
  }

  getPriceDisplay(asset: AssetItem): string {
    if (!asset.isPremium && !asset.isProOnly) {
      return 'Free';
    }
    return `$${asset.price.toFixed(2)}`;
  }

  getPlanBadges(asset: AssetItem): string[] {
    const badges: string[] = [];
    if (asset.includesInPremium) badges.push('premium');
    if (asset.includesInPro) badges.push('pro');
    return badges;
  }

  downloadAsset(asset: AssetItem): void {
    if (!this.canDownload(asset)) {
      alert('You do not have access to this asset');
      return;
    }

    this.assetStoreService.downloadAsset(asset.id).then(code => {
      console.log('Asset downloaded:', code);
      alert(`${asset.name} downloaded successfully!`);
    });
  }

  purchaseAsset(asset: AssetItem): void {
    if (!this.canPurchase(asset)) {
      alert('This asset is not available for your plan');
      return;
    }

    this.assetStoreService.purchaseAsset(asset.id).then(success => {
      if (success) {
        alert(`${asset.name} purchased successfully!`);
      }
    });
  }

  getCategoryLabel(category: string): string {
    const labelMap: { [key: string]: string } = {
      mechanics: 'assetStore.categoryMechanics',
      effects: 'assetStore.categoryEffects',
      ui: 'assetStore.categoryUi',
      gameplay: 'assetStore.categoryGameplay',
      physics: 'assetStore.categoryPhysics'
    };
    const key = labelMap[category];
    return key ? this.translateService.instant(key) : category;
  }
}
