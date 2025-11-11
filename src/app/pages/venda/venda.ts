import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service/api.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-venda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venda.html',
  styleUrls: ['./venda.scss']
})
export class VendaComponent implements OnInit {

  formVenda: any = {
    id: null,
    dataVenda: new Date().toISOString().split('T')[0],
    cliente: { id: null }
  };

  formItem: any = {
    produtoId: null,
    quantidade: 1
  };

  listaDeVendas: any[] = [];
  listaDeClientes: any[] = [];
  listaDeProdutos: any[] = [];
  carrinho: any[] = [];

  isLoading = true;
  isEditMode = false;
  salvando = false;
  mensagem = '';
  erro = '';
  erroItem = '';

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.carregarDadosPagina();
  }

  carregarDadosPagina(): void {
    this.isLoading = true;
    this.erro = '';

    forkJoin({
      clientes: this.apiService.getClientes(),
      produtos: this.apiService.getProdutos(),
      vendas: this.apiService.getVendas()
    }).subscribe({
      next: (data) => {
        this.listaDeClientes = data.clientes;
        this.listaDeProdutos = data.produtos;
        this.listaDeVendas = data.vendas.map(venda => {
          venda.dataVenda = this.formatarDataParaInput(venda.dataVenda);
          return venda;
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.erro = 'Não foi possível carregar os dados. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  recarregarListaVendas(): void {
    this.apiService.getVendas().subscribe({
      next: (data) => {
        this.listaDeVendas = data.map(venda => {
          venda.dataVenda = this.formatarDataParaInput(venda.dataVenda);
          return venda;
        });
      },
      error: (err) => { this.erro = 'Não foi possível atualizar a lista de vendas.'; }
    });
  }

  adicionarAoCarrinho(): void {
    this.erroItem = '';

    const produtoSelecionado = this.listaDeProdutos.find(p => p.id == this.formItem.produtoId);

    if (!produtoSelecionado) {
      this.erroItem = 'Selecione um produto.';
      return;
    }
    if (this.formItem.quantidade <= 0) {
      this.erroItem = 'Quantidade deve ser maior que zero.';
      return;
    }

    const itemExistente = this.carrinho.find(item => item.produtoId == this.formItem.produtoId);

    let quantidadeFinal = 0;

    if (itemExistente) {
      quantidadeFinal = itemExistente.quantidade + this.formItem.quantidade;
    } else {
      quantidadeFinal = this.formItem.quantidade;
    }

    if (quantidadeFinal > produtoSelecionado.quantidade) {
      this.erroItem = `Estoque insuficiente. Máximo: ${produtoSelecionado.quantidade}`;
      return;
    }

    if (itemExistente) {
      itemExistente.quantidade = quantidadeFinal;
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.precoUnitario;
    } else {
      this.carrinho.push({
        produtoId: produtoSelecionado.id,
        nomeProduto: produtoSelecionado.name,
        quantidade: this.formItem.quantidade,
        precoUnitario: produtoSelecionado.valor,
        subtotal: this.formItem.quantidade * produtoSelecionado.valor,
        estoqueMaximo: produtoSelecionado.quantidade
      });
    }

    this.formItem.produtoId = null;
    this.formItem.quantidade = 1;
  }

  removerDoCarrinho(produtoId: number): void {
    this.carrinho = this.carrinho.filter(item => item.produtoId !== produtoId);
  }

  getTotalCarrinho(): number {
    return this.carrinho.reduce((total, item) => total + item.subtotal, 0);
  }

  async salvarVendaCompleta(): Promise<void> {
    this.erro = '';
    this.mensagem = '';

    if (!this.formVenda.cliente.id) {
      this.erro = 'Selecione um cliente.';
      return;
    }
    if (this.carrinho.length === 0) {
      this.erro = 'Adicione pelo menos um item ao carrinho.';
      return;
    }

    this.salvando = true;

    try {
      const respostaVenda: any = await this.apiService.salvarVenda(this.formVenda).toPromise();
      const novaVendaId = respostaVenda?.venda?.id;

      if (!novaVendaId) {
        throw new Error('Não foi possível obter o ID da nova venda.');
      }

      const promessasItens: Observable<any>[] = [];

      for (const item of this.carrinho) {
        const vendaProduto = {
          id: {
            produtoId: item.produtoId,
            vendaId: novaVendaId
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario
        };
        promessasItens.push(this.apiService.salvarVendaProduto(vendaProduto));
      }

      await forkJoin(promessasItens).toPromise();

      this.salvando = false;
      this.mensagem = 'Venda registrada com sucesso!';
      this.resetarFormulario();
      this.recarregarListaVendas();

      this.apiService.getProdutos().subscribe(data => {
        this.listaDeProdutos = data;
      });

      setTimeout(() => { this.mensagem = ''; }, 4000);

    } catch (err: any) {
      console.error('Erro ao salvar venda completa:', err);
      this.salvando = false;
      this.erro = 'Erro ao salvar: ' + (err.error?.mensagem || err.message || 'Verifique os dados.');
    }
  }

  resetarFormulario(): void {
    this.formVenda = {
      id: null,
      dataVenda: new Date().toISOString().split('T')[0],
      cliente: { id: null }
    };
    this.carrinho = [];
    this.formItem = { produtoId: null, quantidade: 1 };
    this.isEditMode = false;
    this.erro = '';
    this.erroItem = '';
    this.mensagem = '';
  }

  deletarVenda(itemId: number): void {
    if (confirm('Tem certeza que deseja excluir esta venda? (Isso APAGARÁ todos os itens associados a ela)')) {
      this.apiService.deleteVenda(itemId).subscribe({
        next: () => {
          this.mensagem = 'Venda excluída com sucesso!';
          this.recarregarListaVendas();
          if (this.isEditMode && this.formVenda.id === itemId) {
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

  iniciarEdicaoVenda(item: any): void {
    this.erro = 'A edição de vendas ainda não foi implementada.';
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }

  private formatarDataParaInput(dataArray: any): string {
    if (!Array.isArray(dataArray) || dataArray.length < 3) {
      if (typeof dataArray === 'string') {
        return dataArray.split('T')[0];
      }
      return '';
    }
    const [ano, mes, dia] = dataArray;
    return new Date(ano, mes - 1, dia).toISOString().split('T')[0];
  }

  // ESTA FUNÇÃO ESTAVA NO LUGAR ERRADO. AGORA É UM MÉTODO DA CLASSE.
  calcularTotalVenda(itens: any[]): number {
    if (!itens) {
      return 0;
    }
    return itens.reduce((total, item) => {
      // O backend já manda o precoUnitario e a quantidade
      return total + (item.precoUnitario * item.quantidade);
    }, 0);
  }
}
