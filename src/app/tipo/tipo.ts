import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { CadastroService } from '../cadastro';
@Component({
  selector: 'app-tipo',
   standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './tipo.html',
  styleUrls: ['./tipo.scss']
})
export class TipoComponent {
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
    this.cadastroService.salvarTipo(dados).subscribe({
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
