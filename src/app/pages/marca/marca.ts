import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./marca.scss']
})
export class MarcaComponent implements OnInit {

  // Modelo do formulário
  formModel: any = { id: null, name: '' };

  // Lista para a tabela
  listaDeMarcas: any[] = [];

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
    this.apiService.getMarcas().subscribe({
      next: (data) => {
        this.listaDeMarcas = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar lista de marcas:', err);
        this.erro = 'Não foi possível carregar a lista.';
        this.isLoading = false;
      }
    });
  }

  salvar(): void {
    if (this.formModel.name.trim() === '') {
      this.erro = 'Nome é obrigatório';
      return;
    }
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    let observable;
    if (this.isEditMode) {
      observable = this.apiService.updateMarca(this.formModel.id, this.formModel);
    } else {
      observable = this.apiService.salvarMarca(this.formModel);
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
    this.formModel = { id: null, name: '' };
    this.isEditMode = false;
    this.erro = '';
    this.mensagem = '';
  }

  deletar(itemId: number): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.apiService.deleteMarca(itemId).subscribe({
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
