// src/app/pages/dashboard/dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../app/services/api.service/api.service'; // Importe o novo serviço
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  // Variáveis para armazenar os totais
  totalVendas = 0;
  totalClientes = 0;
  totalProdutos = 0;
  totalMarcas = 0;

  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.carregarDadosDashboard();
  }

  carregarDadosDashboard(): void {
    this.isLoading = true;

    // forkJoin permite fazer várias chamadas de API em paralelo
    forkJoin({
      vendas: this.apiService.getVendas(),
      clientes: this.apiService.getClientes(),
      produtos: this.apiService.getProdutos(),
      marcas: this.apiService.getMarcas()
    }).subscribe({
      next: (resultados) => {
        // NOTA: Seu backend retorna o valor total da venda?
        // Por enquanto, vamos apenas contar a *quantidade* de vendas.
        this.totalVendas = resultados.vendas.length;

        this.totalClientes = resultados.clientes.length;
        this.totalProdutos = resultados.produtos.length;
        this.totalMarcas = resultados.marcas.length;

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard:', err);
        this.isLoading = false;
        // Aqui você pode mostrar uma mensagem de erro na tela
      }
    });
  }
}
