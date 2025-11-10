import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-venda-produto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venda-produto.html',
  styleUrls: ['./venda-produto.scss']
})
export class VendaProdutoComponent implements OnInit {

  // Modelo do formulário
  formModel: any = {
    id: { // Chave composta
      produtoId: null,
      vendaId: null
    },
    quantidade: 0,
    precoUnitario: 0
  };

  // Listas
  listaDeVendaProdutos: any[] = [];
  listaDeVendas: any[] = [];
  listaDeProdutos: any[] = [];

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

  carregarDadosPagina(): void {
    this.isLoading = true;
    this.erro = '';

    forkJoin({
      vendas: this.apiService.getVendas(),
      produtos: this.apiService.getProdutos(),
      vendaProdutos: this.apiService.getVendaProdutos()
    }).subscribe({
      next: (data) => {
        this.listaDeVendas = data.vendas;
        this.listaDeProdutos = data.produtos;
        this.listaDeVendaProdutos = data.vendaProdutos;
        this.isLoading = false;
      },
      error: (err) => {
        this.erro = 'Não foi possível carregar os dados. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  recarregarListaVendaProdutos(): void {
    this.apiService.getVendaProdutos().subscribe({
      next: (data) => { this.listaDeVendaProdutos = data; },
      error: (err) => { this.erro = 'Não foi possível atualizar a lista.'; }
    });
  }

  salvar(): void {
    if (!this.formModel.id.produtoId || !this.formModel.id.vendaId || this.formModel.quantidade <= 0) {
      this.erro = 'Produto, Venda e Quantidade (maior que 0) são obrigatórios';
      return;
    }
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    let observable;
    if (this.isEditMode) {
      const { produtoId, vendaId } = this.formModel.id;
      observable = this.apiService.updateVendaProduto(produtoId, vendaId, this.formModel);
    } else {
      observable = this.apiService.salvarVendaProduto(this.formModel);
    }

    observable.subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = `Salvo com sucesso!`;
        this.recarregarListaVendaProdutos();
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

  iniciarEdicao(item: any): void {
    this.formModel = {
      id: {
        produtoId: item.id?.produtoId || null,
        vendaId: item.id?.vendaId || null
      },
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario
    };
    this.isEditMode = true;
    this.erro = '';
    this.mensagem = '';
  }

  resetarFormulario(): void {
    this.formModel = { id: { produtoId: null, vendaId: null }, quantidade: 0, precoUnitario: 0 };
    this.isEditMode = false;
    this.erro = '';
    this.mensagem = '';
  }

  deletar(item: any): void {
    const { produtoId, vendaId } = item.id;
    if (!produtoId || !vendaId) {
      this.erro = 'IDs inválidos para exclusão.';
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o item (Produto ${produtoId}, Venda ${vendaId})?`)) {
      this.apiService.deleteVendaProduto(produtoId, vendaId).subscribe({
        next: () => {
          this.mensagem = 'Item excluído com sucesso!';
          this.recarregarListaVendaProdutos();
          if (this.isEditMode && this.formModel.id.produtoId === produtoId && this.formModel.id.vendaId === vendaId) {
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
