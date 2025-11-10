// src/app/pages/clientes/cliente-list/cliente-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-list.html',
  styleUrls: ['./cliente-list.scss']
})
export class ClienteListComponent implements OnInit {

  clientes: any[] = [];
  isLoading = true;
  erroAoCarregar: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.isLoading = true;
    this.erroAoCarregar = null;

    this.apiService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.erroAoCarregar = 'Falha ao carregar clientes. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  deleteCliente(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID do cliente é inválido');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.apiService.deleteCliente(id).subscribe({
        next: () => {
          this.loadClientes(); // Recarrega a lista
        },
        error: (err) => {
          console.error(`Erro ao excluir cliente ${id}:`, err);
          alert('Erro ao excluir cliente.');
        }
      });
    }
  }

  // Funções para adicionar e editar (serão implementadas depois)
 addNewCliente(): void {
    this.router.navigate(['/clientes/novo']); // <-- MODIFICADO
  }

editCliente(cliente: any): void {
    // ARRUIME AQUI: Navega para a rota de edição com o ID
    this.router.navigate(['/clientes/editar', cliente.id]);
  }
}
