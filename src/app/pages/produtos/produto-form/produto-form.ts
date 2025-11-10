// src/app/pages/produtos/produto-form/produto-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service/api.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produto-form.html',
  styleUrls: ['./produto-form.scss']
})
export class ProdutoFormComponent implements OnInit {

  // Modelo para o formulário
  produto: any = {
    name: '',
    valor: 0,
    quantidade: 0,
    marca: { id: null },
    tipo: { id: null }
  };

  // Listas para os dropdowns
  marcas: any[] = [];
  tipos: any[] = [];

  isLoading = true; // Usado apenas para "Carregando dados..."
  salvando = false;
  mensagem = '';
  erro = ''; // Usado apenas para erros ao salvar

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDropdowns();
  }

  carregarDropdowns(): void {
    this.isLoading = true;
    this.erro = ''; // Limpa erros antigos

    forkJoin({
      marcas: this.apiService.getMarcas(),
      tipos: this.apiService.getTipos()
    }).subscribe({
      next: (data) => {
        this.marcas = data.marcas;
        this.tipos = data.tipos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dropdowns de produto:', err);
        // Como solicitado, não mostramos erro ao usuário se os dropdowns falharem
        this.isLoading = false;
      }
    });
  }

  salvar(): void {
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    // Validação
    if (!this.produto.name || !this.produto.marca.id || !this.produto.tipo.id) {
      this.erro = 'Nome, Marca e Tipo são obrigatórios.';
      this.salvando = false;
      return;
    }

    this.apiService.salvarProduto(this.produto).subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = 'Produto salvo com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/produtos']);
        }, 1500);
      },
      error: (err) => {
        // Mostra o erro específico do backend, se disponível
        this.erro = 'Erro ao salvar produto: ' + (err.error?.mensagem || 'Verifique os campos.');
        this.salvando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/produtos']);
  }
}
