import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-venda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venda.html',
  styleUrls: ['./venda.scss']
})
export class VendaComponent implements OnInit {

  // Modelo do formulário
  formModel: any = {
    id: null,
    dataVenda: '',
    cliente: { id: null }
  };

  // Listas
  listaDeVendas: any[] = [];
  listaDeClientes: any[] = []; // Para o dropdown

  // Estados
  isLoading = true;
  isEditMode = false;
  salvando = false;
  mensagem = '';
  erro = '';

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.carregarDadosPagina();
  }

  // --- FUNÇÃO PARA CONVERTER A DATA ---
  // Converte [2024, 11, 10] para "2024-11-10"
  private formatarDataParaInput(dataArray: any): string {
    if (!Array.isArray(dataArray) || dataArray.length < 3) {
      if (typeof dataArray === 'string') {
        return dataArray.split('T')[0]; // Se já for string ISO
      }
      return ''; // Retorna vazio se o formato for inválido
    }
    const [ano, mes, dia] = dataArray;
    // new Date(ano, mes - 1, dia) -> O mês em Date() é base 0 (0=Jan, 11=Dez)
    // toISOString() -> '2024-11-10T03:00:00.000Z'
    // split('T')[0] -> '2024-11-10'
    return new Date(ano, mes - 1, dia).toISOString().split('T')[0];
  }

  // --- FUNÇÃO CORRIGIDA ---
  carregarDadosPagina(): void {
    this.isLoading = true;
    this.erro = '';

    forkJoin({
      clientes: this.apiService.getClientes(),
      vendas: this.apiService.getVendas()
    }).subscribe({
      next: (data) => {
        this.listaDeClientes = data.clientes;
        // Converte as datas da lista ANTES de exibi-las
        this.listaDeVendas = data.vendas.map(venda => {
          venda.dataVenda = this.formatarDataParaInput(venda.dataVenda);
          return venda;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados da página:', err);
        this.erro = 'Não foi possível carregar os dados. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  // --- FUNÇÃO CORRIGIDA ---
  recarregarListaVendas(): void {
    this.apiService.getVendas().subscribe({
      next: (data) => {
        // Converte as datas da lista ANTES de exibi-las
        this.listaDeVendas = data.map(venda => {
          venda.dataVenda = this.formatarDataParaInput(venda.dataVenda);
          return venda;
        });
      },
      error: (err) => { this.erro = 'Não foi possível atualizar a lista de vendas.'; }
    });
  }

  salvar(): void {
    if (!this.formModel.dataVenda || !this.formModel.cliente.id) {
      this.erro = 'Data e Cliente são obrigatórios';
      return;
    }
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    let observable;
    if (this.isEditMode) {
      observable = this.apiService.updateVenda(this.formModel.id, this.formModel);
    } else {
      observable = this.apiService.salvarVenda(this.formModel);
    }

    observable.subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = `Salvo com sucesso!`;
        this.recarregarListaVendas();
        this.resetarFormulario();
        setTimeout(() => { this.mensagem = ''; }, 3000);
      },
      error: (err) => {
        this.salvando = false;
        this.erro = 'Erro ao salvar: ' + (err.error?.mensagem || 'Tente novamente.');
        console.log(err);
      }
    });
  }

  // --- FUNÇÃO CORRIGIDA ---
  iniciarEdicao(item: any): void {
    this.formModel = {
      id: item.id,
      // A data na lista já está formatada como 'YYYY-MM-DD'
      dataVenda: item.dataVenda,
      cliente: { id: item.cliente?.id || null }
    };
    this.isEditMode = true;
    this.erro = '';
    this.mensagem = '';
  }

  resetarFormulario(): void {
    this.formModel = { id: null, dataVenda: '', cliente: { id: null } };
    this.isEditMode = false;
    this.erro = '';
    this.mensagem = '';
  }

  deletar(itemId: number): void {
    if (confirm('Tem certeza que deseja excluir esta venda? (Isso pode apagar itens de venda associados)')) {
      this.apiService.deleteVenda(itemId).subscribe({
        next: () => {
          this.mensagem = 'Item excluído com sucesso!';
          this.recarregarListaVendas();
          if (this.isEditMode && this.formModel.id === itemId) {
            this.resetarFormulario();
          }
          setTimeout(() => { this.mensagem = ''; }, 3000);
        },
        error: (err) => {
          this.erro = 'Erro ao excluir item.';
          console.error(err);
        }
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }
}
