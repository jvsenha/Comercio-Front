import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class MenuComponent {
  constructor(private router: Router) {}

  irParaSexo() { this.router.navigate(['/sexo']); }
  irParaUf() { this.router.navigate(['/uf']); }
  irParaBairro() { this.router.navigate(['/bairro']); }
  irParaCep() { this.router.navigate(['/cep']); }
  irParaRua() { this.router.navigate(['/rua']); }
  irParaMarca() { this.router.navigate(['/marca']); }
  irParaTipo() { this.router.navigate(['/tipo']); }
}
