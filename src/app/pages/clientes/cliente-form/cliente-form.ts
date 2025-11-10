import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service/api.service';
import { Router, ActivatedRoute } from '@angular/router'; // 1. Importe ActivatedRoute
import { forkJoin } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './cliente-form.html',
  styleUrls: ['./cliente-form.scss']
})
export class ClienteFormComponent implements OnInit {

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

  sexos: any[] = [];
  cidades: any[] = [];
  ruas: any[] = [];
  bairros: any[] = [];
  ceps: any[] = [];

  isLoading = true; // Agora controla o carregamento de tudo
  salvando = false;
  mensagem = '';
  erro = '';
  isEditMode = false; // 2. Adicione o modo de edição
  private clienteId: number | null = null; // 3. Adicione o ID do cliente

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute // 4. Injete o ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 5. Verifique se há um ID na URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.clienteId = +idParam; // Converte string para número
    }
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    this.isLoading = true;

    // 6. Carregue os dropdowns primeiro
    const dropdowns = forkJoin({
      sexos: this.apiService.getSexos(),
      cidades: this.apiService.getCidades(),
      ruas: this.apiService.getRuas(),
      bairros: this.apiService.getBairros(),
      ceps: this.apiService.getCeps()
    });

    dropdowns.subscribe({
      next: (data) => {
        this.sexos = data.sexos;
        this.cidades = data.cidades;
        this.ruas = data.ruas;
        this.bairros = data.bairros;
        this.ceps = data.ceps;

        // 7. Se for modo de edição, carregue os dados do cliente
        if (this.isEditMode && this.clienteId) {
          this.carregarDadosCliente(this.clienteId);
        } else {
          this.isLoading = false; // Pronto para adicionar
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados para o formulário:', err);
        this.erro = 'Erro ao carregar dados. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  // 8. Novo método para carregar o cliente (usando o workaround)
  carregarDadosCliente(id: number): void {
    this.apiService.getClientes().subscribe({
      next: (clientes) => {
        const clienteParaEditar = clientes.find(c => c.id === id);
        if (clienteParaEditar) {
          // Preenche o formulário com os dados
          this.cliente = {
            ...clienteParaEditar,
            // Garante que os objetos aninhados tenham apenas o 'id'
            // para o binding do select funcionar corretamente
            sexo: { id: clienteParaEditar.sexo?.id || null },
            cidade: { id: clienteParaEditar.cidade?.id || null },
            rua: { id: clienteParaEditar.rua?.id || null },
            bairro: { id: clienteParaEditar.bairro?.id || null },
            cep: { id: clienteParaEditar.cep?.id || null }
          };
        } else {
          this.erro = 'Cliente não encontrado.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar cliente:', err);
        this.erro = 'Erro ao carregar cliente.';
        this.isLoading = false;
      }
    });
  }

  salvar(): void {
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    if (!this.cliente.name || !this.cliente.cpfCliente || !this.cliente.sexo.id) {
      this.erro = 'Nome, CPF e Sexo são obrigatórios.';
      this.salvando = false;
      return;
    }

    let observable;
    // 9. Verifique o modo de edição para salvar ou atualizar
    if (this.isEditMode && this.clienteId) {
      observable = this.apiService.updateCliente(this.clienteId, this.cliente);
    } else {
      observable = this.apiService.salvarCliente(this.cliente);
    }

    observable.subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = `Cliente ${this.isEditMode ? 'atualizado' : 'salvo'} com sucesso!`;
        setTimeout(() => {
          this.router.navigate(['/clientes']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erro ao salvar cliente:', err);
        this.erro = 'Erro ao salvar cliente: ' + (err.error?.mensagem || 'Verifique os campos.');
        this.salvando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/clientes']);
  }
}
