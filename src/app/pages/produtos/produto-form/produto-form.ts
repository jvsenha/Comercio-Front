import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service/api.service';
import { Router, ActivatedRoute } from '@angular/router'; // 1. Importe ActivatedRoute
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produto-form.html',
  styleUrls: ['./produto-form.scss']
})
export class ProdutoFormComponent implements OnInit {

  produto: any = {
    name: '',
    valor: 0,
    quantidade: 0,
    marca: { id: null },
    tipo: { id: null }
  };

  marcas: any[] = [];
  tipos: any[] = [];

  isLoading = true; // Agora controla o carregamento de tudo
  salvando = false;
  mensagem = '';
  erro = '';
  isEditMode = false; // 2. Adicione o modo de edição
  private produtoId: number | null = null; // 3. Adicione o ID do produto

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
      this.produtoId = +idParam;
    }
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    this.isLoading = true;

    // 6. Carregue os dropdowns primeiro
    const dropdowns = forkJoin({
      marcas: this.apiService.getMarcas(),
      tipos: this.apiService.getTipos()
    });

    dropdowns.subscribe({
      next: (data) => {
        this.marcas = data.marcas;
        this.tipos = data.tipos;

        // 7. Se for modo de edição, carregue os dados do produto
        if (this.isEditMode && this.produtoId) {
          this.carregarDadosProduto(this.produtoId);
        } else {
          this.isLoading = false; // Pronto para adicionar
        }
      },
      error: (err) => {
        this.erro = 'Erro ao carregar dados. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  // 8. Novo método para carregar o produto
  carregarDadosProduto(id: number): void {
    this.apiService.getProdutos().subscribe({
      next: (produtos) => {
        const produtoParaEditar = produtos.find(p => p.id === id);
        if (produtoParaEditar) {
          // Preenche o formulário
          this.produto = {
            ...produtoParaEditar,
            // Garante que os objetos aninhados tenham apenas o 'id'
            marca: { id: produtoParaEditar.marca?.id || null },
            tipo: { id: produtoParaEditar.tipo?.id || null }
          };
        } else {
          this.erro = 'Produto não encontrado.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar produto:', err);
        this.erro = 'Erro ao carregar produto.';
        this.isLoading = false;
      }
    });
  }

  salvar(): void {
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    if (!this.produto.name || !this.produto.marca.id || !this.produto.tipo.id) {
      this.erro = 'Nome, Marca e Tipo são obrigatórios.';
      this.salvando = false;
      return;
    }

    let observable;
    // 9. Verifique o modo de edição para salvar ou atualizar
    if (this.isEditMode && this.produtoId) {
      observable = this.apiService.updateProduto(this.produtoId, this.produto);
    } else {
      observable = this.apiService.salvarProduto(this.produto);
    }

    observable.subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = `Produto ${this.isEditMode ? 'atualizado' : 'salvo'} com sucesso!`;
        setTimeout(() => {
          this.router.navigate(['/produtos']);
        }, 1500);
      },
      error: (err) => {
        this.erro = 'Erro ao salvar produto: ' + (err.error?.mensagem || 'Verifique os campos.');
        this.salvando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/produtos']);
  }
}
