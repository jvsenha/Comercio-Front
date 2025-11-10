import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CadastroService } from '../cadastro';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-rua',
  templateUrl: './rua.html',
   standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./rua.scss']
})
export class RuaComponent {
  nome = '';
  salvando = false;
  mensagem = '';
  erro = '';

  constructor(private cadastroService: CadastroService, private router: Router) { }

  salvar() {
    if (this.nome.trim() === '') {
      this.erro = 'Nome é obrigatório';
      return;
    }
    this.salvando = true;
    this.erro = '';
    const dados = { name: this.nome };
    this.cadastroService.salvarRua(dados).subscribe({
      next: (resposta) => {
        this.salvando = false;
        this.mensagem = 'Salvo com sucesso!';
        this.nome = '';
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
