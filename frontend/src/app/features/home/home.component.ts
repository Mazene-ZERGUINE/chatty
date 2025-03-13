import { Component } from '@angular/core';
import { SideBarMenuComponent } from '../../core/layout/side-bar-menu/side-bar-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SideBarMenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
