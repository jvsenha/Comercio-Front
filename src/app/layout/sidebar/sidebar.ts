// src/app/layout/sidebar/sidebar.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 1. Importe o RouterModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule, // 2. Adicione aqui
    CommonModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  // A lógica de navegação agora é feita por routerLink
}
