import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service/api.service'; // Caminho corrigido
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uf',
  templateUrl: './uf.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./uf.scss']
})
export class UfComponent implements OnInit {

  // Modelo do formulário
  formModel: any = { id: null, name: '', siglaUf: '' };

  // Lista para a tabela
  listaDeUfs: any[] = [];

  // Estados
  isLoading = true;
  isEditMode = false;
  salvando = false;
  mensagem = '';
  erro = '';

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.carregarLista();
  }

  carregarLista(): void {
    this.isLoading = true;
    this.apiService.getUfs().subscribe({
      next: (data) => {
        this.listaDeUfs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar lista de UFs:', err);
        this.erro = 'Não foi possível carregar a lista.';
        this.isLoading = false;
      }
    });
  }

  salvar(): void {
    if (this.formModel.name.trim() === '' || this.formModel.siglaUf.trim() === '') {
      this.erro = 'Nome e Sigla são obrigatórios';
      return;
    }
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    let observable;
    if (this.isEditMode) {
      // MODO DE ATUALIZAÇÃO
      observable = this.apiService.updateUf(this.formModel.id, this.formModel);
    } else {
      // MODO DE CRIAÇÃO
      observable = this.apiService.salvarUf(this.formModel);
    }

    observable.subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = `Salvo com sucesso!`;
        this.carregarLista();
        this.resetarFormulario();
        setTimeout(() => { this.mensagem = ''; }, 3000);
      },
      error: (err) => {
        this.salvando = false;
        this.erro = 'Erro ao salvar. Tente novamente.';
        console.log(err);
      }
    });
  }

  iniciarEdicao(item: any): void {
    this.formModel = { ...item };
    this.isEditMode = true;
    this.erro = '';
    this.mensagem = '';
  }

  resetarFormulario(): void {
    this.formModel = { id: null, name: '', siglaUf: '' };
    this.isEditMode = false;
    this.erro = '';
    this.mensagem = '';
  }

  deletar(itemId: number): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.apiService.deleteUf(itemId).subscribe({
        next: () => {
          this.mensagem = 'Item excluído com sucesso!';
          this.carregarLista();
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
