// src/app/pages/produtos/produto-list/produto-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produto-list.html',
  styleUrls: ['./produto-list.scss']
})
export class ProdutoListComponent implements OnInit {

  produtos: any[] = [];
  isLoading = true;
  erroAoCarregar: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.isLoading = true;
    this.erroAoCarregar = null;

    this.apiService.getProdutos().subscribe({
      next: (data) => {
        this.produtos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.erroAoCarregar = 'Falha ao carregar produtos. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  deleteProduto(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID do produto é inválido');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.apiService.deleteProduto(id).subscribe({
        next: () => {
          this.loadProdutos();
        },
        error: (err) => {
          console.error(`Erro ao excluir produto ${id}:`, err);
          alert('Erro ao excluir produto.');
        }
      });
    }
  }

  addNewProduto(): void {
    this.router.navigate(['/produtos/novo']);
  }

editProduto(produto: any): void {
    this.router.navigate(['/produtos/editar', produto.id]);
  }
}
