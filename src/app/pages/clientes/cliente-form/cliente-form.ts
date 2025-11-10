// src/app/pages/clientes/cliente-form/cliente-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service/api.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.html',
  styleUrls: ['./cliente-form.scss']
})
export class ClienteFormComponent implements OnInit {

  // Modelo para o formulário (com objetos de ID para o backend)
  cliente: any = {
    name: '',
    numeroCasa: '',
    dataNasc: '',
    cpfCliente: '',
    cidade: { id: null },
    rua: { id: null },
    bairro: { id: null },
    cep: { id: null },
    sexo: { id: null }
  };

  // Listas para os dropdowns
  sexos: any[] = [];
  cidades: any[] = [];
  ruas: any[] = [];
  bairros: any[] = [];
  ceps: any[] = [];

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
      sexos: this.apiService.getSexos(),
      cidades: this.apiService.getCidades(),
      ruas: this.apiService.getRuas(),
      bairros: this.apiService.getBairros(),
      ceps: this.apiService.getCeps()
    }).subscribe({
      next: (data) => {
        this.sexos = data.sexos;
        this.cidades = data.cidades;
        this.ruas = data.ruas;
        this.bairros = data.bairros;
        this.ceps = data.ceps;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados para o formulário:', err);
        // Como solicitado, não mostramos erro ao usuário se os dropdowns falharem
        this.isLoading = false;
      }
    });
  }

  salvar(): void {
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    // Validação de campos obrigatórios
    if (!this.cliente.name || !this.cliente.cpfCliente || !this.cliente.sexo.id) {
      this.erro = 'Nome, CPF e Sexo são obrigatórios.';
      this.salvando = false;
      return;
    }

    this.apiService.salvarCliente(this.cliente).subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = 'Cliente salvo com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/clientes']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erro ao salvar cliente:', err);
        // Mostra o erro específico do backend, se disponível
        this.erro = 'Erro ao salvar cliente: ' + (err.error?.mensagem || 'Verifique os campos.');
        this.salvando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/clientes']);
  }
}
