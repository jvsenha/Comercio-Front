import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cidade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cidade.html',
  styleUrls: ['./cidade.scss']
})
export class CidadeComponent implements OnInit {

  // Modelo do formulário
  formModel: any = {
    id: null,
    name: '',
    uf: { id: null } // O backend espera um objeto UF com o ID
  };

  // Listas
  listaDeCidades: any[] = [];
  listaDeUfs: any[] = []; // Lista para o dropdown

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

    // Carrega UFs (para o dropdown) e Cidades (para a lista) em paralelo
    forkJoin({
      ufs: this.apiService.getUfs(),
      cidades: this.apiService.getCidades()
    }).subscribe({
      next: (data) => {
        this.listaDeUfs = data.ufs;
        this.listaDeCidades = data.cidades;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados da página:', err);
        this.erro = 'Não foi possível carregar os dados. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  // Recarrega apenas a lista de cidades (usado após salvar/deletar)
  recarregarListaCidades(): void {
    this.apiService.getCidades().subscribe({
      next: (data) => {
        this.listaDeCidades = data;
      },
      error: (err) => {
        console.error('Erro ao recarregar lista de cidades:', err);
        this.erro = 'Não foi possível atualizar a lista de cidades.';
      }
    });
  }

  salvar(): void {
    if (this.formModel.name.trim() === '' || !this.formModel.uf.id) {
      this.erro = 'Nome e UF são obrigatórios';
      return;
    }
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    let observable;
    if (this.isEditMode) {
      observable = this.apiService.updateCidade(this.formModel.id, this.formModel);
    } else {
      observable = this.apiService.salvarCidade(this.formModel);
    }

    observable.subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = `Salvo com sucesso!`;
        this.recarregarListaCidades(); // Recarrega só a lista
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
      id: item.id,
      name: item.name,
      uf: { id: item.uf?.id || null } // Garante que o ID da UF seja pego
    };
    this.isEditMode = true;
    this.erro = '';
    this.mensagem = '';
  }

  resetarFormulario(): void {
    this.formModel = { id: null, name: '', uf: { id: null } };
    this.isEditMode = false;
    this.erro = '';
    this.mensagem = '';
  }

  deletar(itemId: number): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.apiService.deleteCidade(itemId).subscribe({
        next: () => {
          this.mensagem = 'Item excluído com sucesso!';
          this.recarregarListaCidades();
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
