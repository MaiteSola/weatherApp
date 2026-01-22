import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export type NavigationOption = '3-days' | '5-days' | 'map' | 'settings';

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

    // En móvil, hacer scroll al pronóstico semanal cuando se hace clic en 3 o 5 días
    if (option === '3-days' || option === '5-days') {
      setTimeout(() => {
        const forecastElement = document.getElementById('weekly-forecast');
        if (forecastElement && window.innerWidth < 768) {
          forecastElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
  }

  isActive(option: NavigationOption): boolean {
    return this.activeNav === option;
  }
}
