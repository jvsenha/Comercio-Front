import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cep',
  templateUrl: './cep.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgxMaskDirective
  ],
  styleUrls: ['./cep.scss']
})
export class CepComponent implements OnInit {


  formModel: any = { id: null, numeroCep: '' };


  listaDeCeps: any[] = [];


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
    this.apiService.getCeps().subscribe({
      next: (data) => {
        this.listaDeCeps = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar lista de CEPs:', err);
        this.erro = 'Não foi possível carregar a lista.';
        this.isLoading = false;
      }
    });
  }

  salvar(): void {
    const cepSemMascara = this.formModel.numeroCep.replace(/\D/g, '');

    if (cepSemMascara.length !== 8) {
      this.erro = 'CEP deve ter 8 números';
      return;
    }
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    
    const dadosParaSalvar = {
      id: this.formModel.id,
      numeroCep: cepSemMascara
    };

    let observable;
    if (this.isEditMode) {
      observable = this.apiService.updateCep(dadosParaSalvar.id, dadosParaSalvar);
    } else {
      observable = this.apiService.salvarCep(dadosParaSalvar);
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
    this.formModel = { id: null, numeroCep: '' };
    this.isEditMode = false;
    this.erro = '';
    this.mensagem = '';
  }

  deletar(itemId: number): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.apiService.deleteCep(itemId).subscribe({
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
