// src/app/sexo/sexo.ts
import { Component, OnInit } from '@angular/core'; // Importe OnInit
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service/api.service'; // Use o novo serviço
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sexo',
  templateUrl: './sexo.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./sexo.scss']
})
export class SexoComponent implements OnInit { // Implemente OnInit

  // Modelo do formulário
  formModel: any = { id: null, name: '' };

  // Lista para a tabela
  listaDeSexos: any[] = [];

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
    this.apiService.getSexos().subscribe({
      next: (data) => {
        this.listaDeSexos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar lista de sexos:', err);
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
      // MODO DE ATUALIZAÇÃO
      observable = this.apiService.updateSexo(this.formModel.id, this.formModel);
    } else {
      // MODO DE CRIAÇÃO
      observable = this.apiService.salvarSexo(this.formModel);
    }

    observable.subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = `Salvo com sucesso!`;
        this.carregarLista(); // Recarrega a lista
        this.resetarFormulario(); // Limpa o formulário
        setTimeout(() => { this.mensagem = ''; }, 3000);
      },
      error: (err) => {
        this.salvando = false;
        this.erro = 'Erro ao salvar. Tente novamente.';
        console.log(err);
      }
    });
  }

  // Carrega os dados no formulário para edição
  iniciarEdicao(item: any): void {
    this.formModel = { ...item }; // Copia o item para o formulário
    this.isEditMode = true;
    this.erro = '';
    this.mensagem = '';
  }

  // Limpa o formulário e sai do modo de edição
  resetarFormulario(): void {
    this.formModel = { id: null, name: '' };
    this.isEditMode = false;
    this.erro = '';
    this.mensagem = '';
  }

  // Deleta um item da lista
  deletar(itemId: number): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.apiService.deleteSexo(itemId).subscribe({
        next: () => {
          this.mensagem = 'Item excluído com sucesso!';
          this.carregarLista(); // Recarrega a lista
          if (this.isEditMode && this.formModel.id === itemId) {
            this.resetarFormulario(); // Limpa o form se o item editado foi excluído
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
    this.router.navigate(['/dashboard']); // Mude para a rota do dashboard
  }
}
