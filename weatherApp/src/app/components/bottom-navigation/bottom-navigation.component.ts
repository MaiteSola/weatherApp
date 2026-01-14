import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export type NavigationOption = '3-days' | '5-days' | 'settings';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class BottomNavigationComponent {
  @Output() navigationChange = new EventEmitter<NavigationOption>();

  activeNav: NavigationOption = '3-days';

  onNavClick(option: NavigationOption): void {
    this.activeNav = option;
    this.navigationChange.emit(option);
  }

  isActive(option: NavigationOption): boolean {
    return this.activeNav === option;
  }
}
