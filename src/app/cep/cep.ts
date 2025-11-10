import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CadastroService } from '../cadastro';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-cep',
  templateUrl: './cep.html',
   standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./cep.scss']
})
export class CepComponent {
  numeroCep = '';
  salvando = false;
  mensagem = '';
  erro = '';

  constructor(private cadastroService: CadastroService, private router: Router) { }

  salvar() {
    if (this.numeroCep.trim() === '') {
      this.erro = 'Número CEP é obrigatório';
      return;
    }
    if (this.numeroCep.length !== 8) {
      this.erro = 'CEP deve ter 8 números';
      return;
    }
    this.salvando = true;
    this.erro = '';
    const dados = { numeroCep: this.numeroCep };
    this.cadastroService.salvarCep(dados).subscribe({
      next: (resposta) => {
        this.salvando = false;
        this.mensagem = 'Salvo com sucesso!';
        this.numeroCep = '';
        setTimeout(() => { this.mensagem = ''; }, 3000);
      },
      error: (erro) => {
        this.salvando = false;
        this.erro = 'Erro ao salvar. Tente novamente.';
        console.log(erro);
      }
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
