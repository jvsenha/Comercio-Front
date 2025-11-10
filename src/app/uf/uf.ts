import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CadastroService } from '../cadastro';

@Component({
  selector: 'app-uf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './uf.html',
  styleUrls: ['./uf.scss']
})
export class UfComponent {
  nome = '';
  sigla = '';
  salvando = false;
  mensagem = '';
  erro = '';

  constructor(
    private cadastroService: CadastroService,
    private router: Router
  ) {}

  salvar() {
    if (this.nome.trim() === '' || this.sigla.trim() === '') {
      this.erro = 'Nome e sigla são obrigatórios';
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados = {
      name: this.nome,
      siglaUf: this.sigla.toUpperCase()
    };

    this.cadastroService.salvarUf(dados).subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = 'UF salva com sucesso!';
        this.nome = '';
        this.sigla = '';
        setTimeout(() => this.mensagem = '', 3000);
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
